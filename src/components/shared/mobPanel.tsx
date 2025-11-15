'use client'
import { cn } from '@/lib/utils';
import React from 'react';
import { HiTrendingUp } from 'react-icons/hi';
import { IoHome } from 'react-icons/io5';
import { MdPeopleAlt } from 'react-icons/md';
import { IoAddOutline } from "react-icons/io5";
import { FaNewspaper } from 'react-icons/fa6';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface Props {
    className?: string;
} 

export const MobPanel: React.FC<Props> = ({ className }) => {

     const namePage = usePathname();

     const { data: session } = useSession();

    const navMenuMob = [
            {
                name: "Home",
                svg: <IoHome />,
                href: "/"
            }, 
            {
                name: "Trending",
                svg: <HiTrendingUp />,
                href: "/trending"
            },
            ...(session ? [{
                name: "Create",
                svg: <IoAddOutline />,
                href: "/create"
            }] : []),
            {
                name: "For You",
                svg: <FaNewspaper />,
                href: "/for-you"
            },
            {
                name: "Subs",
                svg: <MdPeopleAlt />,
                href: "/subscriptions"
            }
    ]

    return (
        <div className={cn('mob-panel hidden fixed bottom-0 left-0 w-full z-[500]', className)}>
            <nav className='m-[5px] rounded-[20px] py-2 px-1 bg-[#E0E0E0]/70 dark:bg-[#2a2a2a]/80 backdrop-blur-[12px] border border-solid border-[#b0b0b0]/20 dark:border-[#d9d9d9]/20'>
                <ul className={cn('grid grid-cols-5 items-center justify-center h-full gap-1', !session && 'grid-cols-4')}>
                    {navMenuMob.map((item, index) => ( 
                        <li key={index} 
                             className='flex flex-col items-center justify-center gap-1 w-full h-full'>
                             <Link href={item.href} className={cn('flex flex-col items-center justify-center w-full h-full text-[#333333] dark:text-[#d9d9d9] text-sm font-bold', namePage === item.href && 'dark:text-[#7391d5] text-[#7391d5]')}>
                                <span className={cn('text-[#333333] dark:text-[#d9d9d9] text-[24px] font-bold', namePage === item.href && 'dark:text-[#7391d5] text-[#7391d5]')}>{item.svg}</span>
                                {item.name}
                            </Link>
                        </li>
                    ))}

                </ul>
            </nav>
        </div>
    );
};
