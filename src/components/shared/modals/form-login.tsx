'use client'
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormLogin, formLoginSchema } from './shema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form } from '..';
import { signIn } from 'next-auth/react';
import { toast } from 'react-hot-toast';

interface Props {
    onClose: () => void
} 

export const FormsLogin: React.FC<Props> = ({ onClose }) => {

    const form = useForm<FormLogin>({
        resolver: zodResolver(formLoginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onsubmit = async (data: FormLogin) => {
       try {
        const resp = await signIn('credentials', { ...data, redirect: false });

        if (!resp?.ok) {
         throw Error();
        }

        onClose();

        toast.success('Logged in successfully');
       } catch (error) {
         console.warn(error);
         toast.error('Something went wrong');
       }
    };

    return (
        <FormProvider {...form}>
            <form className='flex flex-col gap-5' onSubmit={form.handleSubmit(onsubmit)}>
                
                <Form name='email' label='Email' required />
                <Form name='password' label='Password' type='password' required />

                <Button className='w-full' type='submit' loading={form.formState.isSubmitting}>Log  In</Button>

            </form>
        </FormProvider>
    );
};

