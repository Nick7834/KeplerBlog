import { cn } from "@/lib/utils";
import { format } from "date-fns";
import React, {  useEffect, useRef, useState } from "react";
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
  setFirstItemIndex
}) => {
  const chatItems = groupMessagesByDate(messagersData);

  const initialIndexRef = useRef<number | null>(null);

  if (chatItems.length > 0 && initialIndexRef.current === null) {
    initialIndexRef.current = chatItems.length - 1;
  }

  useEffect(() => {
    initialIndexRef.current = null;
  }, [currentChatId]);
  
  const [isAtBottom, setIsAtBottom] = useState(true);

  return (
    <Virtuoso
      key={currentChatId}
      ref={virtuosoRef}
      style={{ height: "100%", width: "100%" }}
      data={chatItems}
      firstItemIndex={firstItemIndex}
      overscan={6000}
      initialTopMostItemIndex={initialIndexRef.current ?? undefined}
      alignToBottom={true}
      followOutput={!isFetchingNextPageMessages && isAtBottom}
      atBottomStateChange={setIsAtBottom}
      startReached={async () => {
        if (hasNextPageMessages && !isFetchingNextPageMessages) {
          await fetchNextPageMessages();
          setFirstItemIndex((prev: number) => Math.max(prev - 50, 0));
        }
      }}
      itemContent={(_, item) => {
        if (item.type === "date") {
          return (
            <div className="text-center py-4 text-[#848484] dark:text-[#d9d9d9] text-sm">
              {format(new Date(item.date), "d MMMM yyyy")}
            </div>
          );
        }

        return (
          <div className={cn("px-10 max-[750px]:px-5 py-[7px] min-h-[44px]")}>
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
        Header: () =>
          isFetchingNextPageMessages ? (
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
          ) : null,
        EmptyPlaceholder: () =>
          !isLoadingMessages && messagersData.length === 0 ? (
            <p className="flex flex-col text-center justify-center h-full flex-1 text-gray-500 dark:text-[#d9d9d9]">
              No messages
            </p>
          ) : null,
      }}
      className="scrollbar overflow-x-hidden"
    />
  );
};
