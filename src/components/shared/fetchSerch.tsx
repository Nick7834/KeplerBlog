import axios from "axios";

export interface PostSearchType {
    id: string;
    title: string;
    image?: string[];
    _count: {
        comments: number;
        likes: number;
    };
    author: {
        id: string;
        username: string;
        profileImage: string | null;
    };
    createdAt: Date;
}

export interface UserSearchType {
    id: string;
    username: string;
    profileImage: string;
    bio: string;
    _count: {
        following: number;
        posts: number;
    };
} 

export const FetchSerch = async <T extends PostSearchType | UserSearchType>(
    query: string,
    page: number,
    setData: React.Dispatch<React.SetStateAction<T[]>>,
    setHasMore: React.Dispatch<React.SetStateAction<boolean>>,
    setLoader: React.Dispatch<React.SetStateAction<boolean>>,
    dataType: 'posts' | 'users'
) => {
    setLoader(true);
    try {
        const response = await axios.get(`/api/search?query=${query}&skip=${page * 10}&take=10`);
        const data = response.data;

        setData((prev) => [
            ...prev,
            ...data[dataType].filter((newItem: T) => !prev.some((item: T) => item.id === newItem.id)),
          ]);
        if (data.posts.length < 10) setHasMore(false);
    } catch (error) {
        console.error(error);
    } finally {
        setLoader(false);
    }
};
