'use client'
import React, { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

import toast from 'react-hot-toast';
import { convertFromRaw, convertToRaw, EditorState, RawDraftContentState } from 'draft-js';
import { redirect, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { Post } from '@prisma/client';
import { FaRegSave } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { handlePhotoUpload } from '../handlePhotoUpload';
import { Button, Editor, TitlePost } from '..';
import { Photos } from '../createPost/photos';

interface Props {
    className?: string;
    post: Post;
} 

export const EditPostInput: React.FC<Props> = ({ className, post }) => {

    const router = useRouter();

    const { data: session} = useSession();

    if(session?.user?.id !== post.authorId) redirect('/');
    
    const [title, setTitle] = useState(post?.title);
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    
    const [oldPhoto, setOldPhotos] = useState<string[]>(post?.image);
    const [photoPreview, setPhotoPreview] = useState<string[]>(post?.image);
    const [newPhoto, setNewPhotos] = useState<File[]>([]);

    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const initializePhotos = async () => {
            if (!post) return; 

            const rawContent = post.content as RawDraftContentState | null;
            setEditorState(
                rawContent && rawContent.blocks && rawContent.entityMap !== undefined
                    ? EditorState.createWithContent(convertFromRaw(rawContent))
                    : EditorState.createEmpty()
            );
        };
    
        initializePhotos();
    }, [post]);


    const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        handlePhotoUpload(e, photoPreview, setPhotoPreview, setNewPhotos, setOldPhotos);
    };

    const handlePost = async () => {

        setLoading(true);

        const oldTitle = post.title;
        const oldContent = convertToRaw(editorState.getCurrentContent());
        const oldPhotos = post.image;
    
        const newTitle = title.trim();
        const newContent = post.content;
        const newPhotos = photoPreview;

        const newPhotosLinks = newPhotos.filter((photo) => typeof photo === 'string');
        const newPhotosFiles = newPhotos.filter((photo) => typeof photo !== 'string');
    
        const isTitleChanged = newTitle !== oldTitle;
        const isContentChanged = JSON.stringify(newContent) !== JSON.stringify(oldContent);
        const isPhotosChanged = 
        JSON.stringify(newPhotosLinks) !== JSON.stringify(oldPhotos) || newPhotosFiles.length > 0;

        if (!isTitleChanged && !isContentChanged && !isPhotosChanged) {
            setLoading(false);
            toast.error('No changes detected.');
            return;
        }

        if (title.trim() === '') {
            toast.error('Please enter a title.');
            setLoading(false);
            return;
        }

        const rawContent = convertToRaw(editorState.getCurrentContent());

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', JSON.stringify(rawContent));
        oldPhoto.forEach((oldPhoto) => formData.append('oldPhoto', oldPhoto)); 
        newPhoto.forEach((newPhotos) => formData.append('newPhotos', newPhotos));

        try {

            const response = await axios.put(`/api/posts/${post.id}/edit`, formData);

            if (response.status === 200) {
                toast.success('Post updated successfully.');
            }

            router.replace(`/profile/${session?.user?.id}`); 

        } catch(error) {
            toast.error('Something went wrong.');
            console.error(error);
        } finally {
            setLoading(false);
        }

    }

    const handleDelete = async () => {

        setDeleting(true);

        const confirmed = window.confirm('Are you sure you want to delete this post?');

        if (!confirmed) {
            setDeleting(false);
            return;
        }

        try {
            const response = await axios.delete(`/api/posts/${post.id}/delete`);
            if (response.status === 200) {
                toast.success('Post deleted successfully.'); 
            }
            router.replace(`/profile/${session?.user?.id}`); 
        } catch(error) {
            toast.error('Something went wrong.'); 
            console.error(error);
        } finally {
            setDeleting(false);
        }
    }

    return (
        <div className={cn('flex flex-col max-w-[600px] mt-8', className)}>

            <Photos photos={photoPreview} setPhotoPreview={setPhotoPreview} setOldPhotos={setOldPhotos} setNewPhotos={setNewPhotos}  />

            <TitlePost setTitle={setTitle} title={title} />

            <Editor handlePgoto={handlePhoto} editorState={editorState} setEditorState={setEditorState}  />

            <div className="edit-post flex items-end justify-end gap-5 mt-[30px] ml-auto w-full">
                <Button loading={deleting} onClick={handleDelete} className='flex items-center w-[125px] max-[125px] px-[30px] bg-[#F03535] text-[#d9d9d9] hover:bg-[#F03535]/70'><RiDeleteBinLine className='block translate-y-[-1px]' /> Delete Post</Button>
                <Button loading={loading} onClick={handlePost} disabled={title.length === 0 ? true : false} className='w-[125px] max-[125px] px-[30px] flex items-center text-[#d9d9d9] dark:text-[#333333] bg-[#333333] dark:bg-[#d9d9d9] hover:bg-[#333333]/85 dark:hover:bg-[#d9d9d9]/85'><FaRegSave className='block translate-y-[-1px]' /> Save</Button>
            </div>

        </div>
    );
};