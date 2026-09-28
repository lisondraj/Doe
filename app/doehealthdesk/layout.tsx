import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@/lib/doehealth/doehealth-desk.css";

export const metadata: Metadata = {
  title: "Doe Health Desk · Doe",
};

export default function DoeHealthDeskLayout({ children }: { children: ReactNode }) {
  return children;
}
