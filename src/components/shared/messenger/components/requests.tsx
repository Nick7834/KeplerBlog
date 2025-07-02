import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useRequestQuery, useSentQuery } from "../api/chatRequest/chatRequest";
import { Skeleton } from "@/components/ui/skeleton";
import InfiniteScroll from "react-infinite-scroll-component";
import { Oval } from "react-loader-spinner";
import { cn } from "@/lib/utils";
import { ReqItem } from "./reqItem";
import { SentItem } from "./sentItem";
import { IoIosArrowBack } from "react-icons/io";
import { UseFormatNumber } from "@/components/hooks/useFormatNumber";

interface Props {
  className?: string;
  userId: string;
  count: { pending: number; conutList: number };
  setMenu: (menu: boolean) => void;
}

export const Requests: React.FC<Props> = ({ className, userId, count, setMenu }) => {
  const [point, setPoint] = useState(0);

  const {
    data: toReq,
    hasNextPage: reqHasNextPage,
    fetchNextPage: reqFetchNextPage,
    isLoading: reqLoading,
    isError: reqError,
  } = useRequestQuery(userId, point);

  const massReq = toReq?.pages.flatMap((page) => page.items) || [];

  const {
    data: sent,
    hasNextPage: sentHasNextPage,
    fetchNextPage: sentFetchNextPage,
    isLoading: sentLoading,
    isError: sentError,
  } = useSentQuery(userId, point);

  const massSent = sent?.pages?.flatMap((page) => page.items) || [];

  const conutList = UseFormatNumber(count?.conutList);
  const pending = UseFormatNumber(count?.pending);

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <h2 className="flex items-center gap-2 text-[#333333] dark:text-[#d9d9d9] text-2xl font-bold">
        <Button
          variant="ghost"
          className="hidden max-[750px]:block p-1 bg-0 hover:bg-0 [&_svg]:size-[25px]"
          onClick={() => setMenu(false)}
        >
          <IoIosArrowBack />
        </Button>
        {point === 0 ? "Requests" : "Sent"}
      </h2>

      <div className="mt-5 grid grid-cols-2 items-center gap-2">
        <Button
          onClick={() => setPoint(0)}
          className={
            point === 0
              ? "bg-[#7391d5] dark:bg-[#7391d5] hover:bg-[#7391d5]/80 dark:hover:bg-[#7391d5]/80 text-white"
              : undefined
          }
        >
          Requests <span>{pending}</span>
        </Button>
        <Button
          onClick={() => setPoint(1)}
          className={
            point === 1
              ? "bg-[#7391d5] dark:bg-[#7391d5] hover:bg-[#7391d5]/80 dark:hover:bg-[#7391d5]/80 text-white"
              : undefined
          }
        >
          Sent <span>{conutList}</span>
        </Button>
      </div>

      {point === 0 && (
        <div className="flex flex-1 flex-col h-full mt-5">
          {reqError && (
            <p className="text-red-500 flex flex-1 h-[calc(100%-60px)] flex-col items-center justify-center">
              Something went wrong
            </p>
          )}
          {reqLoading ? (
            <div className="flex flex-col gap-2">
              {[...Array(5)].map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-[76px] w-full bg-[#d7d7d7] dark:bg-[#2a2a2a]"
                />
              ))}
            </div>
          ) : massReq.length === 0 ? (
            <div className="flex flex-1 h-[calc(100%-60px)] flex-col items-center justify-center gap-2 text-[#333333] dark:text-[#d9d9d9] text-xl font-bold">
              <p>No requests</p>
            </div>
          ) : (
            <div
              id="scrollable-chatReq-container"
              className="overflow-y-auto scrollbar h-[calc(85vh-140px)] max-[750px]:max-h-[calc(100vh-75px)]"
            >
              <InfiniteScroll
                dataLength={massReq.length}
                next={reqFetchNextPage}
                hasMore={reqHasNextPage}
                loader={
                  <div className="flex justify-center items-center py-4">
                    <Oval
                      visible={true}
                      height="40"
                      width="40"
                      color="#7391d5"
                      secondaryColor="#7391d5"
                      ariaLabel="oval-loading"
                      strokeWidth={4}
                    />
                  </div>
                }
                scrollableTarget="scrollable-chatReq-container"
              >
                {massReq.map((item, index) => (
                  <ReqItem
                    key={index}
                    item={item}
                    userId={userId}
                  />
                ))}
              </InfiniteScroll>
            </div>
          )}
        </div>
      )}

      {point === 1 && (
        <div className="flex flex-1 flex-col h-full mt-5">
          {sentError && (
            <p className="text-red-500 flex flex-1 h-[calc(100%-60px)] flex-col items-center justify-center">
              Something went wrong
            </p>
          )}
          {sentLoading ? (
            <div className="flex flex-col gap-2">
              {[...Array(5)].map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-[76px] w-full bg-[#d7d7d7] dark:bg-[#2a2a2a]"
                />
              ))}
            </div>
          ) : massSent.length === 0 ? (
            <div className="flex flex-1 h-[calc(100%-60px)] flex-col items-center justify-center gap-2 text-[#333333] dark:text-[#d9d9d9] text-xl font-bold">
              <p>No requests</p>
            </div>
          ) : (
            <div
              id="scrollable-chat-container-sent"
              className="overflow-y-auto scrollbar h-[calc(85vh-140px)] max-[750px]:h-[calc(88vh-75px)]"
            >
              <InfiniteScroll
                dataLength={massSent.length}
                next={sentFetchNextPage}
                hasMore={sentHasNextPage}
                loader={
                  <div className="flex justify-center items-center py-4">
                    <Oval
                      visible={true}
                      height="40"
                      width="40"
                      color="#7391d5"
                      secondaryColor="#7391d5"
                      ariaLabel="oval-loading"
                      strokeWidth={4}
                    />
                  </div>
                }
                scrollableTarget="scrollable-chat-container-sent"
              >
                {massSent.map((item, index) => (
                  <SentItem
                    key={index}
                    item={item}
                  />
                ))}
              </InfiniteScroll>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
