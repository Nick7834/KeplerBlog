'use client'
import { cn } from '@/lib/utils';
import React from 'react';
import { IoCameraSharp } from "react-icons/io5";
import { User } from '@prisma/client';
import toast from 'react-hot-toast';
import axios from 'axios';

interface Props {
    className?: string;
    user: User | null;
} 

export const TopBanner: React.FC<Props> = ({ className, user }) => {

    const [avatar, setAvatar] = React.useState<string | null>(user?.profileImage || null);
    const [poster, setPoster] = React.useState<string | null>(user?.poster || null);

    const handleNewPhoto = async (file: File, type: 'avatar' | 'poster') => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type); 

        const maxFileSize = 15 * 1024 * 1024; 

        if (file && file.size > maxFileSize) {
            toast.error('File size exceeds the 15MB limit.');
            return;
        }

        try {
            const res = await axios.post('/api/upload', formData);
          
              if (res.status === 200) {
                toast.success('Photo uploaded successfully');
              }

              if (type === 'avatar') {
                setAvatar(URL.createObjectURL(file));
              } else if (type === 'poster') {
                setPoster(URL.createObjectURL(file));
              }

        } catch (error) {
            console.warn(error);
            toast.error('Something went wrong');
        }
    }

    const handleChangePhoto = (event: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'poster') => {
        const file = event.target.files?.[0];   

        if (!file?.type.startsWith('image/')) {
            toast.error('Please select an image file.');
            return;
        }

        if (file) {
            handleNewPhoto(file, type);
        }
    }

    return (
        <div className={cn('w-full max-w-[1250px]', className)}>
            <div className='relative w-full max-w-[1250px] h-[clamp(8.125rem,6.066rem+8.24vw,12.5rem)] rounded-[20px] overflow-hidden'>
               {poster && <div className='w-full h-full bg-cover bg-center bg-no-repeat rounded-[20px] overflow-hidden'
                style={{backgroundImage: `url(${poster})`}}>
                </div>}
                <div className='w-full h-full bg-[#908f8f]'></div>
                 <input 
                    type="file" 
                    id='fileBanner' 
                    className='hidden' 
                    onChange={(e) => handleChangePhoto(e, 'poster')}
                 />
                    <label htmlFor="fileBanner" className='cursor-pointer absolute top-0 left-0 flex items-center justify-center w-full h-full bg-neutral-800/50'><IoCameraSharp size={70} className='text-[#e3e3e3] dark:text-[#e3e3e3]' /></label>
            </div>

            <div className="settings-top relative flex items-start justify-start px-[clamp(0.625rem,-0.551rem+4.71vw,3.125rem)] gap-[clamp(0.625rem,0.449rem+0.71vw,1rem)]">
                <div className='relative max-w-[clamp(5.625rem,5.331rem+1.18vw,6.25rem)] h-[clamp(5.625rem,5.331rem+1.18vw,6.25rem)] min-h-[clamp(5.625rem,5.331rem+1.18vw,6.25rem)] mt-[-50px] overflow-hidden rounded-full'>
                    {avatar ? 
                    <img src={avatar} alt="profile" className={cn('block min-w-[clamp(5.625rem,5.331rem+1.18vw,6.25rem)] max-w-[clamp(5.625rem,5.331rem+1.18vw,6.25rem)] h-[clamp(5.625rem,5.331rem+1.18vw,6.25rem)] min-h-[clamp(5.625rem,5.331rem+1.18vw,6.25rem)] object-cover z-[1] overflow-hidden rounded-full')} /> : 
                    <span className={cn('flex flex-col items-center justify-center z-[1] mt-[-50px] overflow-hidden rounded-full min-w-[clamp(5.625rem,5.331rem+1.18vw,6.25rem)] h-[clamp(5.625rem,5.331rem+1.18vw,6.25rem)] bg-[#c7c7c7]', !poster && 'mt-0')} ></span>}
                    <input 
                        type="file" 
                        id='fileAvatar' 
                        className='hidden' 
                        onChange={(e) => handleChangePhoto(e, 'avatar')}
                    />
                    <label htmlFor="fileAvatar" id="fileAvatar" className='cursor-pointer absolute top-0 left-0 flex items-center justify-center w-full h-full bg-neutral-800/50'><IoCameraSharp size={50} className='text-[#e3e3e3] dark:text-[#e3e3e3]' /></label>
                </div>
            </div>
        </div>
    );
};