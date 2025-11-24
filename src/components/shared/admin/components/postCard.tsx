"use client";
import { QueryClient } from "@tanstack/react-query";
import Link from "next/link";
import React, { useState } from "react";
import { FaRegUser } from "react-icons/fa6";
import Image from "next/image";
import { CheckProfile } from "../../checkProfile";
import { cn } from "@/lib/utils";
import { Button } from "../..";
import { LuUserRoundX } from "react-icons/lu";
import { RiQuestionLine } from "react-icons/ri";
import { updateBan } from "../api/updateBan";
import { ModalBan } from "./modalBan";

interface Props {
  className?: string;
  post: {
    id: string;
    title: string;
    image?: string[];
    createdAt: Date;
    updatedAt: Date;
    isbanned: boolean;
    banReason: string;
    authorId: string;
    author: {
      username: string;
      profileImage: string;
      isverified: boolean;
      isbanned: boolean;
    };
  };
  queryClient: QueryClient;
}

export const PostCard: React.FC<Props> = ({ className, post, queryClient }) => {
  const [openModalBan, setOpenModalBan] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ban, setBan] = useState(false);

  const handleBanPost = async () => {
    if (post.isbanned) {
      const confirm = window.confirm(
        "Are you sure you want to unblock this post?"
      );

      if (!confirm) return;

      setIsLoading(true);
      try {
        await updateBan(post.id, post.banReason, queryClient, "post");
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
      className={cn(
        "flex flex-col h-[450px] overflow-auto scrollbar bg-neutral-300/75 dark:bg-neutral-800/35 rounded-[12px] border border-solid border-neutral-400/25 dark:border-neutral-800/85 p-3 hover:translate-y-[-5px] transition-all",
        className
      )}
    >
      <div className="flex">
        <Link
          href={`/profile/${post.id}`}
          className="flex items-center gap-5 w-fit"
        >
          {post.author.profileImage ? (
            <Image
              src={post?.author.profileImage}
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
            {post.author.username}
            <CheckProfile
              isverified={post.author.isverified || false}
              styleCheck="group-hover:top-[-17px]"
            />
          </h2>
        </Link>
        {post.author.isbanned && (
          <p className="text-red-500 font-medium flex items-center gap-2 ml-auto">
            <LuUserRoundX title="User is banned" />
          </p>
        )}
      </div>

      <ul className="mt-5 flex flex-col gap-5">
        <li className="text-[#333333] dark:text-[#d9d9d9] font-medium grid items-center grid-cols-2 gap-2">
          <span className="font-bold">Title:</span>
          {post.title.length > 50
            ? `${post.title.slice(0, 50).trim()}...`
            : post.title}
        </li>

        <li className="text-[#333333] dark:text-[#d9d9d9] font-medium grid items-center grid-cols-2 gap-2">
          <span className="font-bold">Image:</span>
          <div className="flex flex-wrap gap-2">
            {post.image && post.image?.length > 0 ? (
              post.image?.map((image, index) => (
                <Image
                  key={index}
                  src={image}
                  alt="profile"
                  width={60}
                  height={60}
                  loading="lazy"
                  className="block w-[60px] h-[60px] flex-shrink-0 object-cover overflow-hidden rounded-[5px]"
                />
              ))
            ) : (
              <div className="capitalize">No image</div>
            )}
          </div>
        </li>

        <li className="text-[#333333] dark:text-[#d9d9d9] font-medium grid items-center grid-cols-2 gap-2">
          <span className="font-bold">Link:</span>
          <Link
            href={`/post/${post.id}`}
            className="text-sky-500"
          >
            View Post
          </Link>
        </li>

        <li className="text-[#333333] dark:text-[#d9d9d9] font-medium grid items-center grid-cols-2 gap-2">
          <span className="font-bold">Status:</span>
          <span
            className={cn(
              "font-bold",
              post.isbanned ? "text-red-500" : "text-green-500"
            )}
          >
            <div className="relative flex items-center gap-2">
              {post.isbanned ? "Banned" : "Active"}
              {post.banReason && (
                <RiQuestionLine
                  title={post.banReason}
                  onClick={() => setBan(!ban)}
                  className="cursor-pointer"
                />
              )}
              {ban && (
                <p className="absolute top-[25px] bg-[#c5c9d1] dark:bg-[#b2bebe] text-[#333333] dark:text-[#333333] text-[14px] px-2 py-1 rounded-md">
                  {post.banReason}
                </p>
              )}
            </div>
          </span>
        </li>

        <li className="text-[#333333] dark:text-[#d9d9d9] font-medium grid items-center grid-cols-2 gap-2">
          <span className="font-bold">Created At:</span>
          {new Date(post.createdAt).toLocaleDateString()}
        </li>

        <li className="text-[#333333] dark:text-[#d9d9d9] font-medium grid items-center grid-cols-2 gap-2">
          <span className="font-bold">Actions:</span>
          <Button
            className="w-fit px-10 max-[750px]:w-full mt-2 bg-[#333333] hover:bg-[#333333] text-[#d9d9d9] dark:bg-[#d9d9d9] dark:hover:bg-[#d9d9d9] dark:text-[#333333]"
            onClick={handleBanPost}
            loading={isLoading}
          >
            {post.isbanned ? "Unban" : "Ban"}
          </Button>
        </li>
      </ul>

      <ModalBan
        open={openModalBan}
        handleClose={() => setOpenModalBan(!openModalBan)}
        id={post.id}
        queryClient={queryClient}
        category="post"
      />
    </div>
  );
};
