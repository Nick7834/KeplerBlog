import { ChatProps, IchatsData } from "@/@types/message";
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
      (data: {
        chatId: string;
        newMessage: Message & { sender: { username: string, profileImage: string } };
        isReceiverInChat: boolean;
      }) => {
        try {
          const { chatId, newMessage, isReceiverInChat } = data;

          queryClient.setQueryData(
            ["chats", userId],
            (oldData: IchatsData | undefined) => {
              if (!oldData) return oldData;

              let chatToMove: ChatProps | null = null;

              const updatedPages = oldData.pages.map((page) => {
                const filteredChats = page.chats
                  .map((chat) => {
                    if (chat.chatId === chatId) {
                      chatToMove = {
                        ...chat,
                        unreadCount:
                          newMessage.senderId === userId || isReceiverInChat
                            ? chat.unreadCount
                            : chat.unreadCount + 1,
                        lastMessage: {
                          ...chat.lastMessage,
                          id: newMessage.id,
                          isRead: isReceiverInChat ? true : false,
                          createMessageAt: newMessage.createdAt,
                          senderId: newMessage.senderId,
                          content: {
                            text: newMessage.content,
                            image: newMessage.image,
                          },
                        },
                      };
                      return null;
                    }
                    return chat;
                  })
                  .filter(Boolean) as ChatProps[];

                return {
                  ...page,
                  chats: filteredChats,
                };
              });

              if (!chatToMove) {
                queryClient.invalidateQueries({ queryKey: ["chats", userId] });
                return oldData;
              }

              updatedPages[0].chats = [chatToMove, ...updatedPages[0].chats];

              return {
                ...oldData,
                pages: updatedPages,
              };
            }
          );
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
                      ...chat.lastMessage,
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
                        ...chat.lastMessage,
                        createMessageAt: lastActivityAt && new Date(lastActivityAt) || '',
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

    channel.bind("chat-check", ({ senderId }: { senderId: string }) => {
      try {
        queryClient.invalidateQueries({ queryKey: ["chats", senderId] });
      } catch (error) {
        console.warn(error);
      }
    });

    return () => {
      pusher.unsubscribe(`chats-${userId}`);
    };
  }, [queryClient, userId]);
};
