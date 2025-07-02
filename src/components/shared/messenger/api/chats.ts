"use client";

import { QueryClient, useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const fetchProjects = async ({
  pageParam,
}: {
  pageParam?: number | string;
}) => {
  const res = await axios.get("/api/messenger/chats", {
    params: { cursor: pageParam },
  });
  return res.data;
};

export const useChatsQuery = (open: boolean, userId: string) => {
  const query = useInfiniteQuery({
    queryKey: ["chats", userId],
    queryFn: ({ pageParam }) => fetchProjects({ pageParam }),
    getNextPageParam: (lastPage) => {
      if (lastPage.chats.length < 20) return undefined;
      return lastPage.chats[lastPage.chats.length - 1].chatId;
    },
    initialPageParam: undefined,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: open,
  });

  return query;
};

export const postChat = async (
  userId: string,
  idUser: string,
  setCurrentChatId: (chatId: string) => void,
  setOpenMessager: (open: boolean) => void,
  setMenu: (menu: boolean) => void,
  setSettings: (settings: boolean) => void,
  setLoaderButton: (loader: boolean) => void,
  queryClient: QueryClient
) => {
  if (!idUser) return;
  setLoaderButton(true);
  try {
    const resp = await axios.post(`/api/messenger/chats?otherUserId=${idUser}`);

    if (resp.data.chat) {
      setCurrentChatId(resp.data.chat);
      setOpenMessager(true);
      setMenu(false);
      setSettings(false);
      setLoaderButton(false);
    }

    if (resp.data.requestSent) {
      toast.success("Request sent successfully");

      queryClient.invalidateQueries({
        queryKey: ["sent-chats", userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["count-chats", userId],
      });

      setLoaderButton(false);
    }

    if (resp.data.requestPending) {
      toast("Request is already pending.", {
        icon: "❗",
      });

      setLoaderButton(false);
    }

    if (resp.data.requestRejected) {
      toast.success("Request has been rejected. A new request has been sent.");

      queryClient.invalidateQueries({
        queryKey: ["sent-chats", userId],
      });
      
      setLoaderButton(false);
    }
  } catch (error) {
    console.warn(error);
  }
};
