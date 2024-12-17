'use client'
import Link from 'next/link';
import React from 'react';
import { Profile } from './profile';
import { Button } from '.';
import { AutchModal } from './modals/autch-Modal';
import { Session } from 'next-auth';
import { IoLogInOutline } from 'react-icons/io5';
import { IoIosCreate } from 'react-icons/io';
import { User } from '@prisma/client';
import { useLogInStore } from '@/store/logIn';
import { IoSearch } from "react-icons/io5";
import { Skeleton } from '../ui/skeleton';

interface Props {
    className?: string;
    session: Session | null;
    user: User | null;
    status: string;
    setSearchMobOpen: React.Dispatch<React.SetStateAction<boolean>>
} 

export const AutchModalBlock: React.FC<Props> = ({ className, session, user, status, setSearchMobOpen }) => {
    const { open, setOpen } = useLogInStore();

    if (status === 'loading') {
        return (
            <Skeleton className='h-[48px] w-[150px] bg-[#c1c1c1] dark:bg-[#676767] rounded' />
        );
    }
    
    return (
        <div className={className}>
             <div className='flex items-center gap-[20px]'>
                <Button onClick={() => setSearchMobOpen(true)} variant='outline' className='search-button-mob hidden p-0 h-fit bg-transparent border-0 hover:bg-transparent [&_svg]:size-[20px]'><IoSearch className='text-[#333333] dark:text-[#d9d9d9] text-xl' /></Button>
                {session ?
                    <div className='header-left flex items-center gap-10'>
                        <Link href={"/create"} className='flex items-center gap-1 text-[#333333] dark:text-[#d9d9d9] text-lg font-medium transition-all ease-in-out duration-[.3s] hover:text-[#7391d5] dark:hover:text-[#7391d5] create-post '><IoIosCreate /> Create</Link>
                        <Profile user={user} />
                    </div>
                    :
                    <Button onClick={() => setOpen(true)} variant='default' className='h-full px-[30px] py-[12px] bg-[#333333] dark:bg-[#d9d9d9] hover:bg-[#333333]/85 dark:hover:bg-[#d9d9d9]/85'>Log in <IoLogInOutline /></Button>
                }
             </div>

            <AutchModal open={open} onClose={() => setOpen(false)} />
        </div>
    );
};
