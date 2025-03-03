'use client'
import React, { useState } from 'react';

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

interface Props {
    className?: string;
} 

export const CreatePostInput: React.FC<Props> = ({ className }) => {

    const router = useRouter();

    const { data: session} = useSession();
    
    const [title, setTitle] = useState('');
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    
    const [photos, setPhotos] = useState<File[]>([]);
    const [photoPreview, setPhotoPreview] = useState<string[]>([]);
    const { avatarUser, userName } = useUserAvatar();

    const [loading, setLoading] = useState(false);

    const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        handlePhotoUpload(e, photoPreview, setPhotoPreview, setPhotos);
    };

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

            if (response.status === 200) {
                toast.success('Post created successfully.');
            }

            router.replace(`/profile/${session?.user?.id}`); 


        } catch(error) {
            toast.error('Something went wrong.');
            console.error(error);
        } finally {
            setLoading(false);
        }

    }

    return (
        <div className={cn('flex flex-col max-w-[600px] mt-8', className)}>

            <Photos photos={photoPreview} setPhotoPreview={setPhotoPreview} setPhotos={setPhotos} />

            <TitlePost setTitle={setTitle} title={title} />

            <Editor handlePgoto={handlePhoto} editorState={editorState} setEditorState={setEditorState}  />

            <div className="create-post-button flex flex-col items-end justify-end mt-[30px] ml-auto w-full max-w-[125px]">
                <Button loading={loading} onClick={handlePost} disabled={title.length === 0 ? true : false} className='w-full px-[30px] flex items-center justify-center text-[#d9d9d9] dark:text-[#333333] bg-[#333333] dark:bg-[#d9d9d9] hover:bg-[#333333]/85 dark:hover:bg-[#d9d9d9]/85'><MdCreate className='block translate-y-[-1px]' /> Create</Button>
            </div>

        </div>
    );
};