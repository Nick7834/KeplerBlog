import { getUserSession } from "@/lib/get-user-session";
import { redisRest } from "@/lib/redisRest";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getUserSession();

  if (!userId) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  const { id: chatId } = await params;

  if (!chatId) {
    return NextResponse.json({ error: "Chat not found" }, { status: 404 });
  }

  try {
  
    await redisRest.set(`chat:online:${chatId}:${userId.id}`, "1", { ex: 60 });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.warn(error);
  }
}
