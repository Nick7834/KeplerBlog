"use client";
import React, { useMemo } from "react";
import { SkeletonPost } from "./skeletonPost";
// import { Post } from "./post";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Virtuoso } from "react-virtuoso";
import { getInitialPosts } from "@/server/posts";

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
    queryFn: ({ pageParam = 1 }) => getInitialPosts(pageParam, 10),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < 10 ? undefined : allPages.length + 1,
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const posts = useMemo(() => data?.pages.flat() || [], [data]);

  console.log(posts)

  return (
    <div className="mt-[clamp(1.25rem,0.82rem+2.15vw,2.5rem)]">
      {isError && <p className="text-red-500">Something went wrong</p>}
      {isLoading ? (
        <div className="flex flex-col">
          {[...Array(5)].map((_, index) => (
            <SkeletonPost key={index} />
          ))}
        </div>
      ) : (
        <Virtuoso
          style={{ height: "100vh", width: "100%" }}
          data={posts}
          initialItemCount={posts.length > 5 ? 5 : posts.length}
          useWindowScroll
          overscan={5}
          skipAnimationFrameInResizeObserver={true}
          endReached={() => {
            if (hasNextPage && !isFetchingNextPage) fetchNextPage();
          }}
          itemContent={(index, post) => (
            <div key={post.id}>
              {/* <Post post={post} /> */}

              {post.title}
            </div>
          )}
          components={{
            Footer: () =>
              isFetchingNextPage ? (
                <div className="flex flex-col pt-5">
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