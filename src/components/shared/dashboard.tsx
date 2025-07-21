import Link from 'next/link';
import React from 'react';
import { Nav } from '.';
import { cn } from '@/lib/utils';

interface Props {
    className?: string;
} 

export const Dashboard: React.FC<Props> = ({ className }) => {
    return (
        <div className={cn('dashboard fixed top-0 left-0 w-[270px] h-screen py-[20px] px-[30px] border-r border-solid border-[#D3D3D3] dark:border-white/80 flex flex-col', className)}>

            <Link href="/" className='flex items-center w-fit text-[#848484] dark:text-[#e3e3e3] text-5xl font-medium font-["Protest_Guerrilla"]'>K <span className='text-[#7391d5] font-["Protest_Guerrilla"]'>B</span></Link>

            <Nav className='mt-[60px]' />

            <p className='mt-auto text-[#797d7e] dark:text-[#e3e3e3] text-sm text-center font-medium'>© {new Date().getFullYear()} KeplerMedia</p>

        </div>
    );
};