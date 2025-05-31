import { useQueryClient } from "@tanstack/react-query";
import Pusher from "pusher-js";
import { useEffect } from "react";

export const usePusherChatsApi = (userId: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;
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

    const channel = pusher.subscribe(`chats-${userId}`);

    channel.bind("chat-deleted", () => {
      try {
        queryClient.invalidateQueries({ queryKey: ["chats", userId] });
      } catch (error) {
        console.warn(error);
      }
    });
    return () => {
      pusher.unsubscribe(`chats-${userId}`);
    };
  }, [queryClient, userId]);
};
