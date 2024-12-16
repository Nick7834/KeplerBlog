import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: postId } = await params;

    if(!postId) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

   try {

    const posts = await prisma.post.findFirst({
        where: { id: postId },
        include: {
          comments: {
            select: {
              id: true,
              content: true,
              createdAt: true,
              author: {
                select: {
                  id: true,
                  username: true,
                  profileImage: true
                }
              }
            }
          },
          likes: {
            select: {
              id: true,
            }
          },
          author: {
            select: {
              id: true,
              username: true,
              profileImage: true
            }
          },
          _count: {
            select: {
              comments: true,
              likes: true,
            }
          },
        }
      
    });

    if (!posts) {
      return NextResponse.json({ error: 'Posts not found' }, { status: 404 });    
    }

    return NextResponse.json({ posts });

   } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
   }
}