import { useState, useEffect } from 'react';
import axios from 'axios';
import { IPost } from '@/@types/post';

export const usePostId = (id: string) => {
  const [postId, setPostId] = useState<IPost | null>(null);

  useEffect(() => {
    if(!id) return;

    const fetchUserData = async () => {
        try {
          const { data } = await axios.get(`/api/posts/${id}/detailPost`);
          setPostId(data.postWithLikedStatus); 
        } catch (error) {
          console.error('Request failed:', error);
        }
    };

    fetchUserData();
  }, [id]);

  return postId;
};