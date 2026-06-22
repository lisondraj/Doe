import { BLOG_LANDING_HERO } from "@/lib/blog/blog-landing-hero-colors";

const { lineSoft, line, lineStrong, accent, accentWarm, focal } = BLOG_LANDING_HERO;

/** Linear-inspired line art — overlapping circles + converging flow, in Doe beige tones. */
export function BlogLandingHeroGraphic() {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 400 520"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      {/* Baseline + flow markers */}
      <line x1="36" y1="430" x2="364" y2="430" stroke={lineSoft} strokeWidth="1" />
      <circle cx="72" cy="430" r="2.5" fill={line} />
      <circle cx="148" cy="430" r="2.5" fill={lineStrong} />
      <circle cx="252" cy="430" r="2.5" fill={line} />
      <circle cx="328" cy="430" r="2.5" fill={accentWarm} />

      {/* Overlapping circles — left cluster */}
      <circle cx="118" cy="356" r="54" stroke={lineSoft} strokeWidth="1" />
      <circle cx="178" cy="332" r="72" stroke={line} strokeWidth="1" />
      <circle cx="248" cy="360" r="46" stroke={lineStrong} strokeWidth="1" />

      <path
        d="M118 302 L118 298 M178 260 L178 256 M248 314 L248 310"
        stroke={lineSoft}
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M164 356 L160 356 M210 332 L214 332 M280 360 L284 360"
        stroke={accent}
        strokeWidth="1"
        strokeLinecap="round"
      />

      {/* Converging / diverging flow — center band */}
      <g stroke={lineSoft} strokeWidth="0.85">
        <path d="M40 250 C92 248, 128 246, 196 248" />
        <path d="M40 262 C96 260, 132 258, 196 260" />
        <path d="M40 274 C100 272, 136 270, 196 272" />
        <path d="M40 286 C104 284, 140 282, 196 284" />
        <path d="M40 298 C108 296, 144 294, 196 296" />
        <path d="M40 310 C112 308, 148 306, 196 308" />
        <path d="M40 322 C116 320, 152 318, 196 320" />
        <path d="M40 334 C120 332, 156 330, 196 332" />
      </g>

      <rect x="192" y="246" width="16" height="16" fill={focal} rx="1.5" />

      <g stroke={line} strokeWidth="0.85">
        <path d="M208 250 C256 248, 292 246, 360 248" />
        <path d="M208 262 C260 260, 296 258, 360 260" />
        <path d="M208 274 C264 272, 300 270, 360 272" />
        <path d="M208 286 C268 284, 304 282, 360 284" />
        <path d="M208 298 C272 296, 308 294, 360 296" />
        <path d="M208 310 C276 308, 312 306, 360 308" />
        <path d="M208 322 C280 320, 316 318, 360 320" />
        <path d="M208 334 C284 332, 320 330, 360 332" />
      </g>

      <path
        d="M356 248 L360 248 L360 252 M356 332 L360 332 L360 328"
        stroke={accentWarm}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Upper arc hints */}
      <path
        d="M88 148 C128 108, 176 92, 224 108 C272 124, 304 164, 312 204"
        stroke={lineSoft}
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M112 176 C144 148, 188 136, 232 148 C276 160, 304 188, 312 220"
        stroke={line}
        strokeWidth="1"
        strokeLinecap="round"
      />
      <circle cx="312" cy="204" r="3" fill={accent} />
      <circle cx="88" cy="148" r="2.5" fill={lineStrong} />
    </svg>
  );
}
