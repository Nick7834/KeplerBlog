import { Heart } from "lucide-react";
import { MotionWrapper } from "./motionWrapper";

export const GratitudeSlide = () => {
  return (
    <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
      <MotionWrapper>
        <div className="flex flex-col items-center h-full">
          <div className="relative mb-8">
            <div className="bg-white/10 blur-3xl rounded-full scale-150" />
            <Heart className="relative w-12 h-12 text-white fill-white/10" />
          </div>

          <h2 className="text-3xl font-black text-white mb-4 tracking-tighter">
            Thanks for being with <br />
            <span className="text-[#7391d5]">KeplerBlog.</span>
          </h2>

          <p className="text-slate-400 text-sm font-light italic tracking-wide">
            May your 2026 be truly{" "}
            <span className="text-white  font-semibold italic">legendary</span>.
          </p>
        </div>

        <div className="flex flex-col items-center mt-10">
          <div className="h-[1px] w-8 bg-white/10 mb-4" />
          <p className="text-slate-300 text-[10px] uppercase tracking-[0.4em] font-bold opacity-50">
            KeplerMedia
          </p>
        </div>
      </MotionWrapper>
    </div>
  );
};
