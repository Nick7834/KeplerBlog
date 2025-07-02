import { NextResponse } from "next/server";
import { redisRest } from "@/lib/redisRest";
import { getUserSession } from "@/lib/get-user-session";

export async function POST() {
  const user = await getUserSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await redisRest.set(`lastActive:${user.id}`, Date.now());
  await redisRest.expire(`online:${user.id}`, 30);

  return NextResponse.json({ ok: true });
}
