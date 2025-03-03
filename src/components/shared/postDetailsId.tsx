'use client'
import React, { useEffect, useRef, useState } from 'react';
import { Post } from './post';
import { Comments } from './comments/comments';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { redirect, useRouter } from 'next/navigation';
import { SkeletonPost } from './skeletonPost';
import { SkeletonComment } from './skeletonComment';
import { IPost } from '@/@type/post';

interface Props {
    className?: string;
    idPost: string
} 

export const PostDetails: React.FC<Props> = ({ className, idPost }) => {
    const router = useRouter();

    const commetsRef = useRef<HTMLDivElement>(null);

    const [postDetail, setPostDetail] = useState<IPost | null>(null);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        const getPostDetail = async () => {

            setIsLoading(true);
            
            try {
                const response = await axios.get(`/api/posts/${idPost}/detailPost`);
                const data = await response.data.postWithLikedStatus;
                setPostDetail(data);
            } catch (error) {
                console.error('Request failed:', error);
            } finally {
                setIsLoading(false);
            }

        }

        getPostDetail()

    }, [idPost, router]);

    const scrollToSection = () => {
        if (commetsRef.current) {
            commetsRef.current.scrollIntoView({ behavior: 'smooth' }); 
        }
      };

      if (!isLoading && !postDetail) {
        redirect('/');
      }

    return (
    <div className={cn('mt-[clamp(1.875rem,1.445rem+2.15vw,3.125rem)] mb-[30px] mx-[clamp(0.938rem,calc(-15.104rem+23.33vw),3.125rem)] flex flex-col justify-center items-center', className)}>
     
        {isLoading ? 
            <SkeletonPost /> :
            postDetail && <Post onClick={scrollToSection} className="cursor-auto" post={postDetail} />
        }

        {isLoading ? <SkeletonComment className='mt-10' /> :
            postDetail && 
            <Comments 
                ref={commetsRef} 
                post={postDetail} 
                className="scroll-mt-[100px] w-full" 
            />
        }

    </div>
    );
};
