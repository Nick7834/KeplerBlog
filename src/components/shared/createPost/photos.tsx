import { cn } from '@/lib/utils';
import React from 'react';
import Image from 'next/image';
import { MdDelete } from "react-icons/md";
import { PreviewItem } from '../settings/editPostInput';

interface Props {
    className?: string;
    photos: PreviewItem[];
    setPhotoPreview: React.Dispatch<React.SetStateAction<PreviewItem[]>>;
    setOldPhotos?: React.Dispatch<React.SetStateAction<string[]>>;
    setPhotos?: React.Dispatch<React.SetStateAction<File[]>>;
    setNewPhotos?: React.Dispatch<React.SetStateAction<File[]>>;
} 

export const Photos: React.FC<Props> = ({ className, photos, setPhotoPreview, setPhotos, setNewPhotos, setOldPhotos }) => {

    const handleDelete = (index: number) => {
        setPhotoPreview((prev) => prev.filter((_, i) => i !== index))

        const photoItem = photos[index];
        
        if(setPhotos) {
            setPhotos((prev) => prev.filter((_, i) => i !== index))
        }

        if(photoItem.type === "old" && setOldPhotos) {
            setOldPhotos((prev) => prev.filter((_, i) => i !== index))
        }

        if(photoItem.type === "new" && setNewPhotos) {
            setNewPhotos((prev) => prev.filter((_, i) => i !== index))
        }
    };

    return (
        <>
            {photos.length > 0 && 
            <div className={cn('photo-block w-[clamp(22.75rem,15.809rem+27.76vw,37.5rem)] flex items-center gap-5 bg-neutral-300/75 dark:bg-neutral-800/75 rounded-[10px] px-[12px] py-[7px]', className)}>
                {photos.map((photo, index) => (
                    <div key={index} className='relative'>
                        <button onClick={() => handleDelete(index)} className='p-[2px] absolute top-[-7px] right-[-7px] z-[5] bg-[#333333]/80 rounded-full'><MdDelete size={20} className='text-[#e3e3e3]' /></button>
                        <Image src={photo.src} alt="prewiew" width={100} height={100} className='min-w-[100px] h-[100px] block object-cover rounded-[7px]' />
                    </div>
                ))}
            </div>}
        </>
    );
};
