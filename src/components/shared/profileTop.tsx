'use client'
import { cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react';
import { UseFormatNumber } from '../hooks/useFormatNumber';
import { IoMdSettings } from 'react-icons/io';
import Link from 'next/link';
import { FaRegUser } from 'react-icons/fa6';
import { FollowButton } from './followButton';
import { useSession } from 'next-auth/react';
import { CheckProfile } from './checkProfile';
import Counter from '../ui/Counter';

export interface ProfileInterface {
    className?: string;
    user: {
      id: string;
      username: string;
      profileImage: string | null;
      poster: string | null;
      bio: string | null;
      createdAt: Date;
      isFollowing: boolean;
      isverified: boolean;
      followers: {
        id: string;
        followerId: string;
        followingId: string;
      }[];
      _count: {
        following: number;
      };
      posts: {
        id: string;
        _count: {
          likes: number;
        };
      }[];
    }
}

export const ProfileTop: React.FC<ProfileInterface> = ({ className, user }) => {

   const { data: session } = useSession();

    const [follow, setFollow] = useState<number>(user?._count.following || 0);

    const formattedCount = UseFormatNumber(follow);

    useEffect(() => {
        setFollow(user?._count.following || 0);
    }, [user?._count.following]);

    return (
        <div className={cn('w-full max-w-[clamp(65.625rem,22.569rem+44.44vw,78.125rem)] px-[15px]', className)}>
            {user?.poster && 
                <div
                    className='back-profile w-full max-w-[clamp(65.625rem,22.569rem+44.44vw,78.125rem)] h-[clamp(8.125rem,6.066rem+8.24vw,12.5rem)] bg-cover bg-center bg-no-repeat rounded-[20px]'
                    style={{ backgroundImage: `url(${user?.poster})`}}
                >
            </div>}
            <div className={cn("profile-top relative flex items-start justify-start px-[clamp(0.625rem,-0.551rem+4.71vw,3.125rem)] gap-[clamp(0.625rem,0.449rem+0.71vw,1rem)]" , !user?.poster && 'justify-center items-center')}>
            {user?.profileImage ? 
            <img src={user?.profileImage} alt="profile" className={cn('avatar-profile block min-w-[clamp(4.375rem,3.493rem+3.53vw,6.25rem)] max-w-[clamp(4.375rem,3.493rem+3.53vw,6.25rem)] h-[clamp(4.375rem,3.493rem+3.53vw,6.25rem)] min-h-[clamp(4.375rem,3.493rem+3.53vw,6.25rem)] object-cover z-[1] overflow-hidden rounded-full mt-[-50px]', !user?.poster && 'mt-0')} /> :
             <span className={cn('avatar-profile flex flex-col items-center justify-center z-[1] mt-[-50px] overflow-hidden rounded-full min-w-[clamp(4.375rem,3.493rem+3.53vw,6.25rem)] h-[clamp(4.375rem,3.493rem+3.53vw,6.25rem)] bg-[#c7c7c7]', !user?.poster && 'mt-0')} ><FaRegUser size={50} className='text-[#333333]' /></span>}
                <div className='mt-[7px] flex items-center justify-between gap-5 w-full'>
                    <div className="flex flex-col">
                            <h2 className={cn('flex items-center gap-[2px] text-[#333333] dark:text-[#d9d9d9] text-[clamp(1rem,0.882rem+0.47vw,1.25rem)] font-medium leading-5 whitespace-pre-wrap max-[330px]:break-all', user?.username.length > 14 ? 'max-[450px]:text-[12px]' : '')}>
                              {user?.username} <CheckProfile isverified={user?.isverified} />
                            </h2>
                            <span className='flex items-center gap-1 text-[#333333] dark:text-[#d9d9d9] text-sm font-medium mt-1'>
                               {follow >= 1000 ? 
                                    formattedCount
                                  :
                                    <Counter
                                      value={Number(formattedCount)}
                                      fontSize={18}
                                      gap={0}
                                      textColor="inherit"
                                      gradientHeight={0}
                                      places={Array.from({ length: String(formattedCount).length }, (_, i) => Math.pow(10, i)).reverse()}
                                      containerStyle={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', padding: 0, width: 'fit-content'}}
                                      counterStyle={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', lineHeight: '20px', fontWeight: '500', width: 'fit-content', padding: 0 }}
                                      topGradientStyle={{ display: 'none' }}
                                      bottomGradientStyle={{ display: 'none' }}
                                  />
                                }
                              followers
                            </span>
                    </div>
                   {session?.user?.id === user?.id ? <Link href="/settings" className='transition-all ease-in-out duration-[.3s] cursor-pointer m-3 hover:rotate-90'><IoMdSettings size={20} className='text-[#333333] dark:text-[#e3e3e3]' /></Link> 
                   : <FollowButton idUser={user?.id || ''} setFollow={setFollow} follow={follow} isFollowUser={user?.isFollowing} /> }
                </div>
            </div>
        </div>
    );
};