/**
 * Link previews for /demo's pages (what iMessage, Slack and others show when an agent sends a link): the page in the
 * /demo frame, brown edge and cream card, with the clinic's name, what the page is, and a halftone disc. Nothing about
 * the patient goes in a preview; anyone the link reaches can see it.
 */
import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const fonts = () =>
  Promise.all([
    fetch(new URL("../../fonts/p22-mackinac/P22Mackinac-Medium.otf", import.meta.url)).then((r) => r.arrayBuffer()),
    fetch(new URL("../../fonts/satoshi/Satoshi-Medium.otf", import.meta.url)).then((r) => r.arrayBuffer()),
    fetch(new URL("../../fonts/satoshi/Satoshi-Bold.otf", import.meta.url)).then((r) => r.arrayBuffer()),
  ]);

/** Dots on a hex grid that swell toward the middle, as the product's HalftoneDisc draws them. */
function halftone(size: number, step: number, color: string) {
  const r = size / 2;
  const dots: { x: number; y: number; d: number }[] = [];
  const rowH = step * 0.866;
  for (let row = -Math.ceil(r / rowH); row <= Math.ceil(r / rowH); row++) {
    const y = row * rowH;
    for (let x = -r + (row % 2 ? step / 2 : 0); x <= r; x += step) {
      const dist = Math.hypot(x, y) / r;
      if (dist > 0.98) continue;
      const d = step * 0.84 * Math.pow(Math.max(0, 1 - dist * dist), 0.65);
      if (d > 1.2) dots.push({ x: x + r - d / 2, y: y + r - d / 2, d });
    }
  }
  return (
    <div style={{ position: "relative", width: size, height: size, display: "flex" }}>
      {dots.map((p, i) => (
        <div key={i} style={{ position: "absolute", left: p.x, top: p.y, width: p.d, height: p.d, borderRadius: 999, backgroundColor: color }} />
      ))}
    </div>
  );
}

export async function demoOgImage(o: { kicker: string; title: string; sub: string; chips: string[]; tag?: string; disc?: string }) {
  const [mackinac, satoshi, satoshiBold] = await fonts();
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", backgroundColor: "#3A2516", padding: 26 }}>
        <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", borderRadius: 46, backgroundColor: "#FFFCF1", padding: "44px 56px", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: -70, bottom: -90, display: "flex" }}>{halftone(430, 15, o.disc ?? "#E8A585")}</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "Mackinac", fontSize: 52, color: "#3A2516", letterSpacing: -1 }}>Doe</span>
            {o.tag && (
              <span style={{ display: "flex", alignItems: "center", gap: 12, height: 52, padding: "0 24px", borderRadius: 999, backgroundColor: "#3A2516", color: "#FFFCF1", fontFamily: "Satoshi", fontWeight: 700, fontSize: 24 }}>
                <span style={{ width: 12, height: 12, borderRadius: 999, backgroundColor: "#9DBF8A" }} />
                {o.tag}
              </span>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: "auto", maxWidth: 820 }}>
            <span style={{ fontFamily: "Satoshi", fontSize: 32, color: "#28191099" }}>{o.kicker}</span>
            <span style={{ fontFamily: "Mackinac", fontSize: 96, lineHeight: 1.02, letterSpacing: -2.5, color: "#281910", marginTop: 6 }}>{o.title}</span>
            <span style={{ fontFamily: "Satoshi", fontSize: 32, lineHeight: 1.3, color: "#281910CC", marginTop: 16, maxWidth: 700 }}>{o.sub}</span>
            <div style={{ display: "flex", gap: 12, marginTop: 30 }}>
              {o.chips.map((c) => (
                <span key={c} style={{ display: "flex", alignItems: "center", height: 48, padding: "0 22px", borderRadius: 999, backgroundColor: "#F4EEDF", fontFamily: "Satoshi", fontWeight: 700, fontSize: 23, color: "#281910" }}>
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Mackinac", data: mackinac, weight: 500, style: "normal" },
        { name: "Satoshi", data: satoshi, weight: 500, style: "normal" },
        { name: "Satoshi", data: satoshiBold, weight: 700, style: "normal" },
      ],
    },
  );
}
