import { UseFormatNumber } from '@/components/hooks/useFormatNumber';
import { cn } from '@/lib/utils';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import React from 'react';

import { BiLike } from "react-icons/bi";
import { FaRegCommentDots } from "react-icons/fa6";

interface Props {
    className?: string;
    count: number,
    pathname: string,
    router: AppRouterInstance
    onClick?: () => void
} 

export const ActionPanel: React.FC<Props> = ({ className, count, pathname, router, onClick }) => {

    const formattedCountLike = UseFormatNumber(2765434);
    const formattedCountComment = UseFormatNumber(5678);

    const handleCommentClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (pathname.startsWith('/post') && onClick) {
            onClick();
        } else {
            router.push(`/post/${count}`);
        }
    };


    return (
        <div className={cn('mt-4 flex items-center gap-5', className)}>
            <button onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 bg-neutral-300/75 dark:bg-neutral-700/75 p-2 rounded-full">
                <div className='block'><BiLike size={21} /></div>
                <span className='block h-[19px] text-[#333333] dark:text-[#d9d9d9] text-sm font-semibold leading-1'>{formattedCountLike}</span>
            </button>

            <button onClick={handleCommentClick} className="flex items-center gap-2 bg-neutral-300/75 dark:bg-neutral-700/75 p-2 rounded-full">
                <div className='block'><FaRegCommentDots size={20} /></div>
                <span className='block h-[19px] text-[#333333] dark:text-[#d9d9d9] text-sm font-semibold leading-1'>{formattedCountComment}</span>
            </button>
        </div>
    );
};