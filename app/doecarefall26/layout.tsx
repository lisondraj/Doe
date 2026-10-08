import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@/lib/doecarefall26/doecarefall26-desk.css";

export const metadata: Metadata = {
  title: "Doe Care Fall 26 · Doe",
};

export default function DoeCareFall26DeskLayout({ children }: { children: ReactNode }) {
  return children;
}
