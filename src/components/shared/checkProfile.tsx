import { cn } from "@/lib/utils";
import React from "react";
import { BsCheck } from "react-icons/bs";

interface Props {
  className?: string;
  isverified: boolean;
  styleCheck?: string;
}

export const CheckProfile: React.FC<Props> = ({ className, styleCheck, isverified }) => {
  return (
    <>
      {isverified && (
        <span
          className={cn(
            "relative flex flex-col items-center justify-center z-[100] group",
            className
          )}
        >
          <p
            className={cn(
              "absolute top-[-22px] group-hover:top-[-17px] -left-full flex flex-col items-center justify-center bg-[#7391d5] dark:bg-[#7391d5] text-[#d9d9d9] dark:text-[#d9d9d9] rounded-[4px] p-[1px] w-[70px] text-xs uppercase transition-all duration-200 ease-in-out opacity-0 invisible group-hover:opacity-100 group-hover:visible",
              styleCheck
            )}
          >
            confirmed
          </p>
          <BsCheck
            size={22}
            className="text-[#7391d5] block"
          />
        </span>
      )}
    </>
  );
};
