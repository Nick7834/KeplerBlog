import { subDays } from "date-fns";
import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/get-user-session";

export async function GET() {
  const userIds = await getUserSession();

  try {
    const oneWeekAgo = subDays(new Date(), 7);

    const posts = await prisma.post.findMany({
      where: {
        createdAt: {
          gte: oneWeekAgo,
        },
        author: {
          isbanned: false,
        },
        isbanned: false,
      },
      include: {
        likes: {
          where: { authorId: userIds?.id },
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
        _count: {
          select: {
            likes: true,
            comments: {
              where: {
                author: {
                  isbanned: false,
                },
              },
            },
          },
        },
      },
    });

    const trendingPosts = posts
      .map((post) => {
        return {
          ...post,
          popularity: post._count.likes * 1 + post._count.comments * 2,
          isLiked: userIds && Boolean(post.likes[0]),
        };
      })
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 10);

    return NextResponse.json({ trendingPosts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
