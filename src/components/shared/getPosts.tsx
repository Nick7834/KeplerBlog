'use client'
import React, { useEffect, useState } from 'react';
import { SkeletonPost } from './skeletonPost';
import { IPost, Post } from './post';
import axios from 'axios';
import { cn } from '@/lib/utils';
import InfiniteScroll from 'react-infinite-scroll-component';

interface Props {
    className?: string;
} 

export const GetPosts: React.FC<Props> = ({ className }) => {

    const [posts, setPosts] = useState<IPost[]>([]);

    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);

    useEffect(() => {  
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`/api/posts?page=${page}&limit=10`);
                const data = await response.data.posts;

                if(!data || data.length === 0) {
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
    }, [page]);

    const loadMorePosts = () => {
        setPage((prevPage) => prevPage + 1);
    }

    return (
        <InfiniteScroll
            dataLength={posts.length}
            next={loadMorePosts}
            hasMore={hasMore}
            loader={Array.from({ length: 5 }).map((_, index) => <SkeletonPost key={index} />)}
            className={cn('w-full flex-1 flex flex-col items-center justify-center gap-5 mt-[clamp(1.25rem,0.82rem+2.15vw,2.5rem)]', className)}
        >   
            {posts.map((post) => (
                <Post key={post.id} post={post} />
            ))}
        </InfiniteScroll>
    );
};
