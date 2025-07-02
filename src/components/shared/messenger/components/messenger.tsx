"use client";
import React, { useRef } from "react";
import { ModalMessenger } from "./ModalMessenger";
import { LuMessageCircleMore } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { useMessangerStore } from "@/store/messanger";
import { useSession } from "next-auth/react";
import { useNotificationsQuery } from "../api/notifications/notifications";
import { usePusherNotification } from "../lib/pusherNotification";

interface Props {
  className?: string;
}

export const Messenger: React.FC<Props> = ({ className }) => {
  const { openMessager, setOpenMessager } = useMessangerStore();
  const modalRef = useRef<HTMLDivElement>(null);

  const { data: session } = useSession();

  const { data: notifications, isLoading: notificationsLoading } =
    useNotificationsQuery(session?.user?.id || "");

  usePusherNotification(session?.user?.id || "", openMessager, session?.user?.id || "");

  const handleClose = () => {
    if (openMessager) {
      setOpenMessager(false);
    }
  };

  return (
    <div className={className}>
      <Button
        variant="secondary"
        onClick={() => setOpenMessager(!openMessager)}
        className="w-fit bg-0 hover:bg-0 relative p-0 [&_svg]:size-[25px]"
      >
        <LuMessageCircleMore />
        {!notificationsLoading && notifications?.count > 0 && (
          <span className="p-[1px] absolute top-[-5px] right-[-5px] flex items-center justify-center min-w-6 h-6 text-xs text-[#d9d9d9] dark:text-[#d9d9d9] bg-[#7391d5] dark:bg-[#7391d5] rounded-full">
            {notifications?.count}
          </span>
        )}
      </Button>

      <ModalMessenger
        openMessager={openMessager}
        modalRef={modalRef}
        handleClose={handleClose}
      />
    </div>
  );
};
