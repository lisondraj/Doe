import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@/lib/doehealth/doehealth-desk.css";
import "@/lib/doehealth/doehealth-blog.css";
import "@/lib/doehealth/doehealth-blog-motion.css";
import "@/lib/doehealth/doehealth-careers.css";
import "@/lib/doehealthdesk2/doehealthdesk2.css";

export const metadata: Metadata = {
  title: "Doe News",
};

export default function DoeHealthBlogLayout({ children }: { children: ReactNode }) {
  return children;
}
