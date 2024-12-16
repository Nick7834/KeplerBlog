import React from 'react';
import { Button, Input } from '..';

interface Props {
    className?: string;
    commentsValue: string;
    setCommentsValue: React.Dispatch<React.SetStateAction<string>>;
    handleCommetPost: () => void;
    loaderButtonAdd: boolean;
    setLoaderButtonAdd: React.Dispatch<React.SetStateAction<boolean>>
} 

export const InputComment: React.FC<Props> = ({ 
    className, 
    commentsValue, 
    loaderButtonAdd,
    setCommentsValue,
    handleCommetPost,
    }) => {
    return (
        <form className={className} onSubmit={(e) => e.preventDefault()}>
            <Input 
                placeholder="Write a comment..." 
                className="p-[20px] text-base h-[50px] rounded-[10px] border-solid border-[#b0b0b0]/70 dark:border-neutral-300/75 bg-neutral-300/75 dark:bg-neutral-800/75" 
                value={commentsValue}
                onChange={(e) => setCommentsValue(e.target.value)}
            />
            <Button loading={loaderButtonAdd} disabled={commentsValue.trim() === '' ? true : false} onClick={handleCommetPost} className='mt-3 flex-1 w-[150px] ml-auto px-[30px] flex items-center justify-center rounded-[10px] text-[#d9d9d9] dark:text-[#333333] bg-[#333333] dark:bg-[#d9d9d9] hover:bg-[#333333]/85 dark:hover:bg-[#d9d9d9]/85 button-comment'>Add Comment</Button>
        </form>
    );
};
