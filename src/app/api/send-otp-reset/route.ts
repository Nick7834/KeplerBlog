import sendVerificationEmail from "@/lib/sendVerificationEmail";
import { prisma } from "@/prisma/prisma-client";
import { hashSync } from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
   try {

    const { email } = await request.json();

    if (!email) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    });

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await prisma.verificationCode.deleteMany({
        where: {
            userId: user.id,
        }
    });

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const codeBD = await prisma.verificationCode.create({
        data: {
            userId: user.id,
            code: hashSync(code, 10),
            expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        },
    });

    if(!codeBD) {
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }

    await sendVerificationEmail(email, code);

    return NextResponse.json({ message: 'Reset password email sent' }, { status: 200 });

   } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
   }
}