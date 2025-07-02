import { getUserSession } from "@/lib/get-user-session";
import { redisRest } from "@/lib/redisRest";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const userId = await getUserSession();

  if (!userId) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  const body = await req.json();
  const chatId = body.chatId;

  if (!chatId) {
    return NextResponse.json({ error: "Chat not found" }, { status: 404 });
  }

  try {
    const pattern = `chat:online:${chatId}:${userId.id}`;

    await redisRest.del(pattern);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.warn(error);
  }
}
