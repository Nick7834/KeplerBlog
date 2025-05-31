import { getUserSession } from "@/lib/get-user-session";
import { pusher } from "@/lib/pusher";
import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getUserSession();

  if (!userId) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = parseInt(url.searchParams.get("limit") || "50", 10);

  try {
    const { id: chatId } = await params;

    if (!chatId) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        OR: [{ user1Id: userId.id }, { user2Id: userId.id }],
      },
      select: { id: true },
    });

    if (!chat) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const messages = await prisma.message.findMany({
      where: {
        chatId: chatId,
      },
      include: {
        sender: {
          select: { id: true, username: true, profileImage: true },
        },
        replyTo: {
          include: {
            sender: {
              select: { id: true, username: true, profileImage: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalMessagesCount = await prisma.message.count({
      where: {
        chatId: chatId,
      },
    });

    return NextResponse.json({ messages, totalMessagesCount });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUserSession();

  if (!user) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  const { id: chatId } = await params;

  if (!chatId) {
    return NextResponse.json({ error: "Chat ID is required" }, { status: 400 });
  }

  try {

    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      select: {
          user1: { select: { id: true } },
          user2: { select: { id: true } },
        },
    });


    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    await prisma.message.updateMany({
      where: { chatId: chatId },
      data: { replyToId: null },
    });

    await prisma.message.deleteMany({
      where: { chatId: chatId },
    });

    const deletedChat = await prisma.chat.deleteMany({
      where: { id: chatId, OR: [{ user1Id: user.id }, { user2Id: user.id }] },
    });

    const recipientId =
      chat.user1.id === user.id ? chat.user2.id : chat.user1.id;

    for (const id of [user.id, recipientId]) {
      await pusher.trigger(`chats-${id}`, "chat-deleted", chatId);
    }

    return NextResponse.json({ deletedChat });
  } catch (error) {
    console.warn(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
