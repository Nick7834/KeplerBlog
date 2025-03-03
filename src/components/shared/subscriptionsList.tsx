'use client'
import axios from 'axios';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { UserSearch } from './userSearch';
import InfiniteScroll from 'react-infinite-scroll-component';
import { SkeletonUserSearch } from './skeletonUserSearch';
import { cn } from '@/lib/utils';
import { UserSearchType } from './fetchSerch';
import { Button } from '.';
import { useLogInStore } from '@/store/logIn';
import { BsPostcard } from 'react-icons/bs';
import { FaUser } from 'react-icons/fa6';
import { FaUserFriends } from 'react-icons/fa';
import { IoMdPeople } from 'react-icons/io';
import { UseFormatNumber } from '../hooks/useFormatNumber';

interface Props {
    className?: string;
} 

export const SubscriptionsList: React.FC<Props> = ({ className }) => {

    const {data: session} = useSession();

    const { setOpen } = useLogInStore();

    const [profile, setProfile] = useState<UserSearchType[]>([]);
    const [countSub, setCountSub] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true); 
    const [pageSub, setPageSub] = useState(1);
    const formattedCount = UseFormatNumber(countSub);

    useEffect(() => {

        if (!session) {
            setIsLoading(false)
            return
        }

        const fetchProfile = async () => {
            setIsLoading(true);
          try {
            const response = await axios.get(`/api/subscriptions?page=${pageSub}&limit=10`);
            const data = await response.data;

            setCountSub(data?.totalFollowings);

            if (!data || data?.followings.length === 0 ) {
                setHasMore(false);
            } else {
                setProfile((prevPosts) => {
                    const newPosts = data?.followings.filter((post: { id: string; }) => !prevPosts.some(p => p.id === post.id));
                    return [...prevPosts, ...newPosts];
                });
                if (data?.followings.length < 10) setHasMore(false);
            }
          } catch (error) {
            console.error('Error fetching profile:', error);
          } finally {
            setIsLoading(false);
          }
        };
    
        fetchProfile();

    }, [pageSub, session]);

    
    const loadMoreData = () => {
        if (!isLoading && hasMore) {
          setPageSub((prevPage) => prevPage + 1)
        }
    }

    return (
       <>
            <h1 className="relative w-fit flex items-center gap-2 text-[#333333] dark:text-[#d9d9d9] text-[clamp(1.563rem,1.455rem+0.54vw,1.875rem)] font-bold">
                <IoMdPeople />Subscriptions 
               {countSub > 0 && 
                    <span className='flex justify-center items-center absolute top-0 right-[0] mr-[-35px] text-[#d9d9d9] dark:text-[#333333] text-sm bg-[#333333] dark:bg-[#d9d9d9] px-1 rounded-full min-w-[20px] min-h-[20px] max-h-[20px]'>{formattedCount}</span>
               }
            </h1>
            <div className={cn('mt-[clamp(1.25rem,0.82rem+2.15vw,2.5rem)]', className)}>

                {!session && !isLoading ?
                    <div className='flex flex-col items-center justify-center'>
                        <span className='text-[#333333] dark:text-[#d9d9d9] text-[clamp(5rem,3.968rem+5.16vw,8rem)]'><BsPostcard /></span>
                        <h2 className="mt-3 text-[#333333] dark:text-[#d9d9d9] text-3xl font-bold text-center">Log in to your account</h2>
                        <p className="mt-3 text-[#333333] dark:text-[#d9d9d9] text-base text-center">You need to be logged in to see your subscriptions.</p>
                        <Button 
                            onClick={() => setOpen(true)}
                            className='mt-5 flex items-center gap-2 px-[30px] py-[12px] bg-[#333333] dark:bg-[#d9d9d9] hover:bg-[#333333]/85 dark:hover:bg-[#d9d9d9]/85'>
                            <FaUser /> 
                            Log in
                        </Button>
                    </div>
                :
                <InfiniteScroll
                    dataLength={profile.length}
                    next={loadMoreData}
                    hasMore={hasMore}
                    loader={isLoading && Array.from({ length: 3 }).map((_, index) => <SkeletonUserSearch key={index} />)}
                    scrollThreshold={0.8}
                    key="subscriptions-scroll" 
                >
                    {!isLoading && profile.length === 0 ? 
                        <div className="flex flex-col items-center justify-center gap-4">
                            <FaUserFriends  size={85} className="text-[#333333] dark:text-[#d9d9d9]" />
                            <p className="text-[#333333] dark:text-[#d9d9d9] text-xl font-bold">No Subscriptions</p>
                        </div>
                    :
                        profile.map((post: UserSearchType, index: number) => (
                            <UserSearch key={index} user={post} />
                        ))
                    }
                </InfiniteScroll>
            }
            
            </div>
       </>
    );
};
