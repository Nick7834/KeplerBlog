import { useQueryClient } from "@tanstack/react-query";
import Pusher from "pusher-js";
import { useEffect } from "react";
import { showToast } from "../components/toast";
import { Message } from "@prisma/client";

export const usePusherNotification = (recipientId: string, openMessager: boolean, userId: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!recipientId) return;
    const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

    if (!key || !cluster) {
      throw new Error(
        "Pusher key or cluster is missing in environment variables."
      );
    }

    const pusher = new Pusher(key, {
      cluster: cluster,
    });

    const channel = pusher.subscribe(`user-notifications-${recipientId}`);

    channel.bind("chat-unread", () => {
      try {
        queryClient.invalidateQueries({
          queryKey: ["notifications-chats", recipientId],
        });
      } catch (error) {
        console.warn(error);
      }
    });

    const notificationHandler = (data: {
      newMessage: Message & {
        content: string;
        sender: { username: string; profileImage: string };
      };
      isReceiverInChat: boolean;
      mutedBy: string;
    }) => {
      const { newMessage, isReceiverInChat, mutedBy } = data;

      if (newMessage.senderId !== recipientId && !isReceiverInChat && !mutedBy) {
        if (!openMessager) {
          showToast(
            newMessage.sender.username,
            newMessage.content,
            newMessage.image,
            newMessage.sender.profileImage,
            newMessage.chatId,
            queryClient,
            userId
          );
        }
      }
    };

    channel.bind("chat-unread-notification", notificationHandler);

    return () => {
      pusher.unsubscribe(`chat-requests-${recipientId}`);
      channel.unbind("chat-unread-notification", notificationHandler);
    };
  }, [openMessager, queryClient, recipientId]);
};
