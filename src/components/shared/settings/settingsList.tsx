'use client'
import { UseDarkMode } from '@/components/hooks/useDarkMode';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import React, { useState } from 'react';
import { SettingsEdit } from '..';
import { User } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { FormUpdate, formUpdateSchema } from '../modals/shema';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { updateUserProfile } from '@/app/authProfile';
import axios from 'axios';
import { signOut } from 'next-auth/react';
interface Props {
    className?: string;
    user: User
} 

export const SettingsList: React.FC<Props> = ({ className, user }) => {

    const [isLoading, setIsLoading] = useState(false);

    const [userData, setUserData] = useState<User>({
       ...user,
       bio: user?.bio ?? '',
    });

    const formUpdate = useForm<FormUpdate>({
        resolver: zodResolver(formUpdateSchema),
        defaultValues: {
            bio: user?.bio ?? '', 
            email: user?.email ?? '',
            username: user?.username ?? ''
        },
    });

    const { handleSubmit, control } = formUpdate;

    const onSubmit = async (data: FormUpdate) => {
        try {
            await updateUserProfile(data);

            setUserData({
                ...userData,
                bio: data.bio!,
                email: data.email,
                username: data.username,
            });
           
            toast.success('Profile updated successfully');
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong');
        }
    };

    const { theme, handleToggle } = UseDarkMode();

    const handleDelete = async () => {
        if(!user) return;

        setIsLoading(true);

        const userInput = window.prompt(
            `To confirm deletion, please type your account username (${user.username}):`
        );
    
        if (userInput !== user.username) {
            toast.error('Invalid username');
            setIsLoading(false);
            return;
        }

        const lastModal = window.confirm(
            `Are you sure you want to delete your account? This action cannot be undone.`
        );

        if(!lastModal) {
            setIsLoading(false);
            return;
        }

        try {
            const res = await axios.delete('/api/user/delete');
            if(res.status === 201) {
                await signOut();
                toast.success('Account deleted successfully');
            }
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className={className}>

            <ul className='ul-settings flex flex-col gap-4 mt-12'>
                <li className='settings-grid grid grid-cols-[200px_1fr] items-center'>
                    <span className=' text-[#333333] dark:text-[#d9d9d9] text-lg font-medium'>Description</span> 
                    <SettingsEdit 
                        nameProfile={userData?.bio ?? ''} 
                        name='bio'
                        control={control} 
                        onSubmit={handleSubmit(onSubmit)}
                    />
                </li>
                <li className='settings-grid grid grid-cols-[200px_1fr] items-center'>
                    <span className=' text-[#333333] dark:text-[#d9d9d9] text-lg font-medium'>Email</span> 
                    <SettingsEdit 
                        nameProfile={userData!.email} 
                        name='email' 
                        control={control} 
                        onSubmit={handleSubmit(onSubmit)}
                     />
                </li>
                <li className='settings-grid grid grid-cols-[200px_1fr] items-center'>
                    <span className=' text-[#333333] dark:text-[#d9d9d9] text-lg font-medium'>Name</span> 
                    <SettingsEdit 
                        nameProfile={userData!.username} 
                        name='username' 
                        control={control} 
                        onSubmit={handleSubmit(onSubmit)}
                    />
                </li>
                <li className='settings-grid grid grid-cols-[200px_1fr] items-center'>
                    <span className=' text-[#333333] dark:text-[#d9d9d9] text-lg font-medium'>Thema</span>
                    <Switch checked={theme === 'dark'} onCheckedChange={handleToggle} />
                </li>
                <li className='settings-grid grid grid-cols-[200px_1fr] items-center'>
                    <span className=' text-[#333333] dark:text-[#d9d9d9] text-lg font-medium'>Delete account</span>
                    <Button loading={isLoading} onClick={handleDelete} className='min-w-[100px] max-w-[100px] px-[30px] bg-[#F03535] text-[#d9d9d9] hover:bg-[#F03535]/70'>Delete</Button>
                </li>
            </ul>


        </div>
    );
};
