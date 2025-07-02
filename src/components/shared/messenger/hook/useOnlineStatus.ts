import { useEffect } from "react";
import axios from "axios";
import { useOnlineStore } from "@/store/useOnlineStore";

interface UseOnlineStatusResult {
  onlineUsers: Record<string, boolean>;
  setOnlineUsers: (users: Record<string, boolean>) => void;
  lastActiveMap: Record<string, number>;
}

export function useOnlineStatus(openMessager: boolean): UseOnlineStatusResult {
  const onlineUsers = useOnlineStore((state) => state.onlineUsers);
  const lastActiveMap = useOnlineStore((state) => state.lastActiveMap);
  const setOnlineUsers = useOnlineStore((state) => state.setOnlineUsers);
  const setLastActiveMap = useOnlineStore((state) => state.setLastActiveMap);

  useEffect(() => {
    async function fetchOnlineUsers() {
      try {
        const res = await axios.get("/api/online");
        const { onlineUserIds, lastActiveMap  } = res.data;
        const onlineMap: Record<string, boolean> = {};
        onlineUserIds.forEach((id: string) => {
          onlineMap[id] = true;
        });
        setOnlineUsers(onlineMap);
        setLastActiveMap(lastActiveMap);
      } catch (e) {
        console.warn("Failed to fetch online users", e);
      }
    }

    if (openMessager) {
      async function sendOnlineStatus() {
        try {
          await axios.post("/api/online", { online: true });
        } catch (e) {
          console.warn("Failed to send online status", e);
        }
      }

      sendOnlineStatus();

      const pingInterval = setInterval(() => {
        axios.post("/api/online/ping").catch(() => {});
      }, 15000);

      fetchOnlineUsers();
      const fetchInterval = setInterval(fetchOnlineUsers, 20000);

      return () => {
        clearInterval(pingInterval);
        clearInterval(fetchInterval);
      };
    } else {
      fetchOnlineUsers();
      const fetchInterval = setInterval(fetchOnlineUsers, 20000);

      return () => {
        clearInterval(fetchInterval);
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openMessager]);

  return { onlineUsers, setOnlineUsers , lastActiveMap };
}
