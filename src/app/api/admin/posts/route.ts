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

  if (userId.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const cursor = url.searchParams.get("cursor");
    const search = url.searchParams.get("search") || "";
    const seachTrim = search.trim();

    const hasSearch = seachTrim.length > 0;

    const safeQuery = seachTrim.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    
    const posts = await prisma.post.findMany({
      where: hasSearch
        ? {
            OR: [
              {
                title: {
                  contains: safeQuery,
                  mode: "insensitive",
                },
              },
              {
                author: {
                  username: { contains: safeQuery, mode: "insensitive" },
                },
              },
            ],
          }
        : {},
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
        authorId: true,
        image: true,
        isbanned: true,
        banReason: true,
        author: {
          select: {
            id: true,
            username: true,
            profileImage: true,
            isverified: true,
            isbanned: true,
          },
        },
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: 11,
      ...(cursor && {
        skip: 1,
        cursor: { id: cursor },
      }),
    });

    const hasNextPage = posts.length === 11;
    const items = hasNextPage ? posts.slice(0, -1) : posts;

    return NextResponse.json({
      posts: items,
      nextCursor: hasNextPage ? items[items.length - 1].id : null,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
