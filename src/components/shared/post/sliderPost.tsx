'use client'
import { cn } from '@/lib/utils';
import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react'
import { Swiper as SwiperType } from 'swiper';;
import 'swiper/css';

import { Navigation } from 'swiper/modules';
import { IoIosArrowBack } from "react-icons/io";

interface Props {
    className?: string;
    photos: { url: string }[];
} 

export const SliderPost: React.FC<Props> = ({ className, photos }) => {

    const [swiper, setSwiper] = useState<SwiperType | null>(null);

    const prevButtonRef = useRef<HTMLButtonElement>(null);
    const nextButtonRef = useRef<HTMLButtonElement>(null);


    useEffect(() => {
        if (swiper) {
            toggleButtons(swiper);

            swiper.on('slideChange', () => toggleButtons(swiper));
        }
    }, [swiper]);

    const toggleButtons = (swiperInstance: SwiperType) => {
        if (prevButtonRef.current) {
            prevButtonRef.current.style.display = swiperInstance.isBeginning ? 'none' : 'block';
        }

        if (nextButtonRef.current) {
            nextButtonRef.current.style.display = swiperInstance.isEnd ? 'none' : 'block';
        }
    };


    return (
        <div onClick={(e) => e.stopPropagation()} className={cn('relative cursor-pointer', className)}>
        <Swiper
            spaceBetween={10}
            slidesPerView={1}
            navigation={{
                prevEl: prevButtonRef.current,
                nextEl: nextButtonRef.current,
            }}
            modules={[Navigation]}
            className='mt-4'
            onSwiper={(swiperInstance) => setSwiper(swiperInstance)}
        >
            {photos.map((photo, index) => (
                <SwiperSlide key={index}>
                    
                    <div className='relative rounded-[7px] overflow-hidden w-full h-[400px]'>
                        <div 
                        className='absolute top-0 left-0 bg-cover bg-center blur-md z-[1] w-full h-full'
                        style={{ backgroundImage: `url(${photo.url})` }}></div>
                        <div className='relative z-[2] flex items-center justify-center h-full'>
                            <img src={photo.url} alt="avatar" className='max-w-full h-full block object-cover' loading="lazy" />
                        </div>
                    </div>

                </SwiperSlide>
            ))}
        </Swiper>

        <button ref={prevButtonRef} className="prev-button hidden absolute -left-[5px] top-1/2 transform -translate-y-1/2 p-2 rounded-full z-10 bg-[#c0c0c0]/80 dark:bg-[#3e3e3e]/80 active:bg-[#c0c0c0]/30 active:dark:bg-[#3e3e3e]/30">
            <IoIosArrowBack className='text-[#333333] dark:text-[#e3e3e3]' />
        </button>
        <button ref={nextButtonRef} className="next-button absolute -right-[5px] top-1/2 transform -translate-y-1/2 rotate-180 p-2 rounded-full z-10 bg-[#c0c0c0]/80 dark:bg-[#3e3e3e]/80 active:bg-[#c0c0c0]/30 active:dark:bg-[#3e3e3e]/30">
            <IoIosArrowBack className='text-[#333333] dark:text-[#e3e3e3]' />
        </button>
    </div>
    );
};
