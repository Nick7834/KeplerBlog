'use client'
import { UseFormatNumber } from '@/components/hooks/useFormatNumber';
import { Button } from '@/components/ui/button';
import Counter from '@/components/ui/Counter';
import { cn } from '@/lib/utils';
import { useLogInStore } from '@/store/logIn';
import { useStatusLike } from '@/store/status';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BiSolidLike } from "react-icons/bi";

import { BiLike } from "react-icons/bi";
import { FaRegCommentDots } from "react-icons/fa6";
import { PiShareFat } from "react-icons/pi";

interface Props {
    className?: string;
    count: {
        likes: number;
        comments: number
    }
    pathname: string,
    router: AppRouterInstance
    isLiked?: boolean
    onClick?: () => void
    setShowModalShare?: React.Dispatch<React.SetStateAction<boolean>>
    setIdPostShare?: React.Dispatch<React.SetStateAction<string>>
    idPost: string
} 

export const ActionPanel: React.FC<Props> = (
    { 
        className, 
        count, 
        pathname, 
        router, 
        idPost, 
        isLiked, 
        setShowModalShare,
        setIdPostShare,
        onClick 
    }) => {

    const { data: session } = useSession();
    const [likes, setLikes] = useState(count.likes);
    const [liked, setLiked] = useState<boolean>(isLiked || false);
    const { setStatusLike, statusLike } = useStatusLike();
    const formattedCountLike = UseFormatNumber(Number(likes));
    const formattedCountComment = UseFormatNumber(Number(count?.comments));
    const [loading, setLoading] = useState(false);
    const { setOpen } = useLogInStore();

    useEffect(() => {
        setLiked(isLiked || false);
    }, [isLiked, session]);

    useEffect(() => {

        if (!statusLike) {
            return
        }

        const likeStatus = async () => {
            try {
                const { data } = await axios.get(`/api/posts/${idPost}/status`);
                setLiked(data.liked);
                setStatusLike(false);
            } catch (error) {
                console.error(error);
            }
        }

        likeStatus();

    }, [setStatusLike, statusLike]);

    const handleCommentClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (pathname.startsWith('/post') && onClick) {
            onClick();
        } else {
            router.push(`/post/${idPost}`);
        }
    };
  
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

        if (loading) return;

        setLoading(true);

        try {

            await axios.post(`/api/posts/${postId}/like`);

        } catch(error) {
            console.error(error);
            toast.error('Something went wrong');
        } finally {
            setLoading(false); 
        }

    };

    const handleShareClick = (idPost: string) => {
        const postUrl = `${window.location.origin}/post/${idPost}`;
        if (setShowModalShare && setIdPostShare) {
            setShowModalShare(true);
            setIdPostShare(postUrl);
        }
    }

    return (
        <div className={cn('mt-4 flex items-center gap-5', className)}>
            <Button onClick={(e) => (e.stopPropagation(), handleLikeClick(idPost))} className={cn('flex items-center gap-2 bg-neutral-300/75 dark:bg-neutral-700/75 p-2 rounded-full h-fit hover:bg-color', liked && 'bg-[#7391d5] dark:bg-[#7391d5]')}>
                <div className={cn('block [&_svg]:size-[20px] text-[#333333] dark:text-[#d9d9d9]', liked && 'text-[#d9d9d9] dark:text-[#d9d9d9] [&_svg]:size-[20px]')}>{liked ? <BiSolidLike size={20} /> : <BiLike size={20} />}</div>
                <span className={cn('flex items-center justify-center h-[19px] text-[#333333] dark:text-[#d9d9d9] text-sm font-semibold leading-1', liked && 'text-[#d9d9d9] dark:text-[#d9d9d9]')}>
                        {likes >= 1000 ? 
                             formattedCountLike
                        :
                        <Counter
                            value={Number(formattedCountLike)}
                            fontSize={18}
                            gap={0}
                            textColor="inherit"
                            gradientHeight={0}
                            places={Array.from({ length: String(formattedCountLike).length }, (_, i) => Math.pow(10, i)).reverse()}
                            containerStyle={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', padding: 0, width: 'fit-content', height: '19px'}}
                            counterStyle={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', lineHeight: '20px', fontWeight: '600', width: 'fit-content', padding: 0, height: '19px' }}
                            digitStyle={{
                                height: '19px',
                                top: '1px',
                                transition: 'height 0.6s ease-in-out, top 0.6s ease-in-out',
                            }}
                            topGradientStyle={{ display: 'none' }}
                            bottomGradientStyle={{ display: 'none' }}
                        />
                    }
                 </span>
            </Button>
           
            <Button onClick={handleCommentClick} className="flex items-center gap-2 bg-neutral-300/75 dark:bg-neutral-700/75 p-2 rounded-full h-fit hover:bg-color">
                <div className='block [&_svg]:size-[20px] text-[#333333] dark:text-[#d9d9d9]'><FaRegCommentDots size={20} /></div>
                <span className='block h-[19px] text-[#333333] dark:text-[#d9d9d9] text-sm font-semibold leading-1'>{formattedCountComment}</span>
            </Button>

            <Button onClick={(e) => (e.stopPropagation(), handleShareClick(idPost))} className="flex items-center gap-2 bg-neutral-300/75 dark:bg-neutral-700/75 p-2 rounded-full h-fit hover:bg-color">
                <div className='block [&_svg]:size-[20px] text-[#333333] dark:text-[#d9d9d9]'><PiShareFat size={20} /></div>
                <span className='block h-[19px] text-[#333333] dark:text-[#d9d9d9] text-sm font-semibold leading-1'>Share</span>
            </Button>
        </div>
    );
};