'use client'
import { UseFormatNumber } from '@/components/hooks/useFormatNumber';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useLogInStore } from '@/store/logIn';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BiSolidLike } from "react-icons/bi";

import { BiLike } from "react-icons/bi";
import { FaRegCommentDots } from "react-icons/fa6";

interface Props {
    className?: string;
    count: {
        likes: number;
        comments: number
    }
    pathname: string,
    router: AppRouterInstance
    onClick?: () => void
    idPost: string
} 

export const ActionPanel: React.FC<Props> = ({ className, count, pathname, router, idPost, onClick }) => {

    const { data: session } = useSession();

    const [likes, setLikes] = useState(count.likes);
    const [liked, setLiked] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const formattedCountLike = UseFormatNumber(Number(likes));
    const formattedCountComment = UseFormatNumber(Number(count?.comments));

    const [statusFetched, setStatusFetched] = useState(false);

     const { setOpen } = useLogInStore();

    const handleCommentClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (pathname.startsWith('/post') && onClick) {
            onClick();
        } else {
            router.push(`/post/${idPost}`);
        }
    };

    useEffect(() => {

        if (!session || statusFetched) {
            setIsLoading(false);
            return
        }

        const likeStatus = async () => {
            try {
                setIsLoading(true);
                const { data } = await axios.get(`/api/posts/${idPost}/status`);
                setLiked(data.liked);
                setStatusFetched(true);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }

        likeStatus();

    }, [idPost, session, statusFetched]);

    const handleLikeClick = async (postId: string) => {

        if(!session) {
            setOpen(true);
            return
        }

        if(liked) {
            setLikes(likes - 1);
            setLiked(false);
       } else {
            setLikes(likes + 1);
            setLiked(true);
       }

        try {

            await axios.post(`/api/posts/${postId}/like`);

        } catch(error) {
            console.error(error);
            toast.error('Something went wrong');
        }

    };


    return (
        <div className={cn('mt-4 flex items-center gap-5', className)}>
           {isLoading ? <Skeleton className='w-[52px] h-[36px] bg-[#c1c1c1] dark:bg-[#2a2a2a] rounded-full' /> :
                <button onClick={(e) => (e.stopPropagation(), handleLikeClick(idPost))} className={cn('flex items-center gap-2 bg-neutral-300/75 dark:bg-neutral-700/75 p-2 rounded-full', liked && 'bg-[#7391d5] dark:bg-[#7391d5]')}>
                    <div className={cn('block', liked && 'text-[#d9d9d9] dark:text-[#d9d9d9]')}>{liked ? <BiSolidLike size={20} /> : <BiLike size={20} />}</div>
                    <span className={cn('block h-[19px] text-[#333333] dark:text-[#d9d9d9] text-sm font-semibold leading-1', liked && 'text-[#d9d9d9] dark:text-[#d9d9d9]')}>{formattedCountLike}</span>
                </button>
           }

            <button onClick={handleCommentClick} className="flex items-center gap-2 bg-neutral-300/75 dark:bg-neutral-700/75 p-2 rounded-full">
                <div className='block'><FaRegCommentDots size={20} /></div>
                <span className='block h-[19px] text-[#333333] dark:text-[#d9d9d9] text-sm font-semibold leading-1'>{formattedCountComment}</span>
            </button>
        </div>
    );
};