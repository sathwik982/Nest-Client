import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import localFont from "next/font/local";

const flamingo = localFont({
  src: "../../public/fonts/flamingo.ttf",
  variable: "--font-flamingo",
});

const flatorySerif = localFont({
  src: "../../public/fonts/flatory-serif-condensed.ttf",
  variable: "--font-flatory-serif",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Nest Living - Find Your Perfect PG",
  description: "Premium PG accommodations for students and professionals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.className} ${flamingo.variable} ${flatorySerif.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
