import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { FaRegUser } from "react-icons/fa6";
import { CustomPopover } from "./CustomPopover";
import { Chat } from "@/@types/message";
import { IoIosArrowBack } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { CheckProfile } from "../../checkProfile";

interface Props {
  className?: string;
  isLoadingCurrentChat: boolean;
  currentChat: Chat | undefined;
  setCurrentChatId: (chatId: string) => void;
  handleDeleteChat: (id: string) => void;
  handleClose: () => void
}

export const ChatHeader: React.FC<Props> = ({
  className,
  isLoadingCurrentChat,
  currentChat,
  setCurrentChatId,
  handleDeleteChat,
  handleClose
}) => {
  return (
    <div
      className={cn(
        "flex items-center gap-4 p-2 shadow-lg border-b border-solid bg-[#e5e5e5] dark:bg-[#141414] border-[#b0b0b0]/70 dark:border-neutral-300/75",
        className
      )}
    >
      {isLoadingCurrentChat ? (
        <div className="flex items-center gap-4">
          <Skeleton className="min-w-[50px] w-[50px] h-[50px] rounded-full bg-[#c1c1c1] dark:bg-[#2a2a2a]" />
          <Skeleton className="w-[100px] h-[20px] rounded-[10px] bg-[#c1c1c1] dark:bg-[#2a2a2a]" />
        </div>
      ) : (
        <div className="flex w-full items-center gap-4 justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="hidden max-[750px]:block p-1 bg-0 hover:bg-0 [&_svg]:size-[25px]"
              onClick={() => setCurrentChatId("")}
            >
              <IoIosArrowBack />
            </Button>
            <Link
              href={`/profile/${currentChat?.interlocutor?.id}`}
              className="flex items-center gap-4"
              onClick={handleClose}
            >
              {currentChat?.interlocutor?.profileImage ? (
                <img
                  src={currentChat?.interlocutor?.profileImage}
                  alt="avatar"
                  className="min-w-[50px] w-[50px] h-[50px] rounded-full object-cover"
                />
              ) : (
                <span className="flex flex-col items-center justify-center object-cover rounded-full w-[50px] h-[50px] bg-[#c7c7c7]">
                  <FaRegUser className="text-[#333333]" />
                </span>
              )}
              <span className="text-[#333333] dark:text-[#d9d9d9] text-lg font-bold flex items-center gap-1">
                {currentChat?.interlocutor?.username} <CheckProfile isverified={currentChat?.interlocutor?.isverified || false} />
              </span>
            </Link>
          </div>

          <CustomPopover
            currentChatId={currentChat?.id || ""}
            handleDeleteChat={handleDeleteChat}
          />
        </div>
      )}
    </div>
  );
};
