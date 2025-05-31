"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchInfoChat = async (chatId: string) => {
  const res = await axios.get(`/api/messenger/chat/${chatId}`);
  return res.data;
};

export const useInfoChatQuery = (chatId: string) => {
  return useQuery({
    queryKey: ["info-chat", chatId],
    queryFn: () => fetchInfoChat(chatId),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: !!chatId,
  });
};

const fetchChatId = async ({
  pageParam,
  chatId,
}: {
  pageParam: number;
  chatId: string;
}) => {
  const res = await axios.get(
    `/api/messenger/${chatId}?limit=50&page=${pageParam}`
  );
  return res.data;
};

export const useChatQuery = (chatId: string) => {
  return useInfiniteQuery({
    queryKey: ["chat-message", chatId],
    queryFn: ({ pageParam = 1 }) => fetchChatId({ pageParam, chatId }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.messages.length < 50 ? undefined : allPages.length + 1;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: !!chatId,
  });
};
