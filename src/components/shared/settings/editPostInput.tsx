"use client";
import React, { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import toast from "react-hot-toast";
import {
  convertFromRaw,
  convertToRaw,
  EditorState,
  RawDraftContentState,
} from "draft-js";
import { redirect, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import { FaRegSave } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { handlePhotoUpload } from "../handlePhotoUpload";
import { Button, Editor, TitlePost } from "..";
import { Photos } from "../createPost/photos";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IPost } from "@/@types/post";
import {
  deletePost,
  keyQuery,
  updatePostUser,
  updatePostUserDetail,
} from "@/lib/updateQueryData";
import { Post } from "@prisma/client";
import { usePostId } from "@/components/hooks/UsePostDetailFetch";
import { Categories } from "../createPost/categories";

interface Props {
  className?: string;
  post: Post;
}

export type PreviewItem = {
  src: string;
  type: "old" | "new";
};

export const EditPostInput: React.FC<Props> = ({ className, post }) => {
  const router = useRouter();

  const { data: session } = useSession();
  const postId = usePostId(post.id);

  if (session?.user?.id !== post.authorId) redirect("/");

  const [title, setTitle] = useState(post?.title);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [categories, setCategories] = useState<string>(post.categoryId || "");

  const [oldPhoto, setOldPhotos] = useState<string[]>(post.image || []);
  const [newPhoto, setNewPhotos] = useState<File[]>([]);
  const [photoPreview, setPhotoPreview] = useState<PreviewItem[]>(
    (post.image || []).map((url) => ({ src: url, type: "old" }))
  );

  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    const initializePhotos = async () => {
      if (!post) return;

      const rawContent = post.content as RawDraftContentState | null;
      setEditorState(
        rawContent && rawContent.blocks && rawContent.entityMap !== undefined
          ? EditorState.createWithContent(convertFromRaw(rawContent))
          : EditorState.createEmpty()
      );
    };

    initializePhotos();
  }, [post]);

  const mutation = useMutation({
    mutationFn: async (updatePost: IPost) => {
      return updatePost;
    },
    onSuccess: (updatePost) => {
      toast.success("Post updated successfully.");
      updatePostUserDetail(queryClient, "post", post.id, updatePost);
      keyQuery.forEach((key) => updatePostUser(queryClient, key, updatePost));
      router.replace(`/profile/${session?.user?.id}`);
    },
    onError: (error) => {
      toast.error("Something went wrong.");
      console.error(error);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    handlePhotoUpload(
      e,
      photoPreview,
      setPhotoPreview,
      setNewPhotos,
      setOldPhotos
    );
  };

  const handlePost = async () => {
    setLoading(true);

    const oldTitle = post.title;
    const oldContent = post.content;
    const oldPhotos = post.image;
    const oldCategories = post.categoryId;

    const newTitle = title.trim();
    const newContent = convertToRaw(editorState.getCurrentContent());
    const newPhotos = photoPreview.map((p) => p.src);

    const isTitleChanged = newTitle !== oldTitle;

    const isContentChanged =
      JSON.stringify(newContent) !== JSON.stringify(oldContent);

    const hasNewPhotos = newPhoto && newPhoto.length > 0;
    const hasDeletedPhotos =
      JSON.stringify(newPhotos) !== JSON.stringify(oldPhotos);

    const isPhotosChanged = hasNewPhotos || hasDeletedPhotos;

    const isCategoriesChanged = oldCategories !== categories;

    if (!isTitleChanged && !isContentChanged && !isPhotosChanged && !isCategoriesChanged) {
      setLoading(false);
      toast.error("No changes detected.");
      return;
    }

    if (title.trim() === "") {
      toast.error("Please enter a title.");
      setLoading(false);
      return;
    }

    const rawContent = convertToRaw(editorState.getCurrentContent());

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", JSON.stringify(rawContent));
    oldPhoto.forEach((oldPhoto) => formData.append("oldPhoto", oldPhoto));
    newPhoto.forEach((newPhotos) => formData.append("newPhotos", newPhotos));
    formData.append("categories", categories);

    try {
      const response = await axios.put(`/api/posts/${post.id}/edit`, formData);

      if (response.status === 200) {
        if (!postId) return;

        const editPost: IPost = {
          ...postId,
          title: isTitleChanged ? newTitle : oldTitle,
          content: isContentChanged ? rawContent : oldContent,
          image: isPhotosChanged ? newPhotos : oldPhotos,
          categoryId: categories,
        };

        mutation.mutate(editPost);
      }

      router.replace(`/profile/${session?.user?.id}`);
    } catch (error) {
      toast.error("Something went wrong.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const mutationDelete = useMutation({
    mutationFn: async (post: Post) => {
      return post;
    },
    onSuccess: () => {
      toast.success("Post deleted successfully.");
      keyQuery.forEach((key) =>
        deletePost(queryClient, key, post.authorId, post.id)
      );
      router.replace(`/profile/${session?.user?.id}`);
    },
    onError: (error) => {
      toast.error("Something went wrong.");
      console.error(error);
    },
    onSettled: () => {
      setDeleting(false);
    },
  });

  const handleDelete = async () => {
    setDeleting(true);

    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmed) {
      setDeleting(false);
      return;
    }

    try {
      const response = await axios.delete(`/api/posts/${post.id}/delete`);
      if (response.status === 200) {
        mutationDelete.mutate(post);
      }
    } catch (error) {
      toast.error("Something went wrong.");
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className={cn("flex flex-col max-w-[600px] mt-8", className)}>
      <Categories
        categories={categories}
        setCategories={setCategories}
      />
      
      <Photos
        photos={photoPreview}
        setPhotoPreview={setPhotoPreview}
        setOldPhotos={setOldPhotos}
        setNewPhotos={setNewPhotos}
      />

      <TitlePost
        setTitle={setTitle}
        title={title}
      />

      <Editor
        handlePgoto={handlePhoto}
        editorState={editorState}
        setEditorState={setEditorState}
      />

      <div className="edit-post flex items-end justify-end gap-5 mt-[30px] ml-auto w-full">
        <Button
          loading={deleting}
          onClick={handleDelete}
          className="flex items-center w-[125px] max-[125px] px-[30px] bg-[#F03535] text-[#d9d9d9] hover:bg-[#F03535]/70"
        >
          <RiDeleteBinLine className="block translate-y-[-1px]" /> Delete Post
        </Button>
        {!post.isbanned && (
          <Button
            loading={loading}
            onClick={handlePost}
            disabled={title.length === 0 ? true : false}
            className="w-[125px] max-[125px] px-[30px] flex items-center text-[#d9d9d9] dark:text-[#333333] bg-[#333333] dark:bg-[#d9d9d9] hover:bg-[#333333]/85 dark:hover:bg-[#d9d9d9]/85"
          >
            <FaRegSave className="block translate-y-[-1px]" /> Save
          </Button>
        )}
      </div>
    </div>
  );
};
