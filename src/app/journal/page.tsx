import type { Metadata } from "next";
import { JournalView } from "@/components/journal/JournalView";

export const metadata: Metadata = {
  title: "Journal",
  description: "Notes on WebGL, CSS, motion and the craft of building interfaces that feel alive.",
};

export default function JournalPage() {
  return <JournalView />;
}
