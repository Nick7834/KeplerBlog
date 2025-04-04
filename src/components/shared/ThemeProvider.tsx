'use client'

import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from 'next-themes';

export default function ThemeProvider({ children }: ThemeProviderProps) {
  return <NextThemesProvider defaultTheme="system" enableSystem={false} attribute="class">{children}</NextThemesProvider>;
} 