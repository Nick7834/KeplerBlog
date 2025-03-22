import { getUserSession } from "@/lib/get-user-session";
import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: postId } = await params;
  const userIds = await getUserSession();

    if(!postId) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

   try {

    const posts = await prisma.post.findFirst({
        where: { id: postId },
        include: {
          comments: {
            select: {
              id: true,
              content: true,
              createdAt: true,
              author: {
                select: {
                  id: true,
                  username: true,
                  profileImage: true,
                  isverified: true
                }
              }
            }
          },
          likes: {
            select: {
              id: true,
              authorId: true
            }
          },
          author: {
            select: {
              id: true,
              username: true,
              profileImage: true,
              isverified: true
            }
          },
          _count: {
            select: {
              comments: true,
              likes: true,
            }
          },
        }
    });

    if (!posts) {
      return NextResponse.json({ error: 'Posts not found' }, { status: 404 });    
    }

    let isLiked = false;
    let isFollowing = false;

    if (userIds?.id) {
      isLiked = posts.likes.some((like) => like.authorId === userIds.id);

      const follow = await prisma.follower.findFirst({
        where: {
          followerId: userIds.id,
          followingId: posts.author.id,
        },
      });
      isFollowing = !!follow;
    }

    const postWithLikedStatus = {
      ...posts,
      isLiked,
      isFollowing,
    };

    return NextResponse.json({ postWithLikedStatus });

   } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
   }
}