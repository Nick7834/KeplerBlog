import { useEffect } from "react";
import axios from "axios";

export function useChatPing(currentChatId: string) {
  useEffect(() => {
    if (!currentChatId) return;

    const sendPing = async () => {
      try {
        await axios.post(`/api/messenger/chats/ping/${currentChatId}`);
      } catch (error) {
        console.error("Ping error:", error);
      }
    };

    sendPing();

    const interval = setInterval(sendPing, 15000);

    return () => clearInterval(interval);
  }, [currentChatId]);
}