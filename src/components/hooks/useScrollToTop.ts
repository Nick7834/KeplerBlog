import { IPost } from "@/@types/post";
import { useEffect } from "react";

const useScrollToTop = (isLoading: boolean, posts: IPost[]) => {
  useEffect(() => {
    if (isLoading) return;
   
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
    }, 100); 
  }, [isLoading, posts]); 
};

export default useScrollToTop;