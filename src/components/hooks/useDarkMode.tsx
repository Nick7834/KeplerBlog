import { useTheme } from 'next-themes';
import { useEffect, useMemo, useState } from 'react';

export const UseDarkMode = () => {
    const { theme, setTheme, systemTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleToggle = useMemo(() => () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    }, [theme, setTheme]); 

    if (!mounted) {
        return { theme: undefined, handleToggle };
    }

    return { theme: theme === "system" ? systemTheme : theme, handleToggle };
};