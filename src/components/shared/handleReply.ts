import toast from "react-hot-toast";
import { IComment } from "./comments/comments";
import axios from "axios";
import { Session } from "next-auth";


export const handleReply = async (
    replyInput: string,
    user: {
        isverified: boolean; id: string; username: string; profileImage: string | null 
}, 
    setReplyInput: React.Dispatch<React.SetStateAction<string>>,
    setLoaderReply: React.Dispatch<React.SetStateAction<boolean>>,
    setIsReply: React.Dispatch<React.SetStateAction<boolean>>,
    comment: IComment,
    time: number | null,
    setTime: React.Dispatch<React.SetStateAction<number | null>>,
    addReply: (reply: IComment, parentId: string) => void,
    setOpen: (open: boolean) => void,
    session: Session | null
) => {

    if(!session) {
        setOpen(true);
        return;
    }

    if(replyInput.trim() === '') return;

    setLoaderReply(true);

    const now = Date.now();

    if(time && now - time < 2000) {
        toast.error('Please wait at least 2 seconds between comments.', { style: { textAlign: 'center' } });
        setLoaderReply(false);
        return;
    }

    setTime(now);

    try {

        const datas = {
            content: replyInput,
            parentId: comment?.id
        }

        const resp = await axios.post(`/api/comments/${comment?.postId}/comment`, datas);

        if(resp.status === 201) {
            toast.success('Comment posted successfully');
            setReplyInput('');
            setIsReply(false);

            const newComment: IComment = {
                id: resp.data.comment.id,
                createdAt: new Date(),
                author: {
                  id: user!.id,
                  username: user!.username,
                  profileImage: user!.profileImage,
                  isverified: user!.isverified
                },
                content: resp.data.comment.content,
                replies: [],
                parentId: comment?.parentId,
                postId: comment?.postId,
              };

            addReply(newComment, comment?.id);

            console.log(user)
        }

    } catch(error) {
        console.error(error);
        toast.error('Something went wrong');
    } finally {
        setLoaderReply(false);
    }

}