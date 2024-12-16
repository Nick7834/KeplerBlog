import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id: postId } = await params;
    
    if (!postId) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    try {
        const photos = await prisma.post.findUnique({
            where: {
                id: postId
            },
            select: {
                image: true
            }
        });

        if (!photos) {
            return NextResponse.json({ error: 'Photos not found' }, { status: 404 });    
        }

        return NextResponse.json({ photos });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}

