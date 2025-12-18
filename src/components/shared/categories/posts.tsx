"use client";
import React from "react";
import { usePostsQuery } from "./api/posts.service";
import { useActiveCategory } from "@/store/activeCategory";
import { Virtuoso } from "react-virtuoso";
import { SkeletonPost } from "../skeletonPost";
import { Post } from "../post";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

export const Posts: React.FC<Props> = ({ className }) => {
  const { active } = useActiveCategory();
  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isError,
  } = usePostsQuery(active);

  const posts = data?.pages.flatMap((page) => page?.posts) || [];

  return (
    <div className={cn("mt-[clamp(1.25rem,0.82rem+2.15vw,2.5rem)]", className)}>
      {isError && <p className="text-red-500">Something went wrong</p>}
      {isLoading ? (
        <div className="flex flex-col">
          {[...Array(5)].map((_, index) => (
            <SkeletonPost key={index} />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="flex justify-center items-center h-[20vh]">
          <p className="text-center text-[#333333] dark:text-[#d9d9d9]">No results found</p>
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
              <Post post={post} />
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
