'use client'

import { cn } from '@/lib/utils';
import { SliderPost } from '..';
import { useEffect } from 'react';
import { IoClose } from "react-icons/io5";

interface Props {
    className?: string;
    photos?: string[];
    slideIndex?: number;
    showModal?: boolean;
    setShowModal?: React.Dispatch<React.SetStateAction<boolean>>
} 

export const ModalPhoto: React.FC<Props> = ({ className, photos, slideIndex, showModal, setShowModal }) => {

    
    useEffect(() => {
        document.body.style.overflow = showModal ? 'hidden' : 'auto';
        return () => {
            document.body.style.overflow = 'auto';
        }
    }, [showModal]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
              setShowModal?.(false);
            }
          };

          document.addEventListener('keydown', handleKeyDown);
  
          return () => {
            document.removeEventListener('keydown', handleKeyDown);
          };
    }, [setShowModal])
   
    return (
        <div className={cn('select-none fixed left-0 top-0 w-full h-full z-[9999] flex items-center justify-center opacity-0 invisible transition-all ease-in-out duration-[.3s] bg-black', showModal ? 'opacity-100 visible' : '', className)}>

            <button onClick={(e) => (e.stopPropagation(), setShowModal?.(false))} className='absolute top-5 right-5 z-[10000] bg-transparent dark:bg-transparent block'><IoClose size={50} className='text-[#e3e3e3]' /></button>

            <SliderPost photos={photos} slideIndex={slideIndex} slideClass='s h-[100vh] rounded-none' showModal={showModal} />

        </div>
    );
};