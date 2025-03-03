import { useEffect, useState } from "react";

export const useHiddenScroll = (open: boolean) => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
            const handleResize = () => setWindowWidth(window.innerWidth);
    
            if (windowWidth <= 1100 && open) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
    
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
    
    }, [open, windowWidth]);
}
