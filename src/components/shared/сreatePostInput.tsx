'use client'
import React, { useEffect, useState } from 'react';

import { Button } from '../ui/button';
import { MdCreate } from "react-icons/md";
import { cn } from '@/lib/utils';

import { Photos } from './createPost/photos';
import { TitlePost, Editor } from '.';
import toast from 'react-hot-toast';
import { handlePhotoUpload } from './handlePhotoUpload';
import { convertToRaw, EditorState } from 'draft-js';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useUserAvatar } from '@/store/user';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addNewPost, keyQuery } from '@/lib/updateQueryData';
import { IPost } from '@/@types/post';
import { useUser } from '../hooks/useUser';
import { PreviewItem } from './settings/editPostInput';

interface Props {
    className?: string;
}

export const CreatePostInput: React.FC<Props> = ({ className }) => {

    const router = useRouter();

    const { data: session} = useSession();
    const user = useUser();
    const queryClient = useQueryClient();
    
    const [title, setTitle] = useState('');
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    
    const [photos, setPhotos] = useState<File[]>([]);
     const [photoPreview, setPhotoPreview] = useState<PreviewItem[]>([]);
    const { avatarUser, userName } = useUserAvatar();

    const [isDirty, setIsDirty] = useState(false);

    const [loading, setLoading] = useState(false);

    const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsDirty(true)
        handlePhotoUpload(e, photoPreview, setPhotoPreview, setPhotos);
    };

    const mutation = useMutation({
        mutationFn: async (newPost: IPost) => {
            return newPost;
        },
        onSuccess: (data) => {
            toast.success('Post created successfully.');
            keyQuery.forEach((key) => addNewPost(queryClient, key, data));
            router.replace(`/profile/${session?.user?.id}`);
        },
        onError: (error) => {
            toast.error('Something went wrong.');
            console.error(error);
        },
        onSettled: () => {
            setLoading(false);
        }
    });

    const handlePost = async () => {

        setLoading(true);

        if (title.trim() === '') {
            toast.error('Please enter a title.');
            setLoading(false);
            return;
        }

        const rawContent = convertToRaw(editorState.getCurrentContent());

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', JSON.stringify(rawContent));
        photos.forEach((photo) => formData.append('photos', photo)); 
        formData.append('avatarUser', avatarUser || '');
        formData.append('userName', userName)

        try {
            const response = await axios.post('/api/posts', formData);
            if(response.status === 200) {
                if (!user) return;

                const newComment: IPost = {
                    ...response.data.newPost,
                    isLiked: false,
                    author: {
                        id: user.id,
                        username: user.username,
                        profileImage: user.profileImage,
                        isverified: user?.isverified
                    },
                    _count: {
                        comments: 0,
                        likes: 0
                    }
                };

                mutation.mutate(newComment);
            }
        } catch (error) {
            toast.error('Something went wrong.');
            console.error(error);
        }
    }

    const handleTitleChange = (title: string) => {
        setTitle(title);
        if (title.trim() !== '') setIsDirty(true);
    };

    const handleEditorChange = (state: EditorState) => {
        setEditorState(state);
        if (state.getCurrentContent().hasText()) setIsDirty(true);
    };

    useEffect(() => {

        const habdleDirty = (e: BeforeUnloadEvent) => {
            if(isDirty) {
                e.preventDefault();
            }
        }

        window.addEventListener('beforeunload', habdleDirty);

        return () => {
            window.removeEventListener('beforeunload', habdleDirty);
        }

    }, [isDirty])

    return (
        <div className={cn('flex flex-col max-w-[600px] mt-8', className)}>

            <Photos photos={photoPreview} setPhotoPreview={setPhotoPreview} setPhotos={setPhotos} />

            <TitlePost setTitle={handleTitleChange} title={title} />

            <Editor handlePgoto={handlePhoto} editorState={editorState} setEditorState={handleEditorChange}  />

            <div className="create-post-button flex flex-col items-end justify-end mt-[30px] ml-auto w-full max-w-[125px]">
                <Button loading={loading} onClick={handlePost} disabled={title.length === 0 ? true : false} className='w-full px-[30px] flex items-center justify-center text-[#d9d9d9] dark:text-[#333333] bg-[#333333] dark:bg-[#d9d9d9] hover:bg-[#333333]/85 dark:hover:bg-[#d9d9d9]/85'><MdCreate className='block translate-y-[-1px]' /> Create</Button>
            </div>

        </div>
    );
};