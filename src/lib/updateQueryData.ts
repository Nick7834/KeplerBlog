import { IPost, IPostData } from "@/@types/post";
import { QueryClient } from "@tanstack/react-query";

export const keyQuery = ['posts', 'postsUser', 'trending', 'forYou'];
 
// post

export const addNewPost = (
    queryClient: QueryClient, 
    key: string, 
    newPost: IPost
) => {
    queryClient.setQueryData(key === 'postsUser' ? [key, newPost.author.id] : [key], (oldData: IPostData) => {
        if (!oldData) return oldData; 
        if (key === 'trending' || key === 'forYou') return;

        const pages = oldData.pages ?? [oldData];

        const isDuplicate = pages.some(page => page.some(post => post.id === newPost.id));

        if (isDuplicate) return oldData;
        
        const updatedPages = [
            [newPost], 
            ...pages
        ];

        return {
            ...oldData,
            pages: updatedPages
        };
    });
};


export const updatePostUser = (
    queryClient: QueryClient,
    key: string,
    updatedPost: IPost
) => {
    queryClient.setQueryData(key === 'postsUser' ? [key, updatedPost.author.id] : [key], (oldData: IPostData) => {
        if (!oldData) return oldData;

        const pages = oldData.pages ?? [oldData];

        const updatedPages = pages.map(page =>
            page.map(post => (post.id === updatedPost.id ? updatedPost : post))
        );

        return oldData.pages ? { ...oldData, pages: updatedPages } : updatedPages[0];
    });
};

export const updatePostUserDetail = (
    queryClient: QueryClient, 
    key: string,  
    idPost: string,
    updatedPost: IPost
) => {
    queryClient.setQueryData([key, idPost], (oldData: IPost) => {
        if (!oldData) return oldData;
        return updatedPost;
    })
}

export const deletePost = (
    queryClient: QueryClient, 
    key: string,  
    idUser: string,
    idPost: string
) => {
    queryClient.setQueryData(key === 'postsUser' ? [key, idUser] : [key], (oldData: IPostData) => {
        if (!oldData) return oldData;

        const pages = oldData.pages ?? [oldData];

        const updatedPages = pages.map(page =>
            page.filter(post => post.id !== idPost)
        );

        return oldData.pages ? { ...oldData, pages: updatedPages } : updatedPages[0];
    });
}

// likes

export const updateQueryData = (
    queryClient: QueryClient, 
    key: string, 
    idPost: string, 
    idUser: string,
    newLiked: boolean
) => {
    queryClient.setQueryData(key === 'postsUser' ? [key, idUser] : [key], (oldData: IPostData) => {
        if (!oldData) return oldData;

        const pages = oldData.pages ?? [oldData];

        const updatedPages = pages.map((page: IPost[]) =>
            page.flatMap((post: IPost) =>
                post.id === idPost
                    ? {
                        ...post,
                        isLiked: newLiked,
                        _count: {
                            ...post._count,
                            likes: post._count.likes + (newLiked ? 1 : -1),
                        },
                    }
                    : post
            )
        );

        return oldData.pages
            ? { ...oldData, pages: updatedPages }
            : updatedPages[0];
    });
};

export const updatePost = (
    queryClient: QueryClient, 
    key: string,  
    idPost: string,
    newLiked: boolean,
) => {
    queryClient.setQueryData([key, idPost], (oldData: IPost) => {
        if (!oldData) return oldData;
        
        return {
            ...oldData,
            isLiked: newLiked,
            _count: {
                ...oldData._count,
                likes: oldData._count.likes + (newLiked ? 1 : -1),
            },
        }

    })
}

// follow

export const updatePostFollow = (
    queryClient: QueryClient, 
    authorId: string,  
    newFollow: boolean
) => {

    const allQueries = queryClient.getQueryCache().findAll();

    const authorPostQueries = allQueries.filter(
        (query) => {
            if (query.queryKey[0] !== 'post') return false;
            
            const data = query.state.data;
            if (data && typeof data === 'object' && 'authorId' in data) {
                return data.authorId === authorId;
            }
            return false;
        }
    );

    authorPostQueries.forEach((query) => {
        queryClient.setQueryData(query.queryKey, (oldData: IPost) => {
            if (!oldData) return oldData;
            return { ...oldData, isFollowing: newFollow };
        });
    });
};