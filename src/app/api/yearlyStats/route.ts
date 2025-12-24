import { checkBan } from "@/lib/checkBan";
import { getUserSession } from "@/lib/get-user-session";
import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const userId = await getUserSession();
    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    await checkBan(userId.id);

    const yearStart = new Date('2025-01-01T00:00:00Z');
    const yearEnd = new Date('2025-12-23T23:59:59Z');

    // get yearly stats main

    const [
      likedPosts,
      followedAuthors,
      commentsWritten,
      messagesReceived,
      messagesSent,
    ] = await Promise.all([
      prisma.like.count({
        where: {
          authorId: userId.id,
          createdAt: {
            gte: yearStart,
            lt: yearEnd,
          },
        },
      }),
      prisma.follower.count({
        where: {
          followerId: userId.id,
          createdAt: {
            gte: yearStart,
            lt: yearEnd,
          },
        },
      }),
      prisma.comment.count({
        where: {
          authorId: userId.id,
          createdAt: {
            gte: yearStart,
            lt: yearEnd,
          },
        },
      }),
      prisma.message.count({
        where: {
          chat: {
            OR: [{ user1Id: userId.id }, { user2Id: userId.id }],
          },
          senderId: { not: userId.id },
          createdAt: {
            gte: yearStart,
            lt: yearEnd,
          },
        },
      }),
      prisma.message.count({
        where: {
          senderId: userId.id,
          createdAt: {
            gte: yearStart,
            lt: yearEnd,
          },
        },
      }),
    ]);

    // get yearly stats your

    const [myPosts, myFollowers, myLikes, myComments] = await Promise.all([
      prisma.post.count({
        where: {
          authorId: userId.id,
          createdAt: {
            gte: yearStart,
            lt: yearEnd,
          },
          isbanned: false,
        },
      }),
      prisma.follower.count({
        where: {
          followingId: userId.id,
          createdAt: {
            gte: yearStart,
            lt: yearEnd,
          },
        },
      }),
      prisma.like.count({
        where: {
          post: {
            authorId: userId.id,
          },
          createdAt: {
            gte: yearStart,
            lt: yearEnd,
          },
        },
      }),
      prisma.comment.count({
        where: {
          post: {
            authorId: userId.id,
          },
          createdAt: {
            gte: yearStart,
            lt: yearEnd,
          },
          authorId: {
            not: userId.id,
          },
        },
      }),
    ]);

    return NextResponse.json({
      likedPosts,
      followedAuthors,
      commentsWritten,
      messagesReceived,
      messagesSent,

      // your
      myPosts,
      myFollowers,
      myLikes,
      myComments,
    });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
