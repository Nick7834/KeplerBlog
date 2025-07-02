import {
  useMessangerIdChat,
  useMessangerMenu,
  useMessangerSettings,
  useMessangerStore,
} from "@/store/messanger";
import { FaRegUser } from "react-icons/fa6";
import { toast } from "sonner";
import { IoClose } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { handleChatClick } from "../api/chat/handleChatClick";
import { QueryClient } from "@tanstack/react-query";

export const showToast = (
  username: string,
  messageText: string,
  image: string | null,
  avatarUrl: string,
  chatId: string,
  queryClient: QueryClient,
  userId: string
) => {
  const { setOpenMessager } = useMessangerStore.getState();
  const { setCurrentChatId } = useMessangerIdChat.getState();
  const { setMenu } = useMessangerMenu.getState();
  const { setSettings } = useMessangerSettings.getState();

  const handleIsRead = async (chatIds: string) => {
    if (!chatIds) return;

    setOpenMessager(true);

    handleChatClick(
      chatIds,
      setCurrentChatId,
      setMenu,
      setSettings,
      queryClient,
      userId
    );
  };

  toast.custom((id) => (
    <div className="flex cursor-pointer max-w-[400px] min-w-[400px] w-full bg-[#e5e5e5]/80 dark:bg-[#19191b]/80 backdrop-blur-[20px] shadow-lg border-[2px] border-[#b0b0b0]/70 dark:border-neutral-300/75 rounded-lg transition-transform hover:scale-[1.02]">
      <div
        onClick={() => (toast.dismiss(id), handleIsRead(chatId))}
        className="flex flex-1 items-start gap-2 p-4 pr-0"
      >
        <div className="pt-0.5">
          {avatarUrl ? (
            <img
              className="h-10 min-w-10 w-10 rounded-full"
              src={avatarUrl}
              alt={username}
            />
          ) : (
            <span className="flex flex-col items-center justify-center object-cover rounded-full min-w-[40px] w-[40px] h-[40px] bg-[#c7c7c7]">
              <FaRegUser className="text-[#333333]" />
            </span>
          )}
        </div>
        <div className="ml-1">
          <p className="text-sm font-medium text-[#121212] dark:text-[#d9d9d9]">
            {username}
          </p>
          <div className="flex items-center gap-1">
            {image && (
              <img
                src={image}
                alt={username}
                loading="lazy"
                className="min-w-[50px] w-[50px] h-[50px] object-cover"
              />
            )}
            <p className="mt-1 text-sm dark:text-[#d9d9d9] text-gray-600">
              {messageText.length > 50
                ? messageText.slice(0, 50).trim() + "..."
                : messageText}
            </p>
          </div>
        </div>
      </div>
      <Button
        onClick={() => toast.dismiss(id)}
        className="w-12 h-auto bg-0 dark:bg-0 hover:bg-0 hover:dark:bg-0 flex flex-col items-center justify-center text-[#333333] dark:text-[#d9d9d9]"
      >
        <IoClose />
      </Button>
    </div>
  ));
};
