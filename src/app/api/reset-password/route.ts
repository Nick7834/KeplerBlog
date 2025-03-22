import { prisma } from "@/prisma/prisma-client";
import { hashSync } from "bcryptjs";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {

    const { email, code, password } = await request.json();

    if (!email || !code || !password) {
        return NextResponse.json({ error: 'Email, code or password is missing' }, { status: 400 });
    }

    try {

        const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const verificationCode = await prisma.verificationCode.findFirst({
            where: {
                userId: user.id,
                code: code,
            },
        });

        if (!verificationCode) {
            return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
        }

        await prisma.verificationCode.delete({
            where: { id: verificationCode.id },
        });

        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashSync(password, 10) },
        });

        return NextResponse.json({ message: 'Password reset successfully' });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}