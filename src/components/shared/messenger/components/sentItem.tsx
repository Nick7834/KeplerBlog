import { useMessangerStore } from "@/store/messanger";
import { ChatRequest } from "@prisma/client";
import Link from "next/link";
import React from "react";
import { FaCheck, FaRegUser } from "react-icons/fa6";
import { CheckProfile } from "../../checkProfile";
import { cn } from "@/lib/utils";
import { IoMdTime } from "react-icons/io";
import { IoClose } from "react-icons/io5";

interface NewItem extends ChatRequest {
  to: {
    id: string;
    username: string;
    profileImage: string;
    isVerified: boolean;
  };
}

interface Props {
  className?: string;
  item: NewItem;
}

export const SentItem: React.FC<Props> = ({ className, item }) => {
  const { openMessager, setOpenMessager } = useMessangerStore();

  return (
    <div
      className={cn(
        "search-user relative flex items-center gap-5 justify-between p-3 hover:bg-[#d1d1d1]/60 hover:dark:bg-[#333333]/60 rounded-[10px]",
        className
      )}
    >
      <span className="absolute bottom-0 left-0 w-full border-b-[1px] border-[#b0b0b0]/60"></span>
      <Link
        href={`/profile/${item.to.id}`}
        onClick={() => setOpenMessager(!openMessager)}
        className="flex items-center gap-4"
      >
        {item.to.profileImage ? (
          <img
            src={item.to.profileImage}
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
          {item.to.username}
          <CheckProfile isverified={item.to.isVerified} />
        </h3>
      </Link>
      <div className="flex items-center gap-2">
        {item.status === "PENDING" && (
          <span
            title="Under Consideration"
            className="flex items-center justify-center min-w-[40px] max-w-[40px] min-h-[40px] max-h-[40px] rounded-full bg-[#c1c1c1]/30 dark:bg-[#2a2a2a]"
          >
            <IoMdTime size={22} />
          </span>
        )}
        {item.status === "REJECTED" && (
          <span
            title="Rejected"
            className="flex items-center justify-center min-w-[40px] max-w-[40px] min-h-[40px] max-h-[40px] rounded-full bg-red-400 dark:bg-red-400"
          >
            <IoClose size={22} />
          </span>
        )}
        {item.status === "ACCEPTED" && (
          <span
            title="Accepted"
            className="flex items-center justify-center min-w-[40px] max-w-[40px] min-h-[40px] max-h-[40px] rounded-full bg-green-400 dark:bg-green-400"
          >
            <FaCheck
              size={22}
              className="text-white"
            />
          </span>
        )}
      </div>
    </div>
  );
};
