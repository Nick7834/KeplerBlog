import { cn } from '@/lib/utils';
import Image from 'next/image';
import React from 'react';
import { UseFormatNumber } from '../hooks/useFormatNumber';
import { IoMdSettings } from 'react-icons/io';
import Link from 'next/link';
import { Button } from '../ui/button';

interface Props {
    className?: string;
} 

export const ProfileTop: React.FC<Props> = ({ className }) => {

    const formattedCount = UseFormatNumber(224767);

    const isAutch = true;

    return (
        <div className={cn('w-full max-w-[1250px]', className)}>
            <div
                className='w-full max-w-[1250px] h-[200px] bg-cover bg-center bg-no-repeat rounded-[20px]'
                style={{ backgroundImage: 'url(https://img3.akspic.ru/crops/3/4/8/8/3/138843/138843-cnidaria-bespozvonochnyh-sinij-more-meduza-3840x2160.jpg)'}}
            >
            </div>

            <div className="relative flex items-start justify-start px-[50px] gap-4">
                <Image src="https://cspromogame.ru//storage/upload_images/avatars/3358.jpg" alt="avatar" width={100} height={100} className='w-[100px] h-[100px] block object-cover rounded-full z-[1] mt-[-50px]' />
                <div className='mt-[2px] flex items-center justify-between gap-5 w-full'>
                    <div className="flex flex-col">
                            <h2 className='text-[#333333] dark:text-[#d9d9d9] text-xl font-medium leading-6'>Kepler</h2>
                            <span className='text-[#333333] dark:text-[#d9d9d9] text-sm font-normal mt-1'>{formattedCount} Subscribe</span>
                    </div>
                   {!isAutch ? <Button className='py-[6px] px-5 leading-2 h-fit text-sm'>Subscribe</Button> : <Link href="/settings" className='transition-all ease-in-out duration-[.3s] cursor-pointer m-3 hover:rotate-90'><IoMdSettings size={20} className='text-[#333333] dark:text-[#e3e3e3]' /></Link>}
                </div>
            </div>
        </div>
    );
};