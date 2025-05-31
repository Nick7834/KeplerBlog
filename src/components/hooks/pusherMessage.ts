import { ImessageData } from "@/@types/message";
import { Message } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import Pusher from "pusher-js";
import { useEffect } from "react";

interface messageNew extends Message {
  optimistic: boolean;
}

export const useChatPusher = (chatId?: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!chatId) return;

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe(`chat-${chatId}`);

    channel.bind("new-message", (newMessage: messageNew) => {
      queryClient.setQueryData(
        ["chat-message", chatId],
        (oldData: ImessageData) => {
          if (!oldData) return oldData;

          const filteredFirstPage = oldData.pages[0].messages.filter(
            (msg) => !(msg as { optimistic?: boolean }).optimistic
          );

          const updatedPages = [
            {
              messages: [newMessage, ...filteredFirstPage],
            },
            ...oldData.pages.slice(1),
          ];

          return {
            ...oldData,
            pages: updatedPages,
          };
        }
      );
    });

    channel.bind("update-message", (message: Message) => {
      queryClient.setQueryData(
        ["chat-message", chatId],
        (oldData: ImessageData) => {
          if (!oldData) return oldData;

          const updatedPages = oldData.pages.map((page) => {
            return {
              ...page,
              messages: page.messages.map((msg) => {
                if (msg.id === message.id) {
                  return {
                    ...msg,
                    content: message.content,
                    image: message.image,
                    updatedAt: message.updatedAt,
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
    });

    channel.bind("delete-message", (messageId: string) => {
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
    });

    return () => {
      pusher.unsubscribe(`chat-${chatId}`);
    };
  }, [chatId, queryClient]);
};
