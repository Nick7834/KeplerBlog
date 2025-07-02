import { getUserSession } from "@/lib/get-user-session";
import { pusher } from "@/lib/pusher";
import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

export async function PUT
  (request: Request,
  { params }: { params: Promise<{ idChat: string }> }
) {
  const userId = await getUserSession();

  if (!userId) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  const { idChat: idChat } = await params;

  if (!idChat) {
    return NextResponse.json({ error: "Chat not found" }, { status: 404 });
  }

  try {
    await prisma.message.updateMany({
      where: {
        chatId: idChat,
        senderId: {
          not: userId.id,
        },
      },
      data: {
        isRead: true,
      },
    });

    pusher.trigger(`chat-${idChat}`, "update-message-check", userId.id);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.warn(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
