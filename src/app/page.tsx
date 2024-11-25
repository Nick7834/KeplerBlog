import { Post } from "@/components/shared/post";


export default function Home() {
  return (
  <div className="mt-[50px] flex flex-col items-center">
   
   <div className="flex flex-col gap-5">
    {Array.from({ length: 5 }).map((_, index) => (
        <Post key={index} />
      ))}
   </div>

  </div>
  );
}
