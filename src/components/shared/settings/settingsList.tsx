'use client'
import { UseDarkMode } from '@/components/hooks/useDarkMode';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import React from 'react';
import { SettingsEdit } from '..';


interface Props {
    className?: string;
} 

export const SettingsList: React.FC<Props> = ({ className }) => {

    const nameProfile = 'Kepler'

    const { theme, handleToggle } = UseDarkMode();
    
    return (
        <div className={className}>

            <ul className='flex flex-col gap-4 mt-12'>
                <li className='flex items-center'>
                    <span className='w-[200px] text-[#333333] dark:text-[#d9d9d9] text-lg font-medium'>Email</span> 
                    <b className='text-[#333333] dark:text-[#d9d9d9] text-base'>history4527@gmal.com</b>
                </li>
                <li className='flex items-center'>
                    <span className='w-[200px] text-[#333333] dark:text-[#d9d9d9] text-lg font-medium'>Name</span> 
                    
                    <SettingsEdit nameProfile={nameProfile} />
                </li>
                <li className='flex items-center'>
                    <span className='w-[200px] text-[#333333] dark:text-[#d9d9d9] text-lg font-medium'>Thema</span>
                    <Switch checked={theme === 'dark'} onCheckedChange={handleToggle} />
                </li>
                <li className='flex items-center'>
                    <span className='w-[200px] text-[#333333] dark:text-[#d9d9d9] text-lg font-medium'>Delete account</span>
                    <Button className='px-[30px] bg-[#F03535] text-[#d9d9d9] hover:bg-[#F03535]/70'>Delete</Button>
                </li>
            </ul>


        </div>
    );
};
