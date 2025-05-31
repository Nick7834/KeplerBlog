"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { ProfileBlock } from "./profileBlock";
import axios from "axios";
import { ProfileTop } from "./profileTop";
import { redirect } from "next/navigation";
import { SkeletonProfileTop } from "./skeletonProfileTop";
import { Post } from "./post";
import { SkeletonPost } from "./skeletonPost";
import { BsPostcard } from "react-icons/bs";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { Virtuoso } from "react-virtuoso";

interface Props {
  className?: string;
  idUser: string;
}

const fetchUser = async (id: string) => {
  const response = await axios.get(`/api/user/${id}`);
  return response.data;
};

const fetchPosts = async ({ pageParam = 1 }, idUser: string) => {
  const response = await axios.get(
    `/api/posts?page=${pageParam}&limit=10&userId=${idUser}`
  );
  return response.data.posts;
};

export const ProfileDetail: React.FC<Props> = ({ className, idUser }) => {

  const { data: user, isLoading: loaderProfile } = useQuery({
    queryKey: ["user", idUser],
    queryFn: () => fetchUser(idUser),
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["postsUser", idUser],
      queryFn: ({ pageParam = 1 }) => fetchPosts({ pageParam }, idUser),
      getNextPageParam: (lastPage, allPages) =>
        lastPage.length < 10 ? undefined : allPages.length + 1,
      initialPageParam: 1,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    });

  const posts = data?.pages.flat() || [];

  if (!loaderProfile && !user) {
    redirect("/");
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center mt-[50px] mx-[15px] pb-[30px]",
        className
      )}
    >
      <Head>
        <title>{user?.name} - KeplerBlog</title>
        <meta
          name="description"
          content={`Profile ${user?.name} - KeplerBlog`}
        />
        <script type="application/ld+json">
          {`
        {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "${user?.name}",
            "url": "https://kepler-blog.vercel.app/user/${user?.id}",
        }
        `}
        </script>
      </Head>

      {loaderProfile ? (
        <SkeletonProfileTop />
      ) : (
        user && <ProfileTop user={user} />
      )}

      <div className="profile-detail max-w-[clamp(65.625rem,22.569rem+44.44vw,78.125rem)] mt-[clamp(1.875rem,1.287rem+2.35vw,3.125rem)] grid grid-cols-[2fr_1fr] gap-5 w-full">
        <div className="posts-profile">
          <div className="w-full">
            <h2 className="title-posts text-[#333333] dark:text-[#d9d9d9] text-2xl font-bold">
              Publications
            </h2>
            <div className="mt-[20px] w-full">
              {isLoading ? (
                <div className="flex flex-col gap-5 mt-5">
                  <SkeletonPost />
                  <SkeletonPost />
                </div>
              ) : (
                <Virtuoso
                  style={{
                    width: "100%",
                    height: posts.length > 0 ? "100vh" : "auto",
                  }}
                  data={posts}
                  useWindowScroll
                  overscan={5}
                  initialItemCount={posts.length - 1}
                  endReached={() => {
                    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
                  }}
                  components={{
                    Footer: () =>
                      isFetchingNextPage ? (
                        <div className="flex flex-col gap-5 pt-5">
                          <SkeletonPost />
                          <SkeletonPost />
                        </div>
                      ) : null,
                    EmptyPlaceholder: () =>
                      !isLoading && posts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-2 text-[#333333] dark:text-[#d9d9d9] text-xl font-bold mt-10">
                          <BsPostcard size={60} />
                          No publications
                        </div>
                      ) : null,
                  }}
                  itemContent={(index, post) => (
                    <div className={index > 0 ? "pt-5" : ""}>
                      <Post key={post.id} post={post} />
                    </div>
                  )}
                />
              )}
            </div>
          </div>
        </div>

        <ProfileBlock user={user} loader={loaderProfile} />
      </div>
    </div>
  );
};
