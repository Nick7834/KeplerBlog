'use client'
import React, { useEffect, useState } from 'react';
import { Button } from '.';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { usePathname } from 'next/navigation';
import { useLogInStore } from '@/store/logIn';
import { Skeleton } from '../ui/skeleton';

interface Props {
    className?: string;
    idUser: string | undefined;
    setFollow?: (number: number) => void;
    follow?: number;
} 

export const FollowButton: React.FC<Props> = ({ className, idUser, setFollow, follow }) => {

    const { data: session } = useSession();

    const pathname = usePathname();

    const [Isfollow, setIsFollow] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const { setOpen } = useLogInStore();


    useEffect(() => {

        if(!session) return;

        if(!idUser) return;

        setIsLoading(true);

        const getFollow = async () => {
            try {
                const { data } = await axios.get(`/api/user/${idUser}/follow`);
                setIsFollow(data.isFollow);
            } catch(error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }

        getFollow();

    }, [idUser, session]);

    const handleFollow = async () => {

        if(!session) {
            setOpen(true);
            return
        }

        setIsFollow((prev) => !prev);

        if(pathname.startsWith('/profile')) {
            if (Isfollow) {
                setFollow?.(follow ? follow - 1 : 0);
            } else {
                setFollow?.((follow || 0) + 1);
            }
        }

        try {

           await axios.post(`/api/user/${idUser}/follow`);

        } catch(error) {
            console.error(error);
        }

    }

    return (
    <>
        {isLoading ? 
            <Skeleton className='w-[100px] h-[32px] bg-[#c1c1c1] dark:bg-[#2a2a2a] rounded-[10px]' /> :
            <Button onClick={handleFollow} className={cn('py-[6px] px-5 leading-2 h-fit text-sm transition-all ease-in-out duration-300', className, Isfollow && 'bg-[#7391d5] text-white hover:bg-[#7391d5]/85')}>{Isfollow ? 'Following' : 'Follow'}</Button>
         }
    </>
    )
};
