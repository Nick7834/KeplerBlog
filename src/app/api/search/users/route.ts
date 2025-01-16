import { getUserSession } from "@/lib/get-user-session";
import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

    const userID = await getUserSession();

    const query = (req.nextUrl.searchParams.get('query') || '').trim();
    const skipUsers = parseInt(req.nextUrl.searchParams.get('skipUsers') || '0', 10);
    const takeUsers = parseInt(req.nextUrl.searchParams.get('takeUsers') || '10', 10);

    try {
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

        if (!userID) {
            return NextResponse.json({
                users: users.map((user) => ({
                    ...user,
                    isFollowing: false,
                })),
            });
        }

 
        const usersWithFollowStatus = await Promise.all(
            users.map(async (user) => {
                const isFollowing = await prisma.follower.findFirst({
                    where: {
                        followerId: userID.id,
                        followingId: user.id,
                    },
                });

                return {
                    ...user,
                    isFollowing: !!isFollowing, 
                };
            })
        );

        return NextResponse.json({ users: usersWithFollowStatus });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}