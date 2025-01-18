'use client'
import React, { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import {
    FacebookIcon,
    FacebookShareButton,
    LinkedinIcon,
    LinkedinShareButton,
    RedditIcon,
    RedditShareButton,
    TelegramIcon,
    TelegramShareButton,
    TwitterIcon,
    TwitterShareButton,
    VKIcon,
    VKShareButton,
    WhatsappIcon,
    WhatsappShareButton,
} from "react-share";
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { Input } from '../ui/input';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';

interface Props {
    idPost: string;
    showModalShare: boolean;
    setShowModalShare: React.Dispatch<React.SetStateAction<boolean>>
} 

const shareButtons = [
    { Component: TelegramShareButton, Icon: TelegramIcon, name: "Telegram" },
    { Component: VKShareButton, Icon: VKIcon, name: "VK" },
    { Component: FacebookShareButton, Icon: FacebookIcon, name: "Facebook" },
    { Component: TwitterShareButton, Icon: TwitterIcon, name: "Twitter" },
    { Component: WhatsappShareButton, Icon: WhatsappIcon, name: "Whatsapp" },
    { Component: LinkedinShareButton, Icon: LinkedinIcon, name: "LinkedIn" },
    { Component: RedditShareButton, Icon: RedditIcon, name: "Reddit" },
];

export const ModalShare: React.FC<Props> = ({ idPost, showModalShare, setShowModalShare }) => {

    const [copied, setCopied] = useState(false);
    const refInput = useRef<HTMLInputElement>(null);

    const [isCopied, setIsCopied] = useState(false);

    const handleCopyLink = (link: string) => {
        refInput.current?.select();
        if(isCopied) return;
        navigator.clipboard.writeText(link);
        setCopied(true);
        setIsCopied(true);
        toast.success('Link copied to clipboard');
    }

    if(!showModalShare) return null;

    return (
        <Dialog open={showModalShare} onOpenChange={(open) => (setShowModalShare(open), setCopied(false), setIsCopied(false))}>
            <DialogContent className='bg-[#e3e3e3] dark:bg-[#19191b] rounded-md w-full max-w-[95%] sm:max-w-fit p-4 mx-auto '>

                <DialogTitle className='text-center text-[#333333] dark:text-[#d9d9d9] text-xl font-bold'>Share</DialogTitle>


                <div className='flex items-center justify-center mt-3 w-full overflow-hidden'>

                    <Swiper
                        slidesPerView='auto'
                        modules={[FreeMode]}
                        freeMode={true}
                    >
                        {shareButtons.map(({ Component, Icon, name }) => (
                            <SwiperSlide key={name} className='!w-auto overflow-hidden [&:not(:last-child)]:mr-5'>
                                <Component
                                    key={name}
                                    url={idPost}
                                    className="flex flex-col items-center gap-2"
                                >
                                    <Icon size={50} round />
                                    <span className='text-[#333333] dark:text-[#d9d9d9] text-xs'>{name}</span>
                                </Component>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                </div>

                <div className='mt-5 flex items-center gap-2 overflow-hidden'>
                    <Input 
                        ref={refInput}
                        readOnly
                        type='text'
                        className='text-[#333333] dark:text-[#d9d9d9] w-full'
                        value={idPost}
                    />
                    <Button 
                        variant='secondary' onClick={() => handleCopyLink(idPost)}
                        className={cn('bg-[#ffffff] dark:bg-[#484848] dark:hover:bg-[#333333]/80 hover:bg-[#d9d9d9]/80', copied && 'bg-[#7391d5] dark:bg-[#7391d5] hover:bg-[#5772b0] dark:hover:bg-[#5772b0] text-white')}
                    >
                        {copied ? 'Copied' : 'Copy'}
                    </Button>
                </div>

            </DialogContent>
        </Dialog>
    );
};
