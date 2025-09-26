import cloudinary from "@/lib/cloudinary";
import { getUserSession } from "@/lib/get-user-session";
import { getPublicIdFromUrl } from "@/lib/getPublicIdFromUrl";
import { pusher } from "@/lib/pusher";
import { redisRest } from "@/lib/redisRest";
import { prisma } from "@/prisma/prisma-client";
import { differenceInHours } from "date-fns";
import { NextResponse } from "next/server";
import sharp from "sharp";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ chatId: string }> }
) {
  const userId = await getUserSession();

  if (!userId) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  const { chatId: chatId } = await params;

  if (!chatId) {
    return NextResponse.json({ error: "Chat not found" }, { status: 404 });
  }

  try {
    const infoChat = await prisma.chat.findUnique({
      where: { id: chatId },
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
      },
    });

    if (
      !infoChat ||
      (infoChat.user1.id !== userId.id && infoChat.user2.id !== userId.id)
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    let interlocutor;
    if (infoChat.user1.id === userId.id) {
      interlocutor = infoChat.user2;
    } else {
      interlocutor = infoChat.user1;
    }

    return NextResponse.json({
      ...infoChat,
      interlocutor,
      mutedBy: infoChat.mutedBy.includes(userId.id),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
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

  const formData = await req.formData();
  const chatId = formData.get("chatId") as string;
  const senderId = formData.get("senderId") as string;
  const content = formData.get("content") as string;
  const replyToId = formData.get("replyToId") as string;
  const file = formData.get("file") as File;
  const tempId = formData.get("tempId") as string;
  const sentAt = formData.get("sentAt") as string;

  if (!senderId || !chatId || (!content && !file)) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    let imageMessage = null;

    if (file) {
      if (!file.type.startsWith("image/")) {
        return NextResponse.json(
          { error: "Invalid image format" },
          { status: 400 }
        );
      }

      if (file.size > 15 * 1024 * 1024) {
        return NextResponse.json(
          { error: "Image size must be less than 5MB" },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      const isGif = file.type === "image/gif";

      const webpBuffer = isGif
        ? buffer
        : await sharp(buffer).webp({ quality: 80 }).toBuffer();

      const cloudinaryPost = await new Promise<{ secure_url: string }>(
        (resolve, reject) => {
          const postImage = cloudinary.uploader.upload_stream(
            { folder: "messager" },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result as { secure_url: string });
              }
            }
          );

          postImage.end(webpBuffer);
        }
      );

      const image = cloudinaryPost.secure_url;

      imageMessage = image;
    }

    if (content.length > 4096) {
      return NextResponse.json(
        { error: "Message must be less than 1000 characters" },
        { status: 400 }
      );
    }

    const newMessage = await prisma.message.create({
      data: {
        content,
        image: imageMessage || null,
        senderId,
        chatId,
        ...(replyToId ? { replyToId } : {}),
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
    });

    const chat = await prisma.chat.update({
      where: { id: chatId },
      data: {
        lastActivityAt: new Date(),
      },
      select: {
        user1: { select: { id: true } },
        user2: { select: { id: true } },
        unreadBy: true,
        mutedBy: true,
      },
    });

    const recipientId =
      chat.user1.id === senderId ? chat.user2.id : chat.user1.id;

    const existingRequest = await prisma.chatRequest.findFirst({
      where: {
        fromId: recipientId,
        toId: senderId,
        status: "PENDING",
      },
    });

    if (existingRequest) {
      await prisma.chatRequest.update({
        where: { id: existingRequest.id },
        data: { status: "ACCEPTED" },
      });

      await pusher.trigger(`chat-requests-${senderId}`, "new-request", "");
      await pusher.trigger(
        `chat-requests-${recipientId}`,
        "request-deleted",
        ""
      );
    }

    const isReceiverInChat = await redisRest.exists(
      `chat:online:${chatId}:${recipientId}`
    );

    await pusher.trigger(`chat-${chatId}`, "new-message", {
      newMessage,
      tempId,
      sentAt,
      isReceiverInChat,
    });

    for (const id of [senderId, recipientId]) {
      await pusher.trigger(`chats-${id}`, "chat-top", {
        chatId,
        newMessage,
        isReceiverInChat,
      });
    }

    if (isReceiverInChat) {
      await prisma.message.update({
        where: { id: newMessage.id },
        data: { isRead: true },
      });
    } else {
      if (chat.unreadBy !== recipientId) {
        await prisma.chat.update({
          where: { id: chatId },
          data: { unreadBy: recipientId },
        });

        await pusher.trigger(
          `user-notifications-${recipientId}`,
          "chat-unread",
          {
            chatId,
          }
        );
      }
    }

    await pusher.trigger(
      `user-notifications-${recipientId}`,
      "chat-unread-notification",
      {
        newMessage,
        isReceiverInChat,
        mutedBy: chat.mutedBy.includes(recipientId),
      }
    );

    return NextResponse.json(newMessage);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  const userId = await getUserSession();

  if (!userId) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  const formData = await req.formData();
  const chatId = formData.get("chatId") as string;
  const messageId = formData.get("messageId") as string;
  const content = (formData.get("messageContent") as string) || "";
  const file = (formData.get("file") as File) || null;
  const oldPhoto = (formData.get("oldPhoto") as string) || null;

  if (!chatId || !messageId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  if (content.length > 4096) {
    return NextResponse.json(
      { error: "Message must be less than 1000 characters" },
      { status: 400 }
    );
  }

  try {
    let messagePhotoNew = null;

    const message = await prisma.message.findUnique({
      where: { id: messageId },
      select: {
        senderId: true,
        createdAt: true,
      },
    });

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    const diffHours = differenceInHours(
      new Date(),
      new Date(message.createdAt)
    );

    if (diffHours > 48) {
      return NextResponse.json(
        { error: "You cannot edit this message" },
        { status: 403 }
      );
    }

    if (message.senderId !== userId.id) {
      return NextResponse.json(
        { error: "You are not the sender of this message" },
        { status: 403 }
      );
    }

    if (file) {
      if (!file.type.startsWith("image/")) {
        return NextResponse.json(
          { error: "Invalid image format" },
          { status: 400 }
        );
      }

      if (file.size > 15 * 1024 * 1024) {
        return NextResponse.json(
          { error: "Image size must be less than 5MB" },
          { status: 400 }
        );
      }

      if (oldPhoto) {
        const oldPhotoUrl = getPublicIdFromUrl(oldPhoto);
        const response = await cloudinary.api
          .resource(`messager/${oldPhotoUrl}`)
          .catch(() => null);
        if (response && response.public_id) {
          const cloudinaryResponse = await cloudinary.uploader.destroy(
            `messager/${oldPhotoUrl}`
          );

          if (cloudinaryResponse.result !== "ok") {
            return NextResponse.json(
              { error: "Failed to delete old photo" },
              { status: 500 }
            );
          }
        }
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      const isGif = file.type === "image/gif";

      const webpBuffer = isGif ? buffer : await sharp(buffer).webp().toBuffer();

      const cloudinaryMessage = await new Promise<{ secure_url: string }>(
        (resolve, reject) => {
          const uploadMessage = cloudinary.uploader.upload_stream(
            {
              folder: "messager",
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result as { secure_url: string });
              }
            }
          );
          uploadMessage.end(webpBuffer);
        }
      );

      const image = cloudinaryMessage.secure_url;

      messagePhotoNew = image;
    }

    const updatedMessage = await prisma.message.update({
      where: { id: messageId },
      data: {
        content: content || "",
        image: messagePhotoNew || oldPhoto || null,
      },
    });

    pusher.trigger(`chat-${chatId}`, "update-message", {
      id: messageId,
      content,
      image: messagePhotoNew || oldPhoto || null,
    });

    const lastMessage = await prisma.message.findFirst({
      where: { chatId },
      orderBy: { createdAt: "desc" },
      select: { id: true },
    });

    const chatRep = await prisma.chat.findUnique({
      where: { id: chatId },
      select: {
        user1: { select: { id: true } },
        user2: { select: { id: true } },
        unreadBy: true,
      },
    });

    const recipientId =
      chatRep?.user1.id === userId.id ? chatRep?.user2.id : chatRep?.user1.id;

    if (lastMessage?.id === messageId) {
      for (const id of [userId.id, recipientId]) {
        pusher.trigger(`chats-${id}`, "update-chat-message", {
          chatId: chatId,
          content: content,
          image: messagePhotoNew || oldPhoto || null,
        });
      }
    }

    return NextResponse.json(updatedMessage);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const userId = await getUserSession();

  if (!userId) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  const formData = await req.formData();
  const chatId = formData.get("chatId") as string;
  const messageId = formData.get("messageId") as string;

  if (!chatId || !messageId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const message = await prisma.message.findUnique({
      where: { id: messageId },
      select: {
        senderId: true,
        replyToId: true,
      },
    });

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    if (message.senderId !== userId.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.message.findMany({
        where: {
          replyToId: messageId,
        },
        select: {
          id: true,
        },
      });

      await tx.message.updateMany({
        where: {
          replyToId: messageId,
        },
        data: {
          replyToId: null,
        },
      });

      await tx.message.delete({
        where: {
          id: messageId,
        },
      });
    });

    pusher.trigger(`chat-${chatId}`, "delete-message", messageId);

    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      select: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            createdAt: true,
            content: true,
            image: true,
            isRead: true,
            senderId: true,
          },
        },
      },
    });

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    const lastMessage = chat.messages[0] || null;

    const chatUpdate = await prisma.chat.update({
      where: { id: chatId },
      data: {
        lastActivityAt: lastMessage?.createdAt ?? null,
      },
      select: {
        user1: { select: { id: true } },
        user2: { select: { id: true } },
        lastActivityAt: true,
      },
    });

    const recipientId =
      chatUpdate.user1.id === message.senderId
        ? chatUpdate.user2.id
        : chatUpdate.user1.id;

    const lastMessageContent = {
      text: chat.messages[0]?.content || null,
      image: chat.messages[0]?.image || null,
      isRead: chat.messages[0]?.isRead || false,
      senderId: chat.messages[0]?.senderId || null,
    };

    for (const id of [message.senderId, recipientId]) {
      pusher.trigger(`chats-${id}`, "delete-chat-message", {
        messageId,
        chatId,
        lastActivityAt: chatUpdate.lastActivityAt,
        content: lastMessageContent.text,
        isRead: lastMessageContent.isRead,
        image: lastMessageContent.image,
        senderId: lastMessageContent.senderId,
      });
    }

    const unreadMessagesCount = await prisma.message.count({
      where: {
        chatId,
        isRead: false,
        senderId: { not: userId.id },
      },
    });

    if (unreadMessagesCount === 0) {
      await prisma.chat.update({
        where: { id: chatId },
        data: { unreadBy: null },
      });

      await pusher.trigger(`user-notifications-${recipientId}`, "chat-unread", {
        chatId,
      });
    }

    return NextResponse.json({ message: "Message deleted successfully" });
  } catch {
    console.warn("Error deleting message");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
