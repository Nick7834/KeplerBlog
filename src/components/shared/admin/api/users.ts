import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchProjects = async ({
  pageParam,
  endpoint,
  search
}: {
  pageParam?: number | string | null;
  endpoint: string;
  search?: string
}) => {
  const res = await axios.get(`/api/admin/${endpoint}`, {
    params: { cursor: pageParam, search },
  });
  return res.data;
};

export const useAdminQuery = (tab: "users" | "posts", search?: string) => {
  const query = useInfiniteQuery({
    queryKey: [`${tab}Admin`, search],
    queryFn: ({ pageParam }) => fetchProjects({ pageParam, endpoint: tab, search }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: null,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: tab === "users" || tab === "posts",
  });

  return query;
};
