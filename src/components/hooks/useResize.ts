import { useEffect, useState } from "react";

export const useResize = () => {
    const [width, setWidth] = useState(window.innerWidth || 0);

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return { width }
};