import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { User } from '@prisma/client';

export const useUser = () => {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (session?.user?.id) {
      const fetchUserData = async () => {
        try {
          const { data } = await axios.get(`/api/user/${session.user.id}`);
          setUser(data); 
        } catch (error) {
          console.error('Request failed:', error);
        }
      };
      fetchUserData();
    }
  }, [session?.user?.id]);

  return user;
};