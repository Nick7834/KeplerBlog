import { getUserSession } from "@/lib/get-user-session";
import { pusher } from "@/lib/pusher";
import { redisRest } from "@/lib/redisRest";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const user = await getUserSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { online } = await request.json();

  if (online) {
    await redisRest.set(`lastActive:${user.id}`, Date.now());
    await redisRest.set(`online:${user.id}`, "1", { ex: 30 });

    await pusher.trigger("online-status", "user-online", {
      userId: user.id,
    });
  } else {
    await redisRest.del(`online:${user.id}`);

    await pusher.trigger("online-status", "user-offline", {
      userId: user.id,
    });
  }

  return NextResponse.json({ success: true });
}

export async function GET() {
  try {
    const keysLastActive = await redisRest.keys("lastActive:*");
    const userIdsLastActive = keysLastActive.map((key) => key.replace("lastActive:", ""));
    
    const lastActiveMap: Record<string, number> = {};
    for (const userId of userIdsLastActive) {
      const lastSeen = await redisRest.get(`lastActive:${userId}`);
      if (lastSeen) {
        lastActiveMap[userId] = Number(lastSeen);
      }
    }

    const keysOnline = await redisRest.keys("online:*");
    const userIdsOnline = keysOnline.map((key) => key.replace("online:", ""));

    return NextResponse.json({
      onlineUserIds: userIdsOnline,
      lastActiveMap,
    });
  } catch {
    return NextResponse.json({
      onlineUserIds: [],
      lastActiveMap: {},
    });
  }
}