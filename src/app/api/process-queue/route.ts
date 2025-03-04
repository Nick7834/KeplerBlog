import { pusher } from "@/lib/pusher"
import { notificationQueue } from "@/lib/queue"
import { prisma } from "@/prisma/prisma-client"
import chunk from "lodash.chunk"
import { NextResponse } from "next/server"

const CHUNK_SIZE = 10

export async function GET() {
  try {
    const jobs = await notificationQueue.getJobs(["waiting"])

    if (jobs.length === 0) {
      return NextResponse.json({ message: "No notifications to process." })
    }

    for (const job of jobs) {
      try {
        const { userId, userName, avatarUser, newPostId, title, photoUrls } = job.data

        const existingNotification = await prisma.notification.findFirst({
          where: {
            userId: userId,
            postId: newPostId,
          },
        })

        if (existingNotification) {
          await notificationQueue.remove(job.id)
          continue
        }

        const followers = await prisma.follower.findMany({
          where: { followingId: userId },
          select: { followerId: true },
        })

        const followingIds = followers.map((f: { followerId: string }) => f.followerId)
        const chunks = chunk(followingIds, CHUNK_SIZE)

        for (const chunk of chunks) {
          const createdNotifications = await Promise.all(
            chunk.map((id) =>
              prisma.notification.create({
                data: {
                  userId: id,
                  type: "post",
                  postId: newPostId,
                  message: `User "${userName.charAt(0).toUpperCase() + userName.slice(1)}"
                                        has posted a new post: "${title.charAt(0).toUpperCase() + title.slice(1)}"`,
                  avatar: avatarUser,
                  postImage: photoUrls.length > 0 ? photoUrls[0] : null,
                },
                select: { id: true, userId: true },
              }),
            ),
          )

         await pusher.triggerBatch(
            createdNotifications.map((notification) => ({
              channel: `user-${notification.userId}`,
              name: "new_notification",
              data: {
                id: notification.id,
                message: `User "${userName.charAt(0).toUpperCase() + userName.slice(1)}"
                                    has posted a new post: "${title.charAt(0).toUpperCase() + title.slice(1)}"`,
                postId: newPostId,
                avatar: avatarUser,
                isRead: false,
                type: "post",
                postImage: photoUrls.length > 0 ? photoUrls[0] : null,
              },
            })),
          )
        }

        await notificationQueue.remove(job.id)
      } catch (error) {
        console.error(`Error processing job ${job.id}:`, error)
      }
    }

    return NextResponse.json({ message: "Queue processed successfully" })
  } catch (error) {
    console.error("Error processing queue:", error)
    return NextResponse.json({ error: "Queue processing failed" }, { status: 500 })
  }
}

