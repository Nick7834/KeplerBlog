'use client'
import { cn } from '@/lib/utils';
import React from 'react';
import { IoCameraSharp } from "react-icons/io5";
import { User } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { MdDelete } from "react-icons/md";
import { usePhotoSettings } from '@/components/hooks/usePhoto';

interface Props {
    className?: string;
    user: User | null;
} 

export const TopBanner: React.FC<Props> = ({ className, user }) => {

    const { avatar, poster, handleChangePhoto, handleDeletePhoto } = usePhotoSettings(user as User);

    return (
        <div className={cn('w-full max-w-[clamp(65.625rem,22.569rem+44.44vw,78.125rem)]', className)}>
            <div className='relative w-full max-w-[clamp(65.625rem,22.569rem+44.44vw,78.125rem)] h-[clamp(8.125rem,6.066rem+8.24vw,12.5rem)] rounded-[20px] overflow-hidden'>
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
                <label htmlFor="fileBanner" className='cursor-pointer absolute top-0 left-0 flex items-center justify-center w-full h-full bg-neutral-800/50'>
                    <IoCameraSharp size={70} className='text-[#e3e3e3] dark:text-[#e3e3e3]' />
                </label>
                {poster && 
                    <Button 
                        onClick={() => handleDeletePhoto('poster', poster)} 
                        variant="secondary" 
                        className='p-2 w-fit absolute top-2 right-2 bg-0 hover:bg-0 z-5 [&_svg]:size-[25px] group'
                    >
                        <MdDelete className='text-2xl transition-all ease-in-out duration-[.3s] text-[#fd4141] dark:text-[#fd4141] group-hover:text-[#ff0000] dark:group-hover:text-[#ff0000]' />
                    </Button>
                }
            </div>

            <div className="settings-top relative flex items-start justify-start px-[clamp(0.625rem,-0.551rem+4.71vw,3.125rem)] gap-[clamp(0.625rem,0.449rem+0.71vw,1rem)]">
                <div className='relative max-w-[clamp(5.625rem,5.331rem+1.18vw,6.25rem)] h-[clamp(5.625rem,5.331rem+1.18vw,6.25rem)] min-h-[clamp(5.625rem,5.331rem+1.18vw,6.25rem)] mt-[-50px] overflow-hidden rounded-full'>
                    {avatar ? 
                    <img src={avatar} alt="profile" className={cn('block min-w-[clamp(5.625rem,5.331rem+1.18vw,6.25rem)] max-w-[clamp(5.625rem,5.331rem+1.18vw,6.25rem)] h-[clamp(5.625rem,5.331rem+1.18vw,6.25rem)] min-h-[clamp(5.625rem,5.331rem+1.18vw,6.25rem)] object-cover z-[1] overflow-hidden rounded-full')} /> : 
                    <span className={cn('flex flex-col items-center justify-center z-[1] overflow-hidden rounded-full min-w-[clamp(5.625rem,5.331rem+1.18vw,6.25rem)] h-[clamp(5.625rem,5.331rem+1.18vw,6.25rem)] bg-[#c7c7c7]', !poster && 'mt-0')} ></span>}
                    <input 
                        type="file" 
                        id='fileAvatar' 
                        className='hidden' 
                        onChange={(e) => handleChangePhoto(e, 'avatar')}
                    />
                    <label htmlFor="fileAvatar" id="fileAvatar" className='cursor-pointer absolute top-0 left-0 flex items-center justify-center w-full h-full bg-neutral-800/50'><IoCameraSharp size={50} className='text-[#e3e3e3] dark:text-[#e3e3e3]' /></label>
                    {avatar && 
                        <Button 
                            onClick={() => handleDeletePhoto('avatar', avatar)} 
                            variant="secondary" 
                            className='p-2 w-fit absolute top-1 right-1 bg-0 hover:bg-0 z-5 [&_svg]:size-[20px] group'>
                                <MdDelete className='text-2xl transition-all ease-in-out duration-[.3s] text-[#fd4141] dark:text-[#fd4141] group-hover:text-[#ff0000] dark:group-hover:text-[#ff0000]' />
                        </Button>
                    }
                </div>
            </div>
        </div>
    );
};