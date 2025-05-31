import { useQueryClient } from "@tanstack/react-query";
import Pusher from "pusher-js";
import { useEffect } from "react";

export const usePusherRequests = (otherUserId: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!otherUserId) return;
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

    const channel = pusher.subscribe(`chat-requests-${otherUserId}`);

    channel.bind("new-request", () => {
      try {
        queryClient.invalidateQueries({
          queryKey: ["request-chats", otherUserId],
        });
        queryClient.invalidateQueries({
          queryKey: ["count-chats", otherUserId],
        });
      } catch (error) {
        console.warn(error);
      }
    });

    channel.bind("request-deleted", () => {
      try {
        queryClient.invalidateQueries({
          queryKey: ["sent-chats", otherUserId],
        });
        queryClient.invalidateQueries({
          queryKey: ["count-chats", otherUserId],
        });
      } catch (error) {
        console.warn(error);
      }
    });

    return () => {
      pusher.unsubscribe(`chat-requests-${otherUserId}`);
    };
  }, [queryClient, otherUserId]);
};
