import { cn } from '@/lib/utils';
import React from 'react';
import Image from 'next/image';
import { IoCameraSharp } from "react-icons/io5";

interface Props {
    className?: string;
} 

export const TopBanner: React.FC<Props> = ({ className }) => {
    return (
        <div className={cn('w-full max-w-[1250px]', className)}>
            <div
                className='relative w-full max-w-[1250px] h-[200px] bg-cover bg-center bg-no-repeat rounded-[20px] overflow-hidden'
                style={{ backgroundImage: 'url(https://img3.akspic.ru/crops/3/4/8/8/3/138843/138843-cnidaria-bespozvonochnyh-sinij-more-meduza-3840x2160.jpg)'}}
            >
                 <input type="file" id='fileBanner' className='hidden' />
                <label htmlFor="fileBanner" className='cursor-pointer absolute top-0 left-0 flex items-center justify-center w-full h-full bg-neutral-800/50'><IoCameraSharp size={70} className='text-[#e3e3e3] dark:text-[#e3e3e3]' /></label>
            </div>

            <div className="relative flex items-start justify-start px-[50px] gap-4">
                <div className='relative w-[100px] h-[100px] mt-[-50px] overflow-hidden rounded-full'>
                    <Image src="https://cspromogame.ru//storage/upload_images/avatars/3358.jpg" alt="avatar" width={100} height={100} className='w-[100px] h-[100px] block object-cover rounded-full z-[1]' />
                    <input type="file" id='fileAvatar' className='hidden' />
                    <label htmlFor="fileAvatar" id="fileAvatar" className='cursor-pointer absolute top-0 left-0 flex items-center justify-center w-full h-full bg-neutral-800/50'><IoCameraSharp size={50} className='text-[#e3e3e3] dark:text-[#e3e3e3]' /></label>
                </div>
            </div>
        </div>
    );
};
