import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState } from "react";
import { updateBan } from "../api/updateBan";
import { cn } from "@/lib/utils";
import { QueryClient } from "@tanstack/react-query";

interface Props {
  className?: string;
  open: boolean;
  handleClose: () => void;
  userName?: string;
  id: string;
  queryClient: QueryClient;
  category: "post" | "user";
}

const banOptions = [
  {
    reason: "SPAM",
    description: "Posting advertising materials, unwanted messages, or links.",
  },
  {
    reason: "ABUSE",
    description: "Insults, violence, threats of physical harm.",
  },
  {
    reason: "COPYRIGHT_INFRINGEMENT",
    description:
      "Violation of copyright on materials, posting protected works without permission.",
  },
  {
    reason: "TERRORISM",
    description: "Promotion of terrorism, extremist activity.",
  },
  {
    reason: "PLAGIARISM",
    description: "Copying others' content without proper attribution.",
  },
  {
    reason: "COMMUNITY_GUIDELINES_VIOLATION",
    description:
      "Violation of the platform's general community guidelines, including but not limited to disruptive behavior, inappropriate content, or disrespecting other users.",
  },
];

export const ModalBan: React.FC<Props> = ({
  className,
  open,
  handleClose,
  userName,
  id,
  queryClient,
  category,
}) => {
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleBan = async () => {
    setIsLoading(true);
    try {
      await updateBan(id, reason, queryClient, category);
      handleClose();
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={handleClose}
    >
      <DialogContent
        className={cn(
          "w-full max-w-[95%] min-w-[500px] max-[750px]:min-w-[95%] sm:max-w-md p-4 mx-autobg-[#e7e7e7]/70 dark:bg-[#19191b]/70 backdrop-blur-[10px] rounded-md max-h-[90vh] overflow-y-auto",
          className
        )}
      >
        <DialogTitle className="text-center text-[#333333] dark:text-[#d9d9d9] text-xl font-bold">
          {category === "user" ? (<div>
            Do you really want to ban the user{" "}
          <span className="font-bold text-[#0088ff]">{userName}</span>?
          </div>) : (<div>
            Do you really want to ban the post?
          </div>)}
        </DialogTitle>

        <Select onValueChange={setReason}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent className="z-[20000]">
            <SelectGroup className="w-[320px]">
              {banOptions.map((item, index) => (
                <SelectItem
                  key={index}
                  value={item.description}
                >
                  {item.description}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button
          className="w-full mt-3"
          disabled={!reason}
          onClick={handleBan}
          loading={isLoading}
        >
          Ban
        </Button>
      </DialogContent>
    </Dialog>
  );
};
