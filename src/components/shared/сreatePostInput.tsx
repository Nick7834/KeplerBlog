import React from 'react';

import { Button } from '../ui/button';
import { MdCreate } from "react-icons/md";
import { cn } from '@/lib/utils';

import { Photos } from './createPost/photos';
import { TitlePost, Editor } from '.';


interface Props {
    className?: string;
} 


export const CreatePostInput: React.FC<Props> = ({ className }) => {

    return (
        <div className={cn('flex flex-col max-w-[600px] mt-8', className)}>

            <Photos />

            <TitlePost />

            <Editor />

            <div className="flex flex-col items-end mt-[30px]">
                <Button className='px-[30px] flex items-center text-[#d9d9d9] dark:text-[#333333] bg-[#333333] dark:bg-[#d9d9d9] hover:bg-[#3a9989] dark:hover:bg-[#3a9989]'>Create <MdCreate /></Button>
            </div>

        </div>
    );
};


