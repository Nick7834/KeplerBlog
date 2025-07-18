import { useState, useEffect } from 'react';
import { useCommentStore } from '@/store/comment';

export const useComments = (postId: string) => {
  const { comments, fetchComments, addComment } = useCommentStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchComments(postId);
    setLoading(false);
  }, [fetchComments, postId]);

  return {
    comments,
    addComment,
    loading
  };
};