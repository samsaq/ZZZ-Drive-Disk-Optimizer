import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import localFont from "next/font/local";

import { Providers } from "./providers";

import { NavBar } from "@/components/navBar";
import { siteConfig } from "@/config/site";
import CRTOverlay from "@/components/CRTOverlay";
import CRTEffect from "@/components/CRTEffect";

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
          <div className="relative flex flex-col h-screen">
            <main className="container mx-auto max-w-7xl py-10 px-6 flex-grow">
              <CRTEffect>
                <NavBar />
                <div className={`relative h-full w-full`}>{children}</div>
              </CRTEffect>
              <CRTOverlay />
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
