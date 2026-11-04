import type { Metadata } from "next";
import { AboutView } from "@/components/about/AboutView";

export const metadata: Metadata = {
  title: "About",
  description: "Frontend developer from Tbilisi building immersive, motion-rich websites.",
};

export default function AboutPage() {
  return <AboutView />;
}
