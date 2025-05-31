import { ImessageData } from "@/@types/message";
import { QueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

export const handleDelete = async (
  chatId: string,
  messageId: string,
  queryClient: QueryClient
) => {
  const formData = new FormData();
  formData.append("chatId", chatId);
  formData.append("messageId", messageId);

  if (!chatId || !messageId) return;

  queryClient.setQueryData(
    ["chat-message", chatId],
    (oldData: ImessageData) => {
      if (!oldData) return oldData;

      const updatedPages = oldData.pages.map((page) => {
        return {
          ...page,
          messages: page.messages.filter((msg) => msg.id !== messageId),
        };
      });

      return {
        ...oldData,
        pages: updatedPages,
      };
    }
  );

  try {
    await axios.delete(`/api/messenger/chat/${chatId}`, { data: formData });
  } catch (error) {
    console.warn(error);
    toast.error("Something went wrong");
  }
};
