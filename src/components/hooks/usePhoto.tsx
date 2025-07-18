import { User } from "@prisma/client";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

export const usePhotoSettings = (user: User) => {
    const [avatar, setAvatar] = useState<string | null>(user?.profileImage || null);
    const [poster, setPoster] = useState<string | null>(user?.poster || null);

    const handleNewPhoto = async (file: File, type: 'avatar' | 'poster') => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type); 

        const maxFileSize = 15 * 1024 * 1024; 

        if (file && file.size > maxFileSize) {
            toast.error('File size exceeds the 15MB limit.');
            return;
        }

        try {
            const res = await axios.put('/api/upload', formData);
          
              if (res.status === 200) {
                toast.success('Photo uploaded successfully');
              }

              if (type === 'avatar') {
                setAvatar(res.data.user.profileImage);
              } else if (type === 'poster') {
                setPoster(res.data.user.poster);
              }

        } catch (error) {
            console.warn(error);
            toast.error('Something went wrong');
        }
    }

    const handleChangePhoto = (event: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'poster') => {
        const file = event.target.files?.[0];   

        if (!file?.type.startsWith('image/')) {
            toast.error('Please select an image file.');
            return;
        }

        if (file) {
            handleNewPhoto(file, type);
        }
    }

    const handleDeletePhoto = async (type: 'avatar' | 'poster', url: string) => {
        const confirmed = window.confirm('Are you sure you want to delete this photo?');

        if (!confirmed) {
            return;
        }

        try {
            const res = await axios.put(`/api/deletePhotos?type=${type}&url=${url}`);
            if (type === 'avatar' && res.status === 200) {
                setAvatar(null);
                toast.success('Avatar deleted successfully');
            } else if (type === 'poster' && res.status === 200) {
                setPoster(null);
                toast.success('Poster deleted successfully');
            }
        } catch (error) {
            console.warn(error);
            toast.error('Something went wrong');
        }
    }

    return { avatar, poster, handleChangePhoto, handleDeletePhoto };
}