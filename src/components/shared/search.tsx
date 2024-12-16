'use client'
import React, { useEffect, useRef, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { Button, Input } from '.';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { IoClose } from "react-icons/io5";

interface Props {
    className?: string;
    setSearchMobOpen: React.Dispatch<React.SetStateAction<boolean>>
    searchMobOpen: boolean
} 

export const Search: React.FC<Props> = ({ className, setSearchMobOpen, searchMobOpen }) => {

    const router = useRouter();

    const [focus, setFocus] = useState(false);
    const ref = useRef<HTMLLabelElement>(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const handClickOutside = (e: MouseEvent) => {
            if(ref.current && !ref.current.contains(e.target as Node)) {
                setFocus(false);
                setSearchMobOpen(false);
            }
        }

        document.addEventListener('mousedown', handClickOutside);

        return () => {
            document.removeEventListener('mousedown', handClickOutside);
        }
    }, [focus, setSearchMobOpen]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(search.trim() === '') return;

        setFocus(false);
        router.push(`/search?query=${search}`);
    }

    return (
        <form className={cn('search-block max-w-[600px] w-full ', searchMobOpen && 'active-search' )} onSubmit={(e) => handleSubmit(e)}>
            <label ref={ref} className={cn('w-full flex items-center gap-2 p-[12px] border border-solid bg-neutral-300/75 dark:bg-neutral-800/75 rounded-[10px]', focus ? 'border-[#333333] dark:border-[#e3e3e3]' : '', className)}>
                    <FiSearch size={16} className="text-[#333333] dark:text-[#e3e3e3]" />
                    <Input 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onFocus={() => setFocus(true)}
                        type='text' 
                        placeholder='Search' 
                        className='outline-none p-0 h-fit rounded-none border-0 w-full bg-transparent text-[#333333] dark:text-[#e3e3e3] text-base font-medium'  
                    />
                    <Button type='button' onClick={() => (setSearchMobOpen(false), setSearch(''))} variant='outline' className='search-button-mob p-0 h-fit hidden bg-transparent border-0 hover:bg-transparent [&_svg]:size-[20px]'><IoClose className='text-[#333333] dark:text-[#e3e3e3] text-xl' /></Button>
            </label>
        </form>
    );
};
