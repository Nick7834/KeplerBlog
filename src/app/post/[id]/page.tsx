'use client';
import { Comments } from "@/components/shared/comments/comments";
import { Post } from "@/components/shared/post";
import { useRef } from "react";


export default function PostDetail() {

    const commetsRef = useRef<HTMLDivElement>(null);

    const scrollToSection = () => {
        if (commetsRef.current) {
            commetsRef.current.scrollIntoView({ behavior: 'smooth' }); 
        }
      };

    return (
    <div className="m-[50px] flex flex-col justify-center items-center">
     
        <Post onClick={scrollToSection} className="cursor-auto" />

        <Comments ref={commetsRef} className="scroll-mt-[100px] w-full" />

    </div>
    );
}