'use client'
import React, { useEffect, useState } from 'react';
import { Button } from '.';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { usePathname } from 'next/navigation';
import { useLogInStore } from '@/store/logIn';
import { useStatusFollow } from '@/store/status';

interface Props {
    className?: string;
    idUser: string | undefined;
    setFollow?: (number: number) => void;
    follow?: number;
    isFollowUser: boolean
} 

export const FollowButton: React.FC<Props> = ({ className, idUser, setFollow, follow, isFollowUser }) => {

    const { data: session } = useSession();

    const pathname = usePathname();

    const [Isfollow, setIsFollow] = useState(isFollowUser || false);
    const { statusFollow, setStatusFollow } = useStatusFollow();
      const [loading, setLoading] = useState(false);

    const { setOpen } = useLogInStore();

    useEffect(() => {
        setIsFollow(isFollowUser || false);
    }, [isFollowUser, session]);

    useEffect(() => {

        if(!statusFollow) {
            return
        }

        const getFollow = async () => {
            try {
                const { data } = await axios.get(`/api/user/${idUser}/follow`);
                setIsFollow(data.isFollow);
                setStatusFollow(false)
            } catch(error) {
                console.error(error);
            }
        }

        getFollow();

    }, [statusFollow, setStatusFollow]);

    const handleFollow = async () => {

        if(!session) {
            setOpen(true);
            return
        }

        setIsFollow((prev: boolean) => !prev);

        if(pathname.startsWith('/profile')) {
            if (Isfollow) {
                setFollow?.(follow ? follow - 1 : 0);
            } else {
                setFollow?.((follow || 0) + 1);
            }
        }

        if (loading) return;

        setLoading(true);

        try {

           await axios.post(`/api/user/${idUser}/follow`);

        } catch(error) {
            console.error(error);
        } finally {
            setLoading(false); 
        }

    }

    return (
        <Button onClick={handleFollow} className={cn('py-[6px] px-5 leading-2 h-fit text-sm transition-all ease-in-out duration-300', 
        className, 
        Isfollow && 'bg-[#7391d5] text-white hover:bg-[#7391d5]/85')}>
            {Isfollow ? 'Following' : 'Follow'}
        </Button>
    )
};
