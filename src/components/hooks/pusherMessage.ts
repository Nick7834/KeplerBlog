import { ImessageData } from "@/@types/message";
import { pusherClient } from "@/lib/pusherClient";
import { Message } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

interface messageNew extends Message {
  optimistic: boolean;
  tempId: string;
}

export const useChatPusher = (chatId?: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!chatId) return;

    const channel = pusherClient.subscribe(`chat-${chatId}`);

    const normalizeDate = (date: string | Date) => new Date(date).toISOString();

    const handleNewMessage = (data: {
      newMessage: messageNew;
      tempId: string;
      isReceiverInChat: number;
    }) => {
      const { newMessage, tempId, isReceiverInChat } = data;

      queryClient.setQueryData(
        ["chat-message", chatId],
        (oldData: ImessageData) => {
          if (!oldData) return oldData;

          const pages = oldData.pages ?? [];
          const firstPageMessages = pages[0]?.messages ?? [];

          const filteredMessages = firstPageMessages.filter((msg) => {
            const isOptimistic = (msg as messageNew).optimistic;
            const sameTempId = (msg as messageNew).tempId === tempId;

            return !(isOptimistic && sameTempId);
          });

          const updatedMessages = [
            {
              ...newMessage,
              isRead: isReceiverInChat ? true : false,
            },
            ...filteredMessages,
          ];

          const sortedMessages = updatedMessages.sort((a, b) => {
            const timeA = new Date(normalizeDate(a.createdAt)).getTime();
            const timeB = new Date(normalizeDate(b.createdAt)).getTime();

            if (timeB !== timeA) {
              return timeB - timeA;
            }

            const idA =
              ((a as messageNew).id || (a as messageNew).tempId) ?? "";
            const idB =
              ((b as messageNew).id || (b as messageNew).tempId) ?? "";

            return idA.localeCompare(idB);
          });

          return {
            ...oldData,
            pages: [
              {
                messages: sortedMessages,
              },
              ...pages.slice(1),
            ],
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
