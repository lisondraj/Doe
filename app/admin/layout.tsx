import type { Metadata } from "next";

import { DesktopRouteLayout } from "@/components/DesktopRouteLayout";

export const metadata: Metadata = {
  title: "Admin · Doe",
  description: "Doe admin workspace",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <DesktopRouteLayout>{children}</DesktopRouteLayout>;
}
