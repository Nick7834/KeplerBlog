import axios from "axios";
import { Session } from "next-auth";
import Pusher from "pusher-js";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Notification } from '@prisma/client';

export const useNotifications = (session: Session | null, width: number) => {
    
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [notificationsData, setNotifications] = useState<Notification[]>([]);
    const [notificationCount, setNotificationCount] = useState(0);
    const [countFlag, setCountFlag] = useState(false);
    const [notificationFlag, setNotificationFlag] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    // fetch

    const fetchNotifications = async () => {
        try {
             const response = await axios.get(`/api/user/notification?page=${page}&limit=${width < 1100 ? 20 : 10}`);
            const data = await response.data.notifications;
                
            if(!data || data.length === 0) {
                setHasMore(false);
            } else {
                setNotifications((prevPosts) => {
                    const newPosts = data.filter((post: { id: string; }) => !prevPosts.some(p => p.id === post.id));
                    return [...prevPosts, ...newPosts];
                });

                if (data.length < 10) setHasMore(false);
            }
        } catch (error) {
                console.error('Request failed:', error);
            } finally {
                setIsLoading(false);
            }
        };

        useEffect(() => {  
            if(page === 1) return;

            fetchNotifications();

        }, [page]);

        const loadMoreNotifications = () => {
            setPage((prev) => prev + 1);      
        };

         // count 
        
        useEffect(() => {
             if(!session) return;
                
            if(!countFlag) {
                countNotification();
                setCountFlag(true);
            }
        }, [countFlag, session]);
        
        const countNotification = async () => {
            try {
                const response = await axios.get('/api/user/notification/count');
                 setNotificationCount(response.data.unreadCount);
                    
            } catch(error) {
                    console.warn(error);
            }
         }
        
        const putCountNotification = async () => {
            try {
                await axios.put('/api/user/notification/count');
            } catch(error) {
                console.warn(error);
            }
        }
        
        // pusher
        
        useEffect(() => {
            if (!session?.user.id) return;
        
            const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
                cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
            });
        
            const channel = pusher.subscribe(`user-${session.user.id}`);
        
            channel.bind('new_notification', (newNotification: Notification) => {
                setNotifications((prevNotifications) => {
                    const exists = prevNotifications.some(n => n.id === newNotification.id);
                    if (exists) return prevNotifications;
                    return [newNotification, ...prevNotifications];
                });
        
                setNotificationCount((prevCount) => prevCount + 1);
                setNotificationFlag(true);
            });
        
            return () => {
                pusher.unsubscribe(`user-${session.user.id}`);
            };
        }, [session?.user.id]);

        // click Notification 

        const handleClick = async () => {
     
            if(notificationFlag) {
                fetchNotifications();
                setNotificationFlag(false);
            }
    
            if(notificationCount > 0) {
                putCountNotification();
                setNotificationCount(0);
            }
        };

        // click Notification Link

        const handleClickNotification = async (
                id: string, 
                status: boolean, 
        ) => {
        
            if(status) return;
        
            setNotifications((prevNotifications) => {
                return prevNotifications.map((notif) =>
                    notif.id === id ? { ...notif, isRead: true } : notif
                );
            })
        
            try {
                    await axios.put(`/api/user/notification/${id}`);
            } catch(err) {
                    console.warn(err)
            }
        
        }

        // delete notification 

        const handleDel = async (id: string) => {
            let shouldIncrementPage = false;
        
            setNotifications((prevNotifications) => {
                const updatedNotifications = prevNotifications.filter((notif) => notif.id !== id);
        
                if (updatedNotifications.length <= 5 && hasMore) {
                    shouldIncrementPage = true;
                }
        
                return updatedNotifications;
            });
        
            try {
                await axios.delete(`/api/user/notification/${id}`);
               
                if(shouldIncrementPage && hasMore) {
                    fetchNotifications();
                }
            } catch (error) {
                console.warn(error);
                toast.error('Something went wrong');
            }
        };


        return {
                handleClick,
                handleClickNotification,
                handleDel,
                notificationsData,
                notificationCount,
                isLoading,
                hasMore,
                loadMoreNotifications
        }

}