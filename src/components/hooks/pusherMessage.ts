import { ImessageData } from "@/@types/message";
import { pusherClient } from "@/lib/pusherClient";
import { Message } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { compareDesc, parseISO } from "date-fns";
import { useEffect } from "react";

interface messageNew extends Message {
  optimistic: boolean;
  tempId: string;
  sentAt: string;
}

export const useChatPusher = (chatId?: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!chatId) return;

    const channel = pusherClient.subscribe(`chat-${chatId}`);

    const handleNewMessage = (data: {
      newMessage: messageNew;
      tempId: string;
      sentAt: string;
      isReceiverInChat: number;
    }) => {
      const { newMessage, tempId, sentAt, isReceiverInChat } = data;

      queryClient.setQueryData(
        ["chat-message", chatId],
        (oldData: ImessageData) => {
          if (!oldData) return oldData;

          const pages = oldData.pages ?? [];
          const firstPageMessages = pages[0]?.messages ?? [];

          const filteredMessages = firstPageMessages.filter((msg) => {
            const optimistic = (msg as messageNew).optimistic;
            const tId = (msg as messageNew).tempId;
            return !(optimistic && tId === tempId);
          });

          const normalizedCreatedAt = newMessage.createdAt || sentAt;

          const updatedMessages = [
            {
              ...newMessage,
              isRead: Boolean(isReceiverInChat),
              createdAt: normalizedCreatedAt,
            },
            ...filteredMessages,
          ];

          const sortedMessages = updatedMessages.sort((a, b) => {
            const dateA =
              typeof a.createdAt === "string"
                ? parseISO(a.createdAt)
                : a.createdAt;
            const dateB =
              typeof b.createdAt === "string"
                ? parseISO(b.createdAt)
                : b.createdAt;

            return compareDesc(dateA, dateB);
          });

          return {
            ...oldData,
            pages: [
              {
                ...pages[0],
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
