import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchPosts = async ({
  pageParam,
  category,
}: {
  pageParam: string | null;
  category: string | null;
}) => {
  const res = await axios.get(`/api/categories/posts`, {
    params: { cursor: pageParam, category },
  });
  return res.data;
};

export const usePostsQuery = (category: string | null) => {
  return useInfiniteQuery({
    queryKey: ["posts", category],
    queryFn: ({ pageParam }) => fetchPosts({ pageParam, category }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: null,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
