import {
  ChatProps,
  IchatsData,
  ImessageData,
  ReplyType,
} from "@/@types/message";
import { QueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Session } from "next-auth";
import toast from "react-hot-toast";

export const handleMessagePost = async (
  chatId: string,
  content: string,
  queryClient: QueryClient,
  setIsNew: (value: boolean) => void,
  formData: FormData,
  session: Session,
  reply: ReplyType | null,
  filePreview: string | null
) => {
  queryClient.setQueryData(
    ["chat-message", chatId],
    (oldData: ImessageData) => {
      if (!oldData) return oldData;

      const pages = oldData.pages ?? [oldData];

      const tempId = crypto.randomUUID();

      const newMessage = {
        id: tempId,
        tempId,
        image: filePreview || "",
        replyToId: reply?.id || "",
        sender: {
          id: session?.user?.id,
          username: session?.user?.username,
        },
        replyTo: reply && {
          id: reply?.id,
          image: reply?.image || "",
          content: reply?.content || "",
          sender: {
            username: reply?.sender.username,
          },
        },
        senderId: session?.user?.id || "",
        content,
        createdAt: new Date().toISOString() as unknown as Date,
        optimistic: true,
      };

      const updatedPages = [
        {
          messages: [newMessage, ...(pages[0]?.messages ?? [])],
        },
        ...pages.slice(1),
      ];

      return {
        ...oldData,
        pages: updatedPages,
      };
    }
  );

  queryClient.setQueryData(
    ["chats", session?.user?.id],
    (oldData: IchatsData | undefined) => {
      if (!oldData) return oldData;

      let chatToMove: ChatProps | null = null;

      const updatedPages = oldData.pages.map((page) => {
        const updatedChats = page.chats
          .map((chat) => {
            if (chat.chatId === chatId) {
              chatToMove = {
                ...chat,
                companion: chat.companion,
                lastMessage: {
                  ...chat.lastMessage,
                  id: crypto.randomUUID(),
                  createMessageAt: new Date().toISOString() as unknown as Date,
                  content: {
                    text: content,
                    image: filePreview || "",
                  },
                },
                createdAt: new Date().toISOString() as unknown as Date,
              };
              return null;
            }
            return chat;
          })
          .filter(Boolean) as ChatProps[];

        return {
          ...page,
          chats: updatedChats,
        };
      });

      if (!chatToMove) return oldData;

      updatedPages[0].chats = [chatToMove, ...updatedPages[0].chats];

      return {
        ...oldData,
        pages: updatedPages,
      };
    }
  );

  try {
    await axios.post(`/api/messenger/chat/${chatId}`, formData);
    setIsNew(false);
  } catch (error) {
    console.warn(error);
    toast.error("Something went wrong");
  }
};
