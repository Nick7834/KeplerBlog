import { useQueryClient } from "@tanstack/react-query";
import Pusher from "pusher-js";
import { useEffect } from "react";

export const usePusherNotification = (recipientId: string) => {
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
        queryClient.invalidateQueries({ queryKey: ["notifications-chats", recipientId] });
      } catch (error) {
        console.warn(error);
      }
    });
  
    return () => {
      pusher.unsubscribe(`chat-requests-${recipientId}`);
    };
  }, [queryClient, recipientId]);
};
