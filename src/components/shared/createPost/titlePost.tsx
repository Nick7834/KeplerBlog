'use client'
import { cn } from '@/lib/utils';
import React from 'react';

interface Props {
    className?: string;
    title: string;
    setTitle: (title: string) => void;
} 

export const TitlePost: React.FC<Props> = ({ className, setTitle, title }) => {
    return (
        <div className={cn('mt-10 flex flex-col gap-1 max-w-[600px] w-full', className)}>
             <input 
                    className='border border-solid border-[#8b8b8b] dark:border-white/80 rounded-[10px] p-[12px] text-[#333333] dark:text-[#e3e3e3] text-base font-medium outline-none bg-transparent w-full'
                    type="text" 
                    placeholder="Title*" 
                    maxLength={400}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <span className='text-[#8b8b8b] dark:text-[#e3e3e3] text-sm font-medium text-end'>{title.length}/400</span>
        </div>
    );
};
