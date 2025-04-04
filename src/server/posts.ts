"use server";

import { prisma } from "@/prisma/prisma-client";

export async function getInitialPosts(page: number = 1, limit: number = 10, userId?: string) {
  const offset = (page - 1) * limit;

  try {
    const posts = await prisma.post.findMany({
      skip: offset,
      take: limit,
      orderBy: { createdAt: "desc" },
      where: userId ? { authorId: userId } : {},
      include: {
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            author: { select: { id: true, username: true, profileImage: true, isverified: true } },
          },
        },
        author: { select: { id: true, username: true, profileImage: true, isverified: true } },
        _count: { select: { comments: true, likes: true } },
      },
    });

    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}