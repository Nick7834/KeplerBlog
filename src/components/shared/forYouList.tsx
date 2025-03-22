'use client'
import React from 'react';
import { Post } from './post';
import axios from 'axios';
import { SkeletonPost } from './skeletonPost';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { FaUsers } from "react-icons/fa";
import { Button } from '../ui/button';
import { FaUser } from "react-icons/fa6";
import { useLogInStore } from '@/store/logIn';
import { BsPostcard } from "react-icons/bs";
import { useInfiniteQuery } from '@tanstack/react-query';

interface Props {
    className?: string;
} 

const fetchForYou = async ({ pageParam = 1 }) => {
    const response = await axios.get(`/api/forYou?page=${pageParam}&limit=10`);
    return response.data.posts;
};

export const ForYouList: React.FC<Props> = ({ className }) => {

    const { data: session } = useSession();

    const { setOpen } = useLogInStore();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey: ['forYou'],
        queryFn: fetchForYou,
        getNextPageParam: (lastPage, allPages) => (lastPage.length < 10 ? undefined : allPages.length + 1),
        initialPageParam: 1,
        enabled: !!session,
        staleTime: 1000 * 60 * 5, 
        refetchOnWindowFocus: false,  
        refetchOnMount: false
    });

    const posts = data?.pages.flat() || [];

    return (
        <div className={cn("mt-[clamp(1.25rem,0.82rem+2.15vw,2.5rem)]", className)}>

            {!session && !isLoading ? 
                <div className='flex flex-col items-center justify-center'>
                    <span className='text-[#333333] dark:text-[#d9d9d9] text-[clamp(5rem,3.968rem+5.16vw,8rem)]'><BsPostcard /></span>
                    <h2 className="mt-3 text-[#333333] dark:text-[#d9d9d9] text-3xl font-bold text-center">Log in to your account</h2>
                    <p className="mt-3 text-[#333333] dark:text-[#d9d9d9] text-base text-center">Here you will see posts from users you are subscribed to.</p>
                    <Button 
                    onClick={() => setOpen(true)}
                    className='mt-5 flex items-center gap-2 px-[30px] py-[12px] bg-[#333333] dark:bg-[#d9d9d9] hover:bg-[#333333]/85 dark:hover:bg-[#d9d9d9]/85'><FaUser /> Log in</Button>
                </div>    
                :
                <InfiniteScroll
                    dataLength={posts.length}
                    next={fetchNextPage}
                    hasMore={hasNextPage || false}
                    loader={Array.from({ length: 5 }).map((_, index) => <SkeletonPost key={index} />)}
                    className='flex flex-col items-center justify-center gap-5'
                >
                    {isLoading && Array.from({ length: 5 }).map((_, index) => <SkeletonPost key={index} />)}
                    {!isLoading && posts.length === 0 ? 
                        <div className="flex flex-col items-center justify-center gap-4">
                            <FaUsers size={85} className="text-[#333333] dark:text-[#d9d9d9]" />
                            <p className="text-[#333333] dark:text-[#d9d9d9] text-xl font-bold">You not signed up for anything.</p>
                        </div>
                        :
                        posts.map((post) => (
                            <Post key={post.id} post={post} />
                        ))
                    }
                </InfiniteScroll>
            }

        </div>
    );
};
