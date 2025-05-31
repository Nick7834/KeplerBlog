import { useMessangerStore } from "@/store/messanger";
import { ChatRequest } from "@prisma/client";
import Link from "next/link";
import React from "react";
import { FaRegUser } from "react-icons/fa6";
import { CheckProfile } from "../../checkProfile";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FaCheck } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { RequestChat } from "@/@types/message";
import toast from "react-hot-toast";

interface NewItem extends ChatRequest {
  from: {
    id: string;
    username: string;
    profileImage: string;
    isVerified: boolean;
  };
}

interface Props {
  className?: string;
  item: NewItem;
  userId: string;
}

export const ReqItem: React.FC<Props> = ({ className, item, userId }) => {
  const { openMessager, setOpenMessager } = useMessangerStore();

  const queryClient = useQueryClient();

  const handleAccept = async (id: string, status: string) => {
    if (status === "ACCEPTED") {
      const confirm = window.confirm(
        "Are you sure you want to accept this request?"
      );
      if (!confirm) {
        return;
      }
    } else {
      const confirm = window.confirm(
        "Are you sure you want to reject this request?"
      );
      if (!confirm) {
        return;
      }
    }

    // Delete Request

    queryClient.setQueryData(
      ["request-chats", userId],
      (oldData: RequestChat) => {
        if (!oldData) return oldData;

        const deleteRequest = oldData.pages.map((page) => {
          return {
            ...page,
            items: page.items.filter((item) => item.id !== id),
          };
        });

        return {
          ...oldData,
          pages: deleteRequest,
        };
      }
    );

    if (status === "ACCEPTED") {
      toast.success("Request accepted!");
    } else {
      toast.success("Request rejected!");
    }

    try {
      const resp = await axios.put(
        `/api/messenger/messagesPrivate?idRequest=${id}&status=${status}`
      );

      if (resp.status === 200) {
        queryClient.invalidateQueries({
          queryKey: ["count-chats", userId],
        });
      }
    } catch (error) {
      console.warn(error);
    }
  };

  return (
    <div
      className={cn(
        "search-user relative flex items-center gap-5 justify-between p-3 hover:bg-[#d1d1d1]/60 hover:dark:bg-[#333333]/60 rounded-[10px]",
        className
      )}
    >
      <span className="absolute bottom-0 left-0 w-full border-b-[1px] border-[#b0b0b0]/60"></span>
      <Link
        href={`/profile/${item.from.id}`}
        onClick={() => setOpenMessager(!openMessager)}
        className="flex items-center gap-4"
      >
        {item.from.profileImage ? (
          <img
            src={item.from.profileImage}
            alt="avatar"
            className="min-w-[60px] w-[60px] h-[60px] rounded-full object-cover"
            loading="lazy"
          />
        ) : (
          <span className="flex flex-col items-center justify-center object-cover rounded-full w-[60px] h-[60px] bg-[#c7c7c7]">
            <FaRegUser className="text-[#333333]" />
          </span>
        )}
        <h3 className="text-[#333333] dark:text-[#d9d9d9] flex items-center gap-1">
          {item.from.username}
          <CheckProfile isverified={item.from.isVerified} />
        </h3>
      </Link>
      <div className="flex items-center gap-2">
        <Button
          onClick={() => handleAccept(item.id, "ACCEPTED")}
          title="accept"
          className="flex items-center justify-center bg-green-400 dark:bg-green-400 hover:bg-green-600 dark:hover:bg-green-600 min-w-[40px] max-w-[40px] min-h-[40px] max-h-[40px] rounded-full"
        >
          <FaCheck />
        </Button>
        <Button
          onClick={() => handleAccept(item.id, "REJECTED")}
          title="reject"
          className="flex items-center justify-center bg-red-400 dark:bg-red-400 hover:bg-red-600 dark:hover:bg-red-600 min-w-[40px] max-w-[40px] min-h-[40px] max-h-[40px] rounded-full"
        >
          <IoClose />
        </Button>
      </div>
    </div>
  );
};
