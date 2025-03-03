'use client'
import { SessionProvider } from 'next-auth/react';
import ThemeProvider from "@/components/shared/ThemeProvider";
import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';

const queryClient = new QueryClient();

export const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {

    const pathname = usePathname();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <>
            <SessionProvider
                refetchInterval={0} 
                refetchOnWindowFocus={false} 
            >
                <QueryClientProvider client={queryClient}>
                    <ThemeProvider>
                            {children}
                        </ThemeProvider>
                </QueryClientProvider>
            </SessionProvider>
        </>
    );
};
