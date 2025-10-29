import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import "tldraw/tldraw.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { QueryProvider } from "@/components/query-provider";
import { HotkeysProviders } from "@/components/hot-key-provider";
import { ClerkProvider } from "@clerk/nextjs";


const poppins = Poppins({
  subsets:["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700" , "800", "900"],
})

export const metadata: Metadata = {
  title: "PostBoy",
  description: "A modern API client for developers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning className="h-full">
        <body
          className={`${poppins.className} antialiased h-full overflow-hidden`}
        >
          <QueryProvider>
            <ThemeProvider 
              attribute="class" 
              defaultTheme="light" 
              enableSystem
              disableTransitionOnChange={false}
            >
              <HotkeysProviders>
                <Toaster />
                {children}
              </HotkeysProviders>

            </ThemeProvider>
          </QueryProvider>

        </body>
      </html>
    </ClerkProvider>
  );
}
