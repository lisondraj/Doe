"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import {
  PRODUCT_EMR_CANVAS_HEIGHT,
  PRODUCT_EMR_CANVAS_WIDTH,
} from "@/lib/productemr/types";

export function ProductEmrCanvasScaler({ children }: { children: ReactNode }) {
  const scalerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const node = scalerRef.current;
    if (!node) return;
    const sync = () => {
      const availW = node.clientWidth;
      const availH = node.clientHeight;
      if (!availW || !availH) return;
      const next = Math.min(
        availW / PRODUCT_EMR_CANVAS_WIDTH,
        availH / PRODUCT_EMR_CANVAS_HEIGHT,
        1,
      );
      setScale(next > 0 ? next : 0);
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(node);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={scalerRef} className="productemr-scaler">
      <div
        className="productemr-stage"
        style={{
          width: PRODUCT_EMR_CANVAS_WIDTH * scale,
          height: PRODUCT_EMR_CANVAS_HEIGHT * scale,
          visibility: scale > 0 ? "visible" : "hidden",
        }}
      >
        <div
          className="productemr-canvas"
          style={{ transform: `scale(${scale})` }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
