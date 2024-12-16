'use server'

import { getUserSession } from "@/lib/get-user-session";
import { prisma } from "@/prisma/prisma-client";
import { Prisma } from "@prisma/client";
import { hashSync } from "bcryptjs";
import { nanoid } from "nanoid";

// register 

export async function updateUserProfile(body: Prisma.UserUpdateInput) {
    try {
        const currentUser = await getUserSession();

        if (!currentUser) {
            throw new Error('User not found');
        }

        await prisma.user.update({
            where: {
                id: currentUser.id
            }, 
            data: {
                email: body.email,
                username: body.username,
                bio: body.bio
            }
        });

    } catch (error) {
        console.warn('Error [UPDATE_USER_PROFILE]', error);
        throw error;
    }
}

export async function registerUser(body: Prisma.UserCreateInput) {
    
    try {
        const user = await prisma.user.findFirst({ where: { email: body.email } });

        if (user) {
            if (!user.verified) {
                throw new Error('The mail has not been confirmed');
            }

            throw new Error('User with this email already exists');
        }

        const createdUser = await prisma.user.create({ 
            data: {
                email: body.email,
                username: body.username, 
                password: hashSync(body.password, 10)
            } 
        });

        const code = nanoid(6); 

        await prisma.verificationCode.create({
            data: {
                userId: createdUser.id,
                code,
                expiresAt: new Date(Date.now() + 15 * 60 * 1000),
            },
        });



        } catch (error) {
            console.warn('Error [USER_REGISTER]', error);
            throw error;
        }

}