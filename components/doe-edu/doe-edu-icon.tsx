import type { ReactNode } from "react";

export function DoeEduIcon({
  children,
  className = "h-[18px] w-[18px] shrink-0 text-neutral-500",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}
