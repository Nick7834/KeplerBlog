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

    const users = await prisma.user.findMany({
      where: hasSearch
        ? {
            OR: [
              {
                username: {
                  contains: safeQuery, 
                  mode: "insensitive", 
                },
              },
              {
                email: {
                  contains: safeQuery, 
                  mode: "insensitive", 
                },
              },
            ],
          }
        : {},
      select: {
        id: true,
        username: true,
        profileImage: true,
        poster: true,
        email: true,
        role: true,
        bio: true,
        createdAt: true,
        isverified: true,
        verified: true,
        isbanned: true,
        banReason: true,
        _count: {
          select: {
            following: true,
            posts: true,
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

    const hasNextPage = users.length === 11;
    const items = hasNextPage ? users.slice(0, -1) : users;

    return NextResponse.json({
      users: items,
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
