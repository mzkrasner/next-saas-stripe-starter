"use client";

import "@/styles/globals.css";

import { fontGeist, fontHeading, fontSans, fontUrban } from "@/assets/fonts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

import { cn, constructMetadata } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@/components/analytics";
import ModalProvider from "@/components/modals/providers";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { env } from "@/env.mjs";
import { ODB } from "./context/OrbisContext";
import { WalletProvider } from "./context/WalletContext";
import { ThirdwebProvider } from "@thirdweb-dev/react";

interface RootLayoutProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient();

// export const metadata = constructMetadata();

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontUrban.variable,
          fontHeading.variable,
          fontGeist.variable,
        )}
      >
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <QueryClientProvider client={queryClient}>
              <WalletProvider>
                <ODB>
                <ThirdwebProvider activeChain="ethereum" clientId={env.NEXT_PUBLIC_THIRDWEB_ID}>
                  <ModalProvider>{children}</ModalProvider>
                  </ThirdwebProvider>
                </ODB>
               
              </WalletProvider>
            </QueryClientProvider>
            <Analytics />
            <Toaster richColors closeButton />
            <TailwindIndicator />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
