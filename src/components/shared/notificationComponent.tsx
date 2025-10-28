"use client";
import React, { useRef, useState } from "react";
import { IoMdNotificationsOutline, IoMdNotifications } from "react-icons/io";
import { Session } from "next-auth";
import { UseFormatNumber } from "../hooks/useFormatNumber";
import Link from "next/link";
import { FaRegUser } from "react-icons/fa6";
import { Oval } from "react-loader-spinner";
import { MdVisibilityOff } from "react-icons/md";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import UseCloseModal from "../hooks/useCloseModal";
import { IoClose } from "react-icons/io5";
import { useResize } from "../hooks/useResize";
import { useHiddenScroll } from "../hooks/useHiddenScroll";
import InfiniteScroll from "react-infinite-scroll-component";
import { BiSolidNotificationOff } from "react-icons/bi";
import {
  NotificationDataType,
  useNotifications,
} from "../hooks/useNotifications";
import { getShortTimeAgo } from "../hooks/useDate";

interface Props {
  session: Session | null;
}

export const NotificationComponent: React.FC<Props> = ({ session }) => {
  const [isOpen, setIsOpen] = useState(false);
  const refNotification = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  UseCloseModal(buttonRef, refNotification, () => setIsOpen(false));

  const { width } = useResize();

  const {
    handleClick,
    handleClickNotification,
    handleDel,
    notificationsData,
    notificationCount,
    isLoading,
    hasMore,
    loadMoreNotifications,
  } = useNotifications(session, width);

  const formattedCount = UseFormatNumber(notificationCount);

  useHiddenScroll(isOpen);

  return (
    <div className="relative">
      <Button
        variant="secondary"
        ref={buttonRef}
        onClick={() => (handleClick(), setIsOpen(!isOpen))}
        className="w-fit bg-0 hover:bg-0 relative p-0 [&_svg]:size-[25px]"
      >
        {notificationCount > 0 ? (
          <IoMdNotifications className="text-[#333333] dark:text-[#d9d9d9]" />
        ) : (
          <IoMdNotificationsOutline className="text-[#333333] dark:text-[#d9d9d9]" />
        )}
        {formattedCount > "0" && (
          <span className="p-[1px] absolute top-[-5px] right-[-5px] flex items-center justify-center min-w-6 h-6 text-xs text-[#d9d9d9] dark:text-[#d9d9d9] bg-[#7391d5] dark:bg-[#7391d5] rounded-full">
            {formattedCount}
          </span>
        )}
      </Button>

      <div
        ref={refNotification}
        className={cn(
          "invisible opacity-0 scale-[.9] transition-all ease-out duration-[.3s] z-[2000] fixed top-[70px] right-0 p-0 min-w-[500px] max-w-[500px] w-full mt-3 mx-5 backdrop-blur-3xl bg-[#E0E0E0]/80 dark:bg-[#2a2a2a]/80 rounded-[10px] border-[1px] border-[#b0b0b0]/70 dark:border-[#d9d9d9]/70 overflow-hidden max-[1100px]:min-w-full max-[1100px]:m-0 max-[1100px]:max-w-full max-[1100px]:rounded-none max-[1100px]:top-0 max-[1100px]:right-0 max-[1100px]:h-full max-[1100px]:border-0",
          isOpen ? "visible opacity-100 scale-100" : ""
        )}
      >
        <h2 className="text-[#333333] dark:text-[#d9d9d9] text-lg font-bold p-3 botder border-b-[1px] border-[#b0b0b0]/70 dark:border-[#d9d9d9]/70">
          Notifications
        </h2>

        <div
          id="scrollable-container"
          className="relative h-[400px] max-[1100px]:h-[92%] overflow-auto scrollbar"
        >
          <InfiniteScroll
            dataLength={notificationsData.length}
            next={loadMoreNotifications}
            hasMore={hasMore}
            loader={
              <div
                className={cn(
                  "absolute top-0 left-0 w-full flex justify-center items-center h-full",
                  notificationsData.length >= 10 ? "static p-2" : ""
                )}
              >
                <Oval
                  visible={true}
                  height="50"
                  width="50"
                  color="#7391d5"
                  secondaryColor="#7391d5"
                  ariaLabel="oval-loading"
                  strokeWidth={4}
                />
              </div>
            }
            scrollableTarget="scrollable-container"
            className={cn(
              "flex flex-col gap-1 h-full",
              width < 1100 ? "pb-[10px]" : ""
            )}
          >
            {!isLoading && notificationsData.length === 0 ? (
              <div className="absolute top-0 left-0 w-full flex flex-col items-center justify-center gap-2 h-full">
                <BiSolidNotificationOff size={70} />
                <p className="text-[#333333] dark:text-[#d9d9d9] text-lg font-bold">
                  No notifications
                </p>
              </div>
            ) : (
              notificationsData.map(
                (notification: NotificationDataType, index: number) => (
                  <Link
                    onClick={() => (
                      handleClickNotification(
                        notification.id,
                        notification.isRead
                      ),
                      setIsOpen(!isOpen)
                    )}
                    key={index}
                    href={`/post/${notification.postId}`}
                    className="relative flex items-center justify-between gap-2 hover:bg-[#d1d1d1]/60 hover:dark:bg-[#333333]/60 
                                    rounded-[10px] py-3 px-[clamp(0.875rem,0.721rem+0.77vw,1.25rem)]"
                  >
                    <div className="flex items-center justify-between w-full gap-2">
                      <div className="flex items-center gap-2">
                        {!notification.isRead && (
                          <span className="absolute left-[clamp(0.156rem,0.092rem+0.32vw,0.313rem)] block w-fit min-w-2 min-h-2 bg-[#7391d5] dark:bg-[#7391d5] rounded-full"></span>
                        )}

                        <div className="flex items-center gap-3">
                          {notification.sender &&
                          notification.sender.profileImage ? (
                            <img
                              src={notification.sender.profileImage}
                              alt="avatar"
                              className="min-w-[50px] max-w-[50px] w-full min-h-[50px] max-h-[50px] h-full object-cover rounded-full"
                            />
                          ) : (
                            <span className="flex flex-col items-center justify-center rounded-full min-w-[50px] max-w-[50px] w-full min-h-[50px] max-h-[50px] h-full bg-[#c7c7c7]">
                              <FaRegUser className="text-[#333333]" />
                            </span>
                          )}
                          <div className="flex flex-col gap-1">
                            <p className="text-[#333333] dark:text-[#d9d9d9] text-sm font-medium">
                              {width >= 720
                                ? notification.message.length > 150
                                  ? `${notification.message
                                      .substring(0, 150)
                                      .trim()}...`
                                  : notification.message
                                : notification.message.length > 75
                                ? `${notification.message
                                    .substring(0, 110)
                                    .trim()}...`
                                : notification.message}
                            </p>
                            <span className="text-[#6a6a6a] dark:text-[#cecece] text-xs">
                              {notification.createdAt &&
                                getShortTimeAgo(
                                  new Date(notification.createdAt)
                                )}
                            </span>
                          </div>
                        </div>
                      </div>
                      {notification.postImage && (
                        <img
                          src={notification.postImage}
                          alt="arrow"
                          className="min-w-[100px] max-w-[100px] max-h-[70px] h-full object-cover rounded-[10px]"
                        />
                      )}
                    </div>

                    <Button
                      onClick={(e) => (
                        e.stopPropagation(),
                        e.preventDefault(),
                        handleDel(notification.id)
                      )}
                      variant="outline"
                      className="p-0 w-fit h-full bg-transparent border-0 hover:bg-transparent"
                    >
                      <MdVisibilityOff />
                    </Button>
                  </Link>
                )
              )
            )}
          </InfiniteScroll>
        </div>

        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="outline"
          className="absolute top-2 right-2 search-button-mob p-0 h-fit hidden bg-transparent border-0 hover:bg-transparent [&_svg]:size-[30px]"
        >
          <IoClose className="text-[#333333] dark:text-[#e3e3e3] text-xl" />
        </Button>
      </div>
    </div>
  );
};
