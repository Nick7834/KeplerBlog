import { getUserSession } from "@/lib/get-user-session";
import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getUserSession();
  if (!userId) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  if (userId.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: postId } = await params;
  const body = await req.json();
  const reason = body.reason;

  if (!postId || !reason) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    const user = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true, isbanned: true, author: { select: { role: true } } },
    });

    if (user?.isbanned) {
      await prisma.post.update({
        where: { id: postId },
        data: { isbanned: false, banReason: "" },
      });

      return NextResponse.json(
        { message: "Post unblocked successfully" },
        { status: 200 }
      );
    } else {
      await prisma.post.update({
        where: { id: postId },
        data: { isbanned: true, banReason: reason },
      });

      return NextResponse.json(
        { message: "Post blocked successfully" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Unable to block the post", error);
    return NextResponse.json(
      { error: "Unable to block the post" },
      { status: 500 }
    );
  }
}
