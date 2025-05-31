import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchNotifications = async () => {
    const res = await axios.get("/api/messenger/chats/notifications");
    return res.data;
}

export const useNotificationsQuery = (userId: string) => {
    return useQuery({
        queryKey: ["notifications-chats", userId],
        queryFn: fetchNotifications,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });
}