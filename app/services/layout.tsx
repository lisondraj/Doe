import type { ReactNode } from "react";

import "@/lib/doehealthdesk2/doehealthdesk2.css";
import "@/lib/earlypreview/earlypreview-market.css";
import "@/lib/earlypreview/earlypreview-gtm.css";
import "@/lib/earlypreview/earlypreview-product.css";
import "@/lib/earlypreview/earlypreview-films.css";
import "@/lib/earlypreview/earlypreview-compliance.css";

/** /services takes /earlypreview's styles: the same hero, and its tiers table. */
export default function ServicesLayout({ children }: { children: ReactNode }) {
  return children;
}
