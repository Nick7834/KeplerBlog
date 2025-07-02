'use client'
import React, {  useState } from 'react';
import { InputComment } from './inputComment';
import { cn } from '@/lib/utils';
import { Comment } from './comment';
import { handleCommentPost } from '@/lib/commentHandlers';
import { useUser } from '@/components/hooks/useUser';
import { useComments } from '@/components/hooks/useComments';
import { SkeletonComment } from '../skeletonComment';
import { FaComments } from "react-icons/fa6";
import { IPost } from '@/@types/post';

interface Props {
    className?: string;
    ref?: React.Ref<HTMLDivElement>;
    post: IPost;
}

export interface IComment {
    createdAt: Date;
    postId: string;
    id: string;
    author: {
        id: string;
        email?: string | undefined;
        username: string;
        profileImage: string | null;
        isverified: boolean;
    } | null;
    content: string;           
    replies: IComment[];    
    parentId: string | null;
}

export const Comments: React.FC<Props> = ({ className, ref, post }) => {

  const user = useUser();

  const { 
    comments, 
    loading,
    addComment
  } = useComments(post?.id);

  const [commentsValue, setCommentsValue] = useState<string>('');

  const [loaderButtonAdd, setLoaderButtonAdd] = useState<boolean>(false);
  const [lastCommentTime, setLastCommentTime] = useState<number | null>(null);

  const handleComment = async () => {
    handleCommentPost({
      commentsValue,
      setCommentsValue,
      setLoaderButtonAdd,
      lastCommentTime,
      setLastCommentTime,
      addComment,
      post,
      user,
    });
  }

    return (
        <div ref={ref} className={cn('mt-[40px] max-w-[750px]', className)}>

            <h1 className='text-[#333333] dark:text-[#d9d9d9] text-2xl font-bold'>Comments</h1>

            {user && <InputComment 
              className='mt-5' 
              commentsValue={commentsValue}
              setCommentsValue={setCommentsValue}
              handleCommetPost={handleComment}
              setLoaderButtonAdd={setLoaderButtonAdd}
              loaderButtonAdd={loaderButtonAdd}
            />}

            <div className='mt-5'>
                {loading ? <SkeletonComment /> :
                  (!loading && comments.length === 0 ? 
                    <div className='flex flex-col items-center justify-center gap-2 text-[#333333] dark:text-[#d9d9d9] text-lg font-bold'><FaComments size={50} /> No comments</div>
                    :
                    comments.map((comment, index) => (
                      <Comment key={index} comment={comment} user={user} indentLevel={0} className='pl-3' createdAt={comment.createdAt} />
                    ))
                  )
                }
            </div>

            {/* {hasMoreComments && <Button 
              onClick={moreComments} 
              variant='outline' 
              loading={loaderMore}
              className='block mx-auto w-fit border border-solid border-[#b0b0b0]/70 dark:border-neutral-300/75
               rounded-[10px] bg-transparent dark:bg-transparent px-[35px] py-[7px] h-fit text-[#333333] dark:text-[#d9d9d9] text-sm 
               font-medium mt-3 hover:bg-[#333333]/85 dark:hover:bg-[#d9d9d9]/85 
               hover:text-[#d9d9d9] hover:dark:text-[#333333]'>Show more</Button>} */}

        </div>
    );
};

