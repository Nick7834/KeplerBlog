"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { Users } from "./users";
import { useAdminQuery } from "../api/users";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchAdmin } from "@/store/adminSearch";
import { Search } from "./search";
import { Posts } from "./posts";

interface Props {
  className?: string;
}

const tabs = [
  {
    id: 1,
    link: "users",
    title: "Users",
  },
  {
    id: 2,
    link: "posts",
    title: "Posts",
  },
];

export const AdminMain: React.FC<Props> = ({ className }) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"users" | "posts">("users");
  const { search } = useSearchAdmin();

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isError,
  } = useAdminQuery(activeTab, search);

  const dataMain = data?.pages.flatMap((page) => page?.[activeTab]) || [];

  return (
    <div className={className}>
      <div className="mt-5 flex gap-4">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            onClick={() => setActiveTab(tab.link as "users" | "posts")}
            className={cn(
              "block",
              activeTab === tab.link &&
                "bg-[#7391d5] hover:bg-[#7391d5]  text-[#d9d9d9] dark:bg-[#7391d5] dark:hover:bg-[#7391d5] dark:text-[#d9d9d9]"
            )}
          >
            {tab.title}
          </Button>
        ))}
      </div>

      <div className="mt-10">
        <Search />
        {activeTab === "users" && (
          <div>
            <div>
              {dataMain.length === 0 && !isLoading && (
                <div className="mt-5 text-[#333333] dark:text-[#e3e3e3] font-medium">
                  No users
                </div>
              )}
              {isLoading ? (
                <div className="mt-5 grid min-[1500px]:grid-cols-4 max-[1500px]:grid-cols-2 max-[750px]:grid-cols-1 gap-5 [grid-auto-rows:1fr]">
                  {[...Array(4)].map((_, index) => (
                    <Skeleton
                      key={index}
                      className="bg-[#c1c1c1] dark:bg-[#2a2a2a] w-full h-[300px] rounded-[12px]"
                    />
                  ))}
                </div>
              ) : (
                <Users
                  data={dataMain}
                  isError={isError}
                  hasNextPage={hasNextPage}
                  fetchNextPage={fetchNextPage}
                  isFetchingNextPage={isFetchingNextPage}
                  queryClient={queryClient}
                />
              )}
            </div>
          </div>
        )}
        {activeTab === "posts" && (
          <div>
            <div>
              {dataMain.length === 0 && !isLoading && (
                <div className="mt-5 text-[#333333] dark:text-[#e3e3e3] font-medium">
                  No posts
                </div>
              )}
              {isLoading ? (
                <div className="mt-5 grid min-[1500px]:grid-cols-4 max-[1500px]:grid-cols-2 max-[750px]:grid-cols-1 gap-5 [grid-auto-rows:1fr]">
                  {[...Array(4)].map((_, index) => (
                    <Skeleton
                      key={index}
                      className="bg-[#c1c1c1] dark:bg-[#2a2a2a] w-full h-[450px] rounded-[12px]"
                    />
                  ))}
                </div>
              ) : (
                <Posts
                  data={dataMain}
                  isError={isError}
                  hasNextPage={hasNextPage}
                  fetchNextPage={fetchNextPage}
                  isFetchingNextPage={isFetchingNextPage}
                  queryClient={queryClient}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
