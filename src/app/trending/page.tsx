import { TrendingList } from "@/components/shared/trendingList";
import { HiTrendingUp } from "react-icons/hi";

export default async function Trending() {
    return (
    <div className="mt-[clamp(1.875rem,1.445rem+2.15vw,3.125rem)] mb-[30px] mx-[clamp(0.938rem,calc(-15.104rem+23.33vw),3.125rem)] flex flex-col items-center justify-center flex-1">
        <div className="flex flex-col justify-center max-w-[750px] w-full">
            <h1 className="flex items-center gap-2 text-[#333333] dark:text-[#d9d9d9] text-[clamp(1.563rem,1.455rem+0.54vw,1.875rem)] font-bold"><HiTrendingUp />Trending</h1>
            <TrendingList />
        </div>
    </div>
    );
}