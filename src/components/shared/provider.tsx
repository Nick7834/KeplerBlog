'use client'
import { SessionProvider } from 'next-auth/react';
import ThemeProvider from "@/components/shared/ThemeProvider";
import React from 'react';

export const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <>
            <SessionProvider>
                    <ThemeProvider>
                        {children}
                    </ThemeProvider>
            </SessionProvider>
        </>
    );
};
