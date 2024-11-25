'use client'

import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from 'next-themes';

export default function ThemeProvider({ children }: ThemeProviderProps) {
  return <NextThemesProvider defaultTheme="system" enableSystem={true} attribute="class">{children}</NextThemesProvider>;
} 