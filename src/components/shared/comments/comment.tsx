import React, { useState } from 'react';
import { IComment } from './comments';
import Image from 'next/image';
import { ReplyComment } from './replyComment';
import { Button } from '..';
import { cn } from '@/lib/utils';

interface Props {
    className?: string;
    comment: IComment;
    indentLevel: number;
} 

export const Comment: React.FC<Props> = ({ className, comment, indentLevel }) => {

    const maxIndentLevel = 5; 

    const indent = Math.min(indentLevel, maxIndentLevel) * 10;

    const [isReply, setIsReply] = useState(false);

    const [isReplyF, setIsReplyF] = useState(false);

    const handReply = () => {
        setIsReply(!isReply);
    }

    return (
        <div className={cn('mt-5', className)} style={{ marginLeft: `${indent}px` }}>

            <div className="flex items-center gap-1">
                <Image src={comment.avatar} alt="avatar" width={40} height={40} className='w-[40px] h-[40px] block object-cover rounded-full' />
                <span className='text-[#333333] dark:text-[#d9d9d9] text-base font-medium ml-3'>{comment.author}</span>
            </div>

            <p className='text-[#333333] dark:text-[#d9d9d9] text-base font-normal mt-2 ml-1'>{comment.text}</p>

            <div className='flex items-center gap-3'>
                {comment.replies.length > 0 && <Button onClick={() => setIsReplyF(!isReplyF)} variant='link' className='p-0 h-fit text-[#5d92fc] dark:text-[#5d92fc] text-base font-medium mt-2 hover:no-underline'>{comment.replies.length} replies</Button>}
                <Button onClick={handReply} variant='link' className='p-0 h-fit text-[#333333] dark:text-[#d9d9d9] text-base font-medium mt-2 hover:no-underline'>Reply</Button>
            </div>

            {isReply && <ReplyComment className='mt-2' setReply={setIsReply} />}

            {isReplyF && comment.replies.map((reply, index) => (
                <Comment key={index} comment={reply} indentLevel={indentLevel + 1} />
            ))}

        </div>
    );
};
