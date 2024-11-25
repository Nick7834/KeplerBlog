'use client'
import { cn } from '@/lib/utils';
import React from 'react';
import { FaPen } from "react-icons/fa6";
import { FiSave } from "react-icons/fi";
import { Input } from '..';

interface Props {
    className?: string;
    nameProfile: string
} 

export const SettingsEdit: React.FC<Props> = ({ className, nameProfile }) => {

    const [isEdit, setIsEdit] = React.useState(false);


    return (
        <div className={cn('flex items-center gap-2', className)}>
            <b className={cn('text-[#333333] dark:text-[#d9d9d9] text-base', isEdit && 'hidden')}>{nameProfile}</b> 
            <Input type='text' value={nameProfile} onChange={(e) => console.log(e.target.value)} className={cn('bg-neutral-300/75 dark:bg-neutral-800/75 hidden', isEdit && 'block')} />
            <button onClick={() => setIsEdit(true)}><FaPen size={15} className={cn('text-[#333333] dark:text-[#d9d9d9]', isEdit && 'hidden')} /></button>
            <button onClick={() => setIsEdit(false)}><FiSave size={20} className={cn('text-[#333333] dark:text-[#d9d9d9]', !isEdit && 'hidden')} /></button>
       </div>
    );
};
