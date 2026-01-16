import { getUserSession } from "@/lib/get-user-session";
import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const userId = await getUserSession();

  if (!userId) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  const url = new URL(req.url);
  const page = Number(url.searchParams.get("page")) || 1;
  const pageSize = 10;

  try {
    const followedUsers = await prisma.follower.findMany({
      where: {
        followerId: userId.id,
      },
      select: {
        followingId: true,
      },
    });

    const followingIds = followedUsers.map((f) => f.followingId);

    const postsGet = await prisma.post.findMany({
      where: {
        authorId: {
          in: followingIds,
        },
        author: {
          isbanned: false,
        },
        isbanned: false,
      },
      include: {
        likes: {
          where: { authorId: userId?.id },
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
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const posts = postsGet.map((post) => ({
      ...post,
      isLiked: userId && Boolean(post.likes[0]),
    }));

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
