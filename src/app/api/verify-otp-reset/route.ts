import { prisma } from "@/prisma/prisma-client";
import { compare } from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { email, code } = await request.json();

    if (!email || !code) {
        return NextResponse.json({ error: 'Email or code is missing' }, { status: 400 });
    }

    try {

        const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const verificationCode = await prisma.verificationCode.findFirst({
            where: {
                userId: user.id,
            },
            select: {
                code: true, 
                expiresAt: true,
                id: true,
            },
        });

        if (!verificationCode) {
            return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
        }

        const isCodeValid = await compare(code, verificationCode.code);

        if (!isCodeValid) {
            return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
        }

        if (new Date() > new Date(verificationCode.expiresAt)) {
            await prisma.verificationCode.delete({
                where: { id: verificationCode.id },
            });
            return NextResponse.json({ error: 'Verification code has expired' }, { status: 400 });
        }

        return NextResponse.json({ message: 'OTP verified successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return NextResponse.json({ error: 'Failed to verify OTP' }, { status: 500 });
    }
}