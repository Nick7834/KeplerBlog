import type { AuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/prisma/prisma-client";
import { compare, hashSync } from "bcryptjs";
import { nanoid } from 'nanoid';
import { User } from "@prisma/client";

export const authOptions: AuthOptions   = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
      profile(profile) {
        return {
          id: String(profile.id),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if(!credentials) {
          return null;
        }

        const values = {
          email: credentials.email,
        }

        const fintUser = await prisma.user.findUnique({
          where: values,
        })

        if(!fintUser) {
          return null;
        }

        const isPasswordValid = await compare(credentials.password, fintUser.password);

        if(!isPasswordValid) {
          return null;
        }

        return {
          id: fintUser.id,
          name: fintUser.username,
          email: fintUser.email
        }

      }
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account }) {
      
      try {

        if (account?.provider === 'credentials') {
          return true;
        }

        if(!user.email) {
          return false;
        }

        const findUser = await prisma.user.findFirst({
          where: {
            OR: [
              { provider: account?.provider, providerId: account?.providerAccountId },
              { email: user.email },
            ]
          }
        })

        if(findUser) {
          await prisma.user.update({
            where: {
              id: findUser.id
            },
            data: {
              provider: account?.provider,
              providerId: account?.providerAccountId,
            }
          })

          return true;
        }

        await prisma.user.create({
          data: {
            email: user.email,
            username: user.name || 'User #' + user.id,
            password: account?.provider === 'credentials' 
            ? hashSync((user as User).password, 10) 
            : hashSync(nanoid(), 10),
            verified: new Date(),
            provider: account?.provider,
            providerId: account?.providerAccountId,
            profileImage: user.image || '',
          }
        })

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
          email: token.email
        }
      });

      if (findUser) {
        token.id = findUser.id;
        token.username = findUser.username;
        token.email = findUser.email;
        token.profileImage = findUser.profileImage;
      }

      return token;
    },
    session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
      }

      return session;
    }
  },
}