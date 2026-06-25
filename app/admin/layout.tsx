import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin · Doe",
  description: "Doe admin workspace",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
