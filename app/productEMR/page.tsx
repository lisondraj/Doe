import type { Metadata } from "next";

import { ProductEmrView } from "@/components/productemr/ProductEmrView";

export const metadata: Metadata = {
  title: "Doe Product | EMR",
};

export default function ProductEmrPage() {
  return <ProductEmrView />;
}
