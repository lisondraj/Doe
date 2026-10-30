import type { ReactNode } from "react";

import "@/lib/doehealth/doehealth-desk.css";
import "@/lib/doehealth/doehealth-blog.css";
import "@/lib/doehealth/doehealth-careers.css";
import "@/lib/doehealthdesk2/doehealthdesk2.css";
import "@/lib/jobs/jobs.css";

/** /jobs takes /careers' styles, and its own for the intro and the application form. */
export default function JobsLayout({ children }: { children: ReactNode }) {
  return children;
}
