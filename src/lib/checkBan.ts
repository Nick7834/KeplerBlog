import { prisma } from "@/prisma/prisma-client";

export async function checkBan(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isbanned: true }
  });

  if (user?.isbanned) {
    throw new Error("USER_BANNED");
  }
}

export async function checkBanPost(postId: string) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { isbanned: true }
  });

  if (post?.isbanned) {
    throw new Error("POST_BANNED");
  }
}