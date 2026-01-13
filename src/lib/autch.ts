import type { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/prisma/prisma-client";
import { nanoid } from "nanoid";
import bcrypt from "bcryptjs";
import { User } from "@prisma/client";
import { authRateLimit } from "./ratelimit";
import { verifyCaptcha } from "@/server/verifyCaptcha";

export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
      profile(profile) {
        return {
          id: String(profile.id),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        captchaToken: { label: "Captcha Token", type: "text" },
      },
      async authorize(credentials, req) {
        if (!credentials) {
          return null;
        }

        const ip = req.headers?.["x-forwarded-for"] || "127.0.0.1";

        const { success } = await authRateLimit.limit(ip);

        if (!success) {
          throw new Error("RATE_LIMIT_EXCEEDED");
        }

        const isValid = await verifyCaptcha(credentials.captchaToken);

        if (!isValid) {
          throw new Error("Captcha is not valid");
        }

        const values = {
          email: credentials.email,
        };

        const findUser = await prisma.user.findUnique({
          where: values,
        });

        if (!findUser) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          findUser.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: findUser.id,
          name: findUser.username,
          email: findUser.email,
          role: findUser.role,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async signIn({ user, account }) {
      try {
        const isRegistrationDisabled = process.env.REG === "false";
        const isOAuth =
          account?.provider === "google" || account?.provider === "github";

        if (isRegistrationDisabled && isOAuth) {
          return false;
        }

        if (account?.provider === "credentials") {
          return true;
        }

        if (!user.email) {
          return false;
        }

        const findUser = await prisma.user.findFirst({
          where: {
            OR: [
              {
                provider: account?.provider,
                providerId: account?.providerAccountId,
              },
              { email: user.email },
            ],
          },
        });

        if (findUser) {
          await prisma.user.update({
            where: {
              id: findUser.id,
            },
            data: {
              provider: account?.provider,
              providerId: account?.providerAccountId,
            },
          });

          return true;
        }

        await prisma.user.create({
          data: {
            email: user.email,
            username: user.name || "User #" + user.id,
            password:
              account?.provider === "credentials"
                ? bcrypt.hashSync((user as User).password, 10)
                : bcrypt.hashSync(nanoid(), 10),
            verified: new Date(),
            provider: account?.provider,
            providerId: account?.providerAccountId,
            profileImage: user.image || "",
            role: "user",
            isbanned: false,
          },
        });

        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    async jwt({ token }) {
      if (!token.email) {
        return token;
      }

      const findUser = await prisma.user.findUnique({
        where: {
          email: token.email,
        },
      });

      if (findUser) {
        token.id = findUser.id;
        token.username = findUser.username;
        token.email = findUser.email;
        token.profileImage = findUser.profileImage;
        token.role = findUser.role;
        token.isbanned = findUser.isbanned;
      }

      return token;
    },
    session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.isbanned = token.isbanned;
      }

      return session;
    },
  },
};
