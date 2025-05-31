import { getUserSession } from "@/lib/get-user-session";
import { redis } from "@/lib/queue";
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
    
    await redis.set(`chat:online:${chatId}:${userId.id}`, "1", "EX", 15);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.warn(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
