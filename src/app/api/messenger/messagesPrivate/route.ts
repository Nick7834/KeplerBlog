import { getUserSession } from "@/lib/get-user-session";
import { pusher } from "@/lib/pusher";
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
  const cursor = url.searchParams.get("cursor");
  const direction = url.searchParams.get("direction");

  try {
    if (direction === "outgoing") {
      const sentReq = await prisma.chatRequest.findMany({
        where: {
          fromId: userId.id,
        },
        select: {
          status: true,
          id: true,
          to: {
            select: {
              id: true,
              username: true,
              profileImage: true,
              isverified: true,
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

      if (!sentReq) {
        return NextResponse.json(
          { error: "Chat request not found" },
          { status: 404 }
        );
      }

      const hasNextPage = sentReq.length === 11;
      const items = hasNextPage ? sentReq.slice(0, -1) : sentReq;

      return Response.json({
        items,
        nextCursor: hasNextPage ? items[items.length - 1].id : null,
      });
    } else {
      const reqChats = await prisma.chatRequest.findMany({
        where: {
          toId: userId.id,
          status: "PENDING",
        },
        select: {
          status: true,
          id: true,
          from: {
            select: {
              id: true,
              username: true,
              profileImage: true,
              isverified: true,
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

      if (!reqChats) {
        return NextResponse.json(
          { error: "Chat request not found" },
          { status: 404 }
        );
      }

      const hasNextPage = reqChats.length === 11;
      const items = hasNextPage ? reqChats.slice(0, -1) : reqChats;

      return Response.json({
        items,
        nextCursor: hasNextPage ? items[items.length - 1].id : null,
      });
    }
  } catch (error) {
    console.warn(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  const userId = await getUserSession();

  if (!userId) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  const url = new URL(req.url);
  const idRequest = url.searchParams.get("idRequest");
  const status = url.searchParams.get("status");

  if (!idRequest || !status) {
    return NextResponse.json({ error: "Missing idRequest" }, { status: 400 });
  }

  try {
    const reqChat = await prisma.chatRequest.findUnique({
      where: {
        id: idRequest,
      },
      select: {
        id: true,
        fromId: true,
        toId: true,
      },
    });

    if (!reqChat) {
      return NextResponse.json(
        { error: "Chat request not found" },
        { status: 404 }
      );
    }

    await prisma.chatRequest.update({
      where: {
        id: idRequest,
      },
      data: {
        status: status as "ACCEPTED" | "REJECTED",
      },
    });

    await pusher.trigger(`chat-requests-${reqChat.fromId}`, "request-deleted", {});

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.warn(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
