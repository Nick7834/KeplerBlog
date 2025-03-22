import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const query = req.nextUrl.searchParams.get('query')?.trim() || '';
    const skipPosts = parseInt(req.nextUrl.searchParams.get('skipPosts') || '1', 10);
    const takePosts = parseInt(req.nextUrl.searchParams.get('takePosts') || '10', 10);
    const offset = (skipPosts - 1) * takePosts;

    const specialSymbols = ['.', ',', '?', '!', ':', ';', '"', "'", '<', '>', '(', ')'];
    const hasSpecialSymbolOnly = query.split('').every(char => specialSymbols.includes(char));

    if (hasSpecialSymbolOnly) {
        return NextResponse.json({ posts: [] });
    }

    const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const posts = await prisma.post.findMany({
        where: {
            OR: [
                {
                    title: {
                        contains: safeQuery,
                        mode: 'insensitive',
                    },
                },
            ],
        },
        orderBy: {
            createdAt: 'desc',
        },
        skip: offset,
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