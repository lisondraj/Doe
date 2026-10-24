import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@/lib/doehealthdesk2/doehealthdesk2.css";
import "@/lib/earlypreview/earlypreview-films.css";

export const metadata: Metadata = {
  title: "Doe | Health Intelligence in the Era of Personal Agents",
};

export default function DoeHealthDesk2Layout({ children }: { children: ReactNode }) {
  return children;
}
