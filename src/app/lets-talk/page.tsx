import type { Metadata } from "next";
import { ContactView } from "@/components/contact/ContactView";

export const metadata: Metadata = {
  title: "Let’s talk",
  description: "Frontend developer building immersive, motion-rich websites. Tell me about your project.",
};

export default function LetsTalkPage() {
  return <ContactView />;
}
