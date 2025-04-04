import { getUserSession } from "@/lib/get-user-session";
import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getUserSession();

  if (!userId) {
    return NextResponse.json({ liked: false });
  }

  const { id: postId } = await params;

  const likeExists = await prisma.like.count({
    where: { authorId: userId.id, postId: postId },
  });

  return NextResponse.json({ liked: likeExists > 0 });
}
