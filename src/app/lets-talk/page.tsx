import type { Metadata } from "next";
import { ContactView } from "@/components/contact/ContactView";

export const metadata: Metadata = {
  title: "Let’s talk",
  description: "Hiring or have a project in mind? Front-end developer building fast, accessible web apps with React and Next.js.",
};

export default function LetsTalkPage() {
  return <ContactView />;
}
