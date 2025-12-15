"use client";
import React, { useRef } from "react";
import { Post } from "./post";
import { Comments } from "./comments/comments";
import { cn } from "@/lib/utils";
import axios from "axios";
import { redirect } from "next/navigation";
import { SkeletonPost } from "./skeletonPost";
import { SkeletonComment } from "./skeletonComment";
import { useQuery } from "@tanstack/react-query";

interface Props {
  className?: string;
  idPost: string;
}

const fetchPost = async (idPost: string) => {
  const response = await axios.get(`/api/posts/${idPost}/detailPost`);
  return response.data.postWithLikedStatus;
};

export const PostDetails: React.FC<Props> = ({ className, idPost }) => {
  const commetsRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["post", idPost],
    queryFn: () => fetchPost(idPost),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    refetchOnMount: false,
  });

  const scrollToSection = () => {
    if (commetsRef.current) {
      commetsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!isLoading && !data) {
    redirect("/");
  }

  return (
    <div
      className={cn(
        "mt-[clamp(1.875rem,1.445rem+2.15vw,3.125rem)] pb-[30px] mx-auto flex flex-col justify-center items-center",
        className
      )}
    >
      <div className="w-full flex flex-col justify-center items-center mx-[clamp(0.938rem,calc(-15.104rem+23.33vw),3.125rem)] max-[650px]:mx-0">
        {isLoading && <SkeletonPost />}
        {!isLoading && data && (
          <Post
            onClick={scrollToSection}
            className="cursor-auto"
            post={data}
          />
        )}
      </div>

      {isLoading ? (
        <SkeletonComment className="w-full mt-[40px] mx-[clamp(0.938rem,calc(-15.104rem+23.33vw),3.125rem)] 
        max-[1000px]:px-[clamp(0.938rem,calc(-15.104rem+23.33vw),3.125rem)] max-[1000px]:mx-0" />
      ) : (
        <div className="block w-full mx-auto px-[clamp(0.938rem,calc(-15.104rem+23.33vw),3.125rem)]">
          <Comments
            ref={commetsRef}
            post={data}
            className="scroll-mt-[100px] w-full mx-auto"
          />
        </div>
      )}
    </div>
  );
};
