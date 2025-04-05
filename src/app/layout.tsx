import type { Metadata } from "next";
import "./globals.css";
import { Dashboard } from "@/components/shared/dashboard";
import { Header } from "@/components/shared/header";
import { Providers } from "@/components/shared/provider";
import { Toaster } from "react-hot-toast";
import { MobPanel } from "@/components/shared/mobPanel";

export const metadata: Metadata = {
  title: "KeplerBlog",
  description: "Share ideas, inspire others, and grow together.",
};

export default async function RootLayout({
  children,
  // modal
}: Readonly<{
  children: React.ReactNode;
  // modal: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
       <head>
          <link rel="shortcut icon" href="/KB.svg" type="image/x-icon" />
        </head>
      <body>
        
        <Providers>
          <Header className="header bg-[#EAEAEA] dark:bg-[#171717] fixed top-0 left-[270px] w-[calc(100%-270px)] z-[1000]" />

          <main className="main pl-[270px]">
            <Dashboard />
            <div></div>
            <div className="pt-[clamp(5.063rem,4.521rem+1.33vw,5.563rem)]">
              {children}
              {/* <Suspense fallback={null}>{modal}</Suspense> */}
              <Toaster position="top-center" />
            </div>
          </main>

          <MobPanel />
        </Providers>

      </body>
    </html>
  );
}