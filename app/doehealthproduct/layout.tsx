import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Doe | Health Product",
};

export default function DoeHealthProductLayout({ children }: { children: ReactNode }) {
  return children;
}
