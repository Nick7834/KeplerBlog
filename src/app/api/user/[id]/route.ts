import { prisma } from '@/prisma/prisma-client';
import { NextResponse } from 'next/server';


export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: id } = await params;

  if (!id) {
    return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
      select: {
        id: true,
        username: true,
        profileImage: true,
        poster: true,
        bio: true,
        createdAt: true,
        followers: {
          select: {
            id: true,
            followerId: true,
            followingId: true,
          },
        },
        _count: {
          select: {
            following: true
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

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}