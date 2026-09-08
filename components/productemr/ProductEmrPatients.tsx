"use client";

import { ProductEmrPaperPatients } from "@/components/productemr/paper/ProductEmrPaperPatients";

type ProductEmrPatientsProps = {
  onOpenElena: () => void;
};

export function ProductEmrPatients({ onOpenElena }: ProductEmrPatientsProps) {
  return (
    <div
      className="productemr-page-shell"
      onClick={(event) => {
        if ((event.target as HTMLElement).closest(".productemr-elena-hit")) {
          onOpenElena();
        }
      }}
    >
      <ProductEmrPaperPatients />
    </div>
  );
}
