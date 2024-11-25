'use client'
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { photos } from './createPost/photos';

import { usePathname, useRouter } from 'next/navigation';
import { Button, SliderPost, ActionPanel } from '.';

interface Props {
    className?: string;
    onClick?: () => void;
} 

export const Post: React.FC<Props> = ({ className, onClick }) => {

    const router = useRouter();
    const pathname = usePathname();
    
    const count = 222454;
    const text = 'Космос — это безбрежное пространство, которое окружает нашу планету и простирается на миллиарды световых лет. Он полон загадок и тайн, многие из которых человечество только начинает раскрывать. Космос не только удивляет своим масштабом, но и вдохновляет на новые научные открытия. Сначала космос казался недосягаемым, но с развитием технологий человечество научилось исследовать его. В 1969 году первый человек, Нил Армстронг, ступил на Луну, что стало историческим моментом в освоении космоса. Этот шаг открыл новую эру для астрономии и космонавтики, положив начало активному исследованию других планет, звёзд и галактик. Одним из самых интересных объектов космоса являются чёрные дыры — области с таким сильным гравитационным полем, что даже свет не может покинуть их. Чёрные дыры могут образовываться в конце жизни крупных звёзд и могут поглощать всё, что находится в их ближайшем окружении. Звёзды, галактики, планеты, астероиды и кометы — всё это части величественного космоса. И несмотря на то что мы ещё не знаем всего о Вселенной, каждое новое открытие приближает нас к разгадке её бескрайних тайн.'

    return (
        <div onClick={() => pathname.startsWith('/post') ? null : router.push(`/post/${count}`)} className={cn('max-w-[750px] p-3 bg-[#e0e0e0]/95 dark:bg-[#2a2a2a] rounded-[10px] border border-[#b0b0b0]/70 transition-all ease-in-out duration-[.3s] cursor-pointer dark:bg-[#1d1d1d]/95 hover:bg-[#d1d1d1]/60 hover:dark:bg-[#333333]/60', className)}>

                <div className='flex items-center justify-between'>
                    <Link onClick={(e) => e.stopPropagation()} href="/profile" className="flex items-center gap-3 w-fit">
                            <Image 
                                src="https://cspromogame.ru//storage/upload_images/avatars/3358.jpg" 
                                alt="avatar" 
                                width={40} 
                                height={40} 
                                className='rounded-full'
                            />
                            <span className='text-[#333333] dark:text-[#d9d9d9] text-base font-semibold'>Kepler</span>
                    </Link>
                    {!pathname.startsWith('/profile') && <Button onClick={(e) => e.stopPropagation()} className='py-[6px] px-3 leading-2 h-fit text-xs'>Subscribe</Button>}
                </div>

                <h2 className='mt-4 text-[#333333] dark:text-[#d9d9d9] text-lg font-bold'>Свет за окном</h2>
                <p className='mt-2 text-[#333333] dark:text-[#d9d9d9] text-sm font-normal leading-6'>{text.length > 500 ? text.substring(0, 500).trim() + '...' : text.trim()}</p>
                
                <SliderPost photos={photos} />

                <ActionPanel count={count} pathname={pathname} router={router} onClick={onClick} />

        </div>
    );
};