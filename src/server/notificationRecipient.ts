'use server'

import { pusher } from "@/lib/pusher";
import { prisma } from "@/prisma/prisma-client"

export const getNotificationRecipients = async (
    authorId: string, 
    notificationRecipientId: string,
    postId: string,
    userName: string,
    commentId: string,
    shortenedComment: string,
    postTitle: string,
    avatar: string | null
) => {
    if (notificationRecipientId && notificationRecipientId !== authorId) {
        const notification = await prisma.notification.create({
            data: {
                userId: notificationRecipientId,
                type: "comment_reply",
                message: `The user "${userName.charAt(0).toUpperCase() + userName.slice(1)}" replied to your comment on the post "${postTitle}" with the comment "${shortenedComment}"`,
                postId: postId,
                avatar: avatar,
              },
        });

        await pusher.trigger(`user-${notificationRecipientId}`, "new_notification", {
            id: notification.id,
            type: "comment_reply",
            message: `The user "${userName.charAt(0).toUpperCase() + userName.slice(1)}" replied to your comment on the post "${postTitle}" with the comment "${shortenedComment}"`,
            postId,
            commentId:commentId,
            avatar: avatar,
            isRead: false,
        });
    }
}