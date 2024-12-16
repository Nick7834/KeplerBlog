import { getUserSession } from "@/lib/get-user-session";
import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getUserSession();

  const { id: id } = await params;

    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }
  
    if (!id) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    if (userId.id === id) {
      return NextResponse.json({ message: "You cannot follow yourself" }, { status: 400 });
    }
  
    try {
      
      const currentUser = await prisma.follower.findUnique({
        where: { 
            followerId_followingId: {
                followerId: userId.id, 
                followingId: id,
            }
         },
      });

      if(currentUser) {

        await prisma.follower.delete({
            where: {
                id: currentUser.id
            }
        });

        return NextResponse.json({ message: "Unfollowed successfully" });

      } else {

         await prisma.follower.create({
            data: {
              followerId: userId.id, 
              followingId: id,
            },
          });

          return NextResponse.json({ message: "Followed successfully" });
        
      }
  
  
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
  }

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const userId = await getUserSession();

    const { id: id } = await params;

    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }
  
    const follow = await prisma.follower.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId.id,
          followingId: id
        }
      },
    });
  
    return NextResponse.json({ isFollow: !!follow });
}