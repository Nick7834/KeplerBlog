import axios from "axios";
import toast from "react-hot-toast";

export const handleDeleteChatId = async (chatId: string, setCurrentChatId: (chatId: string) => void) => {
    try {

        const resp = await axios.delete(`/api/messenger/${chatId}`);
        
        if(resp.status === 200) {
            toast.success("Chat deleted");
            setCurrentChatId("");
        }

    } catch(error) {
        console.warn(error);
        toast.error("Something went wrong");
    }
}