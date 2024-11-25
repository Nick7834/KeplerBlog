import React from 'react';
import { InputComment } from './inputComment';
import { cn } from '@/lib/utils';
import { Comment } from './comment';

interface Props {
    className?: string;
    ref?: React.Ref<HTMLDivElement>;
} 

export interface IComment {
    id: number;            
    author: string;  
    avatar?: string;
    text: string;           
    replies: IComment[];    
  }

const comments: IComment[] = [
    {
      id: 1,
      author: 'Arduzer',
      text: 'Это основной комментарий',
      avatar: 'https://avatars.githubusercontent.com/u/125916127?v=4',
      replies: [
        {
          id: 2,
          author: 'Defix',
          text: 'Это ответ на комментарий',
          avatar: 'https://sun9-9.userapi.com/impg/G45FdYv1pidBTgqkgnFTp8uNrXd1hwRRlXVjuA/NgRvMOU0kwE.jpg?size=1280x720&quality=96&sign=c02ebec1210a18322fac13ae29a68bfc&type=album',
          replies: [
            {
                id: 1,
                author: 'Arduzer',
                text: 'Это основной комментарий',
                avatar: 'https://avatars.githubusercontent.com/u/125916127?v=4',
                replies: [],
            },
            {
                id: 1,
                author: 'Arduzer',
                text: 'Это основной комментарий',
                avatar: 'https://avatars.githubusercontent.com/u/125916127?v=4',
                replies: [
                    {
                        id: 1,
                        author: 'Arduzer',
                        text: 'Это основной комментарий',
                        avatar: 'https://avatars.githubusercontent.com/u/125916127?v=4',
                        replies: [],
                    }
                ],
            }
          ],
        },
      ],
    },
    {
      id: 3,
      author: 'Defix',
      text: 'А какого хуя, я на это подписался?',
      avatar: 'https://sun9-9.userapi.com/impg/G45FdYv1pidBTgqkgnFTp8uNrXd1hwRRlXVjuA/NgRvMOU0kwE.jpg?size=1280x720&quality=96&sign=c02ebec1210a18322fac13ae29a68bfc&type=album',
      replies: [],
    },
];

export const Comments: React.FC<Props> = ({ className, ref }) => {
    return (
        <div ref={ref} className={cn('mt-16 max-w-[750px]', className)}>

            <h1 className='text-[#333333] dark:text-[#d9d9d9] text-2xl font-bold'>Comments</h1>

            <InputComment className='mt-5' />

            <div className='mt-5'>
                {comments.map((comment) => (
                    <Comment key={comment.id} comment={comment} className='mt-5' indentLevel={0} />
                ))}
            </div>

        </div>
    );
};
