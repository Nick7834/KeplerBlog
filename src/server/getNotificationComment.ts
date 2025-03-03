'use server'

import { pusher } from "@/lib/pusher";
import { prisma } from "@/prisma/prisma-client";


export const getNotificationComment = async (
    authorId: string,
    authorPostId: string,
    postId: string,
    userName: string,
    titlePost: string, 
    shortenedComment: string, 
    avatar: string | null
) => {
    if(authorPostId && authorPostId !== authorId){

        const notificationComment = await prisma.notification.create({
            data: {
                userId: authorPostId,
                type: "comment",
                message: `The user "${userName.charAt(0).toUpperCase() + userName.slice(1)}" commented on your post "${titlePost}" with the comment "${shortenedComment}"`,
                postId: postId,
                avatar: avatar,
            }
        });

        await pusher.trigger(`user-${authorPostId}`, "new_notification", {
            id: notificationComment.id,
            type: "comment",
            message: `The user "${userName.charAt(0).toUpperCase() + userName.slice(1)}" commented on your post "${titlePost}" with the comment "${shortenedComment}"`,
            postId,
            avatar: avatar,
            isRead: false
        })

    }
}