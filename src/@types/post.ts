import { JsonValue } from "@prisma/client/runtime/library";
import { RawDraftContentState } from "draft-js";

export interface IPost {
    createdAt: Date;
    id: string;
    title: string;
    content?: RawDraftContentState | JsonValue;
    banReason: string;
    isbanned: boolean;
    image?: string[];
    author: {
        id: string;
        username: string;
        profileImage: string | null;
        isverified: boolean;
    };
    comments: {
        id: string;
        content: string;
        createdAt: Date;
        author: {
            id: string;
            username: string;
            profileImage: string | null;
            isverified: boolean;
        }
    }[]; 
    isLiked: boolean;
    isFollowing?: boolean;
    likes: {
        id: string;
    }[];
    _count: {
        comments: number;
        likes: number;
    };
}

export interface IPostData {
    pages: IPost[][]
}