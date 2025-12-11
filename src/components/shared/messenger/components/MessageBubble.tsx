"use client";
import { MdEdit, MdOutlineContentCopy } from "react-icons/md";
import { FaReply } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { cn } from "@/lib/utils";
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
import { memo, useCallback } from "react";
import { useModalImg } from "@/store/messanger";
import { useSettingsMessage } from "@/store/settingsMessage";
import { lightenColor } from "@/lib/lightenColor";
import { Session } from "next-auth";

interface Props {
  message: MessageProps;
  isNew?: boolean;
  onReply: (messageId: string) => void;
  onEdit: (messageId: string) => void;
  onDelete: (chatId: string, messageId: string) => void;
  session: Session | null;
}

const MessageBubbleComponent: React.FC<Props> = ({
  message,
  isNew,
  onReply,
  onEdit,
  onDelete,
  session,
}) => {
  const { setImgModal } = useModalImg();

  const { backgroundColorMessage, textColor, fontSize, radiusSize } =
    useSettingsMessage();

  const handleCopy = useCallback(() => {
    if (!message.content) return;
    navigator.clipboard.writeText(message.content);
    toast.success("Message copied to clipboard");
  }, [message.content]);

  const handleEdit = useCallback(() => {
    onEdit(message.id);
  }, [message.id, onEdit]);

  const handleReply = useCallback(() => {
    onReply(message.id);
  }, [message.id, onReply]);

  const handleDelete = useCallback(() => {
    const confirmMessage = window.confirm(
      "Are you sure you want to delete this message?"
    );
    if (!confirmMessage) return;
    onDelete(message.chatId, message.id);
  }, [message.chatId, message.id, onDelete]);

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
      fun: () => handleDelete(),
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

  const commentContentHTML = processContent(message?.content || "", true);

  return (
    <div
      className={
        isNew ? "animate-in fade-in zoom-in-90 duration-200" : undefined
      }
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
            className={`w-fit max-w-xs sm:max-w-md rounded-xl text-sm shadow overflow-hidden select-none
            ${
              message.senderId === session?.user.id
                ? "bg-[#7391d5] text-[#ebebeb] rounded-br-none"
                : "bg-[#ebebeb] dark:bg-[#2b2b2b] text-[#2b2b2b] dark:text-[#ebebeb] rounded-bl-none"
            }
          `}
            style={{
              ...(message.senderId === session?.user.id
                ? {
                    backgroundColor: backgroundColorMessage,
                    color: textColor,
                  }
                : {}),
              borderTopLeftRadius: `${radiusSize}px`,
              borderTopRightRadius: `${radiusSize}px`,
              borderBottomLeftRadius:
                message.senderId === session?.user.id ? `${radiusSize}px` : "0",
              borderBottomRightRadius:
                message.senderId === session?.user.id ? "0" : `${radiusSize}px`,
            }}
          >
            {message?.replyTo && (
              <div
                className="relative flex items-center gap-1 px-4 py-1 m-2 mb-0 rounded-[10px] bg-[#9fb8f4]"
                style={{
                  backgroundColor: lightenColor(backgroundColorMessage, 30),
                }}
              >
                <span
                  className="absolute w-[3px] h-[calc(100%-10px)] left-[8px] bg-[#7391d5] rounded-[5px]"
                  style={{ backgroundColor: backgroundColorMessage }}
                ></span>
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
                    priority={false}
                  />
                )}

                <div>
                  <span className="block font-medium">
                    {message?.replyTo?.sender?.username}
                  </span>
                  {message?.replyTo?.content && (
                    <p className="block text-[12px] leading-3">
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
              <div
                className="relative rounded-[7px] overflow-hidden"
                onClick={() => setImgModal(message?.image || "")}
              >
                <div
                  style={{
                    backgroundImage: `url(${message?.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  className="absolute top-0 left-0 w-full h-full blur-[50px] z-[1]"
                ></div>

                <div className="relative z-[2] flex items-center justify-center h-full cursor-pointer">
                  <Image
                    src={message?.image}
                    alt="basic"
                    width={500}
                    height={400}
                    className="block object-contain rounded-t-xl w-full max-h-[400px]"
                    loading="lazy"
                    priority={false}
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
                    className={cn(
                      "whitespace-pre-wrap break-words px-1 max-[750px]:text-[14px] max-[750px]:select-none"
                    )}
                    style={{ fontSize: `${fontSize}px` }}
                    dangerouslySetInnerHTML={{ __html: commentContentHTML }}
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

                {message.senderId === session?.user.id &&
                  (message.isRead ? (
                    <span title="Read by recipient">
                      <TbChecks size={16} />
                    </span>
                  ) : (
                    <span title="Not read yet">
                      <TbCheck size={16} />
                    </span>
                  ))}
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
    </div>
  );
};

export const MessageBubble = memo(MessageBubbleComponent);
