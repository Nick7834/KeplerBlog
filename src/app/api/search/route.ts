import { prisma } from '@/prisma/prisma-client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('query') || '';

  const skipPosts = parseInt(req.nextUrl.searchParams.get('skipPosts') || '0', 10);
  const takePosts = parseInt(req.nextUrl.searchParams.get('takePosts') || '10', 10);

  const skipUsers = parseInt(req.nextUrl.searchParams.get('skipUsers') || '0', 10);
  const takeUsers = parseInt(req.nextUrl.searchParams.get('takeUsers') || '10', 10);

  const posts = await prisma.post.findMany({
    where: {
      OR: [
        {
          title: {
            contains: query,
            mode: 'insensitive',
          },
        },
      ],
    },
    orderBy: {
      createdAt: 'desc',
    },
    skip: skipPosts,
    take: takePosts,
    select: {
      id: true,
      title: true,
      content: true,
      image: true,
      createdAt: true,
      author: {
        select: {
          id: true,
          username: true,
          profileImage: true,
        },
      },
      _count: {
        select: {
          comments: true,
          likes: true,
        },
      },
    },
  });


  const users = await prisma.user.findMany({
    where: {
      OR: [
        {
          username: {
            contains: query,
            mode: 'insensitive',
          },
        },
      ],
    },
    skip: skipUsers,
    take: takeUsers,
    select: {
      id: true,
      username: true,
      bio: true,
      profileImage: true,
      _count: {
        select: {
          following: true,
          posts: true,
        },
      },
    },
  });

  return NextResponse.json({ posts, users });
}
