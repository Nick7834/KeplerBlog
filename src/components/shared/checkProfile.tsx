import { cn } from '@/lib/utils';
import React from 'react';
import { BsCheck } from 'react-icons/bs';

interface Props {
    className?: string;
    isverified: boolean
} 

export const CheckProfile: React.FC<Props> = ({ className, isverified }) => {
    return (
        <>
        {isverified &&
            <span className={cn('relative flex flex-col items-center justify-center z-[1] group', className)}>
                <p className='absolute top-[-20px] -left-full flex flex-col items-center justify-center bg-[#7391d5] dark:bg-[#7391d5] text-[#d9d9d9] dark:text-[#d9d9d9] 
                rounded-[4px] p-[1px] w-[70px] text-xs uppercase transition-all ease-in-out duration-[.3s] -translate-y-1 opacity-0 invisible group-hover:opacity-100 
                group-hover:visible group-hover:translate-y-0'>
                    confirmed
                </p>
                <BsCheck size={22} className='text-[#7391d5]' />
            </span>
        }
        </>
    );
};
