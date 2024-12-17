import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

interface Props {
    className?: string
}

export const SkeletonProfileTop:React.FC<Props> = ({className}) => {
    return (
       <div className={cn("max-w-[1250px] w-full", className)}>
            <Skeleton className="w-full h-[clamp(8.125rem,6.066rem+8.24vw,12.5rem)] rounded-[20px] bg-[#c1c1c1] dark:bg-[#2a2a2a]" />
            <div className="profile-top flex items-center px-[clamp(0.625rem,-0.551rem+4.71vw,3.125rem)] gap-[clamp(0.625rem,0.449rem+0.71vw,1rem)]">
                <Skeleton className="avatar-profile min-w-[clamp(4.375rem,3.493rem+3.53vw,6.25rem)] h-[clamp(4.375rem,3.493rem+3.53vw,6.25rem)] rounded-full bg-[#c1c1c1] dark:bg-[#2a2a2a] -mt-[50px] z-[1]" />
                <div className="mt-[7px] flex items-center justify-between w-full">
                    <div>
                        <Skeleton className="w-[clamp(5rem,-2.5rem+37.5vw,6.875rem)] h-[10px] rounded-[10px] bg-[#c1c1c1] dark:bg-[#2a2a2a]" />
                        <Skeleton className="w-[80px] h-[10px] rounded-[10px] bg-[#c1c1c1] dark:bg-[#2a2a2a] mt-1" />
                    </div>
                    <Skeleton className="w-[100px] h-[35px] rounded-[10px] bg-[#c1c1c1] dark:bg-[#2a2a2a]" />
                </div>
            </div>
        </div>
    );
};
