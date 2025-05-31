import { IchatsData, ImessageData, ReplyType } from "@/@types/message";
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
    filePreview: string | null,
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

    queryClient.setQueryData(["chats", session?.user?.id], (oldData: IchatsData) => {
      if (!oldData) return oldData;

      const allChats = oldData.pages.flatMap((page) => page.chats) || [];

      const existingCompanion = allChats.find((chat) => chat.chatId === chatId);

      if (!existingCompanion) return oldData;

      const chat = {
        ...existingCompanion,
        companion: existingCompanion.companion,
        lastMessage: {
          id: crypto.randomUUID(),
          content: {
            text: content,
            image: filePreview || "",
          },
        },
        createdAt: new Date().toISOString() as unknown as Date,
      };

      const filter = allChats.filter((chat) => chat.chatId !== chatId);

      const updatedChats = [chat, ...filter];

      const updatedTotalChats = oldData.pages[0]?.totalChats ?? 0;

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

    try {
      await axios.post(`/api/messenger/chat/${chatId}`, formData);
      setIsNew(false);
    } catch (error) {
      console.warn(error);
      toast.error("Something went wrong");
    }
  };