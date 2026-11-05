import type { Metadata } from "next";
import { AboutView } from "@/components/about/AboutView";

export const metadata: Metadata = {
  title: "About",
  description: "Front-end developer in Tbilisi. Experience at Tegeta Motors, Devspark Studio and TetroByte, and the stack behind it.",
};

export default function AboutPage() {
  return <AboutView />;
}
