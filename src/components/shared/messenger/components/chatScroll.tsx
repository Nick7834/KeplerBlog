import { cn } from "@/lib/utils";
import { format } from "date-fns";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { Oval } from "react-loader-spinner";
import { MessageProps } from "@/@types/message";
import { MessageBubble } from "./MessageBubble";
import { groupMessagesByDate } from "../lib/groupMessagesByDate";
import { useSession } from "next-auth/react";

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
  const { data: session } = useSession();
  const chatItems = groupMessagesByDate(messagersData);

  const initialIndexRef = useRef<number | null>(null);
  const bottomAnchorRef = useRef<HTMLDivElement | null>(null);

  if (chatItems.length > 0 && initialIndexRef.current === null) {
    initialIndexRef.current = chatItems.length - 1;
  }

  useEffect(() => {
    initialIndexRef.current = null;
  }, [currentChatId]);

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

  const renderItem = useCallback(
    (_: number, item: MessageProps, index: number) => {
      const isFirst = index === 0;

      if (item.type === "date" && item.date) {
        return (
          <div
            className={cn(
              "sticky top-0 text-center py-4",
              isFirst && "pt-[67px]"
            )}
          >
            <span className="text-[#333333] dark:text-[#d9d9d9] text-sm bg-[#d9d9d9]/70 dark:bg-gray-600/70 backdrop-blur-[12px] p-1 rounded-xl">
              {format(new Date(item.date), "d MMMM yyyy")}
            </span>
          </div>
        );
      }

      return (
        <div
          key={item.id || index}
          className={cn("px-5 max-[750px]:px-2 pt-1 min-h-[44px]")}
          data-virtuoso-item-content
        >
          <MessageBubble
            message={item.message}
            isNew={item.message.optimistic}
            onReply={handleReply}
            onEdit={handleEditPanel}
            onDelete={handleDelete}
            session={session}
          />
        </div>
      );
    },
    [isNew, handleReply, handleEditPanel, handleDelete]
  );

  const handleStartReached = useCallback(async () => {
    if (hasNextPageMessages && !isFetchingNextPageMessages) {
      await fetchNextPageMessages();
      setFirstItemIndex((prev: number) => Math.max(prev - 50, 0));
    }
  }, [
    hasNextPageMessages,
    isFetchingNextPageMessages,
    fetchNextPageMessages,
    setFirstItemIndex,
  ]);

  return (
    <Virtuoso
      key={currentChatId}
      ref={virtuosoRef}
      style={{ height: "100%", width: "100%" }}
      data={chatItems as MessageProps[]}
      firstItemIndex={firstItemIndex}
      increaseViewportBy={{ top: 300, bottom: 300 }}
      overscan={15}
      initialTopMostItemIndex={initialIndexRef.current ?? undefined}
      skipAnimationFrameInResizeObserver={true}
      atBottomThreshold={50}
      alignToBottom={true}
      followOutput={isAtBottom}
      atBottomStateChange={setIsAtBottom}
      startReached={handleStartReached}
      itemContent={renderItem}
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
