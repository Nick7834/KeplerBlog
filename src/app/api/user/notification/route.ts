import { getUserSession } from "@/lib/get-user-session"
import { prisma } from "@/prisma/prisma-client"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const user = await getUserSession()

  if (!user) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
  }

  const url = new URL(req.url)
  const page = Number.parseInt(url.searchParams.get("page") || "1", 10)
  const limit = Number.parseInt(url.searchParams.get("limit") || "10", 10)

  try {
    const notifications = await prisma.notification.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: { userId: user.id },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            profileImage: true,
          },
        },
      },
    })

    return NextResponse.json({
      notifications,
    })
  } catch (error) {
    console.warn(error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
