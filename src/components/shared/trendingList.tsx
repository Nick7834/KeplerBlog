'use client'
import React from 'react';
import { Post } from './post';
import axios from 'axios';
import { SkeletonPost } from './skeletonPost';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { IPost } from '@/@types/post';

interface Props {
    className?: string;
} 

const fetchTrending = async () => {
    const response = await axios.get('/api/popular');
    return response.data.trendingPosts;
};

export const TrendingList: React.FC<Props> = ({ className }) => {

    const {
        data,
        isLoading,
    } = useQuery({
        queryKey: ['trending'],
        queryFn: fetchTrending,
        staleTime: 1000 * 60 * 5, 
        refetchOnWindowFocus: false,  
        refetchOnMount: false
    });

    return (
        <div className={cn("mt-[clamp(1.25rem,0.82rem+2.15vw,2.5rem)] flex flex-col items-center justify-center gap-5", className)}>
            {isLoading ? 
                Array.from({ length: 5 }, (_, index) => (
                   <SkeletonPost key={index} />
                ))
            :
                (data.map((post: IPost) => (
                    <Post key={post.id} post={post} />
                )))
            }

        </div>
    );
};

