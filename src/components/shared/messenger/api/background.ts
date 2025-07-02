import { useQuery } from "@tanstack/react-query";
import axios from "axios";


const fetchInfoChat = async () => {
  const res = await axios.get(`/api/messenger/background`);
  return res.data;
};

export const useBackgroundQuery = (userId: string, point: number) => {
  return useQuery({
    queryKey: ["background-chat", userId],
    queryFn: fetchInfoChat,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: point === 0,
  });
};