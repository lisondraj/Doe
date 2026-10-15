import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@/lib/doehealth/doehealth-desk.css";
import "@/lib/doehealth/doehealth-blog.css";

export const metadata: Metadata = {
  title: "News · Doe",
};

export default function DoeHealthBlogLayout({ children }: { children: ReactNode }) {
  return children;
}
