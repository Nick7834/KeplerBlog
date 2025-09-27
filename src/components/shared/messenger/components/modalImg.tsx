import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useModalImg } from "@/store/messanger";
import { motion, AnimatePresence } from "framer-motion";
import { IoIosClose } from "react-icons/io";
import { Button } from "../..";

interface Props {
  className?: string;
}

export const ModalImg: React.FC<Props> = ({ className }) => {
  const { imgModal, onClose } = useModalImg();

  return (
    <AnimatePresence>
      {imgModal && (
        <motion.div
          className={cn(
            "fixed inset-0 z-[99999] p-5 flex justify-center items-center bg-black/80",
            className
          )}
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Button
            variant="ghost"
            className="absolute top-0 right-0 p-0 bg-0 hover:bg-0 [&_svg]:size-[50px]"
            onClick={onClose}
          >
            <IoIosClose className="text-[#ffffff]" />
          </Button>
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Image
              src={imgModal}
              alt="img"
              width={800}
              height={600}
              style={{ width: "auto", height: "auto" }}
              className="block max-h-[90vh] rounded-[7px] object-contain select-none shadow-2xl"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
