import { getUserSession } from "@/lib/get-user-session";
import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

export async function GET() {
  const userId = await getUserSession();

  if (!userId) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  try {
    const unreadCount = await prisma.chat.count({
      where: {
        unreadBy: userId.id,
      },
    });

    const reqCount = await prisma.chatRequest.count({
      where: {
        toId: userId.id,
        status: "PENDING",
      },
    });

    const count = unreadCount + reqCount;

    return NextResponse.json({ count });
  } catch (error) {
    console.warn(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
