"use client";
import { SessionProvider } from "next-auth/react";
import ThemeProvider from "@/components/shared/ThemeProvider";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {

  return (
    <>
      <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>{children}</ThemeProvider>
        </QueryClientProvider>
      </SessionProvider>
    </>
  );
};
