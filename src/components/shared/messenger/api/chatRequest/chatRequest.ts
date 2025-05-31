import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchRequest = async ({ pageParam = null }) => {
  const res = await axios.get("/api/messenger/messagesPrivate?direction=incoming", {
    params: { cursor: pageParam },
  });
  return res.data;
};

export const useRequestQuery = (userId: string, point: number) => {
  return useInfiniteQuery({
    queryKey: ["request-chats", userId],
    queryFn: fetchRequest,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: null,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: point === 0,
  });
};

const fetchSent = async ({ pageParam = null }) => {
  const res = await axios.get("/api/messenger/messagesPrivate?direction=outgoing", {
    params: { cursor: pageParam },
  });
  return res.data;
};

export const useSentQuery = (userId: string, point: number) => {
  return useInfiniteQuery({
    queryKey: ["sent-chats", userId],
    queryFn: fetchSent,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: null,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: point === 1,
  });
};


const fetchCount = async () => {
  const res = await axios.get("/api/messenger/messagesPrivate/count");
  return res.data.finalCount;
};

export const useCountQuery = (openMessager: boolean, userId: string) => {
  return useQuery({
    queryKey: ["count-chats", userId],
    queryFn: fetchCount,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: !!openMessager,
  });
};