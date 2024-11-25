import { cn } from '@/lib/utils';
import React from 'react';
import Link from 'next/link';
import { IoIosCreate } from "react-icons/io";
import { IoLogInOutline } from "react-icons/io5";
import { Button, Input, Profile } from '.';
import { FiSearch } from 'react-icons/fi';


interface Props {
    className?: string;
}

export const Header: React.FC<Props> = ({ className }) => {

    const isAutch = true;

    return (
        <header className={cn('flex items-center justify-between gap-[20px] py-[20px] px-[50px] border-b border-solid border-[#D3D3D3] dark:border-white/80', className)}>
            
            <label className='max-w-[600px] w-full flex items-center gap-2 p-[12px] border border-solid bg-neutral-300/75 dark:bg-neutral-800/75 rounded-[10px]'>
                <FiSearch size={16} className="text-[#333333] dark:text-[#e3e3e3]" />
                <Input type='text' placeholder='Search' className='outline-none p-0 h-fit rounded-none border-0 w-full bg-transparent text-[#333333] dark:text-[#e3e3e3] text-base font-medium'  />
            </label>

            {isAutch ?
                <div className='flex items-center gap-10'>
                    <Link href={"/create"} className='flex items-center gap-1 text-[#333333] dark:text-[#d9d9d9] text-lg font-medium transition-all ease-in-out duration-[.3s] hover:text-[#3a9989] dark:hover:text-[#3a9989]'><IoIosCreate /> Create</Link>
                    <Profile />
                </div>
                :
                <Button variant='default' className='h-full px-[30px] py-[12px] bg-[#333333] hover:bg-[#3a9989]'>Log in <IoLogInOutline /></Button>
            }
        </header>
    );
};