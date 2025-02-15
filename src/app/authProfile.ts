'use server'

import { getUserSession } from "@/lib/get-user-session";
import { prisma } from "@/prisma/prisma-client";
import { Prisma } from "@prisma/client";
import { hashSync } from "bcryptjs";

// register 

export async function updateUserProfile(body: Prisma.UserUpdateInput) {
    try {
        const currentUser = await getUserSession();

        if (!currentUser) {
            throw new Error('User not found');
        }

        const emailChanged = body.email && body.email !== currentUser.email;

        await prisma.user.update({
            where: {
                id: currentUser.id
            }, 
            data: {
                email: body.email,
                username: body.username,
                bio: body.bio,
                ...(emailChanged && { isverifiedEmail: false }) 
            }
        });

    } catch (error) {
        console.warn('User not updated', error);
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

        return createdUser;

        } catch (error) {
            console.warn('User not created', error);
            throw error;
        }

}