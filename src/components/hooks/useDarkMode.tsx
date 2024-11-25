import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export const UseDarkMode = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleToggle = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    if (!mounted) {
        return { theme: 'dark', handleToggle };
    }

    return { theme, handleToggle };
};