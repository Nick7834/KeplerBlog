import type { Metadata } from "next";
import "./globals.css";
import { Dashboard } from "@/components/shared/dashboard";
import { Header } from "@/components/shared/header";
import { Providers } from "@/components/shared/provider";
import { Toaster } from "react-hot-toast";
import { MobPanel } from "@/components/shared/mobPanel";
import { Toaster as Toast } from "sonner";

export const metadata: Metadata = {
  title: "KeplerBlog",
  description: "Share ideas, inspire others, and grow together.",
};

export default async function RootLayout({
  children,
}: // modal
Readonly<{
  children: React.ReactNode;
  // modal: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <link
          rel="shortcut icon"
          href="/KB.svg"
          type="image/x-icon"
        />
        <meta
          name="theme-color"
          content="#EAEAEA"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#171717"
          media="(prefers-color-scheme: dark)"
        />

        <meta
          name="apple-mobile-web-app-capable"
          content="yes"
        />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
      </head>
      <body>
        <Providers>
          <Header className="header fixed top-0 left-[270px] w-[calc(100%-270px)] z-[1000]" />

          <main className="main pl-[270px]">
            <Dashboard />
            <div></div>
            <div className="pt-[clamp(4.313rem,4.063rem+1.25vw,5rem)]">
              {children}
              {/* <Suspense fallback={null}>{modal}</Suspense> */}
              <Toaster position="top-center" />
              <Toast
                position="top-right"
                toastOptions={{
                  style: {
                    zIndex: 9999,
                  },
                  className: "z-[9999]",
                }}
              />
            </div>
          </main>

          <MobPanel />
        </Providers>
      </body>
    </html>
  );
}
