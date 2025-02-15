import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const query = req.nextUrl.searchParams.get('query') || '';
    const skipPosts = parseInt(req.nextUrl.searchParams.get('skipPosts') || '0', 10);
    const takePosts = parseInt(req.nextUrl.searchParams.get('takePosts') || '10', 10);

    const posts = await prisma.post.findMany({
        where: {
            OR: [
                {
                    title: {
                        contains: query,
                        mode: 'insensitive',
                    },
                },
            ],
        },
        orderBy: {
            createdAt: 'desc',
        },
        skip: skipPosts,
        take: takePosts,
        select: {
            id: true,
            title: true,
            content: true,
            image: true,
            createdAt: true,
            author: {
                select: {
                    id: true,
                    username: true,
                    profileImage: true,
                    isverified: true
                },
            },
            _count: {
                select: {
                    comments: true,
                    likes: true,
                },
            },
        },
    });

    return NextResponse.json({ posts });
}