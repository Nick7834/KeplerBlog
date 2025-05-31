import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { GoKebabHorizontal } from "react-icons/go";
import { MdDelete } from "react-icons/md";

interface Props {
  currentChatId: string;
  handleDeleteChat: (id: string) => void;
}

export function CustomPopover({ currentChatId, handleDeleteChat }: Props) {
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
          "max-w-[215px] min-w-[215px] w-full isvisible opacity-0 scale-[.9] transition-all ease-in-out duration-[.3s] absolute right-1 z-[9999] mt-[40px] flex flex-col gap-2 border border-[#b0b0b0]/70 dark:border-neutral-300/75 bg-[#e5e5e5] dark:bg-[#1e1e1e] p-1 rounded shadow-lg",
          isOpen && "visible opacity-100 scale-100"
        )}
      >
        <Button
          variant="outline"
          className="[&_svg]:size-[16px] border-0 bg-0 p-1 cursor-pointer flex items-center justify-start gap-[5px] w-full text-[#F03535] hover:text-[#F03535] dark:text-[#F03535] text-base font-bold"
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
