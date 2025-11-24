"use client";
import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { VirtuosoGrid } from "react-virtuoso";
import { Skeleton } from "@/components/ui/skeleton";
import { UserCard } from "./userCard";
import { User } from "@prisma/client";
import { QueryClient } from "@tanstack/react-query";

interface Props {
  className?: string;
  data: User[];
  isError: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  queryClient: QueryClient;
}

const List = forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(
  (props, ref) => (
    <div
      {...props}
      ref={ref}
      className="grid min-[1500px]:grid-cols-4 max-[1500px]:grid-cols-2 max-[750px]:grid-cols-1 gap-5 [grid-auto-rows:1fr]"
    />
  )
);

List.displayName = "List";

export const Users: React.FC<Props> = ({
  className,
  data,
  isError,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  queryClient,
}) => {
  return (
    <div className={cn("block", className)}>
      <div className="mt-10">
        {isError && <p className="text-red-500">Something went wrong</p>}
        <VirtuosoGrid
          style={{ height: "100vh", width: "100%" }}
          data={data}
          useWindowScroll
          overscan={5}
          endReached={() => {
            if (hasNextPage && !isFetchingNextPage) fetchNextPage();
          }}
          itemContent={(index, user) => (
            <div key={user.id}>
              <UserCard
                user={user}
                queryClient={queryClient}
              />
            </div>
          )}
          components={{
            List: List,
            Item: (props) => (
              <div
                {...props}
                className="w-full"
              />
            ),
            Footer: () =>
              isFetchingNextPage ? (
                <div className="mt-5 grid min-[1500px]:grid-cols-4 max-[1500px]:grid-cols-2 max-[750px]:grid-cols-1 gap-5 [grid-auto-rows:1fr]">
                  {[...Array(4)].map((_, index) => (
                    <Skeleton
                      key={index}
                      className="bg-[#c1c1c1] dark:bg-[#2a2a2a] w-full h-[300px] rounded-[12px]"
                    />
                  ))}
                </div>
              ) : null,
          }}
        />
      </div>
    </div>
  );
};
