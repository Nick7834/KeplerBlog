"use client";
import React, { useState } from "react";
import { useYearlyStats } from "../api/yaear.service";
import { FaCalendarAlt } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "../..";
import { Music } from "./music";
import { Sliders } from "./sliders";
import { X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const YearModal = () => {
  const [openMessager, setOpenMessager] = useState(false);
  const { data, isLoading } = useYearlyStats(openMessager);

  const handleClose = () => {
    if (openMessager) {
      setOpenMessager(false);
    }
  };

  return (
    <div>
      <Button
        variant="secondary"
        onClick={() => setOpenMessager(!openMessager)}
        className="w-fit bg-0 hover:bg-0 relative p-0 [&_svg]:size-[25px]"
      >
        <FaCalendarAlt />
      </Button>

      <Dialog
        open={openMessager}
        onOpenChange={handleClose}
      >
        <DialogContent
          className="w-[calc(100%-30px)] max-w-[90%] sm:max-w-5xl max-[750px]:max-w-full max-[750px]:w-full mx-auto overflow-hidden
            bg-[#e7e7e7]/80 dark:bg-[#19191b]/80 border-0 backdrop-blur-[12px] rounded-md max-[750px]:rounded-none h-[600px] max-[750px]:h-full max-[750px]:max-h-full max-h-[90vh] overflow-y-auto p-0"
        >
          <DialogTitle className="hidden"></DialogTitle>

          {isLoading ? (
            <Skeleton className="bg-[#c1c1c1] dark:bg-[#676767] w-full h-full rounded-none p-0 m-0"></Skeleton>
          ) : (
            <>
              <div className="absolute top-0 right-0 z-50 flex items-center gap-3 my-2 mx-4">
                <Music />
                <DialogClose className="cursor-pointer rounded-sm opacity-70 transition-opacity hover:opacity-100 disabled:pointer-events-none select-none">
                  <X className="text-[#e7e7e7] dark:text-[#e7e7e7]" />
                </DialogClose>
              </div>

              {data && <Sliders data={data} />}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
