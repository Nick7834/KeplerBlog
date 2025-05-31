import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { FaPen, FaReply } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { InputMessage } from "./inputMessange";
import { useChatQuery, useInfoChatQuery } from "../api/chat";
import { Oval } from "react-loader-spinner";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { useChatPusher } from "@/components/hooks/pusherMessage";
import { useQueryClient } from "@tanstack/react-query";
import { ReplyType } from "@/@types/message";
import { ChatScroll } from "./chatScroll";
import { handleMessagePost } from "../api/chat/handleMessagePost";
import { handleEdit } from "../api/chat/handleEdit";
import { handleDelete } from "../api/chat/handleDelete";
import { ChatHeader } from "./ChatHeader";
import { handleDeleteChatId } from "../api/chat/handleDeleleChat";
import { VirtuosoHandle } from "react-virtuoso";

interface Props {
  className?: string;
  currentChatId: string;
  setCurrentChatId: (chatId: string) => void;
  handleClose: () => void;
}

export const Chat: React.FC<Props> = ({ className, currentChatId, setCurrentChatId, handleClose }) => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  useChatPusher(currentChatId);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { data: currentChat, isLoading: isLoadingCurrentChat } =
    useInfoChatQuery(currentChatId);

  const {
    data: messages,
    fetchNextPage: fetchNextPageMessages,
    hasNextPage: hasNextPageMessages,
    isLoading: isLoadingMessages,
    isFetchingNextPage: isFetchingNextPageMessages,
  } = useChatQuery(currentChatId);

  const messagersData =
    messages?.pages.flatMap((page) => page.messages ?? []).reverse() || [];

  const totalMessages = messages?.pages[0]?.totalMessagesCount || 0;

  const [firstItemIndex, setFirstItemIndex] = useState(() =>
    Math.max(totalMessages - 50, 0)
  );
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    setIsFirstLoad(true);
    setMessageValue("");
    setFile(null);
    setFilePreview(null);
    setReply(null);
    setIsEdit(null);
  }, [currentChatId]);

  useEffect(() => {
    if (isFirstLoad && totalMessages && messagersData.length > 0) {
      const newFirstIndex = totalMessages - messagersData.length;
      setFirstItemIndex(Math.max(newFirstIndex, 0));
      setIsFirstLoad(false);
    }
  }, [isFirstLoad, currentChatId, messagersData.length, totalMessages]);

  ////
  const virtuosoRef = useRef<VirtuosoHandle>(null);

  const [isNew, setIsNew] = useState(false);

  const [file, setFile] = React.useState<File | null>(null);
  const [filePreview, setFilePreview] = React.useState<string | null>(null);

  const [messageValue, setMessageValue] = useState<string>("");
  const [loaderButtonSend, setLoaderButtonSend] = useState<boolean>(false);

  const [reply, setReply] = useState<ReplyType | null>(null);
  const [isEdit, setIsEdit] = useState<ReplyType | null>(null);

  // post

  // const [isTyping, setIsTyping] = useState<boolean>(false);

  const handleNewMessage = (
    chatId: string,
    senderId: string,
    content: string
  ) => {
    if (!session) return;
    if (messageValue.trim() === "" && !filePreview) return;

    if (messageValue.length > 1000) {
      toast.error("Message must be less than 1000 characters.");
      return;
    }

    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    }
    formData.append("chatId", chatId);
    formData.append("senderId", senderId);
    formData.append("replyToId", reply?.id || "");
    formData.append("content", content.trim());

    setMessageValue("");
    setFile(null);
    setFilePreview(null);
    setReply(null);
    setIsEdit(null);
    setIsNew(true);

    handleMessagePost(
      chatId,
      content,
      queryClient,
      setIsNew,
      formData,
      session,
      reply,
      filePreview
    );

    setTimeout(() => {
      virtuosoRef.current?.scrollToIndex({
        index: messagersData.length - 1,
        behavior: "auto",
      })
    }, 300)
  };

  const handleEditMessage = (
    chatId: string,
    messageId: string,
    messageContent: string
  ) => {
    if (!chatId || !messageId) return;

    const formData = new FormData();
    formData.append("chatId", chatId);
    formData.append("messageId", messageId);
    formData.append("messageContent", messageContent || "");

    if (file) {
      formData.append("file", file);
    }

    if (isEdit) {
      formData.append("oldPhoto", isEdit?.image || "");
    }

    setIsEdit(null);
    setFile(null);
    setFilePreview(null);
    setMessageValue("");

    handleEdit(
      chatId,
      messageId,
      messageContent,
      queryClient,
      formData,
      filePreview,
      isEdit,
      file
    );
  };

  const handleReply = (messageId: string) => {
    setIsEdit(null);
    setMessageValue("");

    const messageToReplyTo = messagersData.find((msg) => msg.id === messageId);
    if (messageToReplyTo) {
      setReply(messageToReplyTo);
    }

    setTimeout(() => {
      textareaRef.current?.focus();
    }, 300);
  };

  const handleDeleteMessage = async (chatId: string, messageId: string) => {
    const formData = new FormData();
    formData.append("chatId", chatId);
    formData.append("messageId", messageId);

    if (!chatId || !messageId) return;

    handleDelete(chatId, messageId, queryClient);
  };

  const handleEditPanel = (messageId: string) => {
    setReply(null);
    const messageToEdit = messagersData.find((msg) => msg.id === messageId);
    if (messageToEdit) {
      setIsEdit(messageToEdit);
      setMessageValue(messageToEdit.content);
    }
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 300);
  };

  const handleDeleteChat = (chatId: string) => {
    if(!chatId) return;

    const comfirm = window.confirm("Are you sure you want to delete this chat?");

    if(!comfirm) return;

    handleDeleteChatId(chatId, setCurrentChatId);
  };

  return (
    <div
      className={cn(
        "flex flex-col h-full rounded-br-[20px] rounded-bl-none rounded-tl-none max-[750px]:rounded-[0px] overflow-hidden",
        className
      )}
    >
      
      <ChatHeader
        isLoadingCurrentChat={isLoadingCurrentChat}
        currentChat={currentChat}
        handleDeleteChat={handleDeleteChat}
        setCurrentChatId={setCurrentChatId}
        handleClose={handleClose}
      />

      <div className="flex-1">
        {isLoadingMessages ? (
          <span className="flex items-center justify-center h-full">
            <Oval
              visible={true}
              height="50"
              width="50"
              color="#7391d5"
              secondaryColor="#7391d5"
              ariaLabel="oval-loading"
              strokeWidth={4}
            />
          </span>
        ) : (
          <ChatScroll
            messagersData={messagersData}
            isLoadingMessages={isLoadingMessages}
            isFetchingNextPageMessages={isFetchingNextPageMessages}
            hasNextPageMessages={hasNextPageMessages}
            currentUserId={session?.user.id || ""}
            fetchNextPageMessages={fetchNextPageMessages}
            isNew={isNew}
            handleReply={handleReply}
            handleEditPanel={handleEditPanel}
            handleDelete={handleDeleteMessage}
            firstItemIndex={firstItemIndex}
            setFirstItemIndex={setFirstItemIndex}
            currentChatId={currentChatId}
            virtuosoRef={virtuosoRef}
          />
        )}
      </div>

      <AnimatePresence mode="wait">
        {reply && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 0, x: 100 }}
            transition={{ duration: 0.15 }}
            className="shadow-[0_-4px_10px_rgba(0,0,0,0.1)] bg-[#e5e5e5] dark:bg-[#141414] p-2 mx-4 rounded-t-lg flex justify-between items-center"
          >
            <div className="flex items-center gap-4">
              <div className="text-[#7391d5]">
                <FaReply />
              </div>
              <div className="text-sm flex items-center gap-2">
                {reply.image && (
                  <img
                    src={reply.image}
                    alt="reply"
                    className="block min-w-[50px] h-[50px] object-cover rounded-[5px]"
                  />
                )}
                <div>
                  <p className="text-[#333333] dark:text-[#d9d9d9] font-medium">
                    {reply.sender.username}
                  </p>
                  <span className="text-[#333333] dark:text-[#d9d9d9]">
                    {reply.content.length > 100
                      ? reply.content.substring(0, 100).trim() + "..."
                      : reply.content.trim().substring(0, 100).trim()}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setReply(null)}
              className="text-[#333333] dark:text-[#d9d9d9] text-lg"
            >
              <IoClose />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {filePreview && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 0, x: 100 }}
            transition={{ duration: 0.15 }}
            className="shadow-[0_-4px_10px_rgba(0,0,0,0.1)] bg-[#e5e5e5] dark:bg-[#141414] p-2 mx-4 rounded-t-lg grid grid-cols-[1fr_20px] items-center"
          >
            <img
              src={filePreview}
              alt="file"
              className="block min-w-[50px] h-[50px] object-cover rounded-[5px] mx-auto"
            />
            <Button
              variant="outline"
              onClick={() => {
                setFile(null);
                setFilePreview(null);
              }}
              className="text-[#333333] dark:text-[#d9d9d9] text-lg bg-0 border-0 hover:bg-0 p-2"
            >
              <IoClose />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {isEdit && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 0, x: 100 }}
            transition={{ duration: 0.15 }}
            className="shadow-[0_-4px_10px_rgba(0,0,0,0.1)] bg-[#e5e5e5] dark:bg-[#141414] p-2 mx-4 rounded-t-lg flex justify-between items-center"
          >
            <div className="flex items-center gap-4">
              <div className="text-[#7391d5]">
                <FaPen />
              </div>
              <div className="text-sm flex items-center gap-2">
                {isEdit.image && (
                  <img
                    src={isEdit.image}
                    alt="reply"
                    className="block min-w-[50px] h-[50px] object-cover rounded-[5px]"
                  />
                )}
                <div>
                  <p className="text-[#333333] dark:text-[#d9d9d9] font-medium">
                    Edit Message
                  </p>
                  <span className="text-[#333333] dark:text-[#d9d9d9]">
                    {isEdit.content.length > 100
                      ? isEdit.content.substring(0, 100).trim() + "..."
                      : isEdit.content.trim().substring(0, 100).trim()}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => (
                setIsEdit(null),
                setMessageValue(""),
                setFile(null),
                setFilePreview(null)
              )}
              className="text-[#333333] dark:text-[#d9d9d9] text-lg"
            >
              <IoClose />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <InputMessage
        loaderButtonSend={loaderButtonSend}
        messageValue={messageValue}
        senderId={session?.user.id || ""}
        chatId={currentChat?.id || ""}
        setMessageValue={setMessageValue}
        handleMessagePost={() =>
          handleNewMessage(
            currentChat?.id || "",
            session?.user.id || "",
            messageValue
          )
        }
        setLoaderButtonSend={setLoaderButtonSend}
        setFilePreview={setFilePreview}
        setFile={setFile}
        prewiewFile={filePreview}
        textareaRef={textareaRef}
        messageId={isEdit?.id || ""}
        editImage={isEdit?.image || null}
        edit={Boolean(isEdit)}
        editFunc={() =>
          handleEditMessage(
            currentChat?.id || "",
            isEdit?.id || "",
            messageValue
          )
        }
        className="relative z-[20] shadow-[0_-4px_10px_rgba(0,0,0,0.1)] border-t border-solid border-[#b0b0b0]/70 dark:border-neutral-300/75"
      />
    </div>
  );
};

