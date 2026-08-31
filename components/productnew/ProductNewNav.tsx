"use client";

import { PRODUCTNEW_NAV_ITEMS } from "@/lib/productnew/productnew-nav-copy";

function NavIcon({ id }: { id: (typeof PRODUCTNEW_NAV_ITEMS)[number]["id"] }) {
  switch (id) {
    case "overview":
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
          <path d="M3 3h5v5H3V3zm7 0h5v5h-5V3zM3 10h5v5H3v-5zm7 0h5v5h-5v-5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        </svg>
      );
    case "transactions":
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
          <path d="M3 5h12M3 9h8M3 13h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );
    case "convert":
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
          <path
            d="M4.5 3.5c-.6 0-1 .5-1 1.1.2 2.7 1.3 5.3 3.3 7.3s4.6 3.1 7.3 3.3c.6 0 1.1-.4 1.1-1v-1.9c0-.5-.4-1-.9-1.1l-2.3-.5a1 1 0 0 0-1 .3l-.8.9a8.6 8.6 0 0 1-4-4l.9-.8c.3-.3.4-.7.3-1l-.5-2.3a1 1 0 0 0-1.1-.9H4.5z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "builder":
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
          <circle cx="9" cy="9" r="1.6" fill="currentColor" />
          <circle cx="3.5" cy="4.5" r="1.4" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="14.5" cy="4.5" r="1.4" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="3.5" cy="13.5" r="1.4" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="14.5" cy="13.5" r="1.4" stroke="currentColor" strokeWidth="1.2" />
          <path
            d="M9 9 4.6 5.4M9 9l4.4-3.6M9 9l-4.4 3.6M9 9l4.4 3.6"
            stroke="currentColor"
            strokeWidth="1.1"
          />
        </svg>
      );
    case "cards":
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
          <rect x="2.5" y="4.5" width="13" height="9" rx="2" stroke="currentColor" strokeWidth="1.3" />
          <path d="M2.5 7.5h13" stroke="currentColor" strokeWidth="1.3" />
        </svg>
      );
    case "reports":
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
          <path d="M4 13V8M8 13V5M12 13v-3M16 13V6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );
  }
}

function IconNavToggle({ expanded }: { expanded: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <rect x="2.5" y="3.5" width="13" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M6.5 3.5v11" stroke="currentColor" strokeWidth="1.2" />
      {expanded ? (
        <path
          d="M10.5 9 13 6.5M10.5 9 13 11.5"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M7.5 9 5 6.5M7.5 9 5 11.5"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

export function ProductNewNav({
  expanded,
  onToggle,
  activeId,
  onSelect,
}: {
  expanded: boolean;
  onToggle: () => void;
  activeId: (typeof PRODUCTNEW_NAV_ITEMS)[number]["id"];
  onSelect: (id: (typeof PRODUCTNEW_NAV_ITEMS)[number]["id"]) => void;
}) {
  return (
    <nav
      className={`productnew-nav${expanded ? " productnew-nav--expanded" : ""}`}
      aria-label="Primary"
    >
      {expanded ? (
        <div className="productnew-nav__top">
          <div className="productnew-nav__brand" aria-label="Creatline">
            <span className="productnew-nav__brand-text">Creatline</span>
          </div>
        </div>
      ) : null}

      <ul className="productnew-nav__list">
        {PRODUCTNEW_NAV_ITEMS.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              className={`productnew-nav__item${item.id === activeId ? " productnew-nav__item--active" : ""}`}
              aria-current={item.id === activeId ? "page" : undefined}
              title={expanded ? undefined : item.label}
              onClick={() => onSelect(item.id)}
            >
              <span className="productnew-nav__icon">
                <NavIcon id={item.id} />
              </span>
              {expanded ? <span className="productnew-nav__label">{item.label}</span> : null}
            </button>
          </li>
        ))}
      </ul>

      <div className="productnew-nav__bottom">
        <button
          type="button"
          className="productnew-nav__toggle"
          onClick={onToggle}
          aria-expanded={expanded}
          aria-label={expanded ? "Collapse navigation" : "Expand navigation"}
        >
          <IconNavToggle expanded={expanded} />
        </button>
      </div>
    </nav>
  );
}
