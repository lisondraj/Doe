"use client";

import { ProductEmrPaperDashboardBoard } from "@/components/productemr/paper/ProductEmrPaperDashboardBoard";

type ProductEmrDashboardProps = {
  onOpenElena: () => void;
};

export function ProductEmrDashboard({ onOpenElena }: ProductEmrDashboardProps) {
  return (
    <div
      className="productemr-page-shell"
      onClick={(event) => {
        if ((event.target as HTMLElement).closest(".productemr-elena-hit")) {
          onOpenElena();
        }
      }}
    >
      <ProductEmrPaperDashboardBoard />
    </div>
  );
}
