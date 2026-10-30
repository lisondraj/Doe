import { JOBS_COPY } from "@/lib/jobs/jobs-copy";

function LockIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="3.25" y="7" width="9.5" height="6.75" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M5.5 7V5.25a2.5 2.5 0 0 1 5 0V7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

/** "All submissions are confidential.", small with a lock, over the /jobs filter bar and the form's submit button. */
export function JobsConfidential({ className = "" }: { className?: string }) {
  return (
    <p className={`jobs-confidential ${className}`}>
      <LockIcon />
      {JOBS_COPY.confidential}
    </p>
  );
}
