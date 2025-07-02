"use client";
import React, { useState } from "react";
import { Button } from "../..";
import { cn } from "@/lib/utils";
import { BiSolidSend } from "react-icons/bi";
import { Textarea } from "@/components/ui/textarea";
import { FiPaperclip } from "react-icons/fi";
import { FaCheck } from "react-icons/fa6";
import { RiImageEditLine } from "react-icons/ri";
import { useResize } from "@/components/hooks/useResize";
import toast from "react-hot-toast";
import EmojiPicker from "emoji-picker-react";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import { EmojiClickData } from "emoji-picker-react";

interface Props {
  className?: string;
  formRef: React.RefObject<HTMLFormElement>;
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
  formRef,
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
  const { width } = useResize();
  const [showPicker, setShowPicker] = useState(false);

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

    event.target.value = "";

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
      setShowPicker(false);
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
    setShowPicker(false);

    if (edit) {
      editFunc(chatId, messageId, messageValue);
    } else {
      handleMessagePost(chatId, senderId, messageValue);
    }

    if (messageValue.length > 4096) return;

    const ss = textareaRef.current;
    if (ss) {
      ss.style.height = width > 768 ? "20px" : "24px";
    }
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setMessageValue((prev) => prev + emojiData.emoji);
  };

  return (
    <form
      className={cn(
        "absolute left-0 bottom-0 w-full z-20 flex items-center justify-center gap-4 p-2 backdrop-blur-3xl bg-[#e5e5e5]/80 dark:bg-[#141414]/85 mt-2",
        className
      )}
      onSubmit={(e) => e.preventDefault()}
      ref={formRef}
    >
      <label className="w-full p-[14px] border border-solid border-[#ffffff]/70 dark:border-neutral-300/75 rounded-[10px]">
        <Textarea
          ref={textareaRef}
          placeholder="Write a message..."
          className="scrollbar rounded-0 p-0 h-[20px] max-[750px]:min-h-[24px] border-0 resize-none max-h-[300px] text-[16px] border-solid border-[#b0b0b0]/70 dark:border-neutral-300/75 bg-transparent dark:bg-transparent"
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

      <div className="relative">
        <Button
          type="submit"
          onClick={() => setShowPicker(!showPicker)}
          className={cn(
            "bg-0 p-0 hover:bg-0 [&_svg]:size-[25px] text-[#333333] dark:text-[#d9d9d9]",
            showPicker ? "text-[#7391d5] dark:text-[#7391d5]" : ""
          )}
        >
          <HiOutlineEmojiHappy />
        </Button>

        {showPicker && (
          <div className="mt-2 absolute bottom-[50px] right-[-50px]">
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}
      </div>

      <Button
        type="submit"
        loading={loaderButtonSend}
        disabled={messageValue.trim() === "" && !prewiewFile && !editImage}
        onClick={() => handlePost()}
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
