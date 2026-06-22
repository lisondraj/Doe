import { BLOG_LANDING_HERO } from "@/lib/blog/blog-landing-hero-colors";

const { lineSoft, line, lineStrong, accent, accentWarm, focal } = BLOG_LANDING_HERO;

/**
 * Healthcare abstract — three overlapping cellular circles (upper) + precise
 * cardiac EKG trace (lower). Suggests biology + vital monitoring in Doe beige.
 */
export function BlogLandingHeroGraphic() {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 400 520"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      {/* ── UPPER: three large overlapping circles ─────────────────── */}

      {/* Large left circle */}
      <circle cx="136" cy="172" r="114" stroke={lineSoft} strokeWidth="1" />
      {/* Large right circle */}
      <circle cx="266" cy="148" r="102" stroke={line} strokeWidth="1" />
      {/* Smaller lower-right circle */}
      <circle cx="330" cy="242" r="66" stroke={lineStrong} strokeWidth="1" />

      {/* Geometric anchor dots — top of each arc */}
      <circle cx="136" cy="58" r="2.5" fill={lineSoft} />
      <circle cx="266" cy="46" r="2.5" fill={line} />
      <circle cx="330" cy="176" r="2"   fill={lineStrong} />

      {/* Edge tangent dots */}
      <circle cx="22"  cy="172" r="2.5" fill={lineSoft} />
      <circle cx="368" cy="148" r="2.5" fill={accent} />
      <circle cx="396" cy="242" r="2"   fill={lineStrong} />

      {/* Tick mark extensions at anchor dots */}
      <line x1="136" y1="54"  x2="136" y2="49"  stroke={lineSoft}  strokeWidth="0.9" strokeLinecap="round" />
      <line x1="266" y1="42"  x2="266" y2="37"  stroke={line}      strokeWidth="0.9" strokeLinecap="round" />
      <line x1="368" y1="148" x2="374" y2="148" stroke={accent}    strokeWidth="0.9" strokeLinecap="round" />
      <line x1="22"  y1="172" x2="16"  y2="172" stroke={lineSoft}  strokeWidth="0.9" strokeLinecap="round" />

      {/* Circle–circle intersection accent dot (where left and right circles cross) */}
      <circle cx="204" cy="116" r="3"   fill={accentWarm} />
      <circle cx="204" cy="212" r="2.5" fill={focal} />

      {/* ── DIVIDER: reference baseline ─────────────────────────────── */}
      <line x1="28" y1="318" x2="372" y2="318" stroke={lineSoft} strokeWidth="0.75" opacity="0.55" />

      {/* Interval tick marks above baseline */}
      {[62, 106, 150, 200, 250, 296, 340].map((x) => (
        <line
          key={x}
          x1={x} y1="313"
          x2={x} y2="318"
          stroke={lineSoft}
          strokeWidth="0.85"
          strokeLinecap="round"
        />
      ))}

      {/* ── LOWER: cardiac EKG trace ─────────────────────────────────── */}

      {/* Full PQRST waveform */}
      <path
        d={[
          "M 28,338",
          "H 118",
          // P wave — smooth small positive bump
          "C 124,338 128,330 134,325 C 140,320 144,327 149,334 L 154,338",
          // PR segment flat
          "H 172",
          // QRS complex — sharp spike
          "L 180,345 L 197,291 L 214,347 L 223,338",
          // ST segment flat
          "H 236",
          // T wave — broad rounded positive bump
          "C 244,338 252,338 260,338 C 267,338 274,322 280,319 C 286,316 290,324 295,333 L 299,338",
          // Return to flat
          "H 372",
        ].join(" ")}
        stroke={line}
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* R-peak accent dot — the heartbeat moment */}
      <circle cx="197" cy="291" r="3" fill={accent} />

      {/* Faint sub-baseline */}
      <line x1="28" y1="358" x2="372" y2="358" stroke={lineSoft} strokeWidth="0.6" opacity="0.35" />

      {/* Baseline landmark dots */}
      <circle cx="80"  cy="358" r="2"   fill={lineSoft} />
      <circle cx="197" cy="358" r="2.5" fill={accent} />
      <circle cx="290" cy="358" r="2"   fill={line} />
      <circle cx="348" cy="358" r="2"   fill={accentWarm} />
    </svg>
  );
}
