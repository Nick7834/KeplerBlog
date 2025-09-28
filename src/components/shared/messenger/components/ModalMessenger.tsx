import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
  DialogOverlay,
} from "@/components/ui/dialog";
import React, { useEffect } from "react";
import { Chat } from "./Chat";
import { IoMdChatbubbles } from "react-icons/io";
import { UseFormatNumber } from "@/components/hooks/useFormatNumber";
import { useChatsPusher } from "../lib/pushetChatsTop";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import { usePusherChatsApi } from "../lib/pusherChats";
import {
  useMessangerIdChat,
  useMessangerMenu,
  useMessangerSettings,
} from "@/store/messanger";
import { useResize } from "@/components/hooks/useResize";
import { X } from "lucide-react";
import { Requests } from "./requests";
import { TbMessageCirclePlus } from "react-icons/tb";
import { useCountQuery } from "../api/chatRequest/chatRequest";
import { usePusherRequests } from "../lib/pusherRequests";
import { useQueryClient } from "@tanstack/react-query";
import { useChatPing } from "@/components/hooks/pingRedis";
import { useChatPusher } from "@/components/hooks/pusherMessage";
import axios from "axios";
import { IoSettings } from "react-icons/io5";
import { SettingsMessenger } from "./settingsMessenger";
import { Chats } from "./chats";
import { useChatsQuery } from "../api/chats";
import { handleChatClick } from "../api/chat/handleChatClick";
import { ModalImg } from "./modalImg";
import { TbMessageCircleFilled } from "react-icons/tb";

interface Props {
  openMessager: boolean;
  modalRef: React.RefObject<HTMLDivElement>;
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
  modalRef,
  handleClose,
}) => {
  const { data: session } = useSession();
  const { currentChatId, setCurrentChatId } = useMessangerIdChat();
  const { width } = useResize();

  const { menu, setMenu } = useMessangerMenu();
  const { settings, setSettings } = useMessangerSettings();

  useEffect(() => {
    if (!currentChatId) return;

    const fetchIsRead = async () => {
      if (openMessager && currentChatId) {
        await axios.patch(`/api/messenger/chats?chatId=${currentChatId}`);
      }
      await axios.put(`/api/messenger/isRead/${currentChatId}`);
    };
    fetchIsRead();
  }, [currentChatId, openMessager]);

  const queryClient = useQueryClient();
  const { data, fetchNextPage, hasNextPage, isLoading, isError } =
    useChatsQuery(openMessager, session?.user?.id || "");

  const allChats = data?.pages.flatMap((page) => page.chats) || [];
  const total = data?.pages?.[0]?.totalChats ?? 0;
  const formattedCount = UseFormatNumber(total);

  const { data: count, isLoading: countLoading } = useCountQuery(
    openMessager,
    session?.user?.id || ""
  );

  const conutLists = UseFormatNumber(count?.pending || 0);

  const handleChatClickNow = (chatId: string) => {
    handleChatClick(
      chatId,
      setCurrentChatId,
      setMenu,
      setSettings,
      queryClient,
      session?.user?.id || ""
    );
  };

  useChatPing(currentChatId, openMessager);
  useChatsPusher(session?.user?.id || "");
  usePusherChatsApi(session?.user?.id || "");
  usePusherRequests(session?.user?.id || "");
  useChatPusher(currentChatId);

  return (
    <Dialog
      open={openMessager}
      onOpenChange={handleClose}
    >
      <DialogOverlay className="fixed inset-0 bg-black/15 z-[1000] transition-none" />
      <DialogContent
        ref={modalRef}
        showCloseButton={false}
        onPointerDownOutside={(e) => {
          const target = e.target as Element;
          if (
            target.closest("[data-sonner-toast]") ||
            target.closest("[data-sonner-toaster]")
          ) {
            e.preventDefault();
          }
        }}
        className="z-[1001] w-[calc(100%-30px)] max-w-[95%] sm:max-w-[1400px] max-[750px]:w-full max-[750px]:max-w-full p-0 mx-auto
            bg-[#e5e5e5]/80 dark:bg-[#19191b]/60 backdrop-blur-3xl rounded-md max-h-[100vh] h-[95vh] max-[750px]:h-[100vh] max-[750px]:max-h-full max-[750px]:rounded-none overflow-hidden border-0"
      >
        <DialogClose className="cursor-pointer absolute z-[50] right-1 top-1 max-[750px]:right-1 max-[750px]:top-1 rounded-sm opacity-70 transition-opacity hover:opacity-100 disabled:pointer-events-none select-none">
          <X className="h-4 w-4" />
        </DialogClose>
        <div className="h-full grid grid-cols-[320px_1fr] max-[640px]:grid-cols-[1fr] max-[750px]:grid-cols-[1fr]">
          <div className="flex flex-col gap-1 border-r border-[#b0b0b0]/70 dark:border-neutral-300/75 max-[750px]:border-r-0">
            <DialogTitle className="relative flex items-center justify-between gap-2 p-4 pb-0">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => (
                    setCurrentChatId(""), setMenu(false), setSettings(false)
                  )}
                  className="border-0 bg-0 dasrk:bg-0 hover:bg-0 hover:dark:bg-0 text-[#121212] dark:text-[#d9d9d9]
                   p-0 text-base font-medium hover:outline-none [&_svg]:size-[17px]"
                >
                  <h5 className="flex items-center gap-1">
                    <TbMessageCircleFilled className="relative -top-0.1" />
                    KeplerMessenger
                  </h5>
                  <span className="flex flex-col items-center justify-center bg-[#19191b] dark:bg-[#e5e5e5] min-w-5 h-5 w-fit rounded-full dark:text-[#474747] text-[#d9d9d9] text-sm">
                    {formattedCount}
                  </span>
                </Button>
              </div>
              <div className="h-full flex items-center gap-3">
                <Button
                  variant="outline"
                  className="relative border-0 bg-0 dark:bg-0 hover:bg-0 hover:dark:bg-0 text-[#121212] dark:text-[#d9d9d9] p-0 text-base font-medium hover:outline-none [&_svg]:size-[25px]"
                  onClick={() => (
                    setCurrentChatId(""), setMenu(!menu), setSettings(false)
                  )}
                >
                  <TbMessageCirclePlus />
                  {!countLoading && Number(conutLists) > 0 && (
                    <p className="p-[1px] absolute top-[-5px] right-[-5px] flex items-center justify-center min-w-6 h-6 text-xs text-[#d9d9d9] dark:text-[#d9d9d9] bg-[#7391d5] dark:bg-[#7391d5] rounded-full">
                      {conutLists}
                    </p>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="relative border-0 bg-0 dark:bg-0 hover:bg-0 hover:dark:bg-0 text-[#121212] dark:text-[#d9d9d9] p-0 text-base font-medium hover:outline-none [&_svg]:size-[25px]"
                  onClick={() => (
                    setCurrentChatId(""), setSettings(!settings), setMenu(false)
                  )}
                >
                  <IoSettings />
                </Button>
              </div>
            </DialogTitle>

            <Chats
              allChats={allChats}
              isError={isError}
              isLoading={isLoading}
              hasNextPage={hasNextPage}
              fetchNextPage={fetchNextPage}
              currentChatId={currentChatId}
              handleChatClick={handleChatClickNow}
            />
          </div>

          <AnimatePresence mode="wait">
            {!menu &&
              !settings &&
              (currentChatId ? (
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
              ))}

            {menu && (
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

            {settings && (
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
                <SettingsMessenger
                  userId={session?.user?.id || ""}
                  setSettings={setSettings}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <ModalImg />
      </DialogContent>
    </Dialog>
  );
};
