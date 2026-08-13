import {
  LINKEDIN2_NAV_BRAND,
  LINKEDIN2_NAV_INVEST_LABEL,
} from "@/lib/linkedin/linkedin2-copy";
import { PROTO_FONT_CLASS, PROTO_NAV_LOGO_FONT_CLASS } from "@/lib/proto/proto-font";

function GridIcon() {
  return (
    <svg className="linkedin2-scene__nav-grid" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="2.25" y="2.25" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <rect x="9.25" y="2.25" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <rect x="2.25" y="9.25" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <rect x="9.25" y="9.25" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function NavChevron() {
  return (
    <svg className="linkedin2-scene__nav-chevron" viewBox="0 0 8 8" fill="none" aria-hidden>
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

/** Floating Proto nav pill — brand, grid icon, For Investors split control. */
export function LinkedIn2ProtoNav() {
  return (
    <div className={`linkedin2-scene__nav ${PROTO_FONT_CLASS}`} aria-hidden>
      <span className={`linkedin2-scene__nav-brand ${PROTO_NAV_LOGO_FONT_CLASS}`}>{LINKEDIN2_NAV_BRAND}</span>

      <div className="linkedin2-scene__nav-actions">
        <span className="linkedin2-scene__nav-grid-btn">
          <GridIcon />
        </span>

        <div className="linkedin2-scene__nav-invest">
          <span className="linkedin2-scene__nav-invest-label">{LINKEDIN2_NAV_INVEST_LABEL}</span>
          <span className="linkedin2-scene__nav-invest-chevron" aria-hidden>
            <NavChevron />
          </span>
        </div>
      </div>
    </div>
  );
}
