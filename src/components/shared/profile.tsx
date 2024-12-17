'use client'
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';

import { IoMdSettings } from "react-icons/io";
import { MdDarkMode } from "react-icons/md";
import { ImExit } from "react-icons/im";
import { RxAvatar } from "react-icons/rx";
import { cn } from '@/lib/utils';
import { Switch } from '../ui/switch';
import UseCloseModal from '../hooks/useCloseModal';
import { UseDarkMode } from '../hooks/useDarkMode';
import { signOut } from 'next-auth/react';
import { FaRegUser } from "react-icons/fa";
import { User } from '@prisma/client';
import { Button } from '.';
import { IoClose } from 'react-icons/io5';

interface Props {
    className?: string;
    user: User | null
}

interface MenuItem {
    id?: string;
    name: string;
    svg: React.ReactNode;
    href?: string;
}

export const Profile: React.FC<Props> =  ({ className, user }) => {

    const [open, setOpen] = useState(false);
    const refProfile = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const { theme, handleToggle } = UseDarkMode();

    UseCloseModal(buttonRef, refProfile, () => setOpen(false));

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);

        if (windowWidth <= 1100 && open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);

    }, [open, windowWidth]);
    
    const profileMenu: MenuItem[] = [
        {
            name: 'Profile',
            svg: <RxAvatar size={20} />,
            href: `/profile/${user?.id}`
        },
        {
            name: 'Settings',
            svg: <IoMdSettings size={20} />,
            href: '/settings'
        },
        {
            id: 'theme',
            name: 'Theme',
            svg: <MdDarkMode size={20} />,
        },
        {
            id: 'logout',
            name: 'Logout',
            svg: <ImExit size={20} />,
        },
    ]


    return (
        <div className={className}>

                <div className={cn('main-back', open && 'active-back')}></div>

                <button ref={buttonRef} className='block w-[48px] h-[48px] overflow-hidden rounded-full' onClick={() => {setOpen(!open)}}>
                    {user?.profileImage ? <Image src={user?.profileImage} alt="profile" width={48} height={48} className='block w-[48px] h-[48px] object-cover overflow-hidden rounded-full' /> : 
                    <span className='flex flex-col items-center justify-center object-cover rounded-full w-[48px] h-[48px] bg-[#c7c7c7]'><FaRegUser className='text-[#333333]' /></span>}
                </button>

                <div ref={refProfile} className={cn('profile-modal invisible opacity-0 -translate-y-5 py-5 transition-all ease-in-out duration-[.14s] absolute top-[80px] right-[40px] min-w-[300px] bg-[#E0E0E0] dark:bg-[#2a2a2a] rounded-[10px] border border-[#b0b0b0]/70 dark:border-[#d9d9d9]/70', open && 'active-profile')}>

                    <Link href={`/profile/${user?.id}`} onClick={() => setOpen(false)} className='flex items-center gap-3 px-5 w-fit'>
                        {user?.profileImage ? 
                        <Image src={user?.profileImage} alt="profile" width={48} height={48} className='block w-[48px] h-[48px] object-cover overflow-hidden rounded-full' /> 
                        : <span className='flex flex-col items-center justify-center rounded-full w-[48px] h-[48px] bg-[#c7c7c7]'><FaRegUser className='text-[#333333]' /></span>}
                        <span className='text-[#333333] dark:text-[#e3e3e3] text-base font-medium'>{user?.username}</span>
                    </Link>

                    <ul className='ul-profile mt-[20px] flex flex-col'>
                        {profileMenu.map((item) => { 

                            if(item.href) {
                                return (
                                    <li key={item.name}><Link href={item.href} onClick={() => setOpen(false)} className='flex items-center gap-2 text-[#333333] dark:text-[#e3e3e3] text-lg font-medium w-full py-[10px] transition-all ease-in-out duration-[.3s] px-5 hover:text-[#7391d5] dark:hover:text-[#7391d5] hover:bg-[#c0c0c0]/30 dark:hover:bg-[#3e3e3e]/30'>{item.svg} {item.name}</Link></li> 
                                )
                            }

                            if(item.id === 'theme') {
                                return (
                                    <li onClick={handleToggle} key={item.id}  className='cursor-pointer select-none flex items-center transition-all ease-in-out duration-[.3s] px-5 hover:bg-[#c0c0c0]/30 dark:hover:bg-[#3e3e3e]/30'>
                                        <div className='flex items-center gap-2 text-[#333333] dark:text-[#e3e3e3] text-lg font-medium w-full py-[10px]'>
                                            {item.svg}
                                            {item.name}
                                        </div>

                                        <Switch checked={theme === 'dark'} onCheckedChange={handleToggle} />
                                    </li>
                                )
                            }

                           if(item.id === 'logout') {
                                return (
                                    <li key={item.id} className='text-[#db1212]/80'>
                                        <button onClick={() => signOut()} className='flex items-center gap-2 text-lg font-medium w-full py-[10px] transition-all ease-in-out duration-[.3s] px-5 hover:bg-[#c0c0c0]/30 dark:hover:bg-[#3e3e3e]/30'>
                                            {item.svg}
                                            {item.name}
                                        </button>
                                    </li>
                                )
                            }

                        })}
                    </ul>

                    <Button onClick={() => setOpen(!open)} variant='outline' className='absolute top-2 right-2 search-button-mob p-0 h-fit hidden bg-transparent border-0 hover:bg-transparent [&_svg]:size-[30px]'><IoClose className='text-[#333333] dark:text-[#e3e3e3] text-xl' /></Button>

                </div>

        </div>
    );
};