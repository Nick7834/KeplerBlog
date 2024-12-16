import axios from "axios";
import toast from "react-hot-toast";
import { IComment } from "./comments/comments";

export const UpdateReply = async (
    updateComment: string,
    comment: IComment,
    setUpdateComment: React.Dispatch<React.SetStateAction<string>>,
    setIsUpdate: React.Dispatch<React.SetStateAction<boolean>>,
    setCommentContentMain: React.Dispatch<React.SetStateAction<string>>,
    setLoaderReply: React.Dispatch<React.SetStateAction<boolean>>
) => {
    if(updateComment.trim() === '') return;

    setLoaderReply(true);

    if(updateComment.trim() === comment.content.trim()) {
        toast.error('You cannot reply to your own comment');
        setLoaderReply(false);
        return;
    }

    try {

        const datas = {
            content: updateComment,
        }

        const resp = await axios.put(`/api/comments/${comment?.id}/comment`, datas);

        if(resp.status === 201) {
            toast.success('Comment updated successfully');
            setUpdateComment('');
            setIsUpdate(false);
            setCommentContentMain(resp.data.comment.content);
        }

    } catch(error) {
        console.error(error);
        toast.error('Something went wrong');
    } finally {
        setLoaderReply(false);
    }

}