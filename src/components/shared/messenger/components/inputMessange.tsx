"use client";
import React from "react";
import { Button } from "../..";
import { cn } from "@/lib/utils";
import { BiSolidSend } from "react-icons/bi";
import { Textarea } from "@/components/ui/textarea";
import { FiPaperclip } from "react-icons/fi";
import { FaCheck } from "react-icons/fa6";
import { RiImageEditLine } from "react-icons/ri";
import { useResize } from "@/components/hooks/useResize";
import toast from "react-hot-toast";

interface Props {
  className?: string;
  messageValue: string;
  setMessageValue: React.Dispatch<React.SetStateAction<string>>;
  handleMessagePost: (
    chatId: string,
    senderId: string,
    messageValue: string
  ) => void;
  loaderButtonSend: boolean;
  setLoaderButtonSend: React.Dispatch<React.SetStateAction<boolean>>;
  senderId: string;
  chatId: string;
  setFilePreview: React.Dispatch<React.SetStateAction<string | null>>;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  prewiewFile: string | null;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  messageId: string;
  edit: boolean;
  editImage: string | null;
  editFunc: (chatId: string, messageId: string, messageContent: string) => void;
}

export const InputMessage: React.FC<Props> = ({
  className,
  messageValue,
  loaderButtonSend,
  senderId,
  chatId,
  prewiewFile,
  messageId,
  edit,
  editImage,
  editFunc,
  setMessageValue,
  setFilePreview,
  setFile,
  handleMessagePost,
  textareaRef,
}) => {
  const {width} = useResize()

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = width > 768 ? "20px" : "24px";
    const newHeight = textarea.scrollHeight;
    textarea.style.height = `${newHeight}px`;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }
    
    if (file.size > 15 * 1024 * 1024) {
      toast.error("File size exceeds the 15MB limit.");
      return;
    }

    setFile(file);
    setFilePreview(URL.createObjectURL(file));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      
      if (edit) {
        editFunc(chatId, messageId, messageValue);
      } else {
        handleMessagePost(chatId, senderId, messageValue);
      }

      const ss = textareaRef.current;
      if (ss) {
        ss.style.height = width > 768 ? "20px" : "24px";
      }
    }
  };

  const handlePost = () => {
    handleMessagePost(chatId, senderId, messageValue)

    const ss = textareaRef.current;
    if (ss) {
      ss.style.height = width > 768 ? "20px" : "24px";
    }
  }

  return (
    <form
      className={cn(
        "flex items-center justify-center gap-4 p-2 bg-[#e5e5e5] dark:bg-[#141414] rounded-b-[10px] mt-2",
        className
      )}
      onSubmit={(e) => e.preventDefault()}
    >
      <label className="w-full p-[14px] border border-solid border-[#b0b0b0]/70 dark:border-neutral-300/75 rounded-[10px]">
        <Textarea
          ref={textareaRef}
          placeholder="Write a message..."
          className="scrollbar rounded-0 p-0 h-[20px] max-[750px]:h-[24px] border-0 resize-none max-h-[300px] text-[16px] border-solid border-[#b0b0b0]/70 dark:border-neutral-300/75 bg-transparent dark:bg-transparent"
          value={messageValue}
          onChange={(e) => setMessageValue(e.target.value)}
          onInput={adjustHeight}
          onKeyDown={handleKeyDown}
        />
      </label>

      <label className="cursor-pointer min-w-[20px] w-[20px] h-[50px] flex items-center justify-center">
        <input
          type="file"
          hidden
          accept="image/*"
          multiple
          onChange={handleFileChange}
        />
        {edit ? (
          <RiImageEditLine
            size={20}
            className="text-[#333333] dark:text-[#d9d9d9]"
          />
        ) : (
          <FiPaperclip
            size={20}
            className="text-[#333333] dark:text-[#d9d9d9]"
          />
        )}
      </label>

      <Button
        type="submit"
        loading={loaderButtonSend}
        disabled={messageValue.trim() === "" && !prewiewFile && !editImage}
        onClick={() =>
          edit
            ? editFunc(chatId, messageId, messageValue)
            : handlePost()
        }
        className="min-w-[50px] max-w-[50px] w-[50px] h-[50px] ml-auto flex items-center 
        justify-center rounded-full bg-[#7391d5]
         dark:bg-[#7391d5] hover:bg-[#7391d5]/85 dark:hover:bg-[#7391d5]/85
         [&_svg]:size-[20px]"
      >
        {edit ? <FaCheck /> : <BiSolidSend />}
      </Button>
    </form>
  );
};
