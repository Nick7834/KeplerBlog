import { getUserSession } from "@/lib/get-user-session";
import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const userID = await getUserSession();

  if (!userID) {  
    return NextResponse.json({ message: 'User not authenticated' }, { status: 401 });
  }

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10); 
  const limit = parseInt(url.searchParams.get('limit') || '10', 10);
  const offset = (page - 1) * limit;

  try {
    const paginatedFollowings = await prisma.follower.findMany({
      where: {
        followerId: userID.id,
      },
      skip: offset,
      take: limit,
      select: {
        following: {
          select: {
            id: true,
            username: true,
            profileImage: true,
            bio: true,
            createdAt: true,
            _count: {
              select: {
                following: true,
                posts: true,
              },
            },
          },
        },
      },
    });
    
  
    const followingsWithStatus = await Promise.all(
      paginatedFollowings.map(async (record) => {
        const isFollowing = await prisma.follower.findFirst({
          where: {
            followerId: userID.id,
            followingId: record.following.id, 
          },
        });

        return {
          ...record.following,
          isFollowing: !!isFollowing, 
        };
      })
    );

    const totalFollowings = await prisma.follower.count({
      where: {
        followerId: userID.id,
      },
    });

    return NextResponse.json({
      totalFollowings,
      followings: followingsWithStatus,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}