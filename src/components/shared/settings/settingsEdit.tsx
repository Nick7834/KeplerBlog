'use client'
import { cn } from '@/lib/utils';
import React from 'react';
import { FaPen } from "react-icons/fa6";
import { FiSave } from "react-icons/fi";
import { Input } from '..';
import { Control, useController } from 'react-hook-form';

interface FormData {
    email: string;
    username: string;
    bio?: string;
}

interface Props {
    className?: string;
    nameProfile: string;
    name: 'email' | 'username' | 'bio'; 
    control: Control<FormData>;
    onSubmit: () => void;
} 

export const SettingsEdit: React.FC<Props> = ({ className, nameProfile, name, control, onSubmit, ...props }) => {

    const [isEdit, setIsEdit] = React.useState(false);

    const { field, fieldState: { error } } = useController({
        name,
        control,
        defaultValue: nameProfile || ''
    });

    const handleSave = () => {
        onSubmit();
        setIsEdit(false);
    }

    const errorText = error?.message;

    return (
        <div className={cn('flex items-center gap-2', className)}>
            <b className={cn('text-[#333333] dark:text-[#d9d9d9] text-base', isEdit && 'hidden')}>{nameProfile}</b> 
            <div className='flex flex-col gap-1'>
                <Input 
                    type='text' 
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    {...props}
                    className={cn('bg-neutral-300/75 dark:bg-neutral-800/75 hidden', isEdit && 'block')} 
                />
                {errorText && <p className={cn('text-red-500 text-sm mt-2', className)}>{errorText}</p>}
            </div>
            <button onClick={() => setIsEdit(true)}><FaPen size={15} className={cn('text-[#333333] dark:text-[#d9d9d9]', isEdit && 'hidden')} /></button>
            <button type='submit' onClick={() => handleSave()}><FiSave size={20} className={cn('text-[#333333] dark:text-[#d9d9d9]', !isEdit && 'hidden')} /></button>
       </div>
    );
};
