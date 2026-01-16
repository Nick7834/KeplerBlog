import { getUserSession } from "@/lib/get-user-session";
import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = await getUserSession();

    const url = new URL(req.url);
    const slug = url.searchParams.get("category");
    const cursor = url.searchParams.get("cursor");

    const decodedCategory = slug ? decodeURIComponent(slug) : null;

    const whereCondition = decodedCategory
      ? {
          category: {
            name: decodedCategory,
          },
        }
      : {};

    const posts = await prisma.post.findMany({
      where: {
        author: {
          isbanned: false,
        },
        isbanned: false,
        ...whereCondition,
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
        _count: {
          select: {
            comments: {
              where: {
                author: {
                  isbanned: false,
                },
              },
            },
            likes: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 11,
      ...(cursor && {
        skip: 1,
        cursor: {
          id: cursor,
        },
      }),
    });

    const hasNextPage = posts.length === 11;
    const nextCursor = hasNextPage ? posts[posts.length - 1].id : null;
    const postsWithoutLast = hasNextPage ? posts.slice(0, -1) : posts;

    const postsFiltered = postsWithoutLast.map((post) => ({
      ...post,
      isLiked: user ? Boolean(post.likes[0]) : false,
    }));

    return NextResponse.json({
      posts: postsFiltered,
      nextCursor,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
