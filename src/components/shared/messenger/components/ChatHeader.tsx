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
import { FaVolumeMute } from "react-icons/fa";
import { useOnlineStore } from "@/store/useOnlineStore";
import { formatLastSeen } from "../lib/formatLastSeen";

interface Props {
  className?: string;
  isLoadingCurrentChat: boolean;
  currentChat: Chat | undefined;
  mutedBy: boolean;
  setCurrentChatId: (chatId: string) => void;
  handleDeleteChat: (id: string) => void;
  handleMuteChat: (id: string) => void;
  handleClose: () => void;
}

export const ChatHeader: React.FC<Props> = ({
  className,
  isLoadingCurrentChat,
  currentChat,
  mutedBy,
  setCurrentChatId,
  handleDeleteChat,
  handleMuteChat,
  handleClose,
}) => {
  const onlineUsers = useOnlineStore((state) => state.onlineUsers);
  const lastActiveMap = useOnlineStore((state) => state.lastActiveMap);

  const lastSeenTimestamp = lastActiveMap[currentChat?.interlocutor?.id || ""];

  return (
    <div
      className={cn(
        "absolute top-0 left-0 w-full z-20 flex items-center gap-4 p-2",
        className,
      )}
    >
      {isLoadingCurrentChat ?
        <div className="flex items-center gap-1 w-full">
          <Skeleton className="hidden max-[750px]:block min-w-[50px] w-[50px] h-[50px] rounded-full bg-[#e1e0e0] dark:bg-[#545454]" />
          <Skeleton className="w-full flex-1 min-w-0 basis-0 h-[50px] rounded-full bg-[#e1e0e0] dark:bg-[#545454]" />
          <Skeleton className="hidden max-[750px]:block min-w-[50px] w-[50px] h-[50px] rounded-full bg-[#e1e0e0] dark:bg-[#545454]" />
        </div>
      : <div className="flex w-full items-center gap-1 justify-between">
          <Button
            variant="ghost"
            className={cn(
              "min-w-[50px] w-[50px] h-[50px] hidden max-[750px]:flex p-1 bg-0 hover:bg-0 [&_svg]:size-[20px]",
              "shadow-lg border border-solid backdrop-blur-[12px] bg-[#e5e5e5]/55 dark:bg-[#141414]/60 border-[#b0b0b0]/20 dark:border-neutral-300/20 rounded-full",
            )}
            onClick={() => setCurrentChatId("")}
          >
            <IoIosArrowBack />
          </Button>

          <div className="h-[50px] flex items-center gap-2 justify-between w-full min-[751px]:shadow-lg min-[751px]:border min-[751px]:border-solid min-[751px]:backdrop-blur-[12px] min-[751px]:bg-[#e5e5e5]/55 min-[751px]:dark:bg-[#141414]/60 min-[751px]:border-[#b0b0b0]/20 min-[751px]:dark:border-neutral-300/20 min-[751px]:rounded-full">
            <Link
              href={`/profile/${currentChat?.interlocutor?.id}`}
              className={cn(
                "flex items-center gap-4 w-full flex-1 min-w-0 basis-0",
                "max-[750px]:shadow-lg max-[750px]:border max-[750px]:border-solid max-[750px]:backdrop-blur-[12px] max-[750px]:bg-[#e5e5e5]/55 max-[750px]:dark:bg-[#141414]/60 max-[750px]:border-[#b0b0b0]/20 max-[750px]:dark:border-neutral-300/20 max-[750px]:rounded-full",
                "h-[50px]"
              )}
              onClick={handleClose}
            >
              {currentChat?.interlocutor?.profileImage ?
                <img
                  src={currentChat?.interlocutor?.profileImage}
                  alt="avatar"
                  className="min-w-[50px] w-[50px] h-[50px] rounded-full object-cover"
                />
              : <span className="flex flex-col items-center justify-center object-cover rounded-full w-[50px] h-[50px] bg-[#c7c7c7]">
                  <FaRegUser className="text-[#333333]" />
                </span>
              }
              <div className="flex flex-col">
                <span className="text-[#333333] dark:text-[#d9d9d9] text-lg font-bold flex items-center gap-1">
                 {currentChat?.interlocutor?.username}
                  <CheckProfile
                    isverified={currentChat?.interlocutor?.isverified || false}
                    styleCheck="group-hover:top-[-14px]"
                  />
                  {mutedBy && (
                    <span title="Muted">
                      <FaVolumeMute />
                    </span>
                  )}
                </span>
                {onlineUsers[currentChat?.interlocutor?.id || ""] ?
                  <span className="text-[#7391d5] dark:text-[#7391d5] text-xs font-medium">
                    Online
                  </span>
                : <span className="text-[#333333] dark:text-[#d9d9d9] text-xs font-medium">
                    {formatLastSeen(lastSeenTimestamp)}
                  </span>
                }
              </div>
            </Link>

            <CustomPopover
              currentChatId={currentChat?.id || ""}
              handleDeleteChat={handleDeleteChat}
              handleMuteChat={handleMuteChat}
              mutedBy={mutedBy}
            />
          </div>
        </div>
      }
    </div>
  );
};
