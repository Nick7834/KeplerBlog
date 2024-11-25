import { cn } from '@/lib/utils';
import React from 'react';
import Image from 'next/image';
import { MdDelete } from "react-icons/md";

interface Props {
    className?: string;
} 


export const photos = [
    {
        url: 'https://i.pinimg.com/736x/a1/f4/f4/a1f4f4855bc34585ab2f7ba0315db214.jpg',
    },
    {
        url: 'https://avatars.mds.yandex.net/i?id=89cbeae29f90833944158d0410ca7e67_l-5210051-images-thumbs&n=13',
    },
    {
        url: 'https://u.livelib.ru/reader/Julia_cherry/o/3y1jb0tl/o-o.jpeg',
    }, 
    {
        url: 'https://i.pinimg.com/originals/54/f0/0d/54f00d8db15056704cf9422d50db465e.jpg',
    }, 
    {
        url: 'https://i.pinimg.com/736x/e9/b5/63/e9b5635172c1164a6303eb5b6ad373bc.jpg',
    },
]

export const Photos: React.FC<Props> = ({ className }) => {


    return (
        <div className={cn('w-fit flex items-center gap-5 bg-neutral-300/75 dark:bg-neutral-800/75 rounded-[10px] px-[12px] py-[7px]', className)}>
        {photos.map((photo, index) => (
            <div key={index} className='relative'>
                <button className='p-[2px] absolute top-[-7px] right-[-7px] z-[5] bg-[#333333]/80 rounded-full'><MdDelete size={20} className='text-[#e3e3e3]' /></button>
                <Image src={photo.url} alt="avatar" width={100} height={100} className='w-[100px] h-[100px] block object-cover rounded-[7px]' />
            </div>
        ))}
    </div>
    );
};
