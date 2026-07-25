/** Compact task tile icons for call history open tasks. */
export function Product2CallHistoryOpenTaskIcon({ kind }: { kind: "rx" | "eye" }) {
  if (kind === "eye") {
    return (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.35" aria-hidden>
        <path
          d="M1.5 8s2.4-4.5 6.5-4.5 6.5 4.5 6.5 4.5-2.4 4.5-6.5 4.5S1.5 8 1.5 8Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="8" cy="8" r="1.65" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.35" aria-hidden>
      <rect x="3.25" y="5.25" width="9.5" height="5.5" rx="2.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.5 8h5" strokeLinecap="round" />
    </svg>
  );
}
