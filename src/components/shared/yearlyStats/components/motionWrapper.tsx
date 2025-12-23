"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSwiperSlide } from "swiper/react";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  children: React.ReactNode;
}

export const MotionWrapper: React.FC<Props> = ({ className, children }) => {
  const { isActive } = useSwiperSlide();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.2 },
    },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={cn(
            "flex flex-col items-center justify-center h-full text-center z-10",
            className
          )}
        >
          {Array.isArray(children) ? (
            children.map((child, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="flex flex-col w-fit"
              >
                {child}
              </motion.div>
            ))
          ) : (
            <motion.div variants={itemVariants}>{children}</motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
