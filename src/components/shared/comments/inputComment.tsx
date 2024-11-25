import React from 'react';
import { Button, Input } from '..';

interface Props {
    className?: string;
} 

export const InputComment: React.FC<Props> = ({ className }) => {
    return (
        <div className={className}>
            <Input placeholder="Write a comment..." className="p-[20px] text-base h-[50px] rounded-[10px] border-solid border-[#b0b0b0]/70 dark:border-neutral-300/75 bg-neutral-300/75 dark:bg-neutral-800/75" />
            <Button className='mt-3 flex-1 ml-auto px-[30px] flex items-end justify-end text-[#d9d9d9] dark:text-[#333333] bg-[#333333] dark:bg-[#d9d9d9] hover:bg-[#333333]/85 dark:hover:bg-[#d9d9d9]/85'>Add Comment</Button>
        </div>
    );
};
