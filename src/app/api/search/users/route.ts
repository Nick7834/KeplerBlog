import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const query = req.nextUrl.searchParams.get('query') || '';
    const skipUsers = parseInt(req.nextUrl.searchParams.get('skipUsers') || '0', 10);
    const takeUsers = parseInt(req.nextUrl.searchParams.get('takeUsers') || '10', 10);

    const users = await prisma.user.findMany({
        where: {
            OR: [
                {
                    username: {
                        contains: query,
                        mode: 'insensitive',
                    },
                },
            ],
        },
        skip: skipUsers,
        take: takeUsers,
        select: {
            id: true,
            username: true,
            bio: true,
            profileImage: true,
            _count: {
                select: {
                    following: true,
                    posts: true,
                },
            },
        },
    });

    return NextResponse.json({ users });
}