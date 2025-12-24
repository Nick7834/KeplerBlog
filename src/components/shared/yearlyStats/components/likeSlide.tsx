import React from "react";
import { MotionWrapper } from "./motionWrapper";
import { cn } from "@/lib/utils";
import { Compass, Heart, MessageSquare, UserPlus } from "lucide-react";

interface Props {
  className?: string;
  likesCount: number;
  commentsCount: number;
  followsCount: number;
}

export const LikeSlide: React.FC<Props> = ({
  className,
  likesCount = 0,
  commentsCount = 0,
  followsCount = 0,
}) => {
  return (
    <div
      className={cn(
        "relative z-10 h-full flex items-center justify-center px-6",
        className
      )}
    >
      <MotionWrapper>
        <div className="flex justify-center mb-4 w-full">
          <div className="p-3 rounded-2xl bg-[#7391d5]/10 border border-[#7391d5]/20">
            <Compass
              className="w-6 h-6 text-[#7391d5] animate-spin-slow"
              style={{ animationDuration: "10s" }}
            />
          </div>
        </div>

        <p className="text-[#7391d5] font-mono tracking-[0.3em] uppercase text-[10px] mb-2">
          Your Activity Report
        </p>
        <h2 className="text-4xl font-black text-white mb-10 tracking-tight">
          The <span className="text-[#7391d5]">Explorer</span>
        </h2>

        <div className="grid grid-cols-2 gap-4 w-full min-w-[clamp(18.75rem,9.448rem+46.51vw,31.25rem)] ">
          <div className="col-span-2 bg-white/5 border border-white/10 backdrop-blur-md p-8 rounded-[32px] flex items-center justify-between shadow-[0_20px_50px_-15px_rgba(115,145,213,0.15)] relative overflow-hidden">
            <Heart className="absolute -right-4 -bottom-4 w-24 h-24 text-white/[0.03] -rotate-12 transition-transform duration-500" />

            <div className="text-left relative z-10">
              <p className="text-slate-400 text-sm font-medium mb-1 flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-500" /> Posts Liked
              </p>
              <h4 className="text-6xl font-black text-white tracking-tighter">
                {likesCount.toLocaleString()}
              </h4>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 backdrop-blur-md p-6 rounded-[32px] text-left transition-all duration-300">
            <MessageSquare className="w-6 h-6 text-blue-400 mb-4" />
            <p className="text-slate-400 text-xs font-medium mb-1">Comments</p>
            <h4 className="text-3xl font-bold text-white tracking-tight">
              {commentsCount.toLocaleString()}
            </h4>
          </div>

          <div className="bg-white/5 border border-white/10 backdrop-blur-md p-6 rounded-[32px] text-left transition-all duration-300">
            <UserPlus className="w-6 h-6 text-emerald-400 mb-4" />
            <p className="text-slate-400 text-xs font-medium mb-1">Followed</p>
            <h4 className="text-3xl font-bold text-white tracking-tight">
              {followsCount.toLocaleString()}
            </h4>
          </div>
        </div>

        <p className="mt-10 text-slate-400 text-[13px] leading-relaxed tracking-wide font-light italic">
          Your brain likes a post in{" "}
          <span className="text-white font-medium">13ms</span>.
          <span className="text-slate-500 mx-1">—</span>
          Faster than a blink.
        </p>
      </MotionWrapper>
    </div>
  );
};
