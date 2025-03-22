"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import { UserSearch } from "./userSearch";
import InfiniteScroll from "react-infinite-scroll-component";
import { SkeletonUserSearch } from "./skeletonUserSearch";
import { cn } from "@/lib/utils";
import { UserSearchType } from "./fetchSerch";
import { Button } from ".";
import { useLogInStore } from "@/store/logIn";
import { BsPostcard } from "react-icons/bs";
import { FaUser } from "react-icons/fa6";
import { FaUserFriends } from "react-icons/fa";
import { IoMdPeople } from "react-icons/io";
import { UseFormatNumber } from "../hooks/useFormatNumber";
import { useInfiniteQuery } from "@tanstack/react-query";

interface Props {
  className?: string;
}

const fetchSubscriptions = async ({ pageParam = 1 }) => {
  const resp = await axios.get(`/api/subscriptions?page=${pageParam}&limit=10`);
  return resp.data;
};

export const SubscriptionsList: React.FC<Props> = ({ className }) => {
  const { data: session } = useSession();

  const { setOpen } = useLogInStore();

  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["subscriptions"],
    queryFn: fetchSubscriptions,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.followings.length < 10 ? undefined : allPages.length + 1;
    },
    initialPageParam: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: !!session,
  });

  const posts = data?.pages.flatMap((page) => page.followings) || [];
  const totalSub = data?.pages[0]?.totalFollowings || 0;
  const formattedCount = UseFormatNumber(totalSub);

  return (
    <>
      <h1 className="relative w-fit flex items-center gap-2 text-[#333333] dark:text-[#d9d9d9] text-[clamp(1.563rem,1.455rem+0.54vw,1.875rem)] font-bold">
        <IoMdPeople />
        Subscriptions
        {totalSub > 0 && (
          <span className="flex justify-center items-center absolute top-0 right-[0] mr-[-35px] text-[#d9d9d9] dark:text-[#333333] text-sm bg-[#333333] dark:bg-[#d9d9d9] px-1 rounded-full min-w-[20px] min-h-[20px] max-h-[20px]">
            {formattedCount}
          </span>
        )}
      </h1>
      <div
        className={cn("mt-[clamp(1.25rem,0.82rem+2.15vw,2.5rem)]", className)}
      >
        {!session && !isLoading ? (
          <div className="flex flex-col items-center justify-center">
            <span className="text-[#333333] dark:text-[#d9d9d9] text-[clamp(5rem,3.968rem+5.16vw,8rem)]">
              <BsPostcard />
            </span>
            <h2 className="mt-3 text-[#333333] dark:text-[#d9d9d9] text-3xl font-bold text-center">
              Log in to your account
            </h2>
            <p className="mt-3 text-[#333333] dark:text-[#d9d9d9] text-base text-center">
              You need to be logged in to see your subscriptions.
            </p>
            <Button
              onClick={() => setOpen(true)}
              className="mt-5 flex items-center gap-2 px-[30px] py-[12px] bg-[#333333] dark:bg-[#d9d9d9] hover:bg-[#333333]/85 dark:hover:bg-[#d9d9d9]/85"
            >
              <FaUser />
              Log in
            </Button>
          </div>
        ) : (
          <InfiniteScroll
            dataLength={posts.length}
            next={fetchNextPage}
            hasMore={hasNextPage}
            loader={Array.from({ length: 3 }).map((_, index) => (
              <SkeletonUserSearch key={index} />
            ))}
            scrollThreshold={0.8}
            key="subscriptions-scroll"
          >
            {isLoading &&
              Array.from({ length: 3 }).map((_, index) => (
                <SkeletonUserSearch key={index} />
              ))}
            {!isLoading && posts.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4">
                <FaUserFriends
                  size={85}
                  className="text-[#333333] dark:text-[#d9d9d9]"
                />
                <p className="text-[#333333] dark:text-[#d9d9d9] text-xl font-bold">
                  No Subscriptions
                </p>
              </div>
            ) : (
              posts.map((post: UserSearchType, index: number) => (
                <UserSearch key={index} user={post} />
              ))
            )}
          </InfiniteScroll>
        )}
      </div>
    </>
  );
};
