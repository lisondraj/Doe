import type { CSSProperties } from "react";

import { dmSans, lora } from "@/lib/home/fonts";

type DoeDtcWordmarkProps = {
  className?: string;
  compact?: boolean;
};

const wordmarkStyle: CSSProperties = { fontFamily: lora.style.fontFamily };
const compactStyle: CSSProperties = { fontFamily: dmSans.style.fontFamily };

export function DoeDtcWordmark({ className, compact = false }: DoeDtcWordmarkProps) {
  if (compact) {
    return (
      <span
        className={`doedtc-wordmark doedtc-wordmark--header ${dmSans.className}${className ? ` ${className}` : ""}`}
        style={compactStyle}
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
