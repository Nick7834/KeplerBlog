"use client";
import React, { useState } from "react";
import { BiSolidLike } from "react-icons/bi";
import { FaCalendarAlt } from "react-icons/fa";
import { IoPeopleSharp } from "react-icons/io5";
import { MdDescription } from "react-icons/md";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";
import { CheckProfile } from "./checkProfile";
import { Button } from "../ui/button";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { usePathname } from "next/navigation";
import { postChat } from "./messenger/api/chats";
import { useSession } from "next-auth/react";
import { useMessangerIdChat, useMessangerMenu, useMessangerSettings, useMessangerStore } from "@/store/messanger";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  className?: string;
  user: {
    id: string;
    username: string;
    profileImage: string | null;
    poster: string | null;
    bio: string | null;
    createdAt: Date | null;
    isverified: boolean;
    followers: {
      id: string;
      followerId: string;
      followingId: string;
    }[];
    _count: {
      following: number;
    };
    posts: {
      id: string;
      _count: {
        likes: number;
      };
    }[];
  } | null;
  loader: boolean;
}

export const ProfileBlock: React.FC<Props> = ({ className, user, loader }) => {
  const {data: session} = useSession();
  const pathName = usePathname();
  const idUserChat = pathName.split("/")[2];
  const queryClient = useQueryClient();

  const { setOpenMessager } = useMessangerStore();
  const { setCurrentChatId } = useMessangerIdChat();
  const { setMenu } = useMessangerMenu();
  const { setSettings } = useMessangerSettings();

  const [loaderButton, setLoaderButton] = useState(false);

  return (
    <div
      className={cn(
        "block-info sticky top-[110px] h-fit flex flex-col gap-4 bg-[#e0e0e0]/95 dark:bg-[#2a2a2a]/60 p-4 rounded-md",
        className
      )}
    >
      <h2 className="flex items-center gap-[2px] text-[#333333] dark:text-[#d9d9d9] text-xl font-bold break-all">
        {loader ? (
          <Skeleton className="w-[100px] h-[20px] rounded-[10px] bg-[#c1c1c1] dark:bg-[#2a2a2a]" />
        ) : (
          user?.username
        )}
        {user?.isverified && <CheckProfile isverified={user?.isverified} />}
      </h2>

      {user?.bio && (
        <div className="flex flex-col gap-1">
          <h2 className="flex items-center gap-2 text-[#333333] dark:text-[#d9d9d9] text-base font-bold break-all">
            <MdDescription /> Description
          </h2>
          {loader ? (
            Array.from({ length: 5 }, (_, index) => (
              <Skeleton
                key={index}
                className="[&:not(:first-child)]:mt-2 w-full h-[15px] rounded-[10px] bg-[#c1c1c1] dark:bg-[#2a2a2a]"
              />
            ))
          ) : (
            <p className="text-[#333333] dark:text-[#d9d9d9] text-sm">
              {user?.bio}
            </p>
          )}
        </div>
      )}

      <div className="grid items-center justify-center grid-cols-[repeat(3,1fr)] gap-2">
        <div className="flex flex-col gap-1">
          <h2 className="flex items-center gap-2 text-[#333333] dark:text-[#d9d9d9] text-sm font-bold">
            <FaCalendarAlt /> Joined
          </h2>
          {loader ? (
            <Skeleton className="w-[60px] h-[10px] rounded-[10px] bg-[#c1c1c1] dark:bg-[#2a2a2a]" />
          ) : (
            <p className="text-[#333333] dark:text-[#d9d9d9] text-sm">
              {user?.createdAt &&
                format(new Date(user?.createdAt), "dd MMM yyyy")}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <h2 className="flex items-center gap-2 text-[#333333] dark:text-[#d9d9d9] text-sm font-bold">
            <IoPeopleSharp /> Followers
          </h2>
          {loader ? (
            <Skeleton className="w-[60px] h-[10px] rounded-[10px] bg-[#c1c1c1] dark:bg-[#2a2a2a]" />
          ) : (
            <p className="text-[#333333] dark:text-[#d9d9d9] text-sm">
              {user?._count.following}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <h2 className="flex items-center gap-2 text-[#333333] dark:text-[#d9d9d9] text-sm font-bold">
            <BiSolidLike /> Likes
          </h2>
          {loader ? (
            <Skeleton className="w-[60px] h-[10px] rounded-[10px] bg-[#c1c1c1] dark:bg-[#2a2a2a]" />
          ) : (
            <p className="text-[#333333] dark:text-[#d9d9d9] text-sm">
              {user?.posts.reduce(
                (total, post) => total + post._count.likes,
                0
              )}
            </p>
          )}
        </div>
      </div>

      {session && session?.user.id !== idUserChat && (
        <Button
          loading={loaderButton}
          onClick={() => (postChat(session?.user.id, idUserChat, setCurrentChatId, setOpenMessager, setMenu, setSettings, setLoaderButton, queryClient))}
          variant="outline"
          className="bg-0 border-[#333333] dark:border-[#d9d9d9] hover:bg-[#333333] hover:dark:bg-[#d9d9d9] hover:text-[#e0e0e0] dark:hover:text-[#2a2a2a]"
        >
          <IoChatboxEllipsesOutline /> Chat
        </Button>
      )}
    </div>
  );
};
