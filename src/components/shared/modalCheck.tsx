'use client'
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import { cn } from '@/lib/utils';
import { Button } from '.';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '../ui/input-otp';
import toast from 'react-hot-toast';
import axios from 'axios';

interface Props {
    className?: string;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    email: string
    setIsverifiedEmailState: React.Dispatch<React.SetStateAction<boolean>>
}

export const ModalCheck: React.FC<Props> = ({ className, open, setOpen, email, setIsverifiedEmailState }) => {
    const [otp, setOtp] = useState<string>("");
    const [loader, setLoader] = useState<boolean>(false);

    const handleCodeEmail = async () => {
        if(otp.length === 6) {
            setLoader(true);
            
            try {
            
                const resp = await axios.post('/api/verify-otp', { email, code: otp });

                if(resp.status === 200) {
                    toast.success('Email verified successfully');
                    setOpen(false);
                    setIsverifiedEmailState(true);
                }

            } catch (error) {
                console.error(error);
                toast.error('Something went wrong');
            } finally {
                setLoader(false);
            }

        }
    }

    return (
        <Dialog open={open} onOpenChange={() => (setOpen(false), setOtp(''))}>
            <DialogContent className={cn('flex flex-col w-full max-w-[95%] sm:max-w-md p-4 mx-auto backdrop-blur-[12px] bg-[#e6e6e6]/80 dark:bg-[#19191b]/60 rounded-md max-h-[90vh] overflow-y-auto', className)}>

                <DialogTitle className='text-center text-[#333333] dark:text-[#d9d9d9] text-xl font-bold'>
                    A code has been sent to your email
                </DialogTitle>

                <div className='flex flex-col justify-center items-center'>
                    <InputOTP
                        maxLength={6}
                        value={otp}
                        onChange={(value) => {
                            if (/^\d*$/.test(value)) {
                                setOtp(value);
                            }
                        }}
                    >
                        <InputOTPGroup>
                            <InputOTPSlot index={0}  className="w-12 h-12 text-xl text-center border-[#333333] bg-transparent dark:bg-transparent dark:border-white" />
                            <InputOTPSlot index={1}  className="w-12 h-12 text-xl text-center border-[#333333] bg-transparent dark:bg-transparent dark:border-white" />
                            <InputOTPSlot index={2}  className="w-12 h-12 text-xl text-center border-[#333333] bg-transparent dark:bg-transparent dark:border-white" />
                        </InputOTPGroup>
                            <InputOTPSeparator />
                        <InputOTPGroup>
                            <InputOTPSlot index={3}  className="w-12 h-12 text-xl text-center border-[#333333] bg-transparent dark:bg-transparent dark:border-white" />
                            <InputOTPSlot index={4}  className="w-12 h-12 text-xl text-center border-[#333333] bg-transparent dark:bg-transparent dark:border-white" />
                            <InputOTPSlot index={5}  className="w-12 h-12 text-xl text-center border-[#333333] bg-transparent dark:bg-transparent dark:border-white" />
                        </InputOTPGroup>
                    </InputOTP>
                </div>

                <Button
                    disabled={otp.length !== 6} 
                    loading={loader}
                    variant='secondary' 
                    onClick={handleCodeEmail}
                    className='w-full px-4 border-0 text-[#d9d9d9] dark:text-[#d9d9d9] font-medium transition-all ease-in-out duration-[.3s] hover:text-[#d9d9d9] hover:dark:text-[#d9d9d9] hover:bg-[#7391d5] bg-[#7391d5] dark:bg-[#7391d5] hover:bg-[#7391d5]/85 dark:hover:bg-[#7391d5]/85'
                >
                    Verify
                </Button>

            </DialogContent>
        </Dialog>
    );
};
