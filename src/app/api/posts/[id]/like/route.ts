import { getUserSession } from "@/lib/get-user-session";
import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const userId = await getUserSession();

    if (!userId) {
        return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    try {

        const { id: postId } = await params;
        
        if (!postId) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        const postLike = await prisma.like.findUnique({
            where: {
                authorId_postId: {
                    authorId: userId.id,
                    postId: postId
                }
            }
        });

        if (postLike) {

            await prisma.like.delete({
                where: {
                    id: postLike.id
                }
            });

            return NextResponse.json({ message: 'Like removed' }, { status: 200 });
        } else {

                await prisma.like.create({
                    data: {
                        authorId: userId.id,
                        postId: postId
                    }
                });

                return NextResponse.json({ message: 'Like added' }, { status: 200 });

        }


    } catch (error) {
        console.error('Error handling like operation:', error);
        return NextResponse.json({ error: 'Operation failed' }, { status: 500 });
    }

} 