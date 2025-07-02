import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { GoKebabHorizontal } from "react-icons/go";
import { MdDelete } from "react-icons/md";
import { MdNotificationsOff } from "react-icons/md";

interface Props {
  currentChatId: string;
  mutedBy: boolean;
  handleDeleteChat: (id: string) => void;
  handleMuteChat: (id: string) => void;
}

export function CustomPopover({
  currentChatId,
  mutedBy,
  handleDeleteChat,
  handleMuteChat,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="relative flex justify-center"
      ref={ref}
    >
      <Button
        variant="secondary"
        onClick={() => setIsOpen(!isOpen)}
        className="block w-fit bg-0 hover:bg-0 relative p-1 [&_svg]:size-[25px]"
      >
        <GoKebabHorizontal className="rotate-90" />
      </Button>

      <div
        className={cn(
          "max-w-[215px] min-w-[215px] w-full invisible opacity-0 scale-[.9] transition-all ease-in-out duration-[.3s] absolute right-1 z-[9999] mt-[40px] flex flex-col border border-[#b0b0b0]/70 dark:border-neutral-300/75 bg-[#e5e5e5]/85 dark:bg-[#141414]/85 backdrop-blur-[50px] rounded shadow-lg overflow-hidden",
          isOpen && "visible opacity-100 scale-100"
        )}
      >
        <Button
          variant="secondary"
          className="[&_svg]:size-[16px] text-base font-bold border-0 backdrop-blur-3xl
           bg-transparent rounded-none p-2 cursor-pointer flex items-center justify-start gap-[5px] w-full text-[#1d1d1d] dark:text-[#fdfdfd]"
          onClick={() => {
            handleMuteChat(currentChatId);
            setIsOpen(false);
          }}
        >
          {!mutedBy ? (
            <>
              <MdNotificationsOff className="translate-y-[-1px]" />
              Mute
            </>
          ) : (
            <>
              <MdNotificationsOff className="translate-y-[-1px]" />
              Unmute
            </>
          )}
        </Button>
        <Button
          variant="secondary"
          className="[&_svg]:size-[16px] text-base font-bold border-0 backdrop-blur-3xl bg-transparent rounded-none p-2 cursor-pointer flex items-center justify-start gap-[5px] w-full text-[#F03535] dark:text-[#F03535]"
          onClick={() => {
            handleDeleteChat(currentChatId);
            setIsOpen(false);
          }}
        >
          <MdDelete className="translate-y-[-1px]" />
          Delete chat
        </Button>
      </div>
    </div>
  );
}
