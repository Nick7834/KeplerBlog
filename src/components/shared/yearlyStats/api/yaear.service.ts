import { useQuery } from "@tanstack/react-query";
import axios from "axios";

async function fetchYearlyStats() {
  try {
    const resp = await axios.get("/api/yearlyStats");
    return resp.data;
  } catch (error) {
    console.warn(error);
  }
}

export const useYearlyStats = (openMessager: boolean) => {
  return useQuery({
    queryKey: ["yearlyStats"],
    queryFn: () => fetchYearlyStats(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: !!openMessager,
  });
};
