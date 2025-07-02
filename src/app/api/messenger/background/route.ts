import cloudinary from "@/lib/cloudinary";
import { getUserSession } from "@/lib/get-user-session";
import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

interface CloudinaryResource {
  secure_url: string;
  public_id: string;
}

export async function GET() {
  const userId = await getUserSession();

  if (!userId) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  try {
    const result = await cloudinary.search
      .expression("folder:background")
      .sort_by("public_id", "desc")
      .max_results(20)
      .execute();

    const urls = result.resources.map((r: CloudinaryResource) => ({
      url: r.secure_url,
      id: r.public_id,
    }));

    const userBackground = await prisma.user.findUnique({
      where: {
        id: userId.id,
      },
      select: {
        customBackgroundChat: true,
      },
    });

    return NextResponse.json({
      urls,
      customBackgroundChat: userBackground?.customBackgroundChat,
    });
  } catch (error) {
    console.warn(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  const userId = await getUserSession();

  if (!userId) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  const url = new URL(req.url);
  const background = url.searchParams.get("background");

  try {

    await prisma.user.update({
      where: {
        id: userId.id,
      },
      data: {
        backgroundChat: background || null,
        customBackgroundChat: background ? undefined : null,
      },
    });

    return NextResponse.json({ message: "Background changed successfully" });

  } catch (error) {
    console.warn(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
