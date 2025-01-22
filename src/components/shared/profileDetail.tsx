'use client'
import { cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react';
import { ProfileBlock } from './profileBlock';
import axios from 'axios';
import { ProfileTop } from './profileTop';
import { redirect } from 'next/navigation';
import { SkeletonProfileTop } from './skeletonProfileTop';
import { IPost, Post } from './post';
import InfiniteScroll from 'react-infinite-scroll-component';
import { SkeletonPost } from './skeletonPost';
import { BsPostcard } from "react-icons/bs";

interface Props {
    className?: string;
    idUser: string
}

export const ProfileDetail: React.FC<Props> = ({ className, idUser }) => {

   const [user, setUser] = useState(null);
   const [isLoading, setIsLoading] = useState(true);
   const [page, setPage] = useState(1);
   const [hasMore, setHasMore] = useState(true);
   const [posts, setPosts] = useState<IPost[]>([]);

    useEffect(() => {
        const fetchUserData = async () => {
            setIsLoading(true);
            try {
                const { data } = await axios.get(`/api/user/${idUser}`);
                setUser(data);
            } catch (error) {
                console.error('Request failed:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserData();
    }, [idUser]);

    useEffect(() => {  
        const controller = new AbortController();

        const fetchPosts = async () => {
            try {
                const response = await axios.get(`/api/posts?page=${page}&limit=10&userId=${idUser}`, {
                    signal: controller.signal,
                });
                const data = await response.data.posts;

                if(data.length === 0) {
                    setHasMore(false);
                } else {
                    setPosts((prevPosts) => {
                        const newPosts = data.filter((post: { id: string; }) => !prevPosts.some(p => p.id === post.id));
                        return [...prevPosts, ...newPosts];
                    });

                    if (data.length < 10) setHasMore(false);
                }
            } catch (error) {
                console.error('Request failed:', error);
            }
        };
        fetchPosts();
    }, [idUser, page]);

    const loadMorePosts = () => {
        setPage((prevPage) => prevPage + 1);
    }

    if(!isLoading && !user) {
        redirect('/');
    }

    return (
        <div className={cn("flex flex-col items-center justify-center mt-[50px] mx-[15px] mb-[30px]", className)}>
     
        {isLoading ? (
            <SkeletonProfileTop />
        ) : (
           user && <ProfileTop user={user} />
        )}

        <div className="profile-detail max-w-[1250px] mt-[clamp(1.875rem,1.287rem+2.35vw,3.125rem)] grid grid-cols-[2fr_1fr] gap-5 w-full">

            <div className='posts-profile'>
              <div className='w-full'>
                <h2 className="title-posts text-[#333333] dark:text-[#d9d9d9] text-2xl font-bold">Publications</h2>

                <InfiniteScroll
                    dataLength={posts.length}
                    next={loadMorePosts}
                    hasMore={hasMore}
                    loader={isLoading && Array.from({ length: 5 }).map((_, index) => <SkeletonPost key={index} />)}
                    className={cn('w-full flex-1 flex flex-col justify-center gap-5', className)}
                    >   
                    {!isLoading && posts.length === 0 ?
                        <div className="flex flex-col items-center justify-center gap-2 text-[#333333] dark:text-[#d9d9d9] text-xl font-bold"><BsPostcard size={60} />No publications</div>
                        :
                        posts.map((post) => (
                            <Post key={post.id} post={post} />
                        ))
                    }
                </InfiniteScroll>

              </div>

            </div>

            <ProfileBlock user={user} loader={isLoading} />
            
        </div>
  
    </div>
    );
};
