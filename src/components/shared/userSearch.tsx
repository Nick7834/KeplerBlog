'use client'
import React from 'react';
import Image from 'next/image';
import { FaRegUser } from 'react-icons/fa6';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { UserSearchType } from './fetchSerch';
import { FollowButton } from './followButton';
import { useSession } from 'next-auth/react';

interface Props {
    className?: string;
    user: UserSearchType
} 

export const UserSearch: React.FC<Props> = ({ className, user }) => {
    const { data: session } = useSession();

    return (
        <Link href={`/profile/${user?.id}`} className={cn('search-user relative flex gap-5 cursor-pointer hover:bg-[#d1d1d1]/60 hover:dark:bg-[#333333]/60 px-2 py-5 rounded-[10px]', className)}>

                    <span className='absolute bottom-0 left-0 w-full border-b-[1px] border-[#b0b0b0]/60'></span>

                    {user?.profileImage ? 
                        <Image src={user?.profileImage} alt="avatar" width={60} height={60} className='block min-w-[60px] h-[60px] object-cover z-[1] overflow-hidden rounded-full' /> :
                        <span className='flex flex-col items-center justify-center z-[1] overflow-hidden rounded-full min-w-[60px] h-[60px] bg-[#c7c7c7]' ><FaRegUser size={20} className='text-[#333333]' /></span>
                    } 

                    <div className='w-full flex justify-between gap-1'>
                        <div>
                            <h2 className='text-[#333333] dark:text-[#d9d9d9] text-base font-medium break-all'>{user?.username}</h2>
                            <div className='mt-3 flex items-center gap-2'>
                                <span className='text-[#797d7e] dark:text-[#b9b8b8] text-sm'>{user?._count?.following} followers</span>
                                <span className='text-[#797d7e] dark:text-[#b9b8b8] text-sm'>·</span>
                                <span className='text-[#797d7e] dark:text-[#b9b8b8] text-sm'>{user?._count?.posts} posts</span>
                            </div>
                            <p className='mt-1 text-[#333333] dark:text-[#d9d9d9] text-sm'>{user?.bio}</p>
                        </div>
                      {session?.user?.id !== user?.id &&  <div onClick={(e) => e.preventDefault()}>
                        <FollowButton idUser={user?.id} isFollowUser={user?.isFollowing} />
                        </div>}
                    </div>

        </Link>
    );
};
