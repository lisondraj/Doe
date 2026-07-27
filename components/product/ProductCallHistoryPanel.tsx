"use client";

import { Product2CallHistoryPanel } from "@/components/product2/Product2CallHistoryPanel";
import "@/lib/product/product-landing.css";
import "@/lib/product2/product2-landing.css";

/** /product Call History — mirrors product2 panel on desktop + iPhone. */
export function ProductCallHistoryPanel({ onBack }: { onBack?: () => void } = {}) {
  return <Product2CallHistoryPanel onBack={onBack} />;
}
