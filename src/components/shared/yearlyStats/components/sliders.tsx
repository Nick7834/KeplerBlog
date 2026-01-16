"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-creative";
import { Parallax, Navigation, Mousewheel } from "swiper/modules";
import { WelcomeSlide } from "./welcomeSlide";
import { LikeSlide } from "./likeSlide";
import { CreatorSlide } from "./сreatorSlide";
import { MagnetSlide } from "./magnetSlide";
import { ConnectorSlide } from "./connectorSlide";
import { GratitudeSlide } from "./gratitudeSlide";

interface Props {
  likedPosts: number;
  commentsWritten: number;
  followedAuthors: number;
  myPosts: number;
  myLikes: number;
  myFollowers: number;
  messagesSent: number;
  messagesReceived: number;
}

export const Sliders = ({ data }: { data: Props }) => {
  return (
    <Swiper
      direction={"vertical"}
      slidesPerView={1}
      spaceBetween={0}
      parallax={true}
      mousewheel={{
        enabled: true,
        thresholdDelta: 20,
        sensitivity: 1,
      }}
      speed={500}
      breakpoints={{
        751: {
          speed: 1000,
        },
      }}
      resistance={true}
      resistanceRatio={0}
      modules={[Mousewheel, Navigation, Parallax]}
      className="year-slider w-full h-full select-none"
      observer={true}
      observeParents={true}
      simulateTouch={false}
      allowTouchMove={true}
      touchStartPreventDefault={false}
    >
      <SwiperSlide className="relative overflow-hidden p-8 flex items-center justify-center text-center shadow-2xl bg-[#0f172a]">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/40 blur-[120px] animate-pulse"></div>
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-orange-500/30 blur-[120px] animate-pulse"
          style={{ animationDelay: "10s" }}
        ></div>

        <div
          data-swiper-parallax-opacity="0"
          data-swiper-parallax-duration="800"
          className="w-full h-full flex items-center justify-center"
        >
          <WelcomeSlide />
        </div>
      </SwiperSlide>
      {(data.likedPosts > 0 ||
        data.commentsWritten > 0 ||
        data.followedAuthors > 0) && (
        <SwiperSlide className="relative overflow-hidden p-8 flex items-center justify-center text-center shadow-2xl bg-[#04110d]">
          <div className="pointer-events-none absolute top-[-15%] left-[-15%] w-[60%] h-[60%] rounded-full bg-[#7391d5]/30 blur-[120px] animate-pulse"></div>

          <div
            className="pointer-events-none absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/20 blur-[120px] animate-pulse"
            style={{ animationDelay: "5s" }}
          ></div>

          <div className="pointer-events-none absolute top-[30%] left-[40%] w-[30%] h-[30%] rounded-full bg-blue-600/10 blur-[100px]"></div>

          <div
            data-swiper-parallax-opacity="0"
            data-swiper-parallax-duration="800"
            className="w-full h-full flex items-center justify-center"
          >
            <LikeSlide
              likesCount={data.likedPosts}
              commentsCount={data.commentsWritten}
              followsCount={data.followedAuthors}
            />
          </div>
        </SwiperSlide>
      )}
      {data.myPosts > 0 && (
        <SwiperSlide className="relative overflow-hidden p-8 flex items-center justify-center text-center shadow-2xl bg-[#0a0f1d]">
          <div className="pointer-events-none absolute top-[-15%] left-[-15%] w-[60%] h-[60%] rounded-full bg-emerald-500/20 blur-[120px] animate-pulse"></div>

          <div
            className="pointer-events-none absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-teal-500/15 blur-[120px] animate-pulse"
            style={{ animationDelay: "3s" }}
          ></div>

          <div className="pointer-events-none absolute top-[20%] left-[30%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[100px]"></div>

          <div
            data-swiper-parallax-opacity="0"
            data-swiper-parallax-duration="800"
            className="w-full h-full flex items-center justify-center"
          >
            <CreatorSlide postsCount={data.myPosts} />
          </div>
        </SwiperSlide>
      )}
      {(data.myLikes > 0 || data.myFollowers > 0) && (
        <SwiperSlide className="relative overflow-hidden p-8 flex items-center justify-center text-center shadow-2xl bg-[#120a05]">
          <div className="pointer-events-none absolute top-[-10%] right-[-10%] w-[65%] h-[65%] rounded-full bg-orange-600/20 blur-[120px] animate-pulse"></div>

          <div
            className="pointer-events-none absolute bottom-[-15%] left-[-10%] w-[55%] h-[55%] rounded-full bg-pink-600/15 blur-[120px] animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>

          <div className="pointer-events-none absolute top-[40%] left-[20%] w-[30%] h-[30%] rounded-full bg-yellow-500/10 blur-[80px]"></div>

          <div
            data-swiper-parallax-opacity="0"
            data-swiper-parallax-duration="800"
            className="w-full h-full flex items-center justify-center"
          >
            <MagnetSlide
              likesReceived={data.myLikes}
              followersCount={data.myFollowers}
            />
          </div>
        </SwiperSlide>
      )}
      {(data.messagesSent > 0 || data.messagesReceived > 0) && (
        <SwiperSlide className="relative overflow-hidden p-8 flex items-center justify-center text-center shadow-2xl bg-[#030712]">
          <div className="pointer-events-none absolute top-[-10%] left-[-15%] w-[70%] h-[70%] rounded-full bg-blue-600/20 blur-[130px] animate-pulse"></div>

          <div
            className="pointer-events-none absolute bottom-[-5%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/15 blur-[120px] animate-pulse"
            style={{ animationDelay: "4s" }}
          ></div>

          <div className="pointer-events-none absolute top-[40%] right-[20%] w-[20%] h-[20%] rounded-full bg-cyan-400/10 blur-[60px]"></div>

          <div
            data-swiper-parallax-opacity="0"
            data-swiper-parallax-duration="800"
            className="w-full h-full flex items-center justify-center"
          >
            <ConnectorSlide
              sentCount={data.messagesSent}
              receivedCount={data.messagesReceived}
            />
          </div>
        </SwiperSlide>
      )}
      <SwiperSlide className="relative overflow-hidden p-8 flex items-center justify-center text-center shadow-2xl bg-[#050811]">
        <div className="pointer-events-none absolute top-[-20%] left-[-10%] w-[80%] h-[80%] rounded-full bg-[#7391d5]/20 blur-[140px] animate-pulse"></div>

        <div
          className="pointer-events-none absolute bottom-[-10%] right-[-5%] w-[60%] h-[60%] rounded-full bg-blue-900/10 blur-[120px] animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] rounded-full bg-[#7391d5]/10 blur-[80px]"></div>

        <div
          data-swiper-parallax-opacity="0"
          data-swiper-parallax-duration="800"
          className="w-full h-full flex items-center justify-center"
        >
          <GratitudeSlide />
        </div>

        <p className="text-xs font-light text-white/50 uppercase tracking-widest">
          Jan 1 – Dec 28 Highlights
        </p>
      </SwiperSlide>
    </Swiper>
  );
};
