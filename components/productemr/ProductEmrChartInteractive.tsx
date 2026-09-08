"use client";

import { useCallback, type MouseEvent } from "react";

import { ProductEmrInnerStage } from "@/components/productemr/ProductEmrInnerStage";
import { ProductEmrPaperA1c } from "@/components/productemr/paper/ProductEmrPaperA1c";
import { ProductEmrPaperChartPage } from "@/components/productemr/paper/ProductEmrPaperChartPage";
import { ProductEmrPaperChat } from "@/components/productemr/paper/ProductEmrPaperChat";
import { ProductEmrPaperCoverage } from "@/components/productemr/paper/ProductEmrPaperCoverage";
import { ProductEmrPaperNotes } from "@/components/productemr/paper/ProductEmrPaperNotes";
import { ProductEmrPaperResults } from "@/components/productemr/paper/ProductEmrPaperResults";
import type { ProductEmrChartTab } from "@/lib/productemr/types";

const CHART_TABS = new Set<ProductEmrChartTab>([
  "prep",
  "snapshot",
  "notes",
  "results",
  "billing",
]);

type ProductEmrChartInteractiveProps = {
  chartTab: ProductEmrChartTab;
  noteOpen: boolean;
  onChartTabChange: (tab: ProductEmrChartTab) => void;
  onChatOpenChange: (open: boolean) => void;
  onA1cOpenChange: (open: boolean) => void;
  onNoteOpenChange: (open: boolean) => void;
};

export function ProductEmrChartInteractive({
  onChartTabChange,
  onChatOpenChange,
  onA1cOpenChange,
  onNoteOpenChange,
}: ProductEmrChartInteractiveProps) {
  const handleHostClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement;

      const tab = target.closest<HTMLElement>("[data-tab]");
      const nextTab = tab?.dataset.tab;
      if (nextTab && CHART_TABS.has(nextTab as ProductEmrChartTab)) {
        onChartTabChange(nextTab as ProductEmrChartTab);
        onChatOpenChange(false);
        onA1cOpenChange(false);
        onNoteOpenChange(nextTab === "notes");
        return;
      }

      if (target.closest(".productemr-chart-chat-hit")) {
        onChatOpenChange(true);
        onA1cOpenChange(false);
        return;
      }

      if (target.closest(".productemr-a1c-hit")) {
        onA1cOpenChange(true);
        onChatOpenChange(false);
        return;
      }

      if (target.closest(".productemr-sheet-close")) {
        onChatOpenChange(false);
        onA1cOpenChange(false);
      }
    },
    [onA1cOpenChange, onChartTabChange, onChatOpenChange, onNoteOpenChange],
  );

  return (
    <div className="productemr-chart-host" onClick={handleHostClick}>
      <ProductEmrPaperChartPage />

      <div className="productemr-chart-swap productemr-chart-swap--notes">
        <ProductEmrInnerStage>
          <ProductEmrPaperNotes />
        </ProductEmrInnerStage>
      </div>
      <div className="productemr-chart-swap productemr-chart-swap--results">
        <ProductEmrInnerStage>
          <ProductEmrPaperResults />
        </ProductEmrInnerStage>
      </div>
      <div className="productemr-chart-swap productemr-chart-swap--billing">
        <ProductEmrInnerStage>
          <ProductEmrPaperCoverage />
        </ProductEmrInnerStage>
      </div>

      <button
        type="button"
        className="productemr-chart-dim"
        aria-label="Close overlay"
        onClick={() => {
          onChatOpenChange(false);
          onA1cOpenChange(false);
        }}
      />

      <div className="productemr-chart-sheet productemr-chart-sheet--chat">
        <ProductEmrPaperChat />
      </div>
      <div className="productemr-chart-sheet productemr-chart-sheet--a1c">
        <ProductEmrPaperA1c />
      </div>
    </div>
  );
}
