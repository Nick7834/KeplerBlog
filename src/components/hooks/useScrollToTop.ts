import { IPost } from "@/@types/post";
import { useEffect, useRef } from "react";

const useScrollToTop = (isLoading: boolean, posts: IPost[]) => {
    const hasScrolled = useRef(false);
    const isPageReloaded = useRef(false); 
  
    useEffect(() => {

      if (sessionStorage.getItem("pageReloaded")) {
        isPageReloaded.current = true;
      } else {
        sessionStorage.setItem("pageReloaded", "true"); 
      }
  
      if (isLoading || hasScrolled.current || posts.length > 0) return; 

      if (isPageReloaded.current) {
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: "instant" });
          hasScrolled.current = true; 
          sessionStorage.removeItem("pageReloaded"); 
        }, 100);
      }
    }, [isLoading, posts]); 
};

export default useScrollToTop;