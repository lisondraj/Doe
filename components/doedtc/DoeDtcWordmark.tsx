import type { CSSProperties } from "react";

import { lora } from "@/lib/home/fonts";

type DoeDtcWordmarkProps = {
  className?: string;
};

const wordmarkStyle: CSSProperties = { fontFamily: lora.style.fontFamily };

export function DoeDtcWordmark({ className }: DoeDtcWordmarkProps) {
  return (
    <span
      className={`doedtc-wordmark doedtc-wordmark--gold ${lora.className}${className ? ` ${className}` : ""}`}
      style={wordmarkStyle}
    >
      Doe
    </span>
  );
}
