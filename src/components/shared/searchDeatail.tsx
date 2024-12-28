'use client';
import React, { useEffect,  useState } from 'react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { PostSearch } from './postSearch';
import { SkeletonPostSearch } from './skeletonPostSearch';
import { SkeletonUserSearch } from './skeletonUserSearch';
import { useSearchParams } from 'next/navigation';
import InfiniteScroll from 'react-infinite-scroll-component';
import { UserSearch } from './userSearch';
import { FetchSerch, PostSearchType, UserSearchType } from './fetchSerch';
import { MdSearch } from 'react-icons/md';

interface Props {
    className?: string;
}

export const SearchDeatail: React.FC<Props> = ({ className }) => {
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('query') || '');

    const [posts, setPosts] = useState<(PostSearchType | UserSearchType)[]>([]);
    const [users, setUsers] = useState<(PostSearchType | UserSearchType)[]>([]);

    const [loaderPosts, setLoaderPosts] = useState(false);
    const [loaderUsers, setLoaderUsers] = useState(false);

    const [pagePosts, setPagePosts] = useState(1);
    const [pageUsers, setPageUsers] = useState(1);

    const [hasMorePosts, setHasMorePosts] = useState(true);
    const [hasMoreUsers, setHasMoreUsers] = useState(true);

    const [open, setOpen] = useState<'posts' | 'users'>('posts');

    useEffect(() => {
        setUsers([]);
        setPosts([]);
        setPagePosts(1);
        setPageUsers(1);
        setHasMorePosts(true);
        setHasMoreUsers(true);
    }, [query]);

    useEffect(() => {
        FetchSerch<PostSearchType | UserSearchType>(
            query,
            open === 'posts' ? pagePosts : pageUsers,
            open === 'posts' ? setPosts : setUsers,
            open === 'posts' ? setHasMorePosts : setHasMoreUsers,
            open === 'posts' ? setLoaderPosts : setLoaderUsers,
            open
        )
    }, [query, open, pagePosts, pageUsers]);

    useEffect(() => {
        const urlQuery = searchParams.get('query');
        if (urlQuery && urlQuery !== query) {
            setQuery(urlQuery || '');
        }
    }, [searchParams, query]);

    const loadMorePosts = () => {
        setPagePosts((prev) => prev + 1);
    };

    const loadMoreUsers = () => {
        setPageUsers((prev) => prev + 1);
    };

    return (
        <div className={cn('max-w-[1250px] w-full', className)}>
            <h1 className="flex items-center gap-2 text-[#333333] dark:text-[#d9d9d9] text-[clamp(1.563rem,1.455rem+0.54vw,1.875rem)] font-bold"><MdSearch />Search Results</h1>

            <div className="flex items-center gap-5 mt-[clamp(1.25rem,0.82rem+2.15vw,2.5rem)]">
                <Button
                    onClick={() => setOpen('posts')}
                    className={cn(
                        'py-5 px-10 bg-[#333333] text-[#d9d9d9] dark:text-[#333333] dark:bg-[#d5d5d5]',
                        open === 'posts' && 'bg-[#3a9989] dark:bg-[#3a9989] text-[#d9d9d9] dark:text-[#d9d9d9] hover:bg-[#48c0ac] dark:hover:bg-[#48c0ac]'
                    )}
                >
                    Posts
                </Button>
                <Button
                    onClick={() => setOpen('users')}
                    className={cn(
                        'py-5 px-10 bg-[#333333] text-[#d9d9d9] dark:text-[#333333] dark:bg-[#d5d5d5]',
                        open === 'users' && 'bg-[#3a9989] dark:bg-[#3a9989] text-[#d9d9d9] dark:text-[#d9d9d9] hover:bg-[#48c0ac] dark:hover:bg-[#48c0ac]'
                    )}
                >
                    Users
                </Button>
            </div>

            <div className="mt-10">
            {open === 'posts' && (
                <InfiniteScroll
                    dataLength={posts.length}
                    next={loadMorePosts}
                    hasMore={hasMorePosts}
                    loader={loaderPosts && Array.from({ length: 3 }).map((_, index) => <SkeletonPostSearch key={index} />)}
                >
                    {!loaderPosts && posts.length === 0 ? (
                        <p className="text-[#333333] dark:text-[#d9d9d9] text-lg font-medium">No posts found</p>
                    ) : (
                        posts.map((post) => {
                            if (post && 'title' in post) {
                                return <PostSearch key={post.id} post={post} />;
                            }
                            return null;
                        })
                    )}
                </InfiniteScroll>
            )}
            </div>

            <div className="mt-[clamp(1.25rem,0.82rem+2.15vw,2.5rem)]">
            {open === 'users' && (
                <InfiniteScroll
                    dataLength={users.length}
                    next={loadMoreUsers}
                    hasMore={hasMoreUsers}
                    loader={loaderUsers && Array.from({ length: 3 }).map((_, index) => <SkeletonUserSearch key={index} />)}
                >
                    {!loaderUsers && users.length === 0 ? (
                        <p className="text-[#333333] dark:text-[#d9d9d9] text-lg font-medium">No users found</p>
                    ) : (
                        users.map((user) => {
                            if (user && 'username' in user) {
                                return <UserSearch key={user.id} user={user} />;
                            }
                            return null;
                        })
                    )}
                </InfiniteScroll>
            )}
            </div>
        </div>
    );
};