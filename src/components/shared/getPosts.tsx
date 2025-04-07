"use client";
import React, { useEffect } from "react";
import { SkeletonPost } from "./skeletonPost";
import { Post } from "./post";
import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Virtuoso } from "react-virtuoso";

const fetchPosts = async ({ pageParam = 1 }) => {
  const response = await axios.get(`/api/posts?page=${pageParam}&limit=10`);
  return response.data.posts;
};

export const GetPosts = () => {

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < 10 ? undefined : allPages.length + 1,
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const posts = data?.pages.flat() || [];

  useEffect(() => {
    if (isLoading) return;
    // Добавим задержку для плавного перехода
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100); // можно настроить время
  }, [isLoading, posts]);

  return (
    <div className="mt-[clamp(1.25rem,0.82rem+2.15vw,2.5rem)]">
      {isError && <p className="text-red-500">Something went wrong</p>}
      {isLoading ? (
        <div className="flex flex-col gap-5">
          <SkeletonPost />
          <SkeletonPost />
        </div>
      ) : (
        <Virtuoso
          style={{ height: "100vh", width: "100%" }}
          data={posts}
          initialItemCount={posts.length - 1}
          useWindowScroll
          overscan={5}
          endReached={() => {
            if (hasNextPage && !isFetchingNextPage) fetchNextPage();
          }}
          itemContent={(index, post) => (
            <div key={post.id} className={index > 0 ? "pt-5" : ""}>
              <Post post={post} />
            </div>
          )}
          components={{
            Footer: () =>
              isFetchingNextPage ? (
                <div className="flex flex-col gap-5 pt-5">
                  <SkeletonPost />
                  <SkeletonPost />
                </div>
              ) : null,
          }}
        />
      )}
    </div>
  );
};
