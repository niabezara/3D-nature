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
  title: "Fernhollow",
  description: "A regenerative design studio. Wander through a night valley of flowers that grows as you move.",
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
