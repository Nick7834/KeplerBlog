'use client'
import React from 'react';
import { SkeletonPost } from './skeletonPost';
import { Post } from './post';
import axios from 'axios';
import { cn } from '@/lib/utils';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useInfiniteQuery } from '@tanstack/react-query';

interface Props {
    className?: string;
} 

const fetchPosts = async ({ pageParam = 1 }) => {
    const response = await axios.get(`/api/posts?page=${pageParam}&limit=10`);
    return response.data.posts;
};

export const GetPosts: React.FC<Props> = ({ className }) => {

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isError,
    } = useInfiniteQuery({
        queryKey: ['posts'],
        queryFn: fetchPosts,
        getNextPageParam: (lastPage, allPages) => (lastPage.length < 10 ? undefined : allPages.length + 1),
        initialPageParam: 1,
        staleTime: 1000 * 60 * 5, 
        refetchOnWindowFocus: false,  
        refetchOnMount: false
    });

    const posts = data?.pages.flat() || [];

    return (
        <InfiniteScroll
            dataLength={posts.length}
            next={fetchNextPage}
            hasMore={hasNextPage || false}
            loader={Array.from({ length: 5 }).map((_, index) => <SkeletonPost key={index} />)}
            className={cn(
                'w-full flex-1 flex flex-col items-center justify-center gap-5 mt-[clamp(1.25rem,0.82rem+2.15vw,2.5rem)]',
                className
            )}
        >
            {isLoading && Array.from({ length: 5 }).map((_, index) => <SkeletonPost key={index} />)}

            {isError && <p className="text-red-500">Something went wrong</p>}

            {posts.map((post) => (
                <Post key={post.id} post={post} />
            ))}
        </InfiniteScroll>
    );
};
