import { IComment } from "@/components/shared/comments/comments";
import { buildCommentsTree } from "@/lib/buildCommentsTree";
import axios from "axios";
import { create } from "zustand";

interface ICommentStore {
    comments: IComment[];
    loading: boolean;
    error: unknown | null;
    fetchComments: (postId: string) => void;
    addComment: (comment: IComment) => void;
    addReply: (reply: IComment, parentId: string) => void;
    deleteComment: (commentId: string) => void;
}

export const useCommentStore = create<ICommentStore>((set) => ({
    comments: [],
    loading: false,
    error: null,

    fetchComments: async (postId: string,) => {
      try {
        set({ loading: true, comments: [] });
    
        const response = await axios.get(`/api/comments/${postId}/comment`);
        const data = await response.data;

        const structuredComments = buildCommentsTree(data);

        set(() => ({
          comments: structuredComments,
          loading: false,
        }));
      } catch (error) {
        set({ error, loading: false });
      }
    },

    addComment: (comment: IComment) => {
        set((state) => (
          {
          comments: [comment, ...state.comments]
        }));
    },

    addReply: (reply: IComment, parentId: string) => {
      const updateReplies = (comments: IComment[], parentId: string, reply: IComment): IComment[] => {
        return comments.map((comment) => {
          if (comment.id === String(parentId)) {
            return {
              ...comment,
              replies: [reply, ...comment.replies],
            };
          }
  
          if (comment.replies.length > 0) {
            return {
              ...comment,
              replies: updateReplies(comment.replies, parentId, reply), 
            };
          }
  
          return comment;
        });
      };
  
      set((state) => ({
        comments: updateReplies(state.comments, parentId, reply),
      }));
    },

    deleteComment: (commentId: string) => {

      const delComment = (comments: IComment[], commentId: string): IComment[] => {
        return comments.map((comment) => {
          
          if(comment.id === commentId) {
            return null;
          }

          if(comment.replies.length > 0) {
            return {
              ...comment,
              replies: delComment(comment.replies, commentId)
            }
          }

          return comment;

        })
        .filter((comment) => comment !== null);
      }

      set((state) => ({
        comments: delComment(state.comments, commentId)
      }))
      
    }

}));