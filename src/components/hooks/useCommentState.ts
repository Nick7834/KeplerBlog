import { useEffect, useState } from "react";

export const useCommentState = (initialContent: string) => {
    const [commentContentMain, setCommentContentMain] = useState(initialContent);
    const [isReply, setIsReply] = useState<boolean>(false);
    const [isUpdate, setIsUpdate] = useState<boolean>(false);
    const [isReplyF, setIsReplyF] = useState<boolean>(false);
    const [loaderReply, setLoaderReply] = useState<boolean>(false);
    const [replyInput, setReplyInput] = useState<string>('');
    const [updateComment, setUpdateComment] = useState<string>('');
     const [time, setTime] = useState<number | null>(null);

     useEffect(() => {
        setCommentContentMain(initialContent); 
    }, [initialContent]);

    return {
        commentContentMain,
        setCommentContentMain,
        isReply,
        setIsReply,
        isUpdate,
        setIsUpdate,
        isReplyF,
        setIsReplyF,
        loaderReply,
        setLoaderReply,
        replyInput,
        setReplyInput,
        updateComment,
        setUpdateComment,
        time,
        setTime
    }
}