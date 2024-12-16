import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

interface Props {
    className?: string
}

export const SkeletonUserSearch:React.FC<Props> = ({className}) => {
    return (
       <div className={cn("[&:not(:first-child)]:mt-5 max-w-[1250px] w-full flex-1 flex items-center gap-5", className)}>
             <Skeleton className="min-w-[60px] h-[60px] bg-[#c1c1c1] dark:bg-[#676767] rounded-full" />

            <div className="flex flex-col gap-2 w-full">
                <Skeleton className="w-[120px] h-[25px] rounded-[10px] bg-[#c1c1c1] dark:bg-[#676767]" />
                <Skeleton className="w-full h-[60px] rounded-[10px] bg-[#c1c1c1] dark:bg-[#676767]" />
                <Skeleton className="w-[120px] h-[25px] rounded-[10px] bg-[#c1c1c1] dark:bg-[#676767]" />
            </div>

        </div>
    );
};
