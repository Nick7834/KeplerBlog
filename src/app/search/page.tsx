import { SearchDeatail } from "@/components/shared/searchDeatail";
import { Suspense } from "react";

export default async function Search() {
    return (
    <div className="mt-[clamp(1.875rem,1.445rem+2.15vw,3.125rem)] mb-[30px] mx-[clamp(0.938rem,calc(-15.104rem+23.33vw),3.125rem)] flex flex-col items-center justify-center">
         <Suspense>
            <SearchDeatail />
         </Suspense>
    </div>
    );
}