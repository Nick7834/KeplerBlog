import { getUserSession } from '@/lib/get-user-session';
import { prisma } from '@/prisma/prisma-client';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const userIds = await getUserSession();
    const { id } = await params;
  
    if (!id) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }
  
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          createdAt: true,
          isverified: true,
          isverifiedEmail: true,
          verified: true,
          followers: {
            select: {
              id: true,
              followerId: true,
              followingId: true,
            },
          },
          _count: {
            select: {
              following: true,
              posts: true
            }
          },
          posts: {
            select: {
              id: true,
              _count: {
                select: {
                  likes: true,
                },
              },
            },
          },
        },
      });
  
      if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }
  
      let isFollowing = false;
      if (userIds?.id) {
        const follow = await prisma.follower.findFirst({
          where: {
            followerId: userIds.id,
            followingId: user.id,
          },
        });
        isFollowing = !!follow;
      }
  
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
      const recentActivity = await prisma.$transaction([
        prisma.like.findFirst({
          where: { authorId: id, createdAt: { gte: thirtyDaysAgo } },
        }),
        prisma.comment.findFirst({
          where: { authorId: id, createdAt: { gte: thirtyDaysAgo } },
        }),
        prisma.follower.findFirst({
          where: { followerId: id, createdAt: { gte: thirtyDaysAgo } },
        }),
        prisma.post.findFirst({
          where: { authorId: id, createdAt: { gte: thirtyDaysAgo } },
        }),
      ]);
  
      const isActive = recentActivity.some(activity => activity !== null);
  
      return NextResponse.json({ ...user, isFollowing, isActive });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
  }
  