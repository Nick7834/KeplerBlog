import { useEffect, useRef } from "react";
import axios from "axios";

export function useChatPing(currentChatId: string, openMessager: boolean) {
  const lastChatIdRef = useRef<string | null>(null);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (lastChatIdRef.current) {
        const data = JSON.stringify({ chatId: lastChatIdRef.current });
        navigator.sendBeacon("/api/messenger/chats/cleanup", data);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (!currentChatId || !openMessager) {
      if (lastChatIdRef.current) {
        axios
          .post(`/api/messenger/chats/cleanup`, {
            chatId: lastChatIdRef.current,
          })
          .catch(console.error);
        lastChatIdRef.current = null;
      }
      return;
    }

    if (lastChatIdRef.current && lastChatIdRef.current !== currentChatId) {
      axios
        .post(`/api/messenger/chats/cleanup`, { chatId: lastChatIdRef.current })
        .catch(console.error);
    }

    lastChatIdRef.current = currentChatId;

    const sendPing = async () => {
      try {
        await axios.post(`/api/messenger/chats/ping/${currentChatId}`);
      } catch (error) {
        console.error("Ping error:", error);
      }
    };

    sendPing();

    const interval = setInterval(sendPing, 60000);

    return () => clearInterval(interval);
  }, [currentChatId, openMessager]);
}
