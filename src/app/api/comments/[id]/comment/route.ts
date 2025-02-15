import { getUserSession } from "@/lib/get-user-session";
import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authorId = await getUserSession();
  const postId = (await params).id;
  const body = await request.json();

  const { content, parentId } = body;

  if (!content || !authorId) {
    return NextResponse.json({ error: 'Content or authorId is missing' }, { status: 400 });
  }

  try {
    let newComment;

    if (parentId) {
      newComment = await prisma.comment.create({
        data: {
          content,
          author: {
            connect: { id: authorId.id },
          },
          post: {
            connect: { id: postId },
          },
          parent: {
            connect: { id: parentId }, 
          },
        },
      });
    } else {
      newComment = await prisma.comment.create({
        data: {
          content,
          author: {
            connect: { id: authorId.id },
          },
          post: {
            connect: { id: postId },
          },
        },
      });
    }

    return NextResponse.json({ message: 'Comment created successfully', comment: newComment }, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const postId = (await params).id;

  try {
    const comments = await prisma.comment.findMany({
      where: {
        postId: postId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            profileImage: true,
            isverified: true,
          },
        },
        _count: {
          select: {
            replies: true,
          },
        },
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ message: 'Error fetching comments' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authorId = await getUserSession();
  const commentId = (await params).id;
  const body = await request.json();

  const { content } = body;

  if (!content || !authorId || !commentId) {
    return NextResponse.json({ error: 'Content or authorId is missing' }, { status: 400 });
  }

  try {
    const updatedComment = await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        content,
        author: {
          connect: { id: authorId.id },
        },
      },
    });

    return NextResponse.json({ message: 'Comment updated successfully', comment: updatedComment }, { status: 201 });
    
  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authorId = await getUserSession();
  const commentId = (await params).id;

  if (!authorId || !commentId) {
    return NextResponse.json({ error: 'AuthorId or commentId is missing' }, { status: 400 });
  }

  try {

    async function deleteCommentWithReplies(commentId: string) {

      const replies = await prisma.comment.findMany({
        where: { parentId: commentId },
        select: { id: true },
      });

      for (const reply of replies) {
        await deleteCommentWithReplies(reply.id);
      }

      await prisma.comment.delete({
        where: { id: commentId },
      });
    }

    await deleteCommentWithReplies(commentId);

    return NextResponse.json(
      { message: "Comment and its replies deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
}