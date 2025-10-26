import { getUserSession } from "@/lib/get-user-session";
import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const userId = await getUserSession();

  if (!userId) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  const { backgroundColor, textColor, fontSize, radiusSize } = await req.json();

  try {
    const existing = await prisma.settingsMessenger.findUnique({
      where: { userId: userId.id },
    });

    if (existing) {
      await prisma.settingsMessenger.update({
        where: { userId: userId.id },
        data: {
          backgroundColor: backgroundColor,
          textColor: textColor,
          fontSize: fontSize,
          radiusSize: radiusSize,
        },
      });
    } else {
      await prisma.settingsMessenger.create({
        data: {
          userId: userId.id,
          backgroundColor: backgroundColor,
          textColor: textColor,
          fontSize: fontSize,
          radiusSize: radiusSize,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
