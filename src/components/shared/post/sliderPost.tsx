'use client'
import { cn } from '@/lib/utils';
import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react'
import { Swiper as SwiperType } from 'swiper';
import 'swiper/css';

import { Navigation } from 'swiper/modules';
import { IoIosArrowBack } from "react-icons/io";

interface Props {
    className?: string;
    photos?: string[];
    slideClass?: string;
    onPhotoClick?: (index: number, idPost: string) => void; 
    idPost?: string;
    slideIndex?: number;
    between?: number;
    showModal?: boolean
} 

export const SliderPost: React.FC<Props> = ({ 
    className, 
    photos, 
    slideClass, 
    onPhotoClick, 
    idPost, 
    slideIndex,
    between,
    showModal 
}) => {

    const [swiper, setSwiper] = useState<SwiperType | null>(null);

    const prevButtonRef = useRef<HTMLButtonElement>(null);
    const nextButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (swiper && slideIndex !== undefined) {
            swiper.slideTo(slideIndex); 
        }
    }, [swiper, slideIndex]);

    useEffect(() => {
        if (swiper) {
            toggleButtons(swiper);

            swiper.on('slideChange', () => toggleButtons(swiper));
        }
    }, [swiper]);

    useEffect(() => {
        if (showModal && swiper) {
            toggleButtons(swiper);
        }
    }, [showModal, swiper]);

    const toggleButtons = (swiperInstance: SwiperType) => {
        if (prevButtonRef.current) {
            prevButtonRef.current.style.display = swiperInstance.isBeginning ? 'none' : 'block';
        }

        if (nextButtonRef.current) {
            nextButtonRef.current.style.display = swiperInstance.isEnd ? 'none' : 'block';
        }
    };

    const handleSlideClick = (index: number, idPost: string | undefined) => {
        if (onPhotoClick) {
            onPhotoClick(index, idPost!);
        }
    };


    return (
        <div onClick={(e) => e.stopPropagation()} className={cn('slider relative cursor-pointer w-full', className)}>
        <Swiper
            initialSlide={slideIndex || 0}
            spaceBetween={between || 0}
            slidesPerView='auto'
            navigation={{
                prevEl: prevButtonRef.current,
                nextEl: nextButtonRef.current,
            }}
            modules={[Navigation]}
            onSwiper={(swiperInstance) => setSwiper(swiperInstance)}  
        >
            {photos && photos.map((photo, index) => (
                <SwiperSlide key={index} onClick={() => handleSlideClick(index, idPost)}>
                    
                    <div className={cn('slide-h relative rounded-[7px] overflow-hidden h-[400px]', slideClass)}>
                        <div 
                        className='absolute top-0 left-0 bg-cover bg-center blur-md z-[1] w-full h-full'
                        style={{ backgroundImage: `url(${photo})` }}></div>
                        <div className='relative z-[2] flex items-center justify-center h-full'>
                            <img src={photo} alt="slide" className='img-h max-w-full h-full block object-cover' loading="lazy" />
                        </div>
                    </div>

                </SwiperSlide>
            ))}
        </Swiper>

        <button ref={prevButtonRef} className="prev-button hidden absolute left-[10px] top-1/2 transform -translate-y-1/2 p-2 rounded-full z-10 bg-[#c0c0c0]/80 dark:bg-[#3e3e3e]/80 active:bg-[#c0c0c0]/30 active:dark:bg-[#3e3e3e]/30">
            <IoIosArrowBack className='text-[#333333] dark:text-[#e3e3e3]' />
        </button>
        <button ref={nextButtonRef} className="next-button absolute right-[10px] top-1/2 transform -translate-y-1/2 rotate-180 p-2 rounded-full z-10 bg-[#c0c0c0]/80 dark:bg-[#3e3e3e]/80 active:bg-[#c0c0c0]/30 active:dark:bg-[#3e3e3e]/30">
            <IoIosArrowBack className='text-[#333333] dark:text-[#e3e3e3]' />
        </button>
    </div>
    );
};
