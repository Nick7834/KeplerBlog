'use client'
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

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
import { getShortTimeAgo } from '../hooks/useDate';
import { processContent } from '@/lib/processContent';
import { ModalShare } from './modalShare';
import { CheckProfile } from './checkProfile';

export interface IPost {
    createdAt: Date;
    id: string;
    title: string;
    content?: RawDraftContentState | JsonValue;
    image?: string[];
    author: {
        id: string;
        username: string;
        profileImage: string | null;
        isverified: boolean;
    };
    comments: {
        id: string;
        content: string;
        createdAt: Date;
        author: {
            id: string;
            username: string;
            profileImage: string | null;
            isverified: boolean;
        }
    }[]; 
    isLiked: boolean;
    isFollowing: boolean;
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

    const commentContentText = processContent(html, true);

    const timeAgo = getShortTimeAgo(new Date(post.createdAt));

    const [showModal, setShowModal] = useState(false);
    const [slideIndex, setSlideIndex] = useState(0);
    const [photos, setPhotos] = useState<string[]>([]);

    const [showModalShare, setShowModalShare] = useState(false);
    const [idPostShare, setIdPostShare] = useState('');

    const [widthMob, setWidthMob] = useState(window.innerWidth);
    
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

    useEffect(() => {
        const handleResize = () => setWidthMob(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            <div onClick={() => pathname.startsWith('/post') ? null : router.push(`/post/${post?.id}`)} className={cn('max-w-[750px] w-full flex-1 p-3 bg-[#e0e0e0]/95 dark:bg-[#2a2a2a] rounded-[10px] border border-[#b0b0b0]/70 transition-all ease-in-out duration-[.3s] cursor-pointer dark:bg-[#1d1d1d]/95 hover:bg-[#d1d1d1]/60 hover:dark:bg-[#333333]/60', className)}>

            <div className='flex gap-1 items-center justify-between'>
                <Link onClick={(e) => e.stopPropagation()} href={`/profile/${post?.author?.id}`} className="flex items-center gap-3 w-fit">
                <div>
                    {
                        post?.author?.profileImage ? 
                        <Image 
                            src={post?.author?.profileImage} 
                            alt="avatar" 
                            width={40} 
                            height={40} 
                            className='rounded-full min-w-[40px] h-[40px] object-cover'
                        /> : 
                    <span className='flex flex-col items-center justify-center z-[1] overflow-hidden rounded-full min-w-[40px] h-[40px] bg-[#c7c7c7]' ><FaRegUser size={20} className='text-[#333333]' /></span>
                    }
                </div>
                        <div className={cn('flex items-center text-[#333333] dark:text-[#d9d9d9] text-base font-semibold break-all', 
                            pathname.startsWith('/post') && post?.author?.username.length >= 10 && widthMob <= 450 ? 'block' : 'flex')}>
                            <div className='flex items-center gap-[2px]'>
                            {pathname.startsWith('/post') ? 
                                post?.author?.username :
                                post?.author?.username.length > 15 && widthMob <= 380 ? post?.author?.username.substring(0, 15).trim()  + '...' : post?.author?.username.trim()
                            }
                            <CheckProfile isverified={post?.author?.isverified} />
                            </div>
                            <span className='mx-2'>·</span> 
                            <div className='text-[#797d7e] dark:text-[#e3e3e3] text-sm font-normal'>{timeAgo}</div>
                        </div>
                </Link>


                {post?.author?.id === session?.data?.user?.id ? 
                    <Button 
                        onClick={(e) => (e.stopPropagation(), 
                        router.push(`/edit/${post?.id}`))} 
                        className='p-0 min-h-7 min-w-7 h-fit text-xs rounded-full bg-[#d5d5d5] dark:bg-[#e0e0e0]/95 hover:bg-[#d5d5d5] hover:dark:bg-[#e0e0e0]/95'>
                            <MdCreate size={10} className='text-[#333333] dark:text-[#333333]' />
                    </Button> : 
                    pathname.startsWith('/post') &&
                    <div onClick={(e) => e.stopPropagation()}>
                        <FollowButton idUser={post?.author?.id} isFollowUser={post?.isFollowing} />
                    </div>  
                }
            </div>

            <h2 className='mt-4 text-[#333333] dark:text-[#d9d9d9] text-lg font-bold break-all'>{post?.title}</h2>
            
            {text !== '' && <div className='mt-2 text-[#333333] dark:text-[#d9d9d9] text-sm font-normal leading-6 break-all'>
                {!pathname.startsWith('/post') ? 
                    (text.length > 200 ? 
                        text.substring(0, 200).trim() + '...'
                        : 
                        text.trim()
                    ) :
                    commentContentText
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

            <ActionPanel 
                idPost={post?.id} 
                count={post?._count} 
                pathname={pathname} 
                router={router} 
                isLiked={post?.isLiked} 
                setShowModalShare={setShowModalShare}
                setIdPostShare={setIdPostShare}
                onClick={onClick} 
            />

            <ModalPhoto photos={photos} slideIndex={slideIndex} showModal={showModal} setShowModal={setShowModal} />
            </div>
            <ModalShare idPost={idPostShare} showModalShare={showModalShare} setShowModalShare={setShowModalShare} />
        </>
    );
};
