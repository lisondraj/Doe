import type { ReactNode } from "react";

import "@/lib/doehealthdesk2/doehealthdesk2.css";
import "@/lib/earlypreview/earlypreview-market.css";
import "@/lib/earlypreview/earlypreview-gtm.css";
import "@/lib/earlypreview/earlypreview-product.css";
import "@/lib/earlypreview/earlypreview-films.css";
import "@/lib/earlypreview/earlypreview-compliance.css";

export default function EarlyPreviewLayout({ children }: { children: ReactNode }) {
  return children;
}
