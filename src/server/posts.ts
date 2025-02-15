"use server";

import { prisma } from "@/prisma/prisma-client";
import { getUserSession } from "@/lib/get-user-session";

export async function getInitialPosts(page: number = 1, limit: number = 10, userId?: string) {
  const offset = (page - 1) * limit;
  const userIds = await getUserSession();

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
        likes: { select: { id: true, authorId: true } },
        author: { select: { id: true, username: true, profileImage: true, isverified: true } },
        _count: { select: { comments: true, likes: true } },
      },
    });

    const postsWithLikedStatus = await Promise.all(
      posts.map(async (post) => {
        let isLiked = false;
        let isFollowing = false;

        if (userIds?.id) {
          const like = await prisma.like.findFirst({
            where: { authorId: userIds.id, postId: post.id },
          });
          isLiked = !!like;
        }

        const follow = await prisma.follower.findFirst({
          where: { followerId: userIds?.id, followingId: post.authorId },
        });
        isFollowing = !!follow;

        return { ...post, isLiked, isFollowing };
      })
    );

    return postsWithLikedStatus;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}
