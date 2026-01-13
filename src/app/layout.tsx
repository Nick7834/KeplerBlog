import type { Metadata, Viewport } from "next";
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
  appleWebApp: {
    capable: true,
    title: "KeplerBlog",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#EAEAEA" },
    { media: "(prefers-color-scheme: dark)", color: "#171717" },
  ],
  viewportFit: "cover",
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
