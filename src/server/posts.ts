"use server";

import { getUserSession } from "@/lib/get-user-session";
import { prisma } from "@/prisma/prisma-client";

export async function getInitialPosts(
  page: number = 1,
  limit: number = 10,
  userId?: string
) {
  const user = await getUserSession();

  const offset = (page - 1) * limit;

  const isOwnProfile = userId && user?.id && userId === user.id;

  try {
    const posts = await prisma.post.findMany({
      skip: offset,
      take: limit,
      orderBy: { createdAt: "desc" },
      where: {
        ...(userId && { authorId: userId }),
        ...(isOwnProfile ? {} : { author: { isbanned: false } }),
        ...(isOwnProfile ? {} : { isbanned: false }),
      },
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
                profileImage: true,
                isverified: true,
              },
            },
          },
        },
        likes: {
          where: { authorId: user?.id },
          select: {
            id: true,
          },
        },
        author: {
          select: {
            id: true,
            username: true,
            profileImage: true,
            isverified: true,
          },
        },
        _count: { select: { comments: true, likes: true } },
      },
    });

    const postsWithHasLiked = posts.map((post) => ({
      ...post,
      isLiked: user ? Boolean(post.likes[0]) : false,
    }));

    return postsWithHasLiked;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}