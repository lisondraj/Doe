import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Doe | Dr. Brooks' Migraine Clinic",
};

export const viewport: Viewport = {
  themeColor: "#3A2516",
};

export default function DemoLayout({ children }: { children: ReactNode }) {
  return children;
}
