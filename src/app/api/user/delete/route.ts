import { getUserSession } from "@/lib/get-user-session";
import { prisma } from "@/prisma/prisma-client";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE() {
  const user = await getUserSession();

  if (!user) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  try {
    await prisma.$transaction(async (tx) => {
      const userPosts = await tx.post.findMany({
        where: { authorId: user.id },
        select: { id: true },
      });

      for (const post of userPosts) {
        const rootComments = await tx.comment.findMany({
          where: { postId: post.id },
          select: { id: true },
        });

        if (rootComments.length > 0) {
          await deleteCommentsRecursively(
            rootComments.map((comment) => comment.id),
            tx
          );
        }

        await tx.post.delete({
          where: { id: post.id },
        });
      }

      const userComments = await tx.comment.findMany({
        where: { authorId: user.id },
        select: { id: true },
      });

      if (userComments.length > 0) {
        await deleteCommentsRecursively(
          userComments.map((comment) => comment.id),
          tx
        );
      }

      const userMessages = await tx.message.findMany({
        where: { senderId: user.id },
        select: { id: true },
      });

      const userMessageIds = userMessages.map((msg) => msg.id);

      await tx.message.updateMany({
        where: { replyToId: { in: userMessageIds } },
        data: { replyToId: null },
      });

      await tx.message.deleteMany({
        where: { senderId: user.id },
      });

      await tx.like.deleteMany({
        where: { authorId: user.id },
      });

      await tx.follower.deleteMany({
        where: { OR: [{ followerId: user.id }, { followingId: user.id }] },
      });

      await tx.user.delete({
        where: { id: user.id },
      });
    });

    const response = NextResponse.json(
      { message: "User account deleted successfully" },
      { status: 201 }
    );
    return response;
  } catch (error) {
    console.error("Error deleting user account and related data:", error);
    return NextResponse.json(
      { error: "Failed to delete user account" },
      { status: 500 }
    );
  }
}

async function deleteCommentsRecursively(
  commentIds: string[],
  tx: Prisma.TransactionClient
) {
  if (commentIds.length === 0) return;

  const replies = await tx.comment.findMany({
    where: { parentId: { in: commentIds } },
    select: { id: true },
  });

  if (replies.length > 0) {
    const replyIds = replies.map((reply) => reply.id);
    await deleteCommentsRecursively(replyIds, tx);
  }

  await tx.comment.deleteMany({
    where: { id: { in: commentIds } },
  });
}
