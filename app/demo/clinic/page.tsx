import type { Viewport } from "next";

import { DemoClinicDashboard } from "@/components/demo/DemoClinicDashboard";

export const metadata = {
  title: "Doe | Clinic dashboard",
  openGraph: { title: "Clinic dashboard · Dr. Brooks' Migraine Clinic", description: "Every agent that connects, what it does, and what needs you." },
};

/** The rail's ink, so iPhone's status bar and overscroll match the frame. */
export const viewport: Viewport = { themeColor: "#140C04" };

export default function Page() {
  return <DemoClinicDashboard />;
}
