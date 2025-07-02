import { ImessageData } from "@/@types/message";
import { pusherClient } from "@/lib/pusherClient";
import { Message } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

interface messageNew extends Message {
  optimistic: boolean;
}

export const useChatPusher = (chatId?: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!chatId) return;

    const channel = pusherClient.subscribe(`chat-${chatId}`);

    const handleNewMessage = (data: {
      newMessage: messageNew;
      isReceiverInChat: number;
    }) => {
      const { newMessage, isReceiverInChat } = data;
      queryClient.setQueryData(
        ["chat-message", chatId],
        (oldData: ImessageData) => {
          if (!oldData) return oldData;

          const filteredFirstPage = oldData.pages[0].messages.filter(
            (msg) => !(msg as { optimistic?: boolean }).optimistic
          );

          const updatedPages = [
            {
              messages: [
                {
                  ...newMessage,
                  isRead: isReceiverInChat ? true : false,
                },
                ...filteredFirstPage,
              ],
            },
            ...oldData.pages.slice(1),
          ];

          return {
            ...oldData,
            pages: updatedPages,
          };
        }
      );
    };

    const handleUpdateMessage = (message: Message) => {
      queryClient.setQueryData(
        ["chat-message", chatId],
        (oldData: ImessageData) => {
          if (!oldData) return oldData;

          const updatedPages = oldData.pages.map((page) => ({
            ...page,
            messages: page.messages.map((msg) =>
              msg.id === message.id
                ? {
                    ...msg,
                    content: message.content,
                    image: message.image,
                    updatedAt: message.updatedAt,
                  }
                : msg
            ),
          }));

          return {
            ...oldData,
            pages: updatedPages,
          };
        }
      );
    };

    const handleUpdateMessageCheck = (userId: string) => {
      queryClient.setQueryData(
        ["chat-message", chatId],
        (oldData: ImessageData) => {
          if (!oldData) return oldData;

          const updatedPages = oldData.pages.map((page) => ({
            ...page,
            messages: page.messages.map((msg) =>
              !msg.isRead && msg.senderId !== userId
                ? { ...msg, isRead: true }
                : msg
            ),
          }));

          return {
            ...oldData,
            pages: updatedPages,
          };
        }
      );
    };

    const handleDeleteMessage = (messageId: string) => {
      queryClient.setQueryData(
        ["chat-message", chatId],
        (oldData: ImessageData) => {
          if (!oldData) return oldData;

          const updatedPages = oldData.pages.map((page) => ({
            ...page,
            messages: page.messages
              .map((msg) => {
                if (msg.replyToId === messageId) {
                  return {
                    ...msg,
                    replyToId: null,
                    replyTo: null,
                  };
                }
                return msg;
              })
              .filter((msg) => msg.id !== messageId),
          }));

          return {
            ...oldData,
            pages: updatedPages,
          };
        }
      );
    };

    channel.bind("new-message", handleNewMessage);
    channel.bind("update-message", handleUpdateMessage);
    channel.bind("update-message-check", handleUpdateMessageCheck);
    channel.bind("delete-message", handleDeleteMessage);

    return () => {
      channel.unbind("new-message", handleNewMessage);
      channel.unbind("update-message", handleUpdateMessage);
      channel.unbind("update-message-check", handleUpdateMessageCheck);
      channel.unbind("delete-message", handleDeleteMessage);
    };
  }, [chatId, queryClient]);
};
