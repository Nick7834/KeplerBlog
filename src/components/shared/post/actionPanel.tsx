"use client";
import { UseFormatNumber } from "@/components/hooks/useFormatNumber";
import { Button } from "@/components/ui/button";
import Counter from "@/components/ui/Counter";
import { updatePost, updateQueryData } from "@/lib/updateQueryData";
import { cn } from "@/lib/utils";
import { useLogInStore } from "@/store/logIn";
import { useStatusLike } from "@/store/status";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import React, { memo, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { BiSolidLike } from "react-icons/bi";

import { BiLike } from "react-icons/bi";
import { FaRegCommentDots } from "react-icons/fa6";
import { PiShareFat } from "react-icons/pi";

interface Props {
  className?: string;
  count: {
    likes: number;
    comments: number;
  };
  pathname: string;
  router: AppRouterInstance;
  onClick?: () => void;
  setShowModalShare?: React.Dispatch<React.SetStateAction<boolean>>;
  setIdPostShare?: React.Dispatch<React.SetStateAction<string>>;
  idPost: string;
  idUserPost: string;
  isLike: boolean;
}

export const ActionPanel: React.FC<Props> = memo(
  ({
    className,
    count,
    pathname,
    router,
    idPost,
    idUserPost,
    isLike,
    setShowModalShare,
    setIdPostShare,
    onClick,
  }) => {
    const { data: session } = useSession();
    const [liked, setLiked] = useState(isLike || false);
    const [likes, setLikes] = useState(count.likes);
    const formattedCountLike = useMemo(
      () => UseFormatNumber(Number(likes)),
      [likes]
    );
    const formattedCountComment = useMemo(
      () => UseFormatNumber(Number(count?.comments)),
      [count?.comments]
    );
    const { setOpen } = useLogInStore();

    const { setStatusLike, statusLike } = useStatusLike();

    const queryClient = useQueryClient();

    useEffect(() => {
      setLiked(isLike || false);
    }, [isLike, session]);

    useEffect(() => {
      if (!statusLike) {
        return;
      }
  
      const likeStatus = async () => {
        try {
          const { data } = await axios.get(`/api/posts/${idPost}/status`);
          setLiked(data.liked);
          setStatusLike(false);
        } catch (error) {
          console.error(error);
        }
      };
  
      likeStatus();
    }, [idPost, setStatusLike, statusLike]);

    const likeMutation = useMutation({
      mutationFn: async () => {
        await axios.post(`/api/posts/${idPost}/like`);
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    });

    const handleLikeClick = async () => {
      if (!session) {
        setOpen(true);
        return;
      }

      const newLiked = !liked;
      setLiked(newLiked);
      setLikes((prev) => prev + (newLiked ? 1 : -1));

      likeMutation.mutate(undefined, {
        onSettled: () => {
          updatePost(queryClient, "post", idPost, newLiked);

          ["posts", "trending", "forYou", "postsUser"].forEach((key) => {
            updateQueryData(queryClient, key, idPost, idUserPost, newLiked);
          });
        },
      });
    };

    const handleCommentClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (pathname.startsWith("/post") && onClick) {
        onClick();
      } else {
        router.push(`/post/${idPost}`);
      }
    };

    const handleShareClick = (idPost: string) => {
      const postUrl = `${window.location.origin}/post/${idPost}`;
      if (setShowModalShare && setIdPostShare) {
        setShowModalShare(true);
        setIdPostShare(postUrl);
      }
    };

    return (
      <div className={cn("mt-4 flex items-center gap-5", className)}>
        <Button
          onClick={(e) => (e.stopPropagation(), handleLikeClick())}
          // disabled={isLoading}
          className={cn(
            "flex items-center gap-2 bg-neutral-300/50 dark:bg-neutral-700/50 backdrop-blur-xl p-2 rounded-full h-fit hover:bg-color",
            liked && "bg-[#7391d5] dark:bg-[#7391d5]"
          )}
        >
          <div
            className={cn(
              "block [&_svg]:size-[20px] text-[#333333] dark:text-[#d9d9d9]",
              liked && "text-[#d9d9d9] dark:text-[#d9d9d9] [&_svg]:size-[20px]"
            )}
          >
            {liked ? <BiSolidLike size={20} /> : <BiLike size={20} />}
          </div>
          <span
            className={cn(
              "flex items-center justify-center h-[19px] text-[#333333] dark:text-[#d9d9d9] text-sm font-semibold leading-1",
              liked && "text-[#d9d9d9] dark:text-[#d9d9d9]"
            )}
          >
            {likes >= 1000 ? (
              formattedCountLike
            ) : (
              <Counter
                value={Number(formattedCountLike)}
                fontSize={18}
                gap={0}
                textColor="inherit"
                gradientHeight={0}
                places={Array.from(
                  { length: String(formattedCountLike).length },
                  (_, i) => Math.pow(10, i)
                ).reverse()}
                containerStyle={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "transparent",
                  padding: 0,
                  width: "fit-content",
                  height: "19px",
                }}
                counterStyle={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  lineHeight: "20px",
                  fontWeight: "600",
                  width: "fit-content",
                  padding: 0,
                  height: "19px",
                }}
                digitStyle={{
                  height: "19px",
                  top: "1px",
                  transition: "height 0.6s ease-in-out, top 0.6s ease-in-out",
                }}
                topGradientStyle={{ display: "none" }}
                bottomGradientStyle={{ display: "none" }}
              />
            )}
          </span>
        </Button>

        <Button
          onClick={handleCommentClick}
          className="flex items-center gap-2 bg-neutral-300/50 dark:bg-neutral-700/50 backdrop-blur-xl p-2 rounded-full h-fit hover:bg-color"
        >
          <div className="block [&_svg]:size-[20px] text-[#333333] dark:text-[#d9d9d9]">
            <FaRegCommentDots size={20} />
          </div>
          <span className="block h-[19px] text-[#333333] dark:text-[#d9d9d9] text-sm font-semibold leading-1">
            {formattedCountComment}
          </span>
        </Button>

        <Button
          onClick={(e) => (e.stopPropagation(), handleShareClick(idPost))}
          className="flex items-center gap-2 bg-neutral-300/50 backdrop-blur-xl dark:bg-neutral-700/50 p-2 rounded-full h-fit hover:bg-color"
        >
          <div className="block [&_svg]:size-[20px] text-[#333333] dark:text-[#d9d9d9]">
            <PiShareFat size={20} />
          </div>
          <span className="block h-[19px] text-[#333333] dark:text-[#d9d9d9] text-sm font-semibold leading-1">
            Share
          </span>
        </Button>
      </div>
    );
  }
);

ActionPanel.displayName = "ActionPanel";
