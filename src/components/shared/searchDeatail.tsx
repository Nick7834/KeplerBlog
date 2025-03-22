"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { PostSearch } from "./postSearch";
import { SkeletonPostSearch } from "./skeletonPostSearch";
import { SkeletonUserSearch } from "./skeletonUserSearch";
import { useSearchParams } from "next/navigation";
import InfiniteScroll from "react-infinite-scroll-component";
import { UserSearch } from "./userSearch";
import { MdSearch } from "react-icons/md";
import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";

interface Props {
  className?: string;
}

// api

const fetchPosts = async ({ pageParam = 1 }, query: string) => {
  const response = await axios.get(
    `/api/search/posts?query=${query}&skipPosts=${pageParam}&takePosts=10`
  );
  return response.data.posts;
};

const fetchUsers = async ({ pageParam = 1 }, query: string) => {
  const response = await axios.get(
    `/api/search/users?query=${query}&skipUsers=${pageParam}&takeUsers=10`
  );
  return response.data;
};

///

export const SearchDeatail: React.FC<Props> = ({ className }) => {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [open, setOpen] = useState<"posts" | "users">("posts");

  const {
    data: usersData = { pages: [] },
    fetchNextPage: fetchNextPageUsers,
    hasNextPage: hasNextPageUsers,
    isLoading: loaderUsers,
  } = useInfiniteQuery({
    queryKey: ["serchUsers", query],
    queryFn: ({ pageParam }) => fetchUsers({ pageParam }, query),
    getNextPageParam: (lastPage, allPages) =>
    lastPage.users.length < 10 ? undefined : allPages.length + 1,
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: open === "users",
  });
  
  const {
    data: postsData = { pages: [] },
    fetchNextPage: fetchNextPagePosts,
    hasNextPage: hasNextPagePosts,
    isLoading: loaderPosts,
  } = useInfiniteQuery({
    queryKey: ["serchPosts", query],
    queryFn: ({ pageParam }) => fetchPosts({ pageParam }, query),
    getNextPageParam: (lastPage, allPages) =>
    lastPage.length < 10 ? undefined : allPages.length + 1,
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: open === "posts",
  });

  const users = usersData?.pages.flatMap((page) => page.users) ?? [];
  const posts = postsData?.pages.flat() ?? [];

  useEffect(() => {
    const urlQuery = searchParams.get("query");
    if (urlQuery && urlQuery !== query) {
      setQuery(urlQuery || "");
    }
  }, [searchParams, query]);

  return (
    <div
      className={cn(
        "max-w-[clamp(65.625rem,22.569rem+44.44vw,78.125rem)] w-full",
        className
      )}
    >
      <h1 className="flex items-center gap-2 text-[#333333] dark:text-[#d9d9d9] text-[clamp(1.563rem,1.455rem+0.54vw,1.875rem)] font-bold">
        <MdSearch />
        Search Results
      </h1>

      <div className="flex items-center gap-5 mt-[clamp(1.25rem,0.82rem+2.15vw,2.5rem)]">
        <Button
          onClick={() => setOpen("posts")}
          className={cn(
            "py-5 px-10 bg-[#333333] text-[#d9d9d9] dark:text-[#333333] dark:bg-[#d5d5d5]",
            open === "posts" &&
              "bg-[#7391d5] dark:bg-[#7391d5] text-[#d9d9d9] dark:text-[#d9d9d9] hover:bg-[#85a9fd] dark:hover:bg-[#85a9fd]"
          )}
        >
          Posts
        </Button>
        <Button
          onClick={() => setOpen("users")}
          className={cn(
            "py-5 px-10 bg-[#333333] text-[#d9d9d9] dark:text-[#333333] dark:bg-[#d5d5d5]",
            open === "users" &&
              "bg-[#7391d5] dark:bg-[#7391d5] text-[#d9d9d9] dark:text-[#d9d9d9] hover:bg-[#85a9fd] dark:hover:bg-[#85a9fd]"
          )}
        >
          Users
        </Button>
      </div>

      <div className="mt-10">
        {open === "posts" && (
          <InfiniteScroll
            dataLength={posts.length}
            next={fetchNextPagePosts}
            hasMore={hasNextPagePosts}
            loader={
              Array.from({ length: 3 }).map((_, index) => (
                <SkeletonPostSearch key={index} />
              ))
            }
          >
            {loaderPosts && Array.from({ length: 3 }).map((_, index) => <SkeletonPostSearch key={index} />)}
            {!loaderPosts && posts.length === 0 ? (
              <p className="text-[#333333] dark:text-[#d9d9d9] text-lg font-medium">
                No posts found
              </p>
            ) : (
                posts.map((post) => {
                if (post && "title" in post) {
                  return <PostSearch key={post.id} post={post} />;
                }
                return null;
              })
            )}
          </InfiniteScroll>
        )}
      </div>

      <div className="mt-[clamp(1.25rem,0.82rem+2.15vw,2.5rem)]">
        {open === "users" && (
          <InfiniteScroll
            dataLength={users.length}
            next={fetchNextPageUsers}
            hasMore={hasNextPageUsers}
            loader={
              Array.from({ length: 3 }).map((_, index) => (
                <SkeletonUserSearch key={index} />
              ))
            }
          >
            {loaderUsers && Array.from({ length: 3 }).map((_, index) => <SkeletonUserSearch key={index} />)}
            {!loaderUsers && users.length === 0 ? (
              <p className="text-[#333333] dark:text-[#d9d9d9] text-lg font-medium">
                No users found
              </p>
            ) : (
              users.map((user) => {
                if (user && "username" in user) {
                  return <UserSearch key={user.id} user={user} />;
                }
                return null;
              })
            )}
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
};
