import { pusher } from "@/lib/pusher";
import { notificationQueue } from "@/lib/queue";
import { prisma } from "@/prisma/prisma-client";
import chunk from "lodash.chunk";
import { NextResponse } from "next/server";

const CHUNK_SIZE = 10;

export async function POST() {
  try {
    const jobs = await notificationQueue.getJobs(["waiting"]);

    if (jobs.length === 0) {
      return NextResponse.json({ message: "No notifications to process." });
    }

    for (const job of jobs) {
      try {
        const { userId, userName, avatarUser, newPostId, title, photoUrls } =
          job.data;

        const existingNotification = await prisma.notification.findFirst({
          where: {
            userId: userId,
            postId: newPostId,
          },
        });

        if (existingNotification) {
          await job.remove();
          continue;
        }

        const followers = await prisma.follower.findMany({
          where: { followingId: userId },
          select: { followerId: true },
        });

        const followingIds = followers.map((f) => f.followerId);
        const postImage = photoUrls?.[0] || null;
        const formattedTitle = title.charAt(0).toUpperCase() + title.slice(1);
        const formattedName =
          userName.charAt(0).toUpperCase() + userName.slice(1);
        const message = `User "${formattedName}" has posted a new post: "${formattedTitle}"`;

        const chunks = chunk(followingIds, CHUNK_SIZE);

        for (const batchIds of chunks) {
          await prisma.notification.createMany({
            data: batchIds.map((id) => ({
              userId: id,
              senderId: userId,
              type: "post",
              postId: newPostId,
              message,
              avatar: avatarUser,
              postImage,
            })),
          });

          const pusherEvents = batchIds.map((id) => ({
            channel: `user-${id}`,
            name: "new_notification",
            data: {
              message,
              postId: newPostId,
              avatar: avatarUser,
              postImage,
              type: "post",
              sender: { id: userId, userName, profileImage: avatarUser },
              createdAt: new Date(),
              isRead: false,
            },
          }));

          await pusher.triggerBatch(pusherEvents);
        }

        await job.remove();
      } catch (error) {
        console.error(`Error processing job ${job.id}:`, error);
      }
    }

    return NextResponse.json({ message: "Queue processed successfully" });
  } catch (error) {
    console.error("Error processing queue:", error);
    return NextResponse.json(
      { error: "Queue processing failed" },
      { status: 500 },
    );
  }
}
