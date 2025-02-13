import { subDays } from 'date-fns';
import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";
import { getUserSession } from '@/lib/get-user-session';

export async function GET() {
  const userIds = await getUserSession();
  try {
    const oneWeekAgo = subDays(new Date(), 7);
   
    const posts = await prisma.post.findMany({
      where: {
        createdAt: {
          gte: oneWeekAgo,
        },
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            profileImage: true,
            isverified: true
          },
        },
        likes: {
          select: {
            authorId: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });
    
    const trendingPosts = posts
    .map((post) => {
      const isLiked = post.likes.some((like) => like.authorId === userIds?.id);
      return {
        ...post,
        isLiked, 
        popularity: post._count.likes * 2 + post._count.comments,
      };
    })
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 10);
    
    return NextResponse.json({ trendingPosts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}
