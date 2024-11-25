'use client'
import React from 'react';
import { Button, Input } from '..';
import { cn } from '@/lib/utils';

interface Props {
    className?: string;
    setReply: React.Dispatch<React.SetStateAction<boolean>>
} 

export const ReplyComment: React.FC<Props> = ({ className, setReply }) => {

    const [replyInput, setReplyInput] = React.useState('');

    return (
        <div className={cn('flex mt-2 rounded-[10px] border border-solid border-[#b0b0b0]/70 dark:border-neutral-300/75 bg-neutral-300/75 dark:bg-neutral-800/75', className)}>

                <Input 
                    placeholder="Write a comment..."
                    className="p-[15px] bg-transparent text-base h-[40px]" 
                    value={replyInput}
                    onChange={(e) => setReplyInput(e.target.value)}
                 />

                <div className="flex items-center gap-2">
                    <Button onClick={() => setReply(false)} variant='link' className='p-0 h-fit text-[#333333] dark:text-[#d9d9d9] text-sm font-medium hover:no-underline'>Cancel</Button>
                    <Button disabled={replyInput.trim() === '' ? true : false} className='py-[7px] px-[20px] h-full text-[#d9d9d9] dark:text-[#333333] bg-[#333333] dark:bg-[#d9d9d9] hover:bg-[#333333]/85 dark:hover:bg-[#d9d9d9]/85'>Reply</Button>
                </div>

        </div>
    );
};