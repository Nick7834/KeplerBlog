import { Post } from "@/components/shared/post";
import { ProfileTop } from "@/components/shared/profileTop";

export default function Profile() {
    return (
    <div className="flex flex-col items-center justify-center mt-[50px] mx-[15px]">
     
        <ProfileTop />

        <div className="mt-[50px] flex flex-col gap-5">
        <h2 className="text-[#333333] dark:text-[#d9d9d9] text-2xl font-bold">Publications</h2>
        {Array.from({ length: 5 }).map((_, index) => (
            <Post key={index} />
          ))}
        </div>
  
    </div>
    );
}