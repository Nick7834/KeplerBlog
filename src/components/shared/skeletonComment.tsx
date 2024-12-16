import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

interface Props {
    className?: string
}

export const SkeletonComment:React.FC<Props> = ({className}) => {
    return (
       <div className={cn("max-w-[750px] w-full flex-1", className)}>
            {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="[&:not(:first-child)]:mt-5">
                    <div className="flex items-center gap-3 w-fit">
                        <Skeleton className="w-[40px] h-[40px] rounded-full bg-[#c1c1c1] dark:bg-[#676767]" />
                        <Skeleton className="w-[100px] h-[20px] rounded-[10px] bg-[#c1c1c1] dark:bg-[#676767]" />
                    </div>
                    <Skeleton className="mt-4 w-full h-[20px] rounded-[5px] bg-[#c1c1c1] dark:bg-[#676767]" />
                    <Skeleton className="mt-4 w-full h-[20px] rounded-[5px] bg-[#c1c1c1] dark:bg-[#676767]" />
                    <div className="flex items-center mt-4 gap-5">
                        <Skeleton className="w-[30px] h-[30px] rounded-full bg-[#c1c1c1] dark:bg-[#676767]" />
                        <Skeleton className="w-[80px] h-[30px] rounded-full bg-[#c1c1c1] dark:bg-[#676767]" />
                    </div>    
                </div>
            ))}
        </div>
    );
};
