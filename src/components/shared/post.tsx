"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React, { memo, useEffect, useState } from "react";

import { usePathname, useRouter } from "next/navigation";
import { Button, SliderPost, ActionPanel } from ".";
import { convertFromRaw, RawDraftContentState } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import { useSession } from "next-auth/react";
import { MdCreate } from "react-icons/md";
import { FaRegUser } from "react-icons/fa6";
import { ModalPhoto } from "./post/modalPhoto";
import { FollowButton } from "./followButton";
import axios from "axios";
import { getShortTimeAgo } from "../hooks/useDate";
import { processContentDraft } from "@/lib/processContent";
import { ModalShare } from "./modalShare";
import { CheckProfile } from "./checkProfile";
import { IPost } from "@/@types/post";
import { FastAverageColor } from "fast-average-color";
import { hexToRgb } from "@/lib/hex";
import { UseDarkMode } from "../hooks/useDarkMode";
import { BsFillExclamationDiamondFill } from "react-icons/bs";

interface Props {
  className?: string;
  onClick?: () => void;
  post: IPost;
}

export const Post: React.FC<Props> = memo(({ className, onClick, post }) => {
  const fac = new FastAverageColor();

  const session = useSession();
  const { theme } = UseDarkMode();

  const [ban, setBan] = useState(false);

  const contentState = post?.content
    ? convertFromRaw(post?.content as RawDraftContentState)
    : "";
  const text = contentState ? contentState.getPlainText() : "";
  const html = contentState ? stateToHTML(contentState) : "";

  const commentContentText = processContentDraft(html, true);

  const timeAgo = getShortTimeAgo(new Date(post.createdAt));

  const [background, setBackground] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [photos, setPhotos] = useState<string[]>([]);

  const [showModalShare, setShowModalShare] = useState(false);
  const [idPostShare, setIdPostShare] = useState("");

  const [widthMob, setWidthMob] = useState(0);

  const router = useRouter();
  const pathname = usePathname();

  const handlePhotoClick = async (index: number, idPost: string) => {
    try {
      const resp = await axios.get(`/api/posts/${idPost}/photo`);
      setPhotos(resp.data.photos.image);
      setSlideIndex(index);
      setShowModal(!showModal);
    } catch (error) {
      console.warn(error);
    }
  };

  useEffect(() => {
    setWidthMob(window.innerWidth);
    const handleResize = () => setWidthMob(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getDominantColor = async (imageUrl: string) => {
    if (!imageUrl) return;
    try {
      const color = await fac.getColorAsync(imageUrl);
      setBackground(color.hex);
    } catch (error) {
      console.error("Error getting dominant color:", error);
    }
  };

  return (
    <>
      <div
        onClick={() =>
          pathname.startsWith("/post") ? null : router.push(`/post/${post?.id}`)
        }
        className={cn(
          `overflow-hidden relative max-w-[750px] w-full flex-1 p-3 cursor-pointer rounded-[12px] transition-all ease-in-out duration-300 hover:bg-[#d1d1d1]/60 hover:dark:bg-[#333333]/60`,
          className,
          post.isbanned && "pointer-events-none select-none"
        )}
        onMouseEnter={() => getDominantColor(post?.image?.[0] || "")}
        onMouseLeave={() => setBackground("")}
        style={{
          background: background
            ? `rgba(${hexToRgb(background)}, ${theme === "dark" ? 0.4 : 0.25})`
            : "",
        }}
      >
        <span
          className={cn(
            "absolute bottom-0 left-0 w-full mx-auto max-[650px]:w-[98%] max-[650px]:left-[1%] border-b-[1px] border-[#b0b0b0]/60 dark:border-[#333333]",
            pathname.startsWith("/post") ? "hidden" : ""
          )}
        ></span>

        {post.isbanned && (
          <div className="absolute top-0 left-0 w-full h-full flex justify-end bg-[rgba(206,206,206,0.5)] dark:bg-[rgba(96,96,96,0.5)] z-[500]">
            {post?.author?.id === session?.data?.user?.id && <>
              <Button
                onClick={(e) => (e.stopPropagation(), setBan(!ban))}
                className="w-10 h-10 flex-shrink-0 flex justify-center items-center pointer-events-auto select-auto bg-red-500 hover:bg-red-500 hover:dark:bg-red-500 text-white [&_svg]:size-[25px] m-2 p-0 rounded-full"
              >
                <BsFillExclamationDiamondFill />
              </Button>
              {ban && (
                <div className="absolute top-[50px] right-0 w-[300px] p-2 text-[#333333] dark:text-[#d9d9d9] rounded-[12px] bg-[#b2bbc8]/70 dark:bg-[#24272b]/80 backdrop-blur-[12px]">
                  <p>
                    <span className="font-semibold">Reason for blocking:</span>{" "}
                    {post.banReason}
                  </p>
                  <p className="mt-2 font-bold">
                    You can delete the post{" "}
                    <Link
                      href={`/edit/${post?.id}`}
                      className="text-sky-500 pointer-events-auto select-auto w-fit font-normal"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Go over
                    </Link>
                  </p>
                </div>
              )}
            </>}
          </div>
        )}

        <div className="flex gap-1 items-center justify-between">
          <Link
            onClick={(e) => e.stopPropagation()}
            href={`/profile/${post?.author?.id}`}
            className="flex items-center gap-3 w-fit"
          >
            <div>
              {post?.author?.profileImage ? (
                <Image
                  src={post?.author?.profileImage}
                  alt="avatar"
                  width={40}
                  height={40}
                  className="rounded-full min-w-[40px] h-[40px] object-cover"
                />
              ) : (
                <span className="flex flex-col items-center justify-center z-[1] overflow-hidden rounded-full min-w-[40px] h-[40px] bg-[#c7c7c7]">
                  <FaRegUser
                    size={20}
                    className="text-[#333333]"
                  />
                </span>
              )}
            </div>
            <div
              className={cn(
                "flex items-center text-[#333333] dark:text-[#d9d9d9] text-base font-semibold whitespace-pre-wrap",
                pathname.startsWith("/post") &&
                  post?.author?.username.length >= 14 &&
                  widthMob <= 450
                  ? "block text-[12px]"
                  : "flex"
              )}
            >
              <div className="flex items-center gap-[2px]">
                {pathname.startsWith("/post")
                  ? post?.author?.username
                  : post?.author?.username.length > 15 && widthMob <= 380
                  ? post?.author?.username.substring(0, 15).trim() + "..."
                  : post?.author?.username.trim()}
                <CheckProfile isverified={post?.author?.isverified} />
              </div>
              <span className="mx-2">·</span>
              <div className="text-[#797d7e] dark:text-[#e3e3e3] text-sm font-normal">
                {timeAgo}
              </div>
            </div>
          </Link>

          {post?.author?.id === session?.data?.user?.id ? (
            <Button
              onClick={(e) => (
                e.stopPropagation(), router.push(`/edit/${post?.id}`)
              )}
              className="relative p-0 min-h-7 min-w-7 h-fit text-xs rounded-full bg-[#d5d5d5] dark:bg-[#e0e0e0]/95 hover:bg-[#d5d5d5] hover:dark:bg-[#e0e0e0]/95"
            >
              <MdCreate
                size={10}
                className="text-[#333333] dark:text-[#333333]"
              />
            </Button>
          ) : (
            pathname.startsWith("/post") && (
              <div onClick={(e) => e.stopPropagation()}>
                <FollowButton
                  idUser={post?.author?.id}
                  isFollowUser={post?.isFollowing || false}
                />
              </div>
            )
          )}
        </div>

        <h2 className="mt-4 text-[#333333] dark:text-[#d9d9d9] text-lg font-bold whitespace-pre-wrap break-words">
          {post?.title}
        </h2>

        {text !== "" && (
          <div className="mt-2 text-[#333333] dark:text-[#d9d9d9] text-sm font-normal leading-6 break-words whitespace-normal">
            {!pathname.startsWith("/post") ? (
              text.length > 200 ? (
                text.substring(0, 200).trim() + "..."
              ) : (
                text.trim()
              )
            ) : (
              <div
                dangerouslySetInnerHTML={{ __html: commentContentText }}
              ></div>
            )}
          </div>
        )}

        {post?.image && post?.image.length > 0 && (
          <SliderPost
            photos={post?.image}
            onPhotoClick={handlePhotoClick}
            idPost={post?.id}
            between={10}
            className="mt-4"
          />
        )}

        <ActionPanel
          idPost={post?.id}
          count={post?._count}
          idUserPost={post?.author?.id}
          isLike={post?.isLiked}
          pathname={pathname}
          router={router}
          setShowModalShare={setShowModalShare}
          setIdPostShare={setIdPostShare}
          onClick={onClick}
        />

        {showModal && (
          <ModalPhoto
            photos={photos}
            slideIndex={slideIndex}
            showModal={showModal}
            setShowModal={setShowModal}
          />
        )}
      </div>
      {showModalShare && (
        <ModalShare
          idPost={idPostShare}
          showModalShare={showModalShare}
          setShowModalShare={setShowModalShare}
        />
      )}
    </>
  );
});

Post.displayName = "Post";
