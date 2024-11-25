import Link from 'next/link';
import React from 'react';
import { Nav } from '.';
import { cn } from '@/lib/utils';

interface Props {
    className?: string;
} 

export const Dashboard: React.FC<Props> = ({ className }) => {
    return (
        <div className={cn('sticky top-0 h-[100vh] py-[20px] px-[30px] border-r border-solid border-[#D3D3D3] dark:border-white/80 flex flex-col', className)}>

            <Link href="/" className='w-fit text-[#797d7e] dark:text-[#e3e3e3] text-3xl font-black'>Kepler<span className='text-[#3a9989]'>Blog</span></Link>

            <Nav className='mt-[60px]' />

            <p className='mt-auto text-[#797d7e] dark:text-[#e3e3e3] text-sm text-center font-medium'>© {new Date().getFullYear()} KeplerMedia, Inc</p>

        </div>
    );
};