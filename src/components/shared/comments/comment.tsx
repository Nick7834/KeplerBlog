'use client'
import React, { useEffect, useState } from 'react';
import { IComment } from './comments';
import Image from 'next/image';
import { ReplyComment } from './replyComment';
import { Button, handleReply, UpdateReply } from '..';
import { cn } from '@/lib/utils';
import { FaRegUser } from 'react-icons/fa6';
import Link from 'next/link';
import { RiDeleteBinLine } from 'react-icons/ri';
import { MdCreate } from 'react-icons/md';
import { IoIosAddCircleOutline } from "react-icons/io";
import { FaRegComment } from "react-icons/fa6";
import { IoRemoveCircleOutline } from 'react-icons/io5';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useCommentStore } from '@/store/comment';
import { useCommentState } from '@/components/hooks/useCommentState';
import { useLogInStore } from '@/store/logIn';
import { getShortTimeAgo } from '@/components/hooks/useDate';
import { processContent } from '@/lib/processContent';
import { CheckProfile } from '../checkProfile';

interface Props {
    className?: string;
    comment: IComment;
    indentLevel: number;
    createdAt: Date;
    user: {
        id: string;
        email?: string | undefined;
        username: string;
        profileImage: string | null;
        isverified: boolean
    } | null
} 

export const Comment: React.FC<Props> = ({ className, comment, indentLevel, user }) => {

    const {data: session} = useSession();

    const timeAgo = getShortTimeAgo(new Date(comment.createdAt));
    
     const { setOpen } = useLogInStore();

     const [contetnComment, setContetnComment] = useState(comment.content);

     useEffect(() => {
        setContetnComment(comment.content);
     }, [comment.content])

    const {
        commentContentMain,
        setCommentContentMain,
        isReply,
        setIsReply,
        isUpdate,
        setIsUpdate,
        isReplyF,
        setIsReplyF,
        loaderReply,
        setLoaderReply,
        replyInput,
        setReplyInput,
        updateComment,
        setUpdateComment,
        time,
        setTime,
    } = useCommentState(contetnComment);

    const commentContentText = processContent(commentContentMain, false);

    const { deleteComment, addReply, editComment } = useCommentStore();

    const [isMobile, setIsMobile] = useState(false);


    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 600);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [])

    const indent = Math.min(indentLevel, 5) * (isMobile ? .5 : 4);

    const handReply = () => {
        setIsReply(!isReply);
    }

    const handleReplySubmit = async () => {
        handleReply(
            replyInput,
            user!,
            setReplyInput,
            setLoaderReply,
            setIsReply,
            comment,
            time,
            setTime,
            addReply,
            setOpen,
            session
       )
    }
    
    const handleUpdateComment = async () => {
        UpdateReply(
            updateComment,
            comment,
            editComment,
            setContetnComment, //ddd
            setUpdateComment,
            setIsUpdate,
            setCommentContentMain,
            setLoaderReply
        )
    }

    const handleDelete = async (id: string) => {
        const confirmed = window.confirm('Are you sure you want to delete this comment?');

        if(!confirmed) return;

        try {
            const resp = await axios.delete(`/api/comments/${id}/comment`);

            if(resp.status === 200) {
                toast.success('Comment deleted successfully');
                deleteComment(id);
            }

        } catch(error) {
            console.error(error);
            toast.error('Something went wrong');
        }
    }

    return (
        <div className={cn('pt-[15px] pb-[15px] relative z-[1] flex flex-col', className)} style={{ marginLeft: `${indent}px` }}>

            <div className='absolute top-[15px] left-0 h-[calc(100%-40px)] border-l-[1px] border-[#b0b0b0]/70 dark:border-neutral-300/45 rounded-bl-[10px] border-b w-[20px]'></div>

            <Link href={`/profile/${comment?.author?.id}`} className="flex items-center gap-1 w-fit">
                {comment?.author?.profileImage ?
                    <Image 
                        src={comment?.author?.profileImage} 
                        alt="avatar" 
                        width={40} 
                        height={40} 
                        className='rounded-full w-[40px] h-[40px] object-cover'
                    />
                    : 
                    <span className='flex flex-col items-center justify-center z-[1] overflow-hidden rounded-full min-w-[40px] h-[40px] bg-[#c7c7c7]' ><FaRegUser size={20} className='text-[#333333]' /></span>
                }
                <div className='flex items-center gap-1 text-[#333333] dark:text-[#d9d9d9] text-base font-medium ml-3'>
                    <div className='flex items-center gap-[2px]'>{comment?.author?.username} {comment?.author?.isverified && <CheckProfile isverified={comment?.author?.isverified} />}</div> 
                    · <span className='text-sm font-normal'>{timeAgo}</span></div>
            </Link>

            <p className='text-[#333333] dark:text-[#d9d9d9] text-base font-normal mt-2 ml-1 break-all'
                dangerouslySetInnerHTML={{ __html: commentContentText }}
            />   

            <div className='flex items-center gap-5 mt-2 ml-5'>
                {comment?.replies?.length > 0 && 
                <Button  onClick={() => setIsReplyF(!isReplyF)} variant='link' className='p-0 h-fit text-[#333333] dark:text-[#d9d9d9] hover:no-underline [&_svg]:size-[20px] flex items-center gap-2'>
                    {!isReplyF ? <IoIosAddCircleOutline /> : <IoRemoveCircleOutline />}
                    {/* <span className='block'>{comment?._count?.replies} Replies</span> */}
                </Button>}
                <Button onClick={handReply} variant='link' className='flex gap-2 items-center p-0 h-fit text-[#333333] dark:text-[#d9d9d9] text-base font-medium hover:no-underline'><FaRegComment /> Reply</Button>
            </div>

            {isReply && 
                <ReplyComment 
                    className='mt-2 ml-5' 
                    setReply={setIsReply} 
                    replyInput={replyInput}
                    setReplyInput={setReplyInput}
                    handleReply={handleReplySubmit}
                    loaderReply={loaderReply}
                />
            }

            {isUpdate && 
                <ReplyComment 
                    className='mt-2 ml-5' 
                    setReply={setIsUpdate} 
                    replyInput={updateComment}
                    setReplyInput={setUpdateComment}
                    handleReply={handleUpdateComment}
                    comment={contetnComment}
                    loaderReply={loaderReply}
                />
            }

            {isReplyF && comment?.replies?.map((reply, index) => (
                <Comment key={index} comment={reply} user={user} createdAt={reply.createdAt} indentLevel={indentLevel + 1} className='pl-3' />
            ))} 

            {comment.author?.id === session?.user?.id && 
                <div className='absolute top-[30px] right-0 flex gap-5'>
                <Button variant='link' className='block p-0 h-fit w-fit' onClick={() => setIsUpdate(!isUpdate)}><MdCreate className='block translate-y-[-1px]' /></Button>
                <Button variant='link' className='block p-0 h-fit w-fit' onClick={() => handleDelete(comment.id)}><RiDeleteBinLine className='block translate-y-[-1px]' /></Button>
            </div>
            }

        </div>
    );
};
