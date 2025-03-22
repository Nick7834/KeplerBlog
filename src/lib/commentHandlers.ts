import { IPost } from '@/@types/post';
import { IComment } from '@/components/shared/comments/comments';
import { User } from '@prisma/client';
import axios from 'axios';
import toast from 'react-hot-toast';

interface HandleCommentPostParams {
  commentsValue: string;
  setCommentsValue: React.Dispatch<React.SetStateAction<string>>;
  setLoaderButtonAdd: React.Dispatch<React.SetStateAction<boolean>>;
  lastCommentTime: number | null;
  setLastCommentTime: React.Dispatch<React.SetStateAction<number | null>>;
  addComment: (comment: IComment) => void;
  post: IPost;
  user: User | null;
}

export const handleCommentPost = async ({
  commentsValue,
  setCommentsValue,
  setLoaderButtonAdd,
  lastCommentTime,
  setLastCommentTime,
  addComment,
  post,
  user,
}: HandleCommentPostParams) => {

  if (!user) return;

  if (commentsValue.trim() === '') return;

  setLoaderButtonAdd(true);

  const now = Date.now();

  if (lastCommentTime && now - lastCommentTime < 2000) {
    toast.error('Please wait at least 2 seconds between comments.', { style: { textAlign: 'center' } });
    setLoaderButtonAdd(false);
    return;
  }
  
  setLastCommentTime(now);

  const datas = {
    content: commentsValue,
    parentId: null,
    avatar: user?.profileImage,
    userName: user?.username
  };

  try {
    const resp = await axios.post(`/api/comments/${post.id}/comment`, datas);

    if (resp.status === 201) {
      setCommentsValue('');
    }

    const newComment: IComment = {
      id: resp.data.comment.id,
      createdAt: resp.data.comment.createdAt,
      author: {
        id: user.id,
        username: user.username,
        profileImage: user.profileImage,
        isverified: user?.isverified
      },
      content: resp.data.comment.content,
      replies: [],
      parentId: null,
      postId: post.id
    };

    addComment(newComment);
  } catch (error) {
    console.error(error);
    toast.error('Something went wrong');
  } finally {
    setLoaderButtonAdd(false);
  }
};