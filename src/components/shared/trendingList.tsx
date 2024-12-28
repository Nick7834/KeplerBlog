'use client'
import React, { useEffect, useState } from 'react';
import { IPost, Post } from './post';
import axios from 'axios';
import { SkeletonPost } from './skeletonPost';
import { cn } from '@/lib/utils';

interface Props {
    className?: string;
} 

export const TrendingList: React.FC<Props> = ({ className }) => {

    const [posts, setPosts] = useState<IPost[]>([]);
    const [loader, setLoader] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoader(true);
            try {
                const response = await axios.get('/api/popular');
                const data = await response.data.trendingPosts;
                setPosts(data);
            } catch (error) {
                console.error('Request failed:', error);
            } finally {
                setLoader(false);
            }
        };
        fetchPosts();
    }, []);

    return (
        <div className={cn("mt-[clamp(1.25rem,0.82rem+2.15vw,2.5rem)] flex flex-col items-center justify-center gap-5", className)}>
            {loader ? 
                Array.from({ length: 5 }, (_, index) => (
                   <SkeletonPost key={index} />
                ))
            :
                (posts.map((post) => (
                    <Post key={post.id} post={post} />
                )))
            }

        </div>
    );
};

