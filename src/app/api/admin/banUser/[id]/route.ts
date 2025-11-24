import { getUserSession } from "@/lib/get-user-session";
import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

export async function PATCH(
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

  if (userId.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: userIdBan } = await params;
  const body = await req.json();
  const reason = body.reason;

  if (!userIdBan || !reason) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userIdBan },
      select: { id: true, isbanned: true, role: true },
    });

    if(user?.role === "admin") {
      return NextResponse.json({ error: "You can't block an admin" }, { status: 400 });
    }

    if(user?.isbanned) {
      await prisma.user.update({
        where: { id: userIdBan },
        data: { isbanned: false, banReason: "" },
      });

      return NextResponse.json({ message: "User unblocked successfully" }, { status: 200 });
    } else {
      await prisma.user.update({
        where: { id: userIdBan },
        data: { isbanned: true, banReason: reason },
      });

      return NextResponse.json({ message: "User blocked successfully" }, { status: 200 });
    }

  } catch (error) {
    console.error("Unable to block the user", error);
    return NextResponse.json(
      { error: "Unable to block the user" },
      { status: 500 }
    );
  }
}
