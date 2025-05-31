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
    const PENDING = await prisma.chatRequest.count({
      where: {
        toId: userId.id,
        status: "PENDING",
      },
    });

    const conutList = await prisma.chatRequest.count({
      where: {
        fromId: userId.id,
      },
    });

    const finalCount = {
      pending: PENDING,
      conutList: conutList,
    };

    return NextResponse.json({ finalCount }, { status: 200 });
  } catch (error) {
    console.warn(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
