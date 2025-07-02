import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

interface Props {
    className?: string
}

export const SkeletonPost = (className: Props) => {
    return (
        <div className={cn("max-w-[750px] w-full flex-1 p-3 rounded-[10px] cursor-pointer", className)}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 w-fit">
                    <Skeleton className="w-[40px] h-[40px] rounded-full bg-[#c1c1c1] dark:bg-[#676767]" />
                    <Skeleton className="w-[100px] h-[20px] rounded-[10px] bg-[#c1c1c1] dark:bg-[#676767]" />
                </div>
                <Skeleton className="w-[110px] h-[35px] rounded-[10px] bg-[#c1c1c1] dark:bg-[#676767]" />
            </div>
            <Skeleton className="mt-4 w-full h-[35px] rounded-[10px] bg-[#c1c1c1] dark:bg-[#676767]" />
            {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="mt-4 w-full h-[20px] rounded-[5px] bg-[#c1c1c1] dark:bg-[#676767]" />
            ))}
            <Skeleton className="skeleton-posts mt-4 w-full h-[400px] rounded-[10px] bg-[#c1c1c1] dark:bg-[#676767]" />

            <div className="flex items-center mt-4 gap-5">
                <Skeleton className="w-[80px] h-[35px] rounded-full bg-[#c1c1c1] dark:bg-[#676767]" />
                <Skeleton className="w-[80px] h-[35px] rounded-full bg-[#c1c1c1] dark:bg-[#676767]" />
                <Skeleton className="w-[80px] h-[35px] rounded-full bg-[#c1c1c1] dark:bg-[#676767]" />
            </div>
        </div>
    );
};
