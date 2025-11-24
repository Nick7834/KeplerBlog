import Link from "next/link";
import React, { useState } from "react";
import { FaRegUser } from "react-icons/fa6";
import Image from "next/image";
import { CheckProfile } from "../../checkProfile";
import { Button } from "../..";
import { User } from "@prisma/client";
import { cn } from "@/lib/utils";
import { ModalBan } from "./modalBan";
import { updateBan } from "../api/updateBan";
import { QueryClient } from "@tanstack/react-query";
import { RiQuestionLine } from "react-icons/ri";

interface Props {
  className?: string;
  user: User;
  queryClient: QueryClient;
}

export const UserCard: React.FC<Props> = ({ className, user, queryClient }) => {
  const [openModalBan, setOpenModalBan] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ban, setBan] = useState(false);

  const handleBanUser = async () => {
    if (user.isbanned) {
      const confirm = window.confirm(
        "Are you sure you want to unblock this user?"
      );

      if (!confirm) return;

      setIsLoading(true);
      try {
        await updateBan(user.id, user.banReason, queryClient, "user");
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    } else {
      setOpenModalBan(!openModalBan);
    }
  };

  return (
    <div
      key={user.id}
      className={cn(
        "flex flex-col h-[300px] overflow-auto scrollbar bg-neutral-300/75 dark:bg-neutral-800/35 rounded-[12px] border border-solid border-neutral-400/25 dark:border-neutral-800/85 p-3 hover:translate-y-[-5px] transition-all",
        className
      )}
    >
      <Link
        href={`/profile/${user.id}`}
        className="flex items-center gap-5 w-fit"
      >
        {user?.profileImage ? (
          <Image
            src={user?.profileImage}
            alt="profile"
            width={48}
            height={48}
            className="block w-[48px] h-[48px] flex-shrink-0 object-cover overflow-hidden rounded-full"
          />
        ) : (
          <span className="flex flex-col items-center justify-center object-cover rounded-full w-[48px] h-[48px] flex-shrink-0 bg-[#c7c7c7]">
            <FaRegUser className="text-[#333333]" />
          </span>
        )}
        <h2 className="text-[#333333] dark:text-[#d9d9d9] font-medium flex items-center gap-2">
          {user.username}
          <CheckProfile
            isverified={user.isverified || false}
            styleCheck="group-hover:top-[-17px]"
          />
        </h2>
      </Link>
      <div className="mt-5 flex flex-col gap-2">
        <div className="break-words text-[#333333] dark:text-[#d9d9d9] font-medium grid items-center grid-cols-2 gap-2">
          <span className="font-bold">Email:</span> {user.email}
        </div>
        <div className="capitalize text-[#333333] dark:text-[#d9d9d9] font-medium grid items-center grid-cols-2 gap-2">
          <span className="font-bold">Role:</span> {user.role}
        </div>
        <div className="text-[#333333] dark:text-[#d9d9d9] font-medium grid items-center grid-cols-2 gap-2">
          <span className="font-bold">Status:</span>
          <span
            className={cn(
              "font-bold",
              user.isbanned ? "text-red-500" : "text-green-500"
            )}
          >
            <div className="relative flex items-center gap-2">
              {user.isbanned ? "Banned" : "Active"}
              {user.banReason && (
                <RiQuestionLine
                  title={user.banReason}
                  onClick={() => setBan(!ban)}
                  className="cursor-pointer"
                />
              )}
              {ban && (
                <p className="absolute top-[25px] bg-[#c5c9d1] dark:bg-[#b2bebe] text-[#333333] dark:text-[#333333] text-[14px] px-2 py-1 rounded-md">
                  {user.banReason}
                </p>
              )}
            </div>
          </span>
        </div>
        {user.role !== "admin" && (
          <div className="flex flex-col">
            <span className="font-bold">Actions:</span>
            <Button
              className="w-fit px-10 max-[750px]:w-full mt-2 bg-[#333333] hover:bg-[#333333] text-[#d9d9d9] dark:bg-[#d9d9d9] dark:hover:bg-[#d9d9d9] dark:text-[#333333]"
              onClick={handleBanUser}
              loading={isLoading}
            >
              {user.isbanned ? "Unban" : "Ban"}
            </Button>
          </div>
        )}
      </div>

      <ModalBan
        open={openModalBan}
        handleClose={() => setOpenModalBan(!openModalBan)}
        userName={user.username}
        id={user.id}
        queryClient={queryClient}
        category="user"
      />
    </div>
  );
};
