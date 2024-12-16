import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: postId } = await params;

  if (!postId) {
    return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
  }

  try {
    await prisma.$transaction(async (tx) => {

      const rootComments = await tx.comment.findMany({
        where: { postId },
        select: { id: true },
      });

      if (rootComments.length > 0) {

        async function deleteCommentsRecursively(commentIds: string[]) {
          if (commentIds.length === 0) return;

          const replies = await tx.comment.findMany({
            where: { parentId: { in: commentIds } },
            select: { id: true },
          });

          if (replies.length > 0) {
            const replyIds = replies.map((reply) => reply.id);
            await deleteCommentsRecursively(replyIds);
          }

          await tx.comment.deleteMany({
            where: { id: { in: commentIds } },
          });
        }

        const rootCommentIds = rootComments.map((comment) => comment.id);
        await deleteCommentsRecursively(rootCommentIds);
      }

      await tx.post.delete({
        where: { id: postId },
      });
    });

    return NextResponse.json({ message: "Post and all related data deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting post and comments:", error);
    return NextResponse.json({ error: "Failed to delete post and comments" }, { status: 500 });
  }
}