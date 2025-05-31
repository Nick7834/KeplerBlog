import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useMemo } from "react";
import { Chat } from "./Chat";
import { useChatsQuery } from "../api/chats";
import { Skeleton } from "@/components/ui/skeleton";
import { Oval } from "react-loader-spinner";
import { IoIosChatboxes } from "react-icons/io";
import { emptyChatMessages } from "../lib/emptyChatMessages ";
import { IoMdChatbubbles } from "react-icons/io";
import { UseFormatNumber } from "@/components/hooks/useFormatNumber";
import { FaRegUser } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import { useChatsPusher } from "../lib/pushetChatsTop";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import InfiniteScroll from "react-infinite-scroll-component";
import { usePusherChatsApi } from "../lib/pusherChats";
import { useMessangerIdChat, useMessangerMenu } from "@/store/messanger";
import { useResize } from "@/components/hooks/useResize";
import { X } from "lucide-react";
import { CheckProfile } from "../../checkProfile";
import { Requests } from "./requests";
import { TbMessageCirclePlus } from "react-icons/tb";
import { useCountQuery } from "../api/chatRequest/chatRequest";
import { usePusherRequests } from "../lib/pusherRequests";
import { useQueryClient } from "@tanstack/react-query";
import { IchatsData } from "@/@types/message";
import { useChatPing } from "@/components/hooks/pingRedis";

interface Props {
  openMessager: boolean;
  handleClose: () => void;
}

export interface Message {
  id: string;
  content: string;
  img?: string;
  isOwn: boolean;
  status: "basic" | "answer";
  parent?: string;
  parentImg?: string;
}

export const ModalMessenger: React.FC<Props> = ({
  openMessager,
  handleClose,
}) => {
  const { data: session } = useSession();
  const { currentChatId, setCurrentChatId } = useMessangerIdChat();
  const { width } = useResize();

  const { menu, setMenu } = useMessangerMenu();

  const queryClient = useQueryClient();
  const { data, fetchNextPage, hasNextPage, isLoading, isError } =
    useChatsQuery(openMessager, session?.user?.id || "");

  const allChats = data?.pages.flatMap((page) => page.chats) || [];
  const total = data?.pages?.[0]?.totalChats ?? 0;
  const formattedCount = UseFormatNumber(total);

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
  }, [isLoading]);

  const { data: count, isLoading: countLoading } = useCountQuery(
    openMessager,
    session?.user?.id || ""
  );

  const conutLists = UseFormatNumber(count?.pending || 0);

  const handleChatClick = (chatId: string) => {
    if (!chatId) return;
    setCurrentChatId(chatId);
    setMenu(false);

    const userId = session?.user?.id ?? "";

    queryClient.setQueryData(["chats", userId], (oldData: IchatsData) => {
      if (!oldData) return oldData;

      const updateUnreadCount = oldData.pages.map((page) => {
        return {
          ...page,
          chats: page.chats.map((chat) => {
            return {
              ...chat,
              unreadCount: chat.chatId === chatId ? 0 : chat.unreadCount,
            };
          }),
        };
      });

      return {
        ...oldData,
        pages: updateUnreadCount,
      };
    });
  };

  useChatPing(currentChatId);
  useChatsPusher(session?.user?.id || "");
  usePusherChatsApi(session?.user?.id || "");
  usePusherRequests(session?.user?.id || "");

  return (
    <Dialog
      open={openMessager}
      onOpenChange={handleClose}
    >
      <DialogContent
        showCloseButton={false}
        className="w-[calc(100%-30px)] max-w-[95%] sm:max-w-[1400px] max-[750px]:w-full max-[750px]:max-w-full p-0 mx-auto
            bg-[#e5e5e5] dark:bg-[#19191b] rounded-md max-h-[100vh] max-[750px]:h-[100vh] max-[750px]:max-h-full max-[750px]:rounded-none overflow-hidden"
      >
        <DialogClose className="cursor-pointer absolute z-[50] right-1 top-1 max-[750px]:right-1 max-[750px]:top-1 rounded-sm opacity-70 transition-opacity hover:opacity-100 disabled:pointer-events-none select-none">
          <X className="h-4 w-4" />
        </DialogClose>
        <div className="grid grid-cols-[320px_1fr] max-[640px]:grid-cols-[1fr] max-[750px]:grid-cols-[1fr]">
          <div className="flex flex-col gap-1 max-[750px]:h-[calc(100vh-60px)] border-r border-[#b0b0b0]/70 dark:border-neutral-300/75">
            <DialogTitle className="relative flex items-center justify-between gap-2 p-4 pb-0 bg-[#e5e5e5] dark:bg-[#141414]">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => (setCurrentChatId(""), setMenu(false))}
                  className="border-0 bg-0 dasrk:bg-0 hover:bg-0 hover:dark:bg-0 text-[#121212] dark:text-[#d9d9d9] p-0 text-base font-medium hover:outline-none"
                >
                  KeplerBlog Messenger
                </Button>
                <span className="flex flex-col items-center justify-center bg-[#19191b] dark:bg-[#e5e5e5] min-w-5 h-5 w-fit rounded-full dark:text-[#474747] text-[#d9d9d9] text-sm">
                  {formattedCount}
                </span>
              </div>
              <Button
                variant="outline"
                className="relative border-0 bg-0 dasrk:bg-0 hover:bg-0 hover:dark:bg-0 text-[#121212] dark:text-[#d9d9d9] p-0 text-base font-medium hover:outline-none [&_svg]:size-[25px]"
                onClick={() => setMenu(!menu)}
              >
                <TbMessageCirclePlus />
                {!countLoading && Number(conutLists) > 0 && (
                  <p className="p-[1px] absolute top-[-5px] right-[-5px] flex items-center justify-center min-w-6 h-6 text-xs text-[#d9d9d9] dark:text-[#d9d9d9] bg-[#7391d5] dark:bg-[#7391d5] rounded-full">
                    {conutLists}
                  </p>
                )}
              </Button>
            </DialogTitle>
            <div className="min-h-[calc(100vh-140px)] max-h-[calc(100vh-140px)] max-[750px]:min-h-[calc(100vh-40px)] max-[750px]:max-h-[calc(100vh-40px)] h-full p-2 pb-1 rounded-t-[10px] bg-[#dad9d9] dark:bg-[#1f1f22] flex flex-col">
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
                <div className="flex flex-1 h-[calc(100%-60px)] flex-col items-center justify-center gap-2 text-[#333333] dark:text-[#d9d9d9] text-xl font-bold mt-10">
                  <IoIosChatboxes size={50} />
                  No chats
                </div>
              ) : (
                <div
                  id="scrollable-chat-container"
                  className="overflow-y-auto scrollbar min-h-0 max-h-[calc(100vh-140px)] max-[750px]:max-h-[calc(100vh-75px)]"
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
                    {allChats.map((chat, index) => (
                      <motion.div
                        key={chat.chatId}
                        layout
                        transition={{
                          type: "spring",
                          stiffness: 100,
                          damping: 20,
                          duration: 0.01,
                        }}
                        className={index > 0 ? "pt-2" : ""}
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
                              " flex w-full items-center gap-2 justify-start text-start min-h-[40px] h-full border-0 bg-transparent dark:bg-transparent hover:dark:bg-[#504e4e] hover:bg-[#ededed] px-2 py-2 rounded-[10px]",
                              currentChatId === chat.chatId &&
                                "bg-[#7391d5] dark:bg-[#7391d5] hover:bg-[#8daaee]/70 hover:dark:bg-[#8daaee]/70"
                            )}
                          >
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
                            <div className="flex flex-col w-full">
                              <h2
                                className={cn(
                                  "text-[#333333] dark:text-[#d9d9d9] text-lg font-bold break-all flex items-center gap-1",
                                  currentChatId === chat.chatId &&
                                    "text-[#f4f4f4]"
                                )}
                              >
                                {chat.companion.username.length > 15
                                  ? `${chat.companion.username
                                      .slice(0, 15)
                                      .trim()}...`
                                  : chat.companion.username}
                                <CheckProfile
                                  isverified={
                                    chat?.companion?.isverified || false
                                  }
                                  className={cn(
                                    "[&_svg]:size-[23px]",
                                    currentChatId === chat.chatId &&
                                      "[&_svg]:text-[#f4f4f4]"
                                  )}
                                />
                              </h2>
                              <div className="flex items-center justify-between">
                                {chat.lastMessage ? (
                                  <p
                                    className={cn(
                                      "text-[#333333] dark:text-[#d9d9d9] text-sm flex items-center gap-2",
                                      currentChatId === chat.chatId &&
                                        "text-[#f4f4f4]"
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
                                      currentChatId === chat.chatId &&
                                        "text-[#f4f4f4]"
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
          </div>

          <AnimatePresence mode="wait">
            {!menu ? (
              currentChatId ? (
                <motion.div
                  key="chat"
                  initial={width <= 750 ? { translateX: "100%" } : false}
                  animate={width <= 750 ? { translateX: 0 } : false}
                  exit={
                    width <= 750 ? { translateX: "100%" } : { translateX: 0 }
                  }
                  transition={
                    width <= 750
                      ? { duration: 0.4, ease: "easeInOut" }
                      : undefined
                  }
                  className="max-[750px]:fixed max-[750px]:h-full max-[750px]:top-0 max-[750px]:left-0 max-[750px]:right-0 max-[750px]:bottom-0 max-[750px]:z-[9999] max-[750px]:bg-[#e5e5e5] max-[750px]:dark:bg-[#19191b]"
                >
                  <Chat
                    currentChatId={currentChatId}
                    setCurrentChatId={setCurrentChatId}
                    handleClose={handleClose}
                    className="h-full"
                  />
                </motion.div>
              ) : (
                <p className="flex flex-col gap-2 justify-center items-center text-[#333333] dark:text-[#d9d9d9] text-xl font-bold max-[750px]:hidden">
                  <IoMdChatbubbles size={80} />
                  Select a chat to get started.
                </p>
              )
            ) : (
              <motion.div
                key="chats"
                initial={width <= 750 ? { translateX: "100%" } : false}
                animate={width <= 750 ? { translateX: 0 } : false}
                exit={width <= 750 ? { translateX: "100%" } : { translateX: 0 }}
                transition={
                  width <= 750
                    ? { duration: 0.4, ease: "easeInOut" }
                    : undefined
                }
                className="p-[30px] max-[750px]:p-3 max-[750px]:fixed max-[750px]:h-full max-[750px]:top-0 max-[750px]:left-0 max-[750px]:right-0 max-[750px]:bottom-0 max-[750px]:z-[9999] max-[750px]:bg-[#e5e5e5] max-[750px]:dark:bg-[#19191b]"
              >
                <Requests
                  userId={session?.user?.id || ""}
                  setMenu={setMenu}
                  count={count}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};
