import { CreatePostInput } from "@/components/shared/сreatePostInput";

export default function CareatePost() {
    return (
    <div className="m-[50px]">

        <h1 className="text-[#333333] dark:text-[#d9d9d9] text-2xl font-bold">Create post</h1>
     
        <CreatePostInput />
  
    </div>
    );
  }