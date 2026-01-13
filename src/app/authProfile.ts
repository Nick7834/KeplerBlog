"use server";

import { getUserSession } from "@/lib/get-user-session";
import { prisma } from "@/prisma/prisma-client";
import { emailValid } from "@/server/emailValid";
import { Prisma } from "@prisma/client";
import { hashSync } from "bcryptjs";

// register

export async function updateUserProfile(body: Prisma.UserUpdateInput) {
  try {
    const currentUser = await getUserSession();

    if (!currentUser) {
      throw new Error("User not found");
    }

    const emailChanged = body.email && body.email !== currentUser.email;

    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        email: body.email,
        username: body.username,
        bio: body.bio,
        messagePrivate: body.messagePrivate,
        ...(emailChanged && { isverifiedEmail: false }),
      },
    });
  } catch (error) {
    console.warn("User not updated", error);
    throw error;
  }
}

export async function registerUser(
  body: {
    email: string;
    password: string;
    username: string;
  },
) {
  if (process.env.REG === "false") {
    throw new Error("User not created");
  }

  // if (!body.email || !body.password || !body.username) {
  //   throw new Error("Email, password or username is missing");
  // }

  try {

    const user = await prisma.user.findFirst({ where: { email: body.email } });

    const validateEmail = await emailValid(body.email);

    if (!validateEmail) {
      throw new Error("Email is not valid");
    }

    if (user) {
      if (!user.verified) {
        throw new Error("The mail has not been confirmed");
      }

      throw new Error("User with this email already exists");
    }

    const createdUser = await prisma.user.create({
      data: {
        email: body.email,
        username: body.username,
        password: hashSync(body.password, 10),
      },
    });

    return createdUser;
  } catch (error) {
    console.warn("User not created", error);
    throw error;
  }
}
