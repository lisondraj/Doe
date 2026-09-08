"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export const PRODUCT_EMR_INNER_WIDTH = 1262;
export const PRODUCT_EMR_INNER_HEIGHT = 1020;
export const PRODUCT_EMR_PREP_MOSAIC_WIDTH = 1330;
export const PRODUCT_EMR_PREP_MOSAIC_HEIGHT = 1036;

export function ProductEmrInnerStage({
  children,
  width = PRODUCT_EMR_INNER_WIDTH,
  height = PRODUCT_EMR_INNER_HEIGHT,
}: {
  children: ReactNode;
  width?: number;
  height?: number;
}) {
  const slotRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const node = slotRef.current;
    if (!node) return;
    const sync = () => {
      const availW = node.clientWidth;
      const availH = node.clientHeight;
      if (!availW || !availH) return;
      const next = Math.min(availW / width, availH / height, 1);
      setScale(next > 0 ? next : 0);
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(node);
    return () => ro.disconnect();
  }, [height, width]);

  return (
    <div ref={slotRef} className="productemr-inner-stage">
      <div
        className="productemr-inner-stage__frame"
        style={{
          width: width * scale,
          height: height * scale,
          visibility: scale > 0 ? "visible" : "hidden",
        }}
      >
        <div
          className="productemr-inner-stage__canvas"
          style={{
            width,
            height,
            transform: `scale(${scale})`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
