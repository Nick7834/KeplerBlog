import React from "react";
import { MotionWrapper } from "./motionWrapper";
import { PenTool, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  postsCount: number;
}

export const CreatorSlide: React.FC<Props> = ({ className, postsCount }) => {
  return (
    <div
      className={cn(
        "relative z-10 h-full flex items-center justify-center px-6",
        className
      )}
    >
      <MotionWrapper>
        <div className="relative mb-6 flex justify-center">
          <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full animate-pulse" />
          <div className="relative p-4 rounded-full bg-white/5 border border-white/10">
            <PenTool className="w-8 h-8 text-emerald-400" />
          </div>
        </div>

        <p className="text-emerald-400 font-mono tracking-[0.4em] uppercase text-[10px] mb-4">
          Creation Mode
        </p>

        <h2 className="text-4xl md:text-5xl font-black text-white mb-2 leading-tight tracking-tighter">
          You shared <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
            your voice.
          </span>
        </h2>

        <div className="relative py-12 group">
          <Quote className="absolute top-0 left-1/2 -translate-x-[140%] w-12 h-12 text-white/5 -rotate-12" />

          <div className="relative z-10">
            <span className="text-[120px] font-black text-white leading-none tracking-tighter select-none">
              {postsCount.toLocaleString()}
            </span>
            <p className="text-emerald-500/60 font-bold tracking-[0.5em] text-sm mt-[-10px]">
              POSTS CREATED
            </p>
          </div>

          <Quote className="absolute bottom-4 left-1/2 translate-x-[100%] w-12 h-12 text-white/5 rotate-180" />
        </div>

        <div className="mt-8 space-y-1.5">
          <p className="text-emerald-500/50 text-[9px] uppercase tracking-[0.3em] font-bold">
            Creative Pulse
          </p>
          <p className="text-slate-400 text-[12px] leading-relaxed tracking-wide font-light italic">
            Each post takes an average of{" "}
            <span className="text-white font-medium not-italic">
              17 minutes
            </span>{" "}
            to write.
            <span className="text-slate-600 mx-2">—</span>
            That&apos;s a lot of focus.
          </p>
        </div>
      </MotionWrapper>
    </div>
  );
};
