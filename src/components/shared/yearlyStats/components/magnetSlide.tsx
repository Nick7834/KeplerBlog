import React from "react";
import { MotionWrapper } from "./motionWrapper";
import { Heart, Users, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  likesReceived: number;
  followersCount: number;
}

export const MagnetSlide: React.FC<Props> = ({
  className,
  likesReceived,
  followersCount,
}) => {
  return (
    <div
      className={cn(
        "relative z-10 h-full flex items-center justify-center px-6",
        className
      )}
    >
      <MotionWrapper>
        <div className="relative mb-6 flex justify-center">
          <div className="absolute inset-0 bg-orange-500/30 blur-2xl rounded-full animate-pulse" />
          <div className="relative p-4 rounded-3xl bg-white/5 border border-white/10 rotate-12">
            <Zap className="w-8 h-8 text-orange-400 fill-orange-400/20" />
          </div>
        </div>

        <p className="text-orange-400 font-mono tracking-[0.4em] uppercase text-[10px] mb-4">
          Social Impact
        </p>

        <h2 className="text-4xl font-black text-white mb-10 leading-[1.1] tracking-tighter">
          You are a <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-pink-500 to-rose-400">
            Digital Magnet.
          </span>
        </h2>

        <div className="grid grid-cols-1 gap-4 w-full max-w-[280px] mx-auto">
          <div className="bg-white/5 border border-white/10 p-5 rounded-[32px] flex items-center gap-4 group">
            <div className="p-3 rounded-2xl bg-pink-500/10 text-pink-500">
              <Heart className="w-6 h-6 fill-pink-500/20" />
            </div>
            <div className="text-left">
              <h4 className="text-2xl font-black text-white leading-none">
                {likesReceived.toLocaleString()}
              </h4>
              <p className="text-slate-500 text-[10px] uppercase tracking-wider mt-1">
                Likes earned
              </p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-5 rounded-[32px] flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-400">
              <Users className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h4 className="text-2xl font-black text-white leading-none">
                +{followersCount}
              </h4>
              <p className="text-slate-500 text-[10px] uppercase tracking-wider mt-1">
                New followers
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 space-y-1">
          <p className="text-orange-500/50 text-[9px] uppercase tracking-[0.3em] font-bold">
            Dopamine Logic
          </p>
          <p className="text-slate-400 text-[12px] leading-relaxed tracking-wide font-light italic">
            A digital like triggers the same{" "}
            <span className="text-white font-medium not-italic">
              brain rush
            </span>{" "}
            as chocolate.
            <span className="text-slate-600 mx-2">—</span>
            You fed them well.
          </p>
        </div>
      </MotionWrapper>
    </div>
  );
};
