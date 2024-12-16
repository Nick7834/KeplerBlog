'use client'
import React, { useEffect, useState } from 'react';
import { IPost, Post } from './post';
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

interface Props {
    className?: string;
} 

export const ForYouList: React.FC<Props> = ({ className }) => {

    const { data: session } = useSession();

    const [posts, setPosts] = useState<IPost[]>([]);
    const [loader, setLoader] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);

    const { setOpen } = useLogInStore();

    useEffect(() => {
        if(!session) {
            setLoader(false);
            return
        }

        const fetchPosts = async () => {
            setLoader(true);
            try {
                const response = await axios.get(`/api/forYou?page=${page}&limit=10`);
                const data = await response.data?.posts;
               
                if (!data || data.length === 0 ) {
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
            } finally {
                setLoader(false);
            }
        };
        fetchPosts();
    }, [page, session])

    return (
        <div className={cn("mt-[clamp(1.25rem,0.82rem+2.15vw,2.5rem)]", className)}>

            {!session && !loader ? 
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
                    next={() => setPage(page + 1)}
                    hasMore={hasMore}
                    loader={loader && Array.from({ length: 5 }).map((_, index) => <SkeletonPost key={index} />)}
                    className='flex flex-col items-center justify-center gap-5'
                >
                    {!loader && posts.length === 0 ? 
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
