import { DoeLinkArrow } from "@/components/shared/DoeLinkArrow";
import { suisseIntl } from "@/lib/home/fonts";

const PRODUCT_WORDMARKS = {
  genome: { label: "Genome", viewBox: "0 -0.5 62 12", width: "4.1rem" },
  fabric: { label: "Fabric", viewBox: "0 -0.5 54 12", width: "3.55rem" },
  pulse: { label: "Pulse", viewBox: "0 -0.5 50 12", width: "3.3rem" },
  float: { label: "Float", viewBox: "0 -0.5 46 12", width: "3.05rem" },
} as const;

export type DoeHomeProductWordmarkId = keyof typeof PRODUCT_WORDMARKS;

/** Shared hero gold mark width — iPhone lead row and product row. */
export const DOEHOME_GOLD_WORDMARK_SIZE = "7.5rem";

/** Desktop hero stat product links — match largest mark. */
export const DOEHOME_STAT_GOLD_WORDMARK_SIZE = "5rem";

export function doeHomeProductWordmarkLabel(product: DoeHomeProductWordmarkId) {
  return PRODUCT_WORDMARKS[product].label;
}

/** iPhone product row — normalize to Float viewBox so all three render same size. */
const IPHONE_PRODUCT_ROW_VIEWBOX_WIDTH = 46;

/** Inline product mark for hero stat copy. */
export function DoeHomeProductWordmark({
  product,
  stat = false,
  iphoneLead = false,
  iphoneProductRow = false,
}: {
  product: DoeHomeProductWordmarkId;
  stat?: boolean;
  iphoneLead?: boolean;
  iphoneProductRow?: boolean;
}) {
  const mark = PRODUCT_WORDMARKS[product];
  const width = iphoneProductRow
    ? undefined
    : iphoneLead
      ? DOEHOME_GOLD_WORDMARK_SIZE
      : stat
        ? DOEHOME_STAT_GOLD_WORDMARK_SIZE
        : mark.width;
  const matchFloatRowSize = iphoneProductRow && product !== "genome";
  const viewBox = matchFloatRowSize
    ? `0 -0.5 ${IPHONE_PRODUCT_ROW_VIEWBOX_WIDTH} 12`
    : mark.viewBox;
  const viewBoxWidth = matchFloatRowSize
    ? IPHONE_PRODUCT_ROW_VIEWBOX_WIDTH
    : Number(mark.viewBox.split(/\s+/)[2]);
  const textX = iphoneProductRow ? viewBoxWidth / 2 : 0;

  return (
    <svg
      className={`doehome-product-wordmark doehome-product-wordmark--${product}${stat ? " doehome-product-wordmark--stat" : ""}${iphoneLead ? " doehome-product-wordmark--iphone-lead" : ""}${iphoneProductRow ? " doehome-product-wordmark--iphone-product-row" : ""}`}
      viewBox={viewBox}
      overflow="visible"
      aria-hidden="true"
      focusable="false"
      style={width ? { width } : undefined}
    >
      <text
        x={textX}
        y="9.5"
        textAnchor={iphoneProductRow ? "middle" : undefined}
        fill="url(#doeinsure-blue-gradient-h)"
        style={{ fontFamily: suisseIntl.style.fontFamily }}
        fontSize="10.5"
        fontWeight="500"
        letterSpacing="-0.03em"
      >
        {mark.label}
      </text>
    </svg>
  );
}

/** Tagline under iPhone hero stat wordmarks. */
export function DoeHomeIphoneStatTagline({
  label,
  showArrow = true,
  linked = false,
}: {
  label: string | readonly string[];
  showArrow?: boolean;
  linked?: boolean;
}) {
  const lines = typeof label === "string" ? [label] : label;
  const stacked = lines.length > 1;

  const arrow = showArrow ? <DoeLinkArrow className="doehome-stat-iphone-tagline__arrow" /> : null;

  return (
    <span
      className={`doehome-stat-iphone-tagline${stacked ? " doehome-stat-iphone-tagline--stacked" : ""}${linked ? " doehome-stat-iphone-tagline--link" : ""}`}
    >
      <span className="doehome-stat-iphone-tagline__text">
        {lines.map((line, index) => (
          <span
            key={line}
            className={`doehome-stat-iphone-tagline__line${stacked && showArrow && index === lines.length - 1 ? " doehome-stat-iphone-tagline__line--with-arrow" : ""}`}
          >
            <span className="doehome-stat-iphone-tagline__label">{line}</span>
            {stacked && showArrow && index === lines.length - 1 ? arrow : null}
          </span>
        ))}
      </span>
      {!stacked && showArrow ? arrow : null}
    </span>
  );
}

/** Gold product link at the end of a hero stat description. */
export function DoeHomeStatProductLink({ product }: { product: DoeHomeProductWordmarkId }) {
  const label = doeHomeProductWordmarkLabel(product);

  return (
    <a
      className="doehome-stat-product-link"
      href={`#${product}`}
      aria-label={`See ${label}`}
      onClick={(event) => event.stopPropagation()}
    >
      <DoeHomeProductWordmark product={product} stat />
      <DoeLinkArrow className="doehome-stat-product-link__arrow" />
    </a>
  );
}
