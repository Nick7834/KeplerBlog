"use client";
import { MdEdit, MdOutlineContentCopy } from "react-icons/md";
import { FaReply } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { differenceInHours, format } from "date-fns";
import { MessageProps } from "@/@types/message";
import toast from "react-hot-toast";
import Image from "next/image";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { processContent } from "@/lib/processContent";
import { TbCheck, TbChecks } from "react-icons/tb";

interface Props {
  message: MessageProps;
  isNew?: boolean;
  onReply: (messageId: string) => void;
  onEdit: (messageId: string) => void;
  onDelete: (chatId: string, messageId: string) => void;
}

export const MessageBubble: React.FC<Props> = ({
  message,
  isNew,
  onReply,
  onEdit,
  onDelete,
}) => {
  const { data: session } = useSession();

  const handleCopy = () => {
    if (!message.content) return;
    navigator.clipboard.writeText(message.content || "");
    toast.success("Message copied to clipboard");
  };

  const handleEdit = async () => {
    onEdit(message.id);
  };

  const handleReply = () => {
    onReply(message.id);
  };

  const handleDelete = async (chatId: string, messageId: string) => {
    const comfitmessage = window.confirm(
      "Are you sure you want to delete this message?"
    );

    if (!comfitmessage) {
      return;
    }
    onDelete(chatId, messageId);
  };

  const menuButton = [
    {
      label: "Copy",
      value: "copy",
      icon: <MdOutlineContentCopy />,
      fun: handleCopy,
    },
    {
      label: "Edit",
      value: "edit",
      icon: <MdEdit />,
      fun: handleEdit,
    },
    { label: "Reply", value: "reply", icon: <FaReply />, fun: handleReply },
    {
      label: "Delete",
      value: "delete",
      icon: <MdDelete />,
      fun: () => handleDelete(message.chatId, message.id),
    },
  ];

  const filteredButtons = menuButton.filter((item) => {
    const isOwner = session?.user.id === message.senderId;

    const diffHours = differenceInHours(
      new Date(),
      new Date(message.createdAt)
    );

    if (!isOwner && (item.value === "edit" || item.value === "delete"))
      return false;

    if (item.value === "edit" && diffHours > 48) return false;

    return true;
  });

  const commentContentText = processContent(message?.content || "", false);

  return (
    <motion.div
      initial={isNew ? { opacity: 0, scale: 0.8 } : false}
      animate={isNew ? { opacity: 1, scale: 1 } : false}
      transition={isNew ? { duration: 0.2 } : undefined}
    >
      <ContextMenu>
        <ContextMenuTrigger
          onMouseDown={(e) => e.preventDefault()}
          className={`flex w-full ${
            message.senderId === session?.user.id
              ? "justify-end"
              : "justify-start"
          }  relative`}
        >
          <div
            className={`w-fit max-w-xs sm:max-w-md rounded-xl text-sm shadow overflow-hidden
            ${
              message.senderId === session?.user.id
                ? "bg-[#7391d5]/90 backdrop-blur-[12px] text-[#ebebeb] rounded-br-none"
                : "bg-[#ebebeb]/90 backdrop-blur-[12px] dark:bg-[#2b2b2b] text-[#2b2b2b] dark:text-[#ebebeb] rounded-bl-none"
            }
          `}
          >
            {message?.replyTo && (
              <div className="relative flex items-center gap-1 px-4 py-1 m-2 mb-0 rounded-[10px] bg-[#9fb8f4]">
                <span className="absolute w-[3px] h-[calc(100%-10px)] left-[8px] bg-[#7391d5] rounded-[5px]"></span>
                {message?.replyTo?.image && (
                  <Image
                    src={message?.replyTo?.image}
                    width={40}
                    height={40}
                    alt="answer"
                    className="w-[40px] h-[40px] rounded-[5px] object-cover"
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL={message?.replyTo?.image}
                  />
                )}

                <div>
                  <span className="block font-medium">
                    {message?.replyTo?.sender?.username}
                  </span>
                  {message?.replyTo?.content && (
                    <p className="block text-[12px] leading-3 max-[750px]:text-[14px]">
                      {message?.replyTo?.content.length > 20
                        ? `${message?.replyTo?.content
                            ?.substring(0, 20)
                            .trim()}...`
                        : message?.replyTo?.content?.substring(0, 20).trim()}
                    </p>
                  )}
                </div>
              </div>
            )}
            {message?.image && (
              <div className="relative rounded-[7px] overflow-hidden">
                <div
                  style={{ backgroundImage: `url(${message?.image})` }}
                  className="absolute top-0 left-0 bg-cover bg-center blur-md z-[1] w-full h-full"
                ></div>
                <div className="relative z-[2] flex items-center justify-center h-full">
                  <img
                    src={message?.image}
                    alt="basic"
                    width={500}
                    height={400}
                    className={`block h-fit object-contain rounded-t-xl w-full max-h-[400px] ${
                      message?.replyTo ? "mt-2" : ""
                    }`}
                    loading="lazy"
                  />
                </div>
              </div>
            )}
            <div className={cn("p-2 relative", !message?.content && "p-0")}>
              {message?.content && (
                <div
                  className={cn(
                    "block",
                    message?.content?.length > 60
                      ? "pr-7 max-[650px]:pr-[35px]"
                      : "pr-14 max-[650px]:pr-12"
                  )}
                >
                  <p
                    className="whitespace-pre-wrap break-words px-1 max-[750px]:text-base"
                    dangerouslySetInnerHTML={{
                      __html: String(commentContentText),
                    }}
                  ></p>
                </div>
              )}
              <div
                className={cn(
                  "absolute bottom-1 right-2 z-[5] flex gap-1 text-xs font-medium items-center opacity-70 max-[650px]:bottom-[2px] max-[650px]:right-[5px] max-[650px]:justify-end",
                  !message.content &&
                    "absolute bottom-[5px] right-[5px] bg-gray-900/50 text-white dark:text-white rounded-[12px] px-2 py-[3px]",
                  message?.content && message?.content?.length > 50
                    ? "relative mb-[-8px] justify-end"
                    : "absolute"
                )}
              >
                {message.createdAt &&
                  format(new Date(message.createdAt), "HH:mm")}

                {message.isRead ? (
                  <span title="read">
                    <TbChecks size={16} />
                  </span>
                ) : (
                  <span title="not read">
                    <TbCheck size={16} />
                  </span>
                )}
              </div>
            </div>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent
          className={cn(
            "border-0 z-[2000] rounded-[10px] p-1 w-fit h-fit bg-[#f5f5f5]/80 dark:bg-[#333333]/80 backdrop-blur-md"
          )}
        >
          {filteredButtons.map((item) => (
            <ContextMenuItem
              key={item.value}
              onClick={item.fun}
              inset
              className="cursor-pointer flex items-center gap-2 justify-start text-start text-[#333333] dark:text-[#d9d9d9] w-full h-fit px-2 py-2 rounded-[10px]
               focus:bg-[#d5d5d5]/60 focus:dark:bg-[#333333]/60 hover:bg-[#d5d5d5]/60 hover:dark:bg-[#5d5d5d]/60"
            >
              {item.icon}
              <span>{item.label}</span>
            </ContextMenuItem>
          ))}
        </ContextMenuContent>
      </ContextMenu>
    </motion.div>
  );
};
