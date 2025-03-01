import { getUserSession } from "@/lib/get-user-session";
import { prisma } from "@/prisma/prisma-client";
// import { getNotificationComment } from "@/server/getNotificationComment";
// import { getNotificationRecipients } from "@/server/notificationRecipient";
import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authorId = await getUserSession();
  const postId = (await params).id;
  const body = await request.json();

  const { content, parentId, avatar, userName } = body;

  if (!content || !authorId) {
    return NextResponse.json({ error: 'Content or authorId is missing' }, { status: 400 });
  }

  try {
    let newComment;
    // let notificationRecipientId = null;

    if (parentId) {

      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId },
        select: { 
          authorId: true,
          post: {
            select: {
              title: true,}
          }
        },
      });
    
      if (!parentComment) {
        return NextResponse.json({ error: 'Parent comment not found' }, { status: 404 });
      }

      // notificationRecipientId = parentComment.authorId;

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

      // getNotificationRecipients(
      //   authorId.id,
      //   notificationRecipientId,
      //   postId, 
      //   userName, 
      //   newComment.id, 
      //   content,
      //   parentComment.post.title,
      //   avatar
      // ); 
    
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

      const post = await prisma.comment.findUnique({
        where: { id: newComment.id },
        select: {
          authorId: true,
          post: {
            select: {
              authorId: true,
              title: true,
            },
          },
        }
      });


      if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }

      // getNotificationComment(
      //   authorId.id,
      //   post.post.authorId,
      //   postId, 
      //   userName, 
      //   post.post.title, 
      //   content,
      //   avatar
      // )

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
    const existingComment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!existingComment) {
      return NextResponse.json({ error: 'Comment not found  ' }, { status: 404 });
    }

    if (existingComment.authorId !== authorId.id) {
      return NextResponse.json({ error: 'You are not authorized to update this comment' }, { status: 403 });
    }

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
    const existingComment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { authorId: true },
    });

    if (existingComment?.authorId !== authorId.id) {
      return NextResponse.json({ error: 'You are not authorized to delete this comment' }, { status: 403 });
    }

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