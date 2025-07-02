import { QueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

export const handleMutesChat = async (chatId: string, queryClient: QueryClient, userId: string) => {
  try {
    const resp = await axios.patch(`/api/messenger/chat/mutes/${chatId}`);

    queryClient.invalidateQueries({ queryKey: [`info-chat`, chatId] });
    queryClient.invalidateQueries({ queryKey: [`chats`, userId] });

    if (resp.status === 200) {
      toast.success(resp.data.message);
    }
  } catch (error) {
    console.warn(error);
    toast.error("Something went wrong");
  }
};
