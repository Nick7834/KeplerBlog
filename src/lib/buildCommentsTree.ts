import { IComment } from "@/components/shared/comments/comments";

export const buildCommentsTree = (comments: IComment[]) => {
    const commentMap: Record<string, IComment> = {};
  
    comments.forEach((comment) => {
      commentMap[comment.id] = { ...comment, replies: [] };
    });
  
    const tree: IComment[] = [];
    comments.forEach((comment) => {
      if (comment.parentId) {
        if (commentMap[comment.parentId]) {
          commentMap[comment.parentId].replies.push(commentMap[comment.id]);
        }
      } else {
        tree.push(commentMap[comment.id]);
      }
    });
  
    return tree;
  };
  