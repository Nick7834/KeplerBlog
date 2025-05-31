import { IchatsData } from "@/@types/message";
import { Message } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import Pusher from "pusher-js";
import { useEffect } from "react";

export const useChatsPusher = (userId: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;
    const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

    if (!key || !cluster) {
      throw new Error(
        "Pusher key or cluster is missing in environment variables."
      );
    }

    const pusher = new Pusher(key, {
      cluster: cluster,
    });

    const channel = pusher.subscribe(`chats-${userId}`);

    channel.bind(
      "chat-top",
      (data: { chatId: string; newMessage: Message }) => {
        try {
          const { chatId, newMessage } = data;
          queryClient.setQueryData(["chats", userId], (oldData: IchatsData) => {
            if (!oldData) return oldData;

            const allChats = oldData.pages.flatMap((page) => page.chats) || [];

            const existingCompanion = allChats.find(
              (chat) => chat.chatId === chatId
            );

            if (!existingCompanion) {
              queryClient.invalidateQueries({ queryKey: ["chats", userId] });
              return oldData;
            }

            const newMessageIsSender = newMessage.senderId === userId 

            const chat = {
              ...existingCompanion,
              unreadCount:
                newMessage.senderId === userId
                  ? existingCompanion.unreadCount
                  : existingCompanion.unreadCount + 1,
              lastMessage: {
                id: newMessage.id,
                content: {
                  text: newMessage.content,
                  image: newMessage.image,
                },
              },
            };

            const filter = allChats.filter((chat) => chat.chatId !== chatId);

            const updatedChats = [chat, ...filter];

            const updatedTotalChats = oldData.pages[0].totalChats || 0;

            return {
              ...oldData,
              pages: [
                {
                  chats: updatedChats,
                  totalChats: updatedTotalChats,
                },
              ],
            };
          });
        } catch (error) {
          console.warn(error);
        }
      }
    );

    channel.bind(
      "update-chat-message",
      (data: { chatId: string; content: string; image: string }) => {
        const { chatId, content, image } = data;

        queryClient.setQueryData(
          ["chats", userId],
          (oldData: IchatsData | undefined) => {
            if (!oldData) return oldData;

            const updatedPages = oldData.pages.map((page) => {
              const updatedChats = page.chats.map((chat) => {
                if (chat.chatId === chatId) {
                  return {
                    ...chat,
                    lastMessage: {
                      content: {
                        text: content,
                        image: image,
                      },
                    },
                  };
                }
                return chat;
              });

              return {
                ...page,
                chats: updatedChats,
              };
            });

            return {
              ...oldData,
              pages: updatedPages,
            };
          }
        );
      }
    );

    channel.bind(
      "delete-chat-message",
      (data: {
        chatId: string;
        lastActivityAt: string;
        content: string;
        image: string;
        senderId: string;
      }) => {
        const { chatId, lastActivityAt, content, image, senderId } = data;

        queryClient.setQueryData(
          ["chats", userId],
          (oldData: IchatsData | undefined) => {
            if (!oldData) return oldData;

            const updatedPages = oldData.pages.map((page) => {
              const updatedChats = page.chats.map((chat) =>
                chat.chatId === chatId
                  ? {
                      ...chat,
                      lastActivityAt,
                       unreadCount:
                        senderId === userId
                          ? chat.unreadCount
                          : chat.unreadCount - 1,
                      lastMessage: {
                        content: {
                          text: content,
                          image: image,
                        },
                      },
                    }
                  : chat
              );

              updatedChats.sort((a, b) => {
                const timeA = new Date(a.lastActivityAt ?? 0).getTime();
                const timeB = new Date(b.lastActivityAt ?? 0).getTime();
                return timeB - timeA;
              });

              return {
                ...page,
                chats: updatedChats,
              };
            });

            return {
              ...oldData,
              pages: updatedPages,
            };
          }
        );
      }
    );

    return () => {
      pusher.unsubscribe(`chats-${userId}`);
    };
  }, [queryClient, userId]);
};
