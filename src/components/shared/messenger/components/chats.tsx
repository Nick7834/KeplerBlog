import { Skeleton } from "@/components/ui/skeleton";
import { AnimatePresence, motion } from "framer-motion";
import React, { useMemo } from "react";
import { IoIosChatboxes } from "react-icons/io";
import InfiniteScroll from "react-infinite-scroll-component";
import { Oval } from "react-loader-spinner";
import { Button } from "../..";
import { cn } from "@/lib/utils";
import { FaRegUser } from "react-icons/fa6";
import { CheckProfile } from "../../checkProfile";
import { TbCheck, TbChecks } from "react-icons/tb";
import { formatChatDate } from "../lib/formatChatDate";
import { UseFormatNumber } from "@/components/hooks/useFormatNumber";
import { emptyChatMessages } from "../lib/emptyChatMessages ";
import { ChatProps } from "@/@types/message";
import { FaVolumeMute } from "react-icons/fa";
import { usePusherOnline } from "../lib/pusherOnline";
import { useMessangerStore } from "@/store/messanger";
import { useOnlineStatus } from "../hook/useOnlineStatus";

interface Props {
  allChats: ChatProps[];
  isError: boolean;
  isLoading: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  currentChatId: string;
  handleChatClick: (chatId: string) => void;
}

export const Chats: React.FC<Props> = ({
  allChats,
  isError,
  isLoading,
  hasNextPage,
  fetchNextPage,
  currentChatId,
  handleChatClick,
}) => {
  const { openMessager } = useMessangerStore();
  const { onlineUsers, setOnlineUsers } = useOnlineStatus(openMessager);

  usePusherOnline(setOnlineUsers);

  const randomMessagesMap = useMemo(() => {
    const map: Record<string, string> = {};

    allChats.forEach((chat) => {
      if (!chat.lastMessage) {
        const randomIndex = Math.floor(
          Math.random() * emptyChatMessages.length
        );
        map[chat.chatId] = emptyChatMessages[randomIndex];
      }
    });

    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  return (
    <div className="overflow-x-hidden h-full p-2 pb-1 rounded-t-[10px] backdrop-blur-3xl bg-[#dad9d9]/80 dark:bg-[#1f1f22]/60 flex flex-col">
      {isError && <p className="text-red-500">Something went wrong</p>}
      {isLoading ? (
        <div className="flex flex-col gap-2">
          {[...Array(5)].map((_, index) => (
            <Skeleton
              key={index}
              className="h-[76px] w-full bg-[#c1c1c1] dark:bg-[#2a2a2a]"
            />
          ))}
        </div>
      ) : allChats.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-[#333333] dark:text-[#d9d9d9] text-xl font-bold mt-10">
          <IoIosChatboxes size={50} />
          No chats
        </div>
      ) : (
        <div
          id="scrollable-chat-container"
          className="scrollbarMessage overflow-x-hidden scrollbar max-h-[calc(100dvh-125px)] max-[750px]:max-h-[calc(100vh-75px)]"
        >
          <InfiniteScroll
            dataLength={allChats.length}
            next={fetchNextPage}
            hasMore={hasNextPage}
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
            scrollableTarget="scrollable-chat-container"
          >
            {allChats.map((chat) => (
              <motion.div
                key={chat.chatId}
                layout
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 20,
                  duration: 0.01,
                }}
              
                style={{
                  zIndex: chat.chatId === currentChatId ? 10 : 1,
                  position: "relative",
                }}
              >
                <AnimatePresence>
                  <Button
                    onClick={() => handleChatClick(chat.chatId)}
                    variant="outline"
                    className={cn(
                      "flex w-full items-center gap-2 justify-start text-start min-h-[40px] h-full border-0 bg-transparent dark:bg-transparent hover:dark:bg-[#504e4e]/80 hover:bg-[#ededed]/80 px-2 py-[10px] rounded-[10px]",
                      currentChatId === chat.chatId &&
                        "bg-[#7391d5] dark:bg-[#7391d5] hover:bg-[#8daaee]/70 hover:dark:bg-[#8daaee]/70"
                    )}
                  >
                    <div className="relative">
                      {chat.companion.profileImage ? (
                        <img
                          src={chat.companion.profileImage}
                          alt="avatar"
                          className="min-w-[60px] w-[60px] h-[60px] rounded-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <span className="flex flex-col items-center justify-center object-cover rounded-full min-w-[60px] w-[60px] h-[60px] bg-[#c7c7c7]">
                          <FaRegUser className="text-[#333333]" />
                        </span>
                      )}
                      {onlineUsers[chat.companion.id] && (
                        <span className="absolute bottom-0 right-0 w-[15px] h-[15px] rounded-full bg-[#7391d5] dark:bg-[#7391d5] border-[1px] border-[#ffffff]"></span>
                      )}
                    </div>
                    <div className="flex flex-col w-full">
                      <div
                        className={cn(
                          "text-[#333333] dark:text-[#d9d9d9] text-lg font-bold break-all flex items-center justify-between gap-1",
                          currentChatId === chat.chatId && "text-[#f4f4f4]"
                        )}
                      >
                        <div className="flex items-center gap-1">
                          {chat.companion.username.length >
                          (chat.companion.isverified ? 8 : 11)
                            ? `${chat.companion.username
                                .slice(0, chat.companion.isverified ? 8 : 11)
                                .trim()}...`
                            : chat.companion.username}
                          <CheckProfile
                            isverified={chat?.companion?.isverified || false}
                            className={cn(
                              "[&_svg]:size-[23px]",
                              currentChatId === chat.chatId &&
                                "[&_svg]:text-[#f4f4f4]"
                            )}
                          />
                          {chat.mutedBy && (
                            <span title="Muted">
                              <FaVolumeMute />
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          {chat.lastMessage.isRead ? (
                            <span
                              title="read"
                              className={cn(
                                "text-[#7391d5]",
                                currentChatId === chat.chatId &&
                                  "text-[#f4f4f4]"
                              )}
                            >
                              <TbChecks size={16} />
                            </span>
                          ) : (
                            <span
                              title="not read"
                              className={cn(
                                "text-[#7391d5]",
                                currentChatId === chat.chatId &&
                                  "text-[#f4f4f4]"
                              )}
                            >
                              <TbCheck size={16} />
                            </span>
                          )}

                          <span
                            className={cn(
                              "text-[#333333] dark:text-[#d9d9d9] text-xs font-normal",
                              currentChatId === chat.chatId && "text-[#f4f4f4]"
                            )}
                          >
                            {chat.lastMessage.createMessageAt &&
                              formatChatDate(
                                String(chat.lastMessage.createMessageAt)
                              )}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        {chat.lastMessage ? (
                          <p
                            className={cn(
                              "text-[#333333] dark:text-[#d9d9d9] text-sm flex items-center gap-2",
                              currentChatId === chat.chatId && "text-[#f4f4f4]"
                            )}
                          >
                            {chat.lastMessage.content.image && (
                              <img
                                src={chat.lastMessage.content.image}
                                alt="image"
                                className="w-[20px] h-[20px] rounded-sm object-cover"
                                loading="lazy"
                              />
                            )}
                            {chat.lastMessage.content.text &&
                            chat.lastMessage.content.text.length >= 15
                              ? `${chat.lastMessage.content.text
                                  .slice(0, 15)
                                  .trim()}...`
                              : chat.lastMessage.content.text}
                          </p>
                        ) : (
                          <p
                            className={cn(
                              "text-[#5e5e5e] dark:text-[#b2b2b2] text-sm",
                              currentChatId === chat.chatId && "text-[#f4f4f4]"
                            )}
                          >
                            {randomMessagesMap[chat.chatId]}
                          </p>
                        )}
                        {chat.unreadCount > 0 && (
                          <span
                            className={cn(
                              "flex items-center justify-center min-w-6 h-6 text-xs text-[#d9d9d9] dark:text-[#d9d9d9] bg-[#7391d5] dark:bg-[#7391d5] rounded-full",
                              currentChatId === chat.chatId &&
                                "bg-[#d9d9d9] dark:bg-[#d9d9d9] text-[#7391d5] dark:text-[#7391d5]"
                            )}
                          >
                            {UseFormatNumber(chat?.unreadCount || 0)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Button>
                </AnimatePresence>
              </motion.div>
            ))}
          </InfiniteScroll>
        </div>
      )}
    </div>
  );
};
