import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@/lib/doehealthdesk2/doehealthdesk2.css";

export const metadata: Metadata = {
  title: "Doe Health Desk 2 · Doe",
};

export default function DoeHealthDesk2Layout({ children }: { children: ReactNode }) {
  return children;
}
