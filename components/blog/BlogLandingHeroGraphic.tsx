import { BLOG_LANDING_HERO } from "@/lib/blog/blog-landing-hero-colors";

const { lineSoft, line, lineStrong, accent, accentWarm, focal } = BLOG_LANDING_HERO;

/**
 * Three large overlapping circles filling the hero card.
 * Dots sit at exact circle-circumference intersections and extreme arc positions.
 * No EKG — pure geometric / cellular abstraction in Doe beige.
 *
 * Circle geometry (viewBox 400×520, preserveAspectRatio slice):
 *   A  cx=155  cy=180  r=118
 *   B  cx=262  cy=148  r=105
 *   C  cx=285  cy=310  r=82
 *
 * Intersection points (mathematically exact to 1 decimal):
 *   A∩B  upper  (194, 68)    lower  (248, 252)
 *   A∩C  upper  (261, 232)   lower  (207, 286)
 *   B∩C  right  (320, 236)   left   (231, 248)
 */
export function BlogLandingHeroGraphic() {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 400 520"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      {/* ── Three circles ─────────────────────────────────────────────── */}
      <circle cx="155" cy="180" r="118" stroke={lineSoft} strokeWidth="1"   />
      <circle cx="262" cy="148" r="105" stroke={line}     strokeWidth="1"   />
      <circle cx="285" cy="310" r="82"  stroke={lineStrong} strokeWidth="1" />

      {/* ── Dots along circle lines ───────────────────────────────────── */}

      {/* Extreme arc positions — top of each circle */}
      <circle cx="155" cy="62"  r="2"   fill={lineSoft}  />   {/* top of A */}
      <circle cx="262" cy="43"  r="2"   fill={line}      />   {/* top of B */}
      <circle cx="285" cy="228" r="2"   fill={lineStrong}/>   {/* top of C */}

      {/* Left tangent of A (partially clipped by slice — intentional bleed) */}
      <circle cx="37"  cy="180" r="2"   fill={lineSoft}  />

      {/* A∩B intersections */}
      <circle cx="194" cy="68"  r="3"   fill={accentWarm}/>   {/* A∩B upper */}
      <circle cx="248" cy="252" r="2.5" fill={line}      />   {/* A∩B lower */}

      {/* A∩C intersections */}
      <circle cx="261" cy="232" r="2"   fill={lineStrong}/>   {/* A∩C upper */}
      <circle cx="207" cy="286" r="2"   fill={focal}     />   {/* A∩C lower */}

      {/* B∩C intersections */}
      <circle cx="320" cy="236" r="2.5" fill={accent}    />   {/* B∩C right */}
      <circle cx="231" cy="248" r="2"   fill={focal}     />   {/* B∩C left  */}

      {/* ── Tick extensions at extreme positions ─────────────────────── */}
      {/* Top of A */}
      <line x1="155" y1="58"  x2="155" y2="53"  stroke={lineSoft}  strokeWidth="0.9" strokeLinecap="round" />
      {/* Top of B */}
      <line x1="262" y1="39"  x2="262" y2="34"  stroke={line}      strokeWidth="0.9" strokeLinecap="round" />
      {/* Left tangent of A */}
      <line x1="33"  y1="180" x2="28"  y2="180" stroke={lineSoft}  strokeWidth="0.9" strokeLinecap="round" />
      {/* A∩B upper — small cross-hair */}
      <line x1="194" y1="64"  x2="194" y2="59"  stroke={accentWarm} strokeWidth="0.9" strokeLinecap="round" />
    </svg>
  );
}
