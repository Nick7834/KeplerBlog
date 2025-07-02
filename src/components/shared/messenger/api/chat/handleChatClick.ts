import { IchatsData } from "@/@types/message";
import { QueryClient } from "@tanstack/react-query";

export const handleChatClick = async (
  chatId: string,
  setCurrentChatId: (chatId: string) => void,
  setMenu: (menu: boolean) => void,
  setSettings: (settings: boolean) => void,
  queryClient: QueryClient,
  userId: string,
) => {
  if (!chatId) return;

  setCurrentChatId(chatId);
  setMenu(false);
  setSettings(false);

  queryClient.setQueryData(["chats", userId], (oldData: IchatsData) => {
    if (!oldData) return oldData;

    const updateUnreadCount = oldData.pages.map((page) => ({
      ...page,
      chats: page.chats.map((chat) => ({
        ...chat,
        unreadCount: chat.chatId === chatId ? 0 : chat.unreadCount,
        lastMessage:
          chat.chatId === chatId && chat.lastMessage.senderId !== userId
            ? {
                ...chat.lastMessage,
                isRead: true,
              }
            : chat.lastMessage,
      })),
    }));

    return {
      ...oldData,
      pages: updateUnreadCount,
    };
  });

};

