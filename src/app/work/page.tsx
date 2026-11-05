import type { Metadata } from "next";
import { WorkView } from "@/components/work/WorkView";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected work: a multi-brand showroom kiosk, brand websites, an insurance flow and more, built with React and Next.js.",
};

export default function WorkPage() {
  return <WorkView />;
}
