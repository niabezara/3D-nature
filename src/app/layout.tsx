import type { Metadata, Viewport } from "next";
import { Antonio, Instrument_Serif, Manrope } from "next/font/google";
import { ValleyProvider } from "@/components/valley/ValleyProvider";
import "./globals.css";

const antonio = Antonio({
  variable: "--font-antonio",
  weight: "400",
  subsets: ["latin"],
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // absolute base for the share image; set SITE_URL once the domain is known (Vercel fills it in otherwise)
  metadataBase: process.env.SITE_URL ? new URL(process.env.SITE_URL) : undefined,
  title: {
    default: "Nia Bezarashvili — Front-end Developer",
    template: "%s · Nia Bezarashvili",
  },
  description:
    "Front-end developer in Tbilisi building fast, accessible web apps with React, Next.js and TypeScript.",
  openGraph: {
    type: "website",
    siteName: "Nia Bezarashvili",
    title: "Nia Bezarashvili — Front-end Developer",
    description:
      "Fast, accessible web apps with React & Next.js. Front-end developer at Tegeta Motors, Tbilisi.",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${antonio.variable} ${instrument.variable} ${manrope.variable} h-full overflow-hidden bg-black`}>
      <body className="h-full overflow-hidden overscroll-none bg-black font-sans text-cream antialiased">
        <ValleyProvider>{children}</ValleyProvider>
      </body>
    </html>
  );
}
