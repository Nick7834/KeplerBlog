import { cn } from "@/lib/utils";
import { format } from "date-fns";
import React, { useEffect, useRef, useState } from "react";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { Oval } from "react-loader-spinner";
import { MessageProps } from "@/@types/message";
import { MessageBubble } from "./MessageBubble";
import { groupMessagesByDate } from "../lib/groupMessagesByDate";

interface Props {
  className?: string;
  messagersData: MessageProps[];
  isLoadingMessages: boolean;
  isFetchingNextPageMessages: boolean;
  hasNextPageMessages: boolean;
  currentUserId?: string | null;
  isNew: boolean;
  firstItemIndex: number;
  currentChatId: string;
  fetchNextPageMessages: () => void;
  handleReply: (messageId: string) => void;
  handleEditPanel: (messageId: string) => void;
  handleDelete: (chatId: string, messageId: string) => void;
  setFirstItemIndex: React.Dispatch<React.SetStateAction<number>>;
  virtuosoRef: React.RefObject<VirtuosoHandle>;
}

export const ChatScroll: React.FC<Props> = ({
  messagersData,
  isLoadingMessages,
  isFetchingNextPageMessages,
  hasNextPageMessages,
  isNew,
  firstItemIndex,
  currentChatId,
  virtuosoRef,
  fetchNextPageMessages,
  handleReply,
  handleEditPanel,
  handleDelete,
  setFirstItemIndex,
}) => {
  const chatItems = groupMessagesByDate(messagersData);

  const initialIndexRef = useRef<number | null>(null);
  const bottomAnchorRef = useRef<HTMLDivElement | null>(null);

  if (chatItems.length > 0 && initialIndexRef.current === null) {
    initialIndexRef.current = chatItems.length - 1;
  }

  useEffect(() => {
    initialIndexRef.current = null;
  }, [currentChatId]);

  // const prevChatIdRef = useRef<string | null>(null);
  // const prevMessagesLengthRef = useRef<number>(messagersData.length);
  const [isAtBottom, setIsAtBottom] = useState(true);

  useEffect(() => {
    if (!isAtBottom) return;

    bottomAnchorRef.current?.scrollIntoView({ behavior: "auto" });

    const timeout = setTimeout(() => {
      bottomAnchorRef.current?.scrollIntoView({ behavior: "auto" });
    }, 300);

    return () => clearTimeout(timeout);
  }, [chatItems.length, isAtBottom]);

  useEffect(() => {
    bottomAnchorRef.current?.scrollIntoView({ behavior: "auto" });
    const timeout = setTimeout(() => {
      bottomAnchorRef.current?.scrollIntoView({ behavior: "auto" });
    }, 300);

    return () => clearTimeout(timeout);
  }, [currentChatId]);

  return (
    <Virtuoso
      key={currentChatId}
      ref={virtuosoRef}
      style={{ height: "100%", width: "100%" }}
      data={chatItems}
      firstItemIndex={firstItemIndex}
      increaseViewportBy={1000}
      overscan={100}
      initialTopMostItemIndex={initialIndexRef.current ?? undefined}
      alignToBottom={true}
      followOutput={isAtBottom}
      atBottomStateChange={setIsAtBottom}
      startReached={async () => {
        if (hasNextPageMessages && !isFetchingNextPageMessages) {
          await fetchNextPageMessages();
          setFirstItemIndex((prev: number) => Math.max(prev - 50, 0));
        }
      }}
      itemContent={(_, item, index) => {
        const isFirst = index === 0;
        if (item.type === "date") {
          return (
            <div className={cn("text-center py-4", isFirst && "pt-[67px]")}>
              <span className="text-[#333333] dark:text-[#d9d9d9] text-sm bg-[#d9d9d9]/70 dark:bg-gray-600/70 backdrop-blur-[12px] p-1 rounded-xl">
                {format(new Date(item.date), "d MMMM yyyy")}
              </span>
            </div>
          );
        }

        return (
          <div className={cn("px-10 max-[750px]:px-5 pt-1 min-h-[44px]")}>
            <MessageBubble
              message={item.message}
              isNew={isNew}
              onReply={handleReply}
              onEdit={handleEditPanel}
              onDelete={handleDelete}
            />
          </div>
        );
      }}
      components={{
        Header: () => (
          <div className="flex flex-col">
            <div className="max-[650px]:h-[67px] max-[650px]:shrink-0" />
            {isFetchingNextPageMessages && (
              <div className="flex flex-col justify-center items-center gap-2 pt-2">
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
            )}
          </div>
        ),
        Footer: () => (
          <>
            <div ref={bottomAnchorRef} />
            <div className="min-h-[10px] max-[650px]:min-h-[80px] max-[650px]:shrink-0" />
          </>
        ),
        EmptyPlaceholder: () =>
          !isLoadingMessages && messagersData.length === 0 ? (
            <p className="flex flex-col text-center justify-center h-full flex-1 text-gray-700 dark:text-[#d9d9d9]">
              <span className="w-fit bg-[#e5e5e5]/50 dark:bg-[#141414]/80 backdrop-blur-3xl rounded-full p-1 mx-auto">
                No messages
              </span>
            </p>
          ) : null,
      }}
      className="scrollbarMessage overflow-x-hidden"
    />
  );
};
