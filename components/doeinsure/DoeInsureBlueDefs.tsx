/** Shared SVG gradient defs for /doeinsure blue strokes and fills. */
export function DoeInsureBlueDefs() {
  return (
    <svg aria-hidden="true" focusable="false" width="0" height="0" className="doeinsure-blue-defs">
      <defs>
        <linearGradient id="doeinsure-blue-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3a62ec" />
          <stop offset="52%" stopColor="#3050e0" />
          <stop offset="100%" stopColor="#2a48d4" />
        </linearGradient>
        <linearGradient id="doeinsure-blue-gradient-h" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3a62ec" />
          <stop offset="100%" stopColor="#2a48d4" />
        </linearGradient>
      </defs>
    </svg>
  );
}
