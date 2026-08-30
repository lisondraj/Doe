import type { CSSProperties } from "react";

import { lora } from "@/lib/home/fonts";

type DoeDtcWordmarkProps = {
  className?: string;
  compact?: boolean;
};

const wordmarkStyle: CSSProperties = { fontFamily: lora.style.fontFamily };

export function DoeDtcWordmark({ className, compact = false }: DoeDtcWordmarkProps) {
  if (compact) {
    return (
      <span
        className={`doedtc-wordmark doedtc-wordmark--header ${lora.className}${className ? ` ${className}` : ""}`}
        style={wordmarkStyle}
      >
        Doe
      </span>
    );
  }

  return (
    <span
      className={`doedtc-wordmark doedtc-wordmark--gold ${lora.className}${className ? ` ${className}` : ""}`}
      style={wordmarkStyle}
    >
      Doe
    </span>
  );
}
