function PillChevron() {
  return (
    <svg className="linkedin2-sandbox-pill__chevron" viewBox="0 0 8 8" fill="none" aria-hidden>
      <path
        d="M2 3l2 2 2-2"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Static Proto sandbox control pill — label + downward chevron. */
export function LinkedIn2SandboxPill({ label }: { label: string }) {
  return (
    <div className="linkedin2-sandbox-pill" aria-hidden>
      <span className="linkedin2-sandbox-pill__label">{label}</span>
      <PillChevron />
    </div>
  );
}
