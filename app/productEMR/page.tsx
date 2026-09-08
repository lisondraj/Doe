import type { Metadata } from "next";

import { ProductEmrView } from "@/components/productemr/ProductEmrView";

export const metadata: Metadata = {
  title: "Product EMR · Doe",
};

export default function ProductEmrPage() {
  return <ProductEmrView />;
}
