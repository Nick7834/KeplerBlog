import { ImessageData } from "@/@types/message";
import { QueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

export const handleEdit = async (
    chatId: string,
    messageId: string,
    messageContent: string,
    queryClient: QueryClient,
    formData: FormData,
    filePreview: string | null,
    isEdit: { image: string } | null,
    file: File | null,
  ) => {

    queryClient.setQueryData(
      ["chat-message", chatId],
      (oldData: ImessageData) => {
        if (!oldData) return oldData;

        const updatedPages = oldData.pages.map((page) => {
          return {
            ...page,
            messages: page.messages.map((msg) => {
              if (msg.id === messageId) {
                return {
                  ...msg,
                  content: messageContent,
                  image: file ? filePreview : isEdit?.image,
                  updatedAt: new Date(),
                };
              }
              return msg;
            }),
          };
        });

        return {
          ...oldData,
          pages: updatedPages,
        };
      }
    );

    // rest api

    try {
      await axios.patch(`/api/messenger/chat/${chatId}`, formData);
    } catch (err) {
      console.warn(err);
      toast.error("Something went wrong");
    }
  };