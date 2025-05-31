import { getUserSession } from "@/lib/get-user-session";
import { notificationQueue } from "@/lib/queue";
import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getUserSession();
  const { id: postId } = await params;

  if (!postId) {
    return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
  }

  if (!userId) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
  }

  try {

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (post?.authorId !== userId.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const jobs = await notificationQueue.getJobs(["waiting", "active"]); 
    const jobToRemove = jobs.find((job) => job.data.newPostId === postId);

    if (jobToRemove) {
      await notificationQueue.remove(jobToRemove.id);
    }

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
