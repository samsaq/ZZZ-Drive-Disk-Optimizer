import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import localFont from "next/font/local";

import { Providers } from "./providers";

import { NavBar } from "@/components/layout/navBar";
import { siteConfig } from "@/config/site";
import CRTOverlay from "@/components/layout/CRTOverlay";
import CRTEffect from "@/components/layout/CRTEffect";
import AuthProvider from "@/components/providers/AuthProvider";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

const fontIBM = localFont({
  src: "../public/fonts/Web437_IBM_BIOS.woff",
  variable: "--font-IBM",
});

const fontDOS = localFont({
  src: "../public/fonts/Perfect_DOS_VGA_437_Win.ttf",
  variable: "--font-DOS",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      suppressHydrationWarning
      className={`${fontIBM.variable} ${fontDOS.variable}`}
      lang="en"
    >
      <head />
      <body className={clsx("min-h-screen bg-black font-sans antialiased")}>
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <AuthProvider>
            <CRTEffect>
              <div className="relative flex h-screen flex-col">
                <NavBar />
                <main className="container mx-auto max-w-7xl flex-grow px-6 py-10">
                  <div className={`relative h-full w-full`}>{children}</div>
                </main>
              </div>
            </CRTEffect>
            <CRTOverlay />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
