import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Doe | Dr. Brooks' Migraine Clinic",
};

export const viewport: Viewport = {
  themeColor: "#140C04",
};

export default function DemoLayout({ children }: { children: ReactNode }) {
  return children;
}
