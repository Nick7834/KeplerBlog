'use client'
import React from 'react';
import { Input } from '.';
import { useFormContext } from 'react-hook-form';
import { cn } from '@/lib/utils';

interface Props {
    name: string;
    label?: string;
    required?: boolean;
    className?: string;
    type?: string;
} 

export const Form: React.FC<Props> = ({ className, name, label, required, ...props }) => {

    const {
        register,
        formState: { errors },
    } = useFormContext();

    const errotText = errors?.[name]?.message as string;

    return (
        <div className={ className }>
            <label htmlFor={name}>{ label }{required && <span className='text-red-500'> *</span>}</label>

            <Input className="h-12 text-md bg-neutral-300/75 dark:bg-neutral-800/75 border border-solid border-neutral-800/30 dark:border-[#b0b0b0]/70" {...register(name)} {...props} />

            {errotText && <p className={cn('text-red-500 text-sm mt-2', className)}>{errotText}</p>}
        </div>
    );
};
