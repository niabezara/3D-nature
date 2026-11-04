import type { Metadata } from "next";
import { WorkView } from "@/components/work/WorkView";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected work: dashboards, 3D scenes and interfaces built for teams who track what matters.",
};

export default function WorkPage() {
  return <WorkView />;
}
