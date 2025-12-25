"use client";
import React, { useState } from "react";
import { Button } from "../..";
import { cn } from "@/lib/utils";
import { BiSolidSend } from "react-icons/bi";
import { Textarea } from "@/components/ui/textarea";
import { FiPaperclip } from "react-icons/fi";
import { FaCheck } from "react-icons/fa6";
import { RiImageEditLine } from "react-icons/ri";
// import { useResize } from "@/components/hooks/useResize";
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
  // const { width } = useResize();
  const [showPicker, setShowPicker] = useState(false);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "20px";
    textarea.style.height = `${Math.max(textarea.scrollHeight - 1, 20)}px`;
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

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds the 5MB limit.");
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
        ss.style.height = "20px";
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
      ss.style.height = "20px";
    }
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setMessageValue((prev) => prev + emojiData.emoji);
  };

  return (
    <form
      className={cn(
        "rounded-[20px] min-h-[52px] z-20 flex items-center justify-center gap-2 max-[750px]:gap-1 px-3 backdrop-blur-[15px] bg-[#e5e5e5]/70 dark:bg-[#141414]/60 mt-2 m-[10px]",
        className
      )}
      onSubmit={(e) => e.preventDefault()}
      ref={formRef}
    >
      <label className="block w-full rounded-[10px] px-2 py-3 cursor-text">
        <Textarea
          ref={textareaRef}
          placeholder="Write a message..."
          className={cn(
            "px-0 py-0 placeholder:relative placeholder:top-[1px] placeholder:text-[#333333]/80 dark:placeholder:text-[#e5e5e5]/80 leading-[20px] overflow-hidden rounded-0 p-0 h-[20px] max-[750px]:min-h-[24px] border-0 resize-none max-h-[300px] text-[16px] border-solid bg-transparent dark:bg-transparent",
            textareaRef.current &&
              textareaRef.current?.scrollHeight >= 300 &&
              "scrollbar overflow-auto"
          )}
          value={messageValue}
          onChange={(e) => setMessageValue(e.target.value)}
          onInput={adjustHeight}
          onKeyDown={handleKeyDown}
        />
      </label>

      {!messageValue && (
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
      )}

      <div className="relative z-[900] order-[-1]">
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
          <div className="mt-2 absolute bottom-[50px] left-0">
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}
      </div>

      <Button
        type="submit"
        loading={loaderButtonSend}
        disabled={messageValue.trim() === "" && !prewiewFile && !editImage}
        onClick={() => handlePost()}
        className="min-w-[40px] max-[750px]:min-w-[25px] max-w-[40px] max-[750px]:max-w-[25px] w-[40px] max-[750px]:w-[25px] h-[40px] ml-auto flex items-center 
        justify-center rounded-full bg-[#7391d5]
         dark:bg-[#7391d5] max-[750px]:bg-transparent max-[750px]:dark:bg-transparent
          hover:bg-[#7391d5]/85 dark:hover:bg-[#7391d5]/85 max-[750px]:hover:bg-transparent max-[750px]:dark:hover:bg-transparent
         [&_svg]:size-[20px] max-[750px]:[&_svg]:size-[25px] max-[750px]:text-[#7391d5] max-[750px]:dark:text-[#7391d5]"
      >
        {edit ? <FaCheck /> : <BiSolidSend />}
      </Button>
    </form>
  );
};
