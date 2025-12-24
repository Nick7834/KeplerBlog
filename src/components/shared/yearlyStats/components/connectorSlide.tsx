import { MessageSquare, ReplyAll, Send } from "lucide-react";
import React from "react";
import { MotionWrapper } from "./motionWrapper";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  sentCount: number;
  receivedCount: number;
}

export const ConnectorSlide: React.FC<Props> = ({ className, sentCount, receivedCount }) => {
  return (
    <div
      className={cn(
        "relative z-10 h-full flex items-center justify-center px-6",
        className
      )}
    >
      <MotionWrapper>
        <div className="relative mb-6 flex justify-center">
          <div className="absolute inset-0 bg-blue-500/30 blur-2xl rounded-full animate-pulse" />
          <div className="relative p-4 rounded-2xl bg-white/5 border border-white/10 -rotate-6">
            <MessageSquare className="w-8 h-8 text-blue-400 fill-blue-400/10" />
          </div>
        </div>

        <p className="text-blue-400 font-mono tracking-[0.4em] uppercase text-[10px] mb-4">
          Networking & DMs
        </p>

        <h2 className="text-4xl font-black text-white mb-10 leading-[1.1] tracking-tighter">
          The <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400">
            Connector.
          </span>
        </h2>

        <div className="space-y-4 w-full max-w-[300px] mx-auto">
          <div className="bg-blue-600/10 border border-blue-500/20 p-5 rounded-t-[24px] rounded-bl-[24px] ml-auto w-[85%] text-right relative overflow-hidden group">
            <Send className="absolute -left-2 -bottom-2 w-12 h-12 text-white/5 -rotate-12" />
            <p className="text-blue-300 text-[10px] uppercase font-bold mb-1 tracking-widest">
              Sent
            </p>
            <h4 className="text-3xl font-black text-white">{sentCount.toLocaleString()}</h4>
          </div>

          <div className="bg-white/5 border border-white/10 p-5 rounded-t-[24px] rounded-br-[24px] mr-auto w-[85%] text-left relative overflow-hidden">
            <ReplyAll className="absolute -right-2 -bottom-2 w-12 h-12 text-white/5 rotate-12" />
            <p className="text-slate-500 text-[10px] uppercase font-bold mb-1 tracking-widest">
              Received
            </p>
            <h4 className="text-3xl font-black text-white">{receivedCount.toLocaleString()}</h4>
          </div>
        </div>

        <div className="mt-12 space-y-1">
          <p className="text-blue-500/50 text-[9px] uppercase tracking-[0.3em] font-bold">
            Internet Lore
          </p>
          <p className="text-slate-400 text-[12px] leading-relaxed tracking-wide font-light italic px-4">
            The first webcam was made just to check if a{" "}
            <span className="text-white font-medium not-italic">
              coffee pot
            </span>{" "}
            was empty.
            <span className="text-slate-600 mx-2">—</span>
            Pure efficiency.
          </p>
        </div>
      </MotionWrapper>
    </div>
  );
};
