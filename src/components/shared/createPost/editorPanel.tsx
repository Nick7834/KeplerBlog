import { cn } from '@/lib/utils';
import React from 'react';
import { FaBold } from "react-icons/fa";
import { FaItalic } from "react-icons/fa";
import { MdFormatUnderlined } from "react-icons/md";
import { FaImage } from "react-icons/fa6";

interface Props {
    className?: string;
    toggleBold: () => void;
    toggleItalic: () => void;
    toggleUnderline: () => void;
} 

export const EditorPanel: React.FC<Props> = ({ className, toggleBold, toggleItalic, toggleUnderline }) => {

    const buttonFun = [
        {
            name: 'fun',
            svg: <FaBold size={16} />,
            fun: toggleBold
        },
        {
            name: 'fun',
            svg: <FaItalic size={16} />,
            fun: toggleItalic
        },
        {
            name: 'fun',
            svg: <MdFormatUnderlined size={16} />,
            fun: toggleUnderline
        },
        {
            name: 'img',
            svg: <FaImage size={16} />
        }
    ]

    return (
        <div>
            
            <div className={cn('mt-5 flex items-center gap-5 bg-neutral-300/75 dark:bg-neutral-800/75 rounded-t-[10px] px-[12px] py-[7px] w-fit', className)}>
                {buttonFun.map((button, index) => {
                    if(button.name === 'fun') {
                      return <button key={index} onClick={button.fun}>{button.svg}</button>
                    }

                    if(button.name === 'img') {
                      return <div key={index} className='flex items-center justify-center'>
                        <input type="file" id="fileImg" className="hidden" />
                        <label htmlFor="fileImg" className='block'><span className='cursor-pointer'>{button.svg}</span></label>
                      </div>
                    }
                })}
            </div>
        </div>
    );
};
