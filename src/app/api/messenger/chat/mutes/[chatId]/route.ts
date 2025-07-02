import { getUserSession } from "@/lib/get-user-session";
import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
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
    const chat = await prisma.chat.findUnique({ where: { id: chatId }, select: { mutedBy: true } });

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    const isMuted = chat.mutedBy.includes(userId.id);

    if (!isMuted) {
      await prisma.chat.update({
        where: { id: chatId },
        data: {
          mutedBy: {
            push: userId.id,
          },
        },
      });
       return NextResponse.json({ message: "Chat muted" }, { status: 200 });
    } else {
      await prisma.chat.update({
        where: { id: chatId },
        data: {
          mutedBy: {
            set: chat.mutedBy.filter((id) => id !== userId.id),
          },
        },
      });
        return NextResponse.json({ message: "Chat unmuted" }, { status: 200 });
    }
  } catch (error) {
    console.warn(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
