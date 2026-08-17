"use client";

import type { ReactNode } from "react";

import { useDoeInsureSectionReveal } from "@/lib/doeinsure/use-doeinsure-section-reveal";

type RevealVariant = "rise" | "left" | "right";

export function DoeInsureReveal({
  children,
  className = "",
  variant = "rise",
}: {
  children: ReactNode | ((revealed: boolean) => ReactNode);
  className?: string;
  variant?: RevealVariant;
}) {
  const { ref, revealed } = useDoeInsureSectionReveal();
  const content = typeof children === "function" ? children(revealed) : children;

  return (
    <div
      ref={ref}
      className={`doeinsure-reveal doeinsure-reveal--${variant}${revealed ? " is-in" : ""}${className ? ` ${className}` : ""}`}
    >
      {content}
    </div>
  );
}
