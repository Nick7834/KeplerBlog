import { IPost } from "@/@types/post";
import { useEffect, useRef } from "react";

const useScrollToTop = (isLoading: boolean, posts: IPost[]) => {
    const hasScrolled = useRef(false); 
    
    useEffect(() => {
        if (isLoading || hasScrolled.current) return;
 
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: "instant" });
          hasScrolled.current = true; 
        }, 100); 
      }, [isLoading, posts]);  
};

export default useScrollToTop;