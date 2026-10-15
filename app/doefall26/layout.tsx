import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@/lib/doefall26/doefall26-desk.css";

export const metadata: Metadata = {
  title: "Doe Fall 26 · Doe",
};

export default function DoeFall26DeskLayout({ children }: { children: ReactNode }) {
  return children;
}
