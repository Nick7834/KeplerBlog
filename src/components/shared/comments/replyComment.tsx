'use client'
import React, { useEffect } from 'react';
import { Button, Input } from '..';
import { cn } from '@/lib/utils';

interface Props {
    className?: string;
    setReply: React.Dispatch<React.SetStateAction<boolean>>
    handleReply: () => void
    replyInput: string
    setReplyInput: React.Dispatch<React.SetStateAction<string>>
    comment?: string
    loaderReply: boolean
} 

export const ReplyComment: React.FC<Props> = ({ className, replyInput, setReplyInput, setReply, handleReply, comment, loaderReply }) => {

    useEffect(() => {
        if(comment) {
            setReplyInput(comment);

        }
    }, [comment, setReplyInput])

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                handleReply();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleReply]);

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
                    <Button loading={loaderReply} disabled={replyInput.trim() === '' ? true : false} onClick={handleReply} className='w-[75px] py-[7px] px-[20px] h-full text-[#d9d9d9] dark:text-[#333333] bg-[#333333] dark:bg-[#d9d9d9] hover:bg-[#333333]/85 dark:hover:bg-[#d9d9d9]/85'>Reply</Button>
                </div>

        </div>
    );
};
