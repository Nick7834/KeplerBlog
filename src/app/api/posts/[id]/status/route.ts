import { getUserSession } from "@/lib/get-user-session";
import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const userId = await getUserSession();
    if (!userId) {
      return NextResponse.json({ liked: false });
    }
  
    const { id: postId } = await params;
    const like = await prisma.like.findUnique({
      where: {
        authorId_postId: {
          authorId: userId.id,
          postId,
        },
      },
    });
  
    return NextResponse.json({ liked: !!like });
}