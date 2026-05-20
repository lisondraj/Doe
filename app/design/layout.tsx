import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Design — Doe",
};

export const viewport: Viewport = {
  themeColor: "#1a2e34",
};

export default function DesignLayout({ children }: { children: React.ReactNode }) {
  return children;
}
