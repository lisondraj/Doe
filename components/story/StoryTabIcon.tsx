import type { StoryTabId } from "@/lib/story/story-nav";

function StoryTabIconFrame({
  children,
  className = "h-5 w-5 shrink-0",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      {children}
    </svg>
  );
}

export function ProductNavIcon({ className }: { className?: string }) {
  return (
    <StoryTabIconFrame className={className}>
      <rect width="7" height="7" x="3" y="3" rx="1.5" />
      <rect width="7" height="7" x="14" y="3" rx="1.5" />
      <rect width="7" height="7" x="3" y="14" rx="1.5" />
      <rect width="7" height="7" x="14" y="14" rx="1.5" />
    </StoryTabIconFrame>
  );
}

export function FundraiseNavIcon({ className }: { className?: string }) {
  return (
    <StoryTabIconFrame className={className}>
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 6H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6" />
    </StoryTabIconFrame>
  );
}

export function DocumentsNavIcon({ className }: { className?: string }) {
  return (
    <StoryTabIconFrame className={className}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8M8 17h5" />
    </StoryTabIconFrame>
  );
}

/** Shared story tab glyph — sidebar nav and tab panel header. */
export function StoryTabIcon({ tab, className }: { tab: StoryTabId; className?: string }) {
  if (tab === "introduction") {
    return (
      <StoryTabIconFrame className={className}>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </StoryTabIconFrame>
    );
  }

  if (tab === "meet-doe") {
    return (
      <StoryTabIconFrame className={className}>
        <circle cx="12" cy="8.5" r="3.25" />
        <path d="M5.5 18.5v-1.25a4.25 4.25 0 0 1 4.25-4.25h4.5A4.25 4.25 0 0 1 18.5 17.25V18.5" />
      </StoryTabIconFrame>
    );
  }

  if (tab === "genome") {
    return (
      <StoryTabIconFrame className={className}>
        <path d="M9 3c-1.75 2.5-1.75 5.25 0 7.75s1.75 5.25 0 7.75" />
        <path d="M15 3c1.75 2.5 1.75 5.25 0 7.75s-1.75 5.25 0 7.75" />
        <path d="M9 6.75h6" />
        <path d="M10.5 12h3" />
        <path d="M9 17.25h6" />
      </StoryTabIconFrame>
    );
  }

  if (tab === "compliance") {
    return (
      <StoryTabIconFrame className={className}>
        <path d="M12 3 20 7v6c0 4.5-3.4 7.8-8 9-4.6-1.2-8-4.5-8-9V7l8-4z" />
        <path d="m9.5 12.2 1.8 1.8L15 10" />
      </StoryTabIconFrame>
    );
  }

  if (tab === "pulse") {
    return (
      <StoryTabIconFrame className={className}>
        <path d="M3 12h3l2.5 7L13 5l2.5 7H21" />
      </StoryTabIconFrame>
    );
  }

  if (tab === "fabric") {
    return (
      <StoryTabIconFrame className={className}>
        <path d="M4 4h16v16H4z" />
        <path d="M4 9h16M4 14h16M9 4v16M14 4v16" />
      </StoryTabIconFrame>
    );
  }

  if (tab === "float") {
    return (
      <StoryTabIconFrame className={className}>
        <path d="M12 19V5" />
        <path d="m8 9 4-4 4 4" />
        <path d="M6.5 19h11" />
      </StoryTabIconFrame>
    );
  }

  if (tab === "use-cases") {
    return (
      <StoryTabIconFrame className={className}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M8 13h8M8 17h5" />
      </StoryTabIconFrame>
    );
  }

  if (tab === "team") {
    return (
      <StoryTabIconFrame className={className}>
        <circle cx="9" cy="8.5" r="2.75" />
        <circle cx="16.5" cy="9.75" r="2.25" />
        <path d="M4.5 18.5v-1.1a3.75 3.75 0 0 1 3.75-3.75h1.5A3.75 3.75 0 0 1 13.5 17.4V18.5" />
        <path d="M13.5 18.5v-0.85a3.1 3.1 0 0 1 2.55-3.05" />
      </StoryTabIconFrame>
    );
  }

  if (tab === "budget") {
    return (
      <StoryTabIconFrame className={className}>
        <path d="M4 4h16v16H4z" />
        <path d="M4 9h16M4 14h16M9 4v16M14 4v16" />
      </StoryTabIconFrame>
    );
  }

  if (tab === "our-ask" || tab === "goals-at-seed") {
    return (
      <StoryTabIconFrame className={className}>
        <line x1="12" x2="12" y1="2" y2="22" />
        <path d="M17 6H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6" />
      </StoryTabIconFrame>
    );
  }

  if (tab === "roadmap-gtm") {
    return (
      <StoryTabIconFrame className={className}>
        <path d="M3 3v18h18" />
        <path d="M7 16l4-8 4 5 5-9" />
      </StoryTabIconFrame>
    );
  }

  return (
    <StoryTabIconFrame className={className}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </StoryTabIconFrame>
  );
}
