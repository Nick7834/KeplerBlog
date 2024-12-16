'use client'
import React from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { FaRegUser } from 'react-icons/fa6';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { PostSearchType } from './fetchSerch';

interface Props {
    className?: string;
    post: PostSearchType
} 

export const PostSearch: React.FC<Props> = ({ className, post }) => {

    const router = useRouter();

    return (
        <div onClick={() => router.push(`/post/${post?.id}`)} className={cn('search-user search-post relative flex items-center gap-5 cursor-pointer hover:bg-[#d1d1d1]/60 hover:dark:bg-[#333333]/60 px-2 py-5 rounded-[10px]', className)}>

            <span className='absolute bottom-0 left-0 w-full border-b-[1px] border-[#b0b0b0]/60'></span>
            
            {post?.image?.[0] && 
                <Image src={post?.image[0]} alt="post" width={130} height={130} className='block min-w-[130px] h-[130px] object-cover rounded-[15px]' />
            }

            <div>
                <div className='flex items-center gap-2'>
                    <Link onClick={(e) => e.stopPropagation()} href={`/profile/${post?.author?.id}`} className="flex items-center gap-3 w-fit hover:underline">
                        {post?.author?.profileImage ?
                        <Image src={post?.author?.profileImage} alt="avatar" width={40} height={40} className='block min-w-[40px] h-[40px] object-cover z-[1] overflow-hidden rounded-full' /> :
                        <span className='flex flex-col items-center justify-center z-[1] overflow-hidden rounded-full min-w-[40px] h-[40px] bg-[#c7c7c7]' ><FaRegUser size={20} className='text-[#333333]' /></span>
                        }
                        <span className='text-[#333333] dark:text-[#d9d9d9] text-base font-medium'>{post?.author?.username}</span>
                    </Link>
                    <span className='text-[#797d7e] dark:text-[#e3e3e3] text-sm'>·</span>
                    <span className='text-[#797d7e] dark:text-[#e3e3e3] text-sm'>{post?.createdAt && format(new Date(post?.createdAt), 'dd MMM yyyy')}</span>
                </div>

                <h2 className='mt-3 text-[#333333] dark:text-[#d9d9d9] text-2xl font-bold'>{post?.title}</h2>

                <div className='mt-3 flex items-center gap-2'>
                    <span className='text-[#333333] dark:text-[#d9d9d9] text-sm'>{post?._count?.likes} likes</span>
                    <span className='text-[#333333] dark:text-[#d9d9d9] text-sm'>·</span>
                    <span className='text-[#333333] dark:text-[#d9d9d9] text-sm'>{post?._count?.comments} comments</span>
                </div>
            </div>

        </div>
    );
};
