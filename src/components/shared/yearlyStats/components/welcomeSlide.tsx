import React from "react";
import { MotionWrapper } from "./motionWrapper";
import { Button } from "../..";
import { cn } from "@/lib/utils";
import { useSwiper } from "swiper/react";

interface Props {
  className?: string;
}

export const WelcomeSlide: React.FC<Props> = ({ className }) => {
  const swiper = useSwiper(); 

  const handleStart = () => {
    if (swiper) {
      swiper.slideNext();
    }
  };
  
  return (
    <div
      className={cn(
        "relative z-10 h-full flex items-center justify-center flex-col",
        className
      )}
    >
      <MotionWrapper>
        <span className="inline-block px-4 py-1 rounded-full bg-white/10 text-white/80 text-sm font-medium mb-6 border border-white/20 backdrop-blur-sm">
          #KeplerBlog 2025
        </span>
        <h2 className="flex flex-col gap-1 text-5xl md:text-7xl max-[750px]:text-4xl font-bold text-white leading-[1.1] mb-6 tracking-tighter">
          Explore <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#85a5f1] via-[#63b3f1] to-[#50d6db]">
            Your 2025 Universe.
          </span>
        </h2>
        <p className="w-[500px] max-[750px]:w-full text-xl max-[750px]:text-lg text-slate-300 mb-10 font-light max-w-2xl mx-auto text-center">
          We’ve analyzed everything—from your very first click to your final
          like of the year.
        </p>
        <Button
          className="swiper-no-swiping bg-gradient-to-br from-[#7391d5] via-[#6366f1] to-[#4338ca] text-white font-bold py-4 px-10 
            rounded-2xl hover:scale-105 transition-transform shadow-[0_15px_50px_-5px_rgba(115,145,213,0.7)]"
          onClick={handleStart}
        >
          Explore My Journey
        </Button>
      </MotionWrapper>
    </div>
  );
};
