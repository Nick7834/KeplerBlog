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

  try {
    const cursorExists = cursor
      ? await prisma.chat.findUnique({ where: { id: cursor } })
      : null;

    const effectiveCursor = cursorExists ? cursor : undefined;

    const chatsFetch = await prisma.chat.findMany({
      where: {
        AND: [
          {
            OR: [{ user1Id: userId.id }, { user2Id: userId.id }],
          },
          {
            messages: {
              some: {},
            },
          },
        ],
      },
      select: {
        id: true,
        mutedBy: true,
        user1: {
          select: {
            id: true,
            username: true,
            profileImage: true,
            isverified: true,
          },
        },
        user2: {
          select: {
            id: true,
            username: true,
            profileImage: true,
            isverified: true,
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            id: true,
            content: true,
            image: true,
            createdAt: true,
            updatedAt: true,
            isRead: true,
            senderId: true,
          },
        },
        lastActivityAt: true,
        updatedAt: true,
        createdAt: true,
      },
      take: 20,
      cursor: effectiveCursor ? { id: effectiveCursor } : undefined,
      skip: cursor ? 1 : 0,
      orderBy: [
        { lastActivityAt: "desc" },
        { updatedAt: "desc" },
        { id: "desc" },
      ],
    });

    const totalChats = await prisma.chat.count({
      where: {
        AND: [
          {
            OR: [{ user1Id: userId.id }, { user2Id: userId.id }],
          },
          {
            messages: {
              some: {},
            },
          },
        ],
      },
    });

    const chats = await Promise.all(
      chatsFetch.map(async (chat) => {
        const isUser1 = chat.user1.id === userId.id;
        const companion = isUser1 ? chat.user2 : chat.user1;

        const lastMessage = chat.messages[0] || null;

        const lastMessageContent = {
          text: chat.messages[0]?.content || null,
          image: chat.messages[0]?.image || null,
          isRead: chat.messages[0]?.isRead || false,
          senderId: chat.messages[0]?.senderId || null,
          createMessageAt: chat.messages[0]?.createdAt || null,
        };

        const unreadCount = await prisma.message.count({
          where: {
            chatId: chat.id,
            isRead: false,
            senderId: { not: userId.id },
          },
        });

        return {
          chatId: chat.id,
          mutedBy: chat.mutedBy.includes(userId.id),
          companion: {
            id: companion.id,
            username: companion.username,
            profileImage: companion.profileImage,
            isverified: companion.isverified,
          },
          lastUpdated: chat.updatedAt,
          createdAt: chat.createdAt,
          lastActivityAt: chat.lastActivityAt,
          unreadCount,
          lastMessage: lastMessage
            ? {
                id: lastMessage.id,
                content: lastMessageContent,
                сreatedAt: lastMessage.createdAt,
                isRead: lastMessage.isRead,
                senderId: lastMessage.senderId,
                createMessageAt: lastMessage.createdAt,
              }
            : null,
        };
      })
    );

    return NextResponse.json(
      { chats, totalChats: totalChats },
      { status: 200 }
    );
  } catch (error) {
    console.warn(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const userId = await getUserSession();

  if (!userId) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  const url = new URL(req.url);
  const otherUserId = url.searchParams.get("otherUserId");

  if (!otherUserId) {
    return NextResponse.json({ error: "Missing otherUserId" }, { status: 400 });
  }

  try {
    const userReq = await prisma.user.findUnique({
      where: { id: otherUserId },
      select: { messagePrivate: true },
    });

    if (!userReq) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const chat = await prisma.chat.findFirst({
      where: {
        OR: [
          { user1Id: userId.id, user2Id: otherUserId },
          { user1Id: otherUserId, user2Id: userId.id },
        ],
      },
      include: {
        messages: {
          take: 1,
        },
      },
    });

    const isPrivateRequest = userReq.messagePrivate === "Request";

    if (isPrivateRequest && (!chat || chat.messages.length === 0)) {
      const existingRequest = await prisma.chatRequest.findFirst({
        where: {
          fromId: userId.id,
          toId: otherUserId,
        },
      });

      if (existingRequest) {
        if (existingRequest.status === "PENDING") {
          return NextResponse.json(
            {
              requestPending: true,
              message: "Request is already pending.",
            },
            { status: 200 }
          );
        }

        if (existingRequest.status === "REJECTED") {
          await prisma.chatRequest.update({
            where: {
              id: existingRequest.id,
            },
            data: {
              fromId: userId.id,
              toId: otherUserId,
              status: "PENDING",
            },
          });

          await pusher.trigger(
            `chat-requests-${otherUserId}`,
            "new-request",
            ""
          );

          await pusher.trigger(
            `user-notifications-${otherUserId}`,
            "chat-unread",
            {
              chatId: chat?.id,
            }
          );

          return NextResponse.json(
            {
              requestRejected:
                "Request has been rejected. A new request has been sent.",
            },
            { status: 200 }
          );
        }
      } else {
        await prisma.chatRequest.create({
          data: {
            fromId: userId.id,
            toId: otherUserId,
            status: "PENDING",
          },
        });

        await pusher.trigger(`chat-requests-${otherUserId}`, "new-request", "");
        await pusher.trigger(
          `user-notifications-${otherUserId}`,
          "chat-unread",
          {
            chatId: chat?.id,
          }
        );
        return NextResponse.json(
          {
            requestSent: true,
            message:
              "Request has been sent. Please wait for the other user to accept it.",
          },
          { status: 200 }
        );
      }
    }

    if (chat) {
      return NextResponse.json(
        { chat: chat.id, alreadyExisted: true },
        { status: 200 }
      );
    }

    const newChat = await prisma.chat.create({
      data: {
        user1Id: userId.id,
        user2Id: otherUserId,
      },
    });

    return NextResponse.json(
      { chat: newChat.id, created: true },
      { status: 200 }
    );
  } catch (error) {
    console.warn(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

// update chat get api

export async function PATCH(req: Request) {
  const userId = await getUserSession();

  if (!userId) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  const url = new URL(req.url);
  const chatId = url.searchParams.get("chatId");

  if (!chatId) {
    return NextResponse.json({ error: "Missing chatId" }, { status: 400 });
  }

  try {
    const lastMessage = await prisma.message.findFirst({
      where: {
        chatId: chatId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 1,
      select: {
        senderId: true,
        isRead: true,
      },
    });

    if (!lastMessage) {
      return NextResponse.json({ hasMessages: false });
    }
    
    if (lastMessage.senderId !== userId.id && !lastMessage.isRead) {
      const chat = await prisma.chat.update({
        where: {
          id: chatId,
        },
        include: {
          user1: {
            select: {
              id: true,
            },
          },
          user2: {
            select: {
              id: true,
            },
          },
        },
        data: {
          unreadBy: null,
        },
      });

      const isUser1 = chat.user1Id === userId.id;
      const companion = isUser1 ? chat.user2.id : chat.user1.id;

      await pusher.trigger(`user-notifications-${userId.id}`, "chat-unread", {
        chatId,
      });

      await pusher.trigger(`chats-${companion}`, "chat-check", {
        senderId: companion,
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
