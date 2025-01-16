import { Skeleton } from "../ui/skeleton";

export const SkeletonPost = () => {
    return (
        <div className="max-w-[750px] w-full flex-1 p-3 bg-[#e0e0e0]/95 dark:bg-[#2a2a2a] rounded-[10px] border border-[#b0b0b0]/70 dark:bg-[#1d1d1d]/95 cursor-pointer">
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
