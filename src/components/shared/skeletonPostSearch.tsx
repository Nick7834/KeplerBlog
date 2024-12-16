import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

interface Props {
    className?: string
}

export const SkeletonPostSearch:React.FC<Props> = ({className}) => {
    return (
       <div className={cn("[&:not(:first-child)]:mt-5 w-full flex gap-5 skeleton-post", className)}>
                <Skeleton className="min-w-[130px] h-[130px] rounded-[20px] bg-[#c1c1c1] dark:bg-[#676767]" />
                
                <div className="flex flex-col justify-between w-full">
                    <div className="flex items-center gap-3 w-fit">
                        <Skeleton className="w-[40px] h-[40px] rounded-full bg-[#c1c1c1] dark:bg-[#676767]" />
                        <Skeleton className="w-[100px] h-[20px] rounded-[10px] bg-[#c1c1c1] dark:bg-[#676767]" />
                        <Skeleton className="w-[100px] h-[20px] rounded-[10px] bg-[#c1c1c1] dark:bg-[#676767]" />
                    </div>
                    <Skeleton className="m-1 max-w-[700px] w-full h-[50px] rounded-[10px] bg-[#c1c1c1] dark:bg-[#676767]" />
                    <div className="mt-1 flex gap-2 w-fit">
                        <Skeleton className="w-[120px] h-[25px] rounded-[10px] bg-[#c1c1c1] dark:bg-[#676767]" />
                        <Skeleton className="w-[120px] h-[25px] rounded-[10px] bg-[#c1c1c1] dark:bg-[#676767]" />
                    </div>    
                </div>        
        </div>
    );
};
