"use client";
import React, { useEffect, useRef, useState } from "react";
import { useCategories } from "../createPost/api/fetchCategory";
import { Swiper, SwiperSlide } from "swiper/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { iconsMap } from "@/lib/category";
import { Category } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/mousewheel";
import { Mousewheel } from "swiper/modules";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { IoIosArrowBack } from "react-icons/io";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { faBorderAll } from "@fortawesome/free-solid-svg-icons";
import { useActiveCategory } from "@/store/activeCategory";

interface Props {
  className?: string;
}

export const ItemBar: React.FC<Props> = ({ className }) => {
  const { data, error, isLoading } = useCategories();
  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const rawCategory = searchParams.get("category") || "";
  const activeCategory = decodeURIComponent(rawCategory.replace(/\+/g, " "));
  const { setActive } = useActiveCategory();

  useEffect(() => {
    setActive(activeCategory || null);
  }, [activeCategory, setActive]);

  const onCategoryClick = (name: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (name) {
      params.set("category", name);
    } else {
      params.delete("category");
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  if (error) {
    return <p className="text-red-500">Error: {error.message}</p>;
  }

  return (
    <div className={cn("max-[650px]:px-5", className)}>
      {isLoading ? (
        <div className="mt-5 flex items-center gap-[10px]">
          {[...Array(5)].map((_, index) => (
            <Skeleton
              key={index}
              className="h-[40px] w-full bg-[#c1c1c1] dark:bg-[#2a2a2a]"
            />
          ))}
        </div>
      ) : (
        <div className="relative mt-5">
          <Swiper
            modules={[Mousewheel]}
            spaceBetween={10}
            slidesPerView="auto"
            mousewheel={{
              forceToAxis: false,
              sensitivity: 2,
              thresholdDelta: 0,
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
            }}
            onProgress={(swiper) => {
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
            }}
            freeMode={true}
          >
            <SwiperSlide className="!w-auto">
              <Button
                onClick={() => onCategoryClick(null)}
                variant="secondary"
                className={cn(
                  "select-none p-0 m-0 rounded-[10px] dark:bg-[#333333] bg-[#d9d9d9] text-[#333333] dark:text-[#d9d9d9] hover:bg-[#c9c8c8] dark:hover:bg-[#333333]/55",
                  !activeCategory &&
                    "bg-[#7391d5] dark:bg-[#7391d5] hover:bg-[#7391d5] dark:hover:bg-[#7391d5] text-[#d9d9d9] dark:text-[#d9d9d9]"
                )}
              >
                <span className="flex items-center whitespace-nowrap justify-center px-3 py-2">
                  <FontAwesomeIcon
                    icon={faBorderAll}
                    className="mr-2 -translate-y-[1px]"
                  />{" "}
                  All
                </span>
              </Button>
            </SwiperSlide>
            {data &&
              data?.map((item: Category) => (
                <SwiperSlide
                  key={item.id}
                  className="!w-auto whitespace-nowrap flex items-center justify-center"
                >
                  <Button
                    onClick={() => onCategoryClick(item.name)}
                    variant="secondary"
                    className={cn(
                      "select-none p-0 m-0 rounded-[10px] dark:bg-[#333333] bg-[#d9d9d9] text-[#333333] dark:text-[#d9d9d9] hover:bg-[#c9c8c8] dark:hover:bg-[#333333]/55",
                      activeCategory === item.name &&
                        "bg-[#7391d5] dark:bg-[#7391d5] hover:bg-[#7391d5] dark:hover:bg-[#7391d5] text-[#d9d9d9] dark:text-[#d9d9d9]"
                    )}
                  >
                    <span className="flex items-center whitespace-nowrap justify-center px-3 py-2">
                      <FontAwesomeIcon
                        icon={iconsMap[item.icon as keyof typeof iconsMap]}
                        className="mr-2 -translate-y-[1px]"
                      />{" "}
                      {item.name}
                    </span>
                  </Button>
                </SwiperSlide>
              ))}
          </Swiper>
          <div>
            <Button
              onClick={() => swiperRef.current?.slidePrev()}
              className={cn(
                "category-arrow w-[42px] h-[42px] flex-shrink-0 absolute -left-1 top-[50%] translate-y-[-50%] z-20 p-0 px-2 m-0 rounded-full bg-[#EAEAEA] dark:bg-[#171717] text-[#333333] dark:text-[#d9d9d9] shadow-[0_0_40px_25px_rgba(234,234,234,1)] dark:shadow-[0_0_40px_25px_rgba(23,23,23,1)] blur-[0.5px]",
                isBeginning ? "opacity-0 pointer-events-none" : "opacity-100"
              )}
            >
              <IoIosArrowBack className="text-[#333333] dark:text-[#e3e3e3]" />
            </Button>
            <Button
              onClick={() => swiperRef.current?.slideNext()}
              className={cn(
                "category-arrow w-[42px] h-[42px] flex-shrink-0 absolute -right-1 top-[50%] translate-y-[-50%] z-20 p-0 px-2 m-0 rounded-full rotate-180 bg-[#EAEAEA] dark:bg-[#171717] text-[#333333] dark:text-[#d9d9d9] shadow-[0_0_40px_25px_rgba(234,234,234,1)] dark:shadow-[0_0_40px_25px_rgba(23,23,23,1)] blur-[0.5px]",
                isEnd ? "opacity-0 pointer-events-none" : "opacity-100"
              )}
            >
              <IoIosArrowBack className="text-[#333333] dark:text-[#e3e3e3]" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
