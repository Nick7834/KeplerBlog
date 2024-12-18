'use client'
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

import { usePathname, useRouter } from 'next/navigation';
import { Button, SliderPost, ActionPanel } from '.';
import { convertFromRaw, RawDraftContentState } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { useSession } from 'next-auth/react';
import { MdCreate } from 'react-icons/md';
import { FaRegUser } from 'react-icons/fa6';
import { JsonValue } from '@prisma/client/runtime/library';
import { ModalPhoto } from './post/modalPhoto';
import { FollowButton } from './followButton';
import axios from 'axios';

export interface IPost {
    id: string;
    title: string;
    content?: RawDraftContentState | JsonValue;
    image?: string[];
    author: {
        id: string;
        username: string;
        profileImage: string | null;
    };
    comments: {
        id: string;
        content: string;
        createdAt: Date;
        author: {
            id: string;
            username: string;
            profileImage: string | null;
        }
    }[]; 
    likes: {
        id: string;
    }[];
    _count: {
        comments: number;
        likes: number;
    };
}

interface Props {
    className?: string;
    onClick?: () => void;
    post: IPost
} 

export const Post: React.FC<Props> = ({ className, onClick, post }) => {
    const session = useSession();

    const contentState = post?.content ? convertFromRaw(post?.content as RawDraftContentState) : '';
    const text = contentState ? contentState.getPlainText() : '';
    const html = contentState ? stateToHTML(contentState) : '';

    const [showModal, setShowModal] = React.useState(false);
    const [slideIndex, setSlideIndex] = useState(0);
    const [photos, setPhotos] = useState<string[]>([]);
    
    const router = useRouter();
    const pathname = usePathname();

    const handlePhotoClick = async (index: number, idPost: string) => {
        try {
            const resp = await axios.get(`/api/posts/${idPost}/photo`);
            setPhotos(resp.data.photos.image);
            setSlideIndex(index);
            setShowModal(!showModal);
        } catch(error) {
            console.warn(error);
        }
    }

    return (
        <div onClick={() => pathname.startsWith('/post') ? null : router.push(`/post/${post?.id}`)} className={cn('max-w-[750px] w-full flex-1 p-3 bg-[#e0e0e0]/95 dark:bg-[#2a2a2a] rounded-[10px] border border-[#b0b0b0]/70 transition-all ease-in-out duration-[.3s] cursor-pointer dark:bg-[#1d1d1d]/95 hover:bg-[#d1d1d1]/60 hover:dark:bg-[#333333]/60', className)}>

                <div className='flex items-center justify-between'>
                    <Link onClick={(e) => e.stopPropagation()} href={`/profile/${post?.author?.id}`} className="flex items-center gap-3 w-fit">
                    <div>
                        {
                            post?.author?.profileImage ? 
                            <Image 
                                src={post?.author?.profileImage} 
                                alt="avatar" 
                                width={40} 
                                height={40} 
                                className='rounded-full w-[40px] h-[40px] object-cover'
                            /> : 
                        <span className='flex flex-col items-center justify-center z-[1] overflow-hidden rounded-full min-w-[40px] h-[40px] bg-[#c7c7c7]' ><FaRegUser size={20} className='text-[#333333]' /></span>
                        }
                    </div>
                            <span className='text-[#333333] dark:text-[#d9d9d9] text-base font-semibold'>{post?.author?.username}</span>
                    </Link>


                    {post?.author?.id === session?.data?.user?.id ? 
                        <Button 
                            onClick={(e) => (e.stopPropagation(), 
                            router.push(`/edit/${post?.id}`))} 
                            className='p-0 min-h-7 min-w-7 h-fit text-xs rounded-full bg-[#d5d5d5] dark:bg-[#e0e0e0]/95 hover:bg-[#d5d5d5] hover:dark:bg-[#e0e0e0]/95'>
                                <MdCreate size={10} className='text-[#333333] dark:text-[#333333]' />
                        </Button> : 
                        pathname.startsWith('/post') &&
                        <div onClick={(e) => e.stopPropagation()}><FollowButton idUser={post?.author?.id} /></div>  
                    }
                </div>

                <h2 className='mt-4 text-[#333333] dark:text-[#d9d9d9] text-lg font-bold'>{post?.title}</h2>
                 {text !== '' && <div className='mt-2 text-[#333333] dark:text-[#d9d9d9] text-sm font-normal leading-6'>
                    {!pathname.startsWith('/post') ? 
                    (text.length > 200 ? text.substring(0, 200).trim() + '...' : text.trim()) :
                     <div dangerouslySetInnerHTML={{ __html: html }}></div>
                     }
                </div>}
                
                {post?.image && post?.image.length > 0 && 
                    <SliderPost 
                        photos={post?.image} 
                        onPhotoClick={handlePhotoClick} 
                        idPost={post?.id} 
                        between={10}
                        className='mt-4' 
                />}

                <ActionPanel idPost={post?.id} count={post?._count} pathname={pathname} router={router} onClick={onClick} />

                <ModalPhoto photos={photos} slideIndex={slideIndex} showModal={showModal} setShowModal={setShowModal} />
        </div>
    );
};
