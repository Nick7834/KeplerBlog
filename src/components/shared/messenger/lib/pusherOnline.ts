import Pusher from "pusher-js";
import { useEffect } from "react";

type SetOnlineUsers = (users: Record<string, boolean>) => void;

export const usePusherOnline = (setOnlineUsers: SetOnlineUsers) => {
  useEffect(() => {
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

    const channel = pusher.subscribe(`online-status`);

    let currentUsers: Record<string, boolean> = {};

    const updateOnlineUsers = (newUsers: Record<string, boolean>) => {
      currentUsers = newUsers;
      setOnlineUsers(newUsers);
    };

    channel.bind("user-online", ({ userId }: { userId: string }) => {
      updateOnlineUsers({ ...currentUsers, [userId]: true });
    });

    channel.bind("user-offline", ({ userId }: { userId: string }) => {
      const copy = { ...currentUsers };
      delete copy[userId];
      updateOnlineUsers(copy);
    });

    return () => {
      pusher.unsubscribe(`online-status`);
      channel.unsubscribe();
    };
  }, [setOnlineUsers]);
};