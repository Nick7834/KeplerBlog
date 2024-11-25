'use client'
import Image from 'next/image';
import Link from 'next/link';
import React, { useRef, useState } from 'react';

import { IoMdSettings } from "react-icons/io";
import { MdDarkMode } from "react-icons/md";
import { ImExit } from "react-icons/im";
import { RxAvatar } from "react-icons/rx";
import { cn } from '@/lib/utils';
import { Switch } from '../ui/switch';
import UseCloseModal from '../hooks/useCloseModal';
import { UseDarkMode } from '../hooks/useDarkMode';

interface Props {
    className?: string;
}

interface MenuItem {
    id?: string;
    name: string;
    svg: React.ReactNode;
    href?: string;
}

export const Profile: React.FC<Props> = ({ className }) => {

    const [open, setOpen] =useState(false);
    const refProfile = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const { theme, handleToggle } = UseDarkMode();

    UseCloseModal(buttonRef, refProfile, () => setOpen(false));
    
    const profileMenu: MenuItem[] = [
        {
            name: 'Profile',
            svg: <RxAvatar size={20} />,
            href: '/profile'
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
        <div className={cn('relative', className)}>

                <button ref={buttonRef} className='block w-[48px] h-[48px] overflow-hidden rounded-full' onClick={() => {setOpen(!open)}}>
                    <Image src="https://cspromogame.ru//storage/upload_images/avatars/3358.jpg" alt="profile" width={48} height={48} />
                </button>

                <div ref={refProfile} className={cn('invisible opacity-0 -translate-y-5 py-5 transition-all ease-in-out duration-[.14s] absolute top-[60px] right-0 min-w-[300px] bg-[#E0E0E0] dark:bg-[#2a2a2a] rounded-[10px] border border-[#b0b0b0]/70 dark:border-[#d9d9d9]/70', open && 'visible opacity-100 translate-y-0 ')}>

                    <Link href='/' className='flex items-center gap-3 px-5'>
                        <Image src="https://cspromogame.ru//storage/upload_images/avatars/3358.jpg" alt="profile" width={48} height={48} className='block w-[48px] h-[48px] overflow-hidden rounded-full' />
                        <span className='text-[#333333] dark:text-[#e3e3e3] text-base font-medium'>Kepler</span>
                    </Link>

                    <ul className='mt-[20px] flex flex-col'>
                        {profileMenu.map((item) => {
                            

                            if(item.href) {
                                return (
                                    <li key={item.name}><Link href={item.href} className='flex items-center gap-2 text-[#333333] dark:text-[#e3e3e3] text-lg font-medium w-full py-[10px] transition-all ease-in-out duration-[.3s] px-5 hover:text-[#3a9989] dark:hover:text-[#3a9989] hover:bg-[#c0c0c0]/30 dark:hover:bg-[#3e3e3e]/30'>{item.svg} {item.name}</Link></li> 
                                )
                            }

                            if(item.id === 'theme') {
                                return (
                                    <li onClick={handleToggle} key={item.id} className='cursor-pointer select-none flex items-center transition-all ease-in-out duration-[.3s] px-5 hover:bg-[#c0c0c0]/30 dark:hover:bg-[#3e3e3e]/30'>
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
                                        <button className='flex items-center gap-2 text-lg font-medium w-full py-[10px] transition-all ease-in-out duration-[.3s] px-5 hover:bg-[#c0c0c0]/30 dark:hover:bg-[#3e3e3e]/30'>
                                            {item.svg}
                                            {item.name}
                                        </button>
                                    </li>
                                )
                            }

                        })}
                    </ul>

                </div>

        </div>
    );
};