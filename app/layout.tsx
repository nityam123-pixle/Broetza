import type { Metadata } from "next";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";

export const metadata: Metadata = {
  title: "Bro'etza | Pizza with 'Aaha!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700&family=Instrument+Sans:ital,wght@0,400..700;1,400..700&display=swap"
          rel="stylesheet"
        />
        {/* Preload Hero Video scrub.mp4 for instant playback */}
        <link rel="preload" href="/assets/scrub.mp4" as="video" type="video/mp4" />
      </head>
      <body className="preloader-active">
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}