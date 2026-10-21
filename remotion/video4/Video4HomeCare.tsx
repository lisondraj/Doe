import { useLayoutEffect, useRef, type CSSProperties } from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";

import { DotTide, DotWave, Stage } from "../video1/backdrops";
import { Bubble, Slot, TimeStamp, TypingBubble } from "../video1/imessage";
import { EASE_IN, EASE_IN_OUT, EASE_OUT, camera, keys, lerp, pulse, ramp, type CameraKey } from "../video1/motion";
import { C, F } from "../video1/theme";
import { AppShell, Chip, ClickRing, Cursor, ShadowsContext, Toggle } from "../video1/ui";
import { Av, Display, Field, HalftoneZones, Ico, Menu, PAGE, Pill, SAGE, SAGE_TEXT, SHELL, SUB, Segmented, SelectBox, Status, clamp01, onPage, press, rise, track, type AvTone, type Zone } from "./kit";

export const VIDEO4_HOMECARE_FRAMES = 900;

const ASK_END = 300;
const COVER_AT = 268;
const COVER_LEN = 456;
const CONFIRM_AT = COVER_AT + 440;

export function Video4HomeCare() {
  return (
    <ShadowsContext.Provider value={false}>
      <Audio src={staticFile("video1/BED.m4a")} startFrom={1230} volume={0.2} />
      <HomeStage />
    </ShadowsContext.Provider>
  );
}

function HomeStage() {
  const frame = useCurrentFrame();
  const tide = ramp(frame, COVER_AT, 30, EASE_IN_OUT) * (1 - ramp(frame, CONFIRM_AT, 30, EASE_IN_OUT));
  const wave = ramp(frame, CONFIRM_AT, 30, EASE_IN_OUT);
  return (
    <Stage
      backdrop={
        <>
          {tide > 0 ? (
            <AbsoluteFill style={{ opacity: tide }}>
              <DotTide reach={480} />
            </AbsoluteFill>
          ) : null}
          {wave > 0 ? (
            <AbsoluteFill style={{ opacity: wave }}>
              <DotWave top={0.52} amp={60} />
            </AbsoluteFill>
          ) : null}
        </>
      }
    >
      <Sequence from={0} durationInFrames={ASK_END} name="Request → map">
        <AskScene />
      </Sequence>
      <Sequence from={COVER_AT} durationInFrames={COVER_LEN} name="Coverage + schedule">
        <CoverageScene />
      </Sequence>
      <Sequence from={CONFIRM_AT} durationInFrames={VIDEO4_HOMECARE_FRAMES - CONFIRM_AT} name="Match confirmed">
        <ConfirmScene />
      </Sequence>
    </Stage>
  );
}

/* ─── The ask over a turning dot sphere, which settles into a coverage map ── */

const REQUEST = "My dad is coming home Friday. We need help every morning starting this weekend.";
const SPHERE = { x: 960, y: 470, r: 360, count: 2600, speed: 0.006, tilt: 0.42 };
const MORPH_AT = 128;
const MORPH_DUR = 62;
const MAPC = { x: 140, y: 170, w: 860, h: 740 };
const BLOB = { x: MAPC.x + MAPC.w / 2 - 10, y: MAPC.y + MAPC.h / 2 + 10, r: 300 };
const blobR = (a: number) => BLOB.r * (1 + 0.14 * Math.sin(3 * a + 0.8) + 0.08 * Math.sin(5 * a - 0.4) + 0.05 * Math.cos(2 * a));
const HOME = { x: BLOB.x + 70, y: BLOB.y - 50 };
const CARD = { x: 1040, y: 170, w: 740, h: 740 };
const PUSH_AT = 248;
const DAYS = [
  { d: "Sat", n: 24 },
  { d: "Sun", n: 25 },
  { d: "Mon", n: 26 },
  { d: "Tue", n: 27 },
  { d: "Wed", n: 28 },
  { d: "Thu", n: 29 },
  { d: "Fri", n: 30 },
];

const ASK_CAMS: CameraKey[] = [
  { f: 0, x: 960, y: 540, s: 1.06 },
  { f: MORPH_AT, x: 960, y: 540, s: 1.0 },
  { f: 200, x: 960, y: 540, s: 0.98 },
  { f: PUSH_AT, x: 980, y: 540, s: 1.02 },
];

function askCamera(frame: number) {
  if (frame < PUSH_AT) return camera(frame, ASK_CAMS);
  return camera(frame, [ASK_CAMS[ASK_CAMS.length - 1], { f: ASK_END, x: HOME.x, y: HOME.y, s: 5 }], EASE_IN);
}

function AskScene() {
  const frame = useCurrentFrame();
  const morph = ramp(frame, MORPH_AT, MORPH_DUR, (t) => t);
  const threadOut = ramp(frame, MORPH_AT - 6, 22, EASE_IN_OUT);
  const mapIn = ramp(frame, MORPH_AT + 24, 30, EASE_IN_OUT);
  const leave = ramp(frame, PUSH_AT + 26, 14, EASE_IN);
  return (
    <AbsoluteFill style={{ opacity: 1 - leave, filter: leave > 0 ? `blur(${leave * 14}px)` : undefined }}>
      <div style={askCamera(frame)}>
        <div style={{ position: "absolute", left: MAPC.x, top: MAPC.y, width: MAPC.w, height: MAPC.h, borderRadius: 36, background: "#ECE2CD", overflow: "hidden", opacity: mapIn, transform: `scale(${lerp(0.96, 1, mapIn)})` }}>
          <Streets w={MAPC.w} h={MAPC.h} reveal={ramp(frame, MORPH_AT + 36, 30, EASE_IN_OUT)} />
        </div>
        <SphereToMap morph={morph} />
        <BlobOutline draw={ramp(frame, MORPH_AT + 50, 34, EASE_IN_OUT)} />
        <div style={{ position: "absolute", left: MAPC.x + 24, top: MAPC.y + 24, display: "flex", gap: 8, ...rise(frame, MORPH_AT + 52, { y: -8, dur: 16 }) }}>
          <Chip tone="paper" size={1.3} icon={<Ico name="route" size={16} />}>
            Within 25 min of Dad
          </Chip>
        </div>
        <HomePin frame={frame} at={MORPH_AT + 58} x={HOME.x} y={HOME.y} label={"Dad\u2019s place"} />

        <div style={{ position: "absolute", left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h, ...rise(frame, MORPH_AT + 20, { x: 60, y: 0, blur: 6, dur: 28 }) }}>
          <RequestCard frame={frame} />
        </div>

        <div style={{ position: "absolute", left: 960 - 210, bottom: 1080 - 1000, width: 420, display: "flex", flexDirection: "column", fontFamily: F.ios, transform: `translateY(${-80 * threadOut}px) scale(2)`, transformOrigin: "50% 100%", opacity: 1 - threadOut, filter: threadOut > 0 ? `blur(${threadOut * 6}px)` : undefined }}>
          <Slot frame={frame} at={8} side="center">
            <TimeStamp day="Today" time="6:40 PM" />
          </Slot>
          <Slot frame={frame} at={16} side="out" dur={20}>
            <Bubble out>{REQUEST}</Bubble>
          </Slot>
          <Slot frame={frame} at={56} until={82} side="in" dur={12}>
            <TypingBubble frame={frame} />
          </Slot>
          <Slot frame={frame} at={82} side="in" dur={18}>
            <Bubble>I&rsquo;ll find home care near Dad&rsquo;s place that can cover every morning.</Bubble>
          </Slot>
        </div>
      </div>
    </AbsoluteFill>
  );
}

const SPHERE_PTS = (() => {
  const pts = new Float32Array(SPHERE.count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < SPHERE.count; i++) {
    const y = 1 - (i / (SPHERE.count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    pts[i * 3] = Math.cos(golden * i) * r;
    pts[i * 3 + 1] = y;
    pts[i * 3 + 2] = Math.sin(golden * i) * r;
  }
  return pts;
})();

/** The sphere's dots unfold (equal-area, from the front pole) into the service-area blob, centre first. */
function SphereToMap({ morph }: { morph: number }) {
  const frame = useCurrentFrame();
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, 1920, 1080);
    ctx.fillStyle = C.dot;
    const spinA = Math.min(frame, MORPH_AT) * SPHERE.speed;
    const ca = Math.cos(spinA);
    const sa = Math.sin(spinA);
    const ct = Math.cos(SPHERE.tilt);
    const st = Math.sin(SPHERE.tilt);
    const t = frame / 30;
    const enter = ramp(frame, 0, 30, EASE_IN_OUT);
    for (let i = 0; i < SPHERE.count; i++) {
      const x = SPHERE_PTS[i * 3];
      const y = SPHERE_PTS[i * 3 + 1];
      const z = SPHERE_PTS[i * 3 + 2];
      const x1 = x * ca + z * sa;
      const z1 = -x * sa + z * ca;
      const y2 = y * ct - z1 * st;
      const z2 = y * st + z1 * ct;
      const depth = (z2 + 1) / 2;
      const persp = 1 + 0.12 * z2;
      const sx = SPHERE.x + x1 * SPHERE.r * persp;
      const sy = SPHERE.y + y2 * SPHERE.r * persp;
      const sr = 0.8 + 1.9 * depth;
      const salpha = 0.12 + 0.7 * Math.pow(depth, 1.5);

      const k = Math.sqrt(2 / (1 + Math.max(-0.97, z2)));
      const rho = Math.min(1, (k * Math.hypot(x1, y2)) / 2);
      const ang = Math.atan2(y2, x1);
      const br = blobR(ang);
      const tx = BLOB.x + Math.cos(ang) * br * rho;
      const ty = BLOB.y + Math.sin(ang) * br * rho;
      const h = 0.5 + 0.5 * Math.sin(tx / 70 + ty / 90 + t * 1.1);
      const edge = Math.min(1, (1 - rho) * 6);
      const tr = (1.5 + 1.9 * h) * (0.55 + 0.45 * edge);
      const talpha = (0.5 + 0.4 * h) * (0.45 + 0.55 * edge);

      const u = EASE_IN_OUT(clamp01(morph * 1.5 - rho * 0.5));
      ctx.globalAlpha = lerp(salpha, talpha, u) * enter;
      ctx.beginPath();
      ctx.arc(lerp(sx, tx, u), lerp(sy, ty, u), lerp(sr, tr, u), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }, [frame, morph]);
  return <canvas ref={ref} width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }} />;
}

function BlobOutline({ draw }: { draw: number }) {
  if (draw <= 0) return null;
  const pts = Array.from({ length: 121 }, (_, i) => {
    const a = (i / 120) * Math.PI * 2;
    const r = blobR(a) + 18;
    return `${i ? "L" : "M"}${(BLOB.x + Math.cos(a) * r).toFixed(1)} ${(BLOB.y + Math.sin(a) * r).toFixed(1)}`;
  }).join(" ");
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <path d={pts} fill="none" stroke={C.walnut} strokeOpacity={0.45} strokeWidth={2} strokeDasharray="8 8" pathLength={1000} strokeDashoffset={0} opacity={draw} />
    </svg>
  );
}

function Streets({ w, h, reveal, step = 74, angle = -14 }: { w: number; h: number; reveal: number; step?: number; angle?: number }) {
  const lines = Array.from({ length: 21 }, (_, i) => (i - 10) * step);
  return (
    <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0, opacity: reveal }}>
      <g transform={`translate(${w / 2} ${h / 2}) rotate(${angle})`}>
        {lines.map((k, i) => (
          <line key={`v${k}`} x1={k} y1={-900} x2={k} y2={900} stroke={C.paper} strokeWidth={i === 12 ? 16 : 7} />
        ))}
        {lines.map((k, i) => (
          <line key={`h${k}`} x1={-900} y1={k} x2={900} y2={k} stroke={C.paper} strokeWidth={i === 9 ? 16 : 7} />
        ))}
      </g>
    </svg>
  );
}

function HomePin({ frame, at, x, y, label }: { frame: number; at: number; x: number; y: number; label: string }) {
  const p = ramp(frame, at, 14, EASE_OUT);
  const ring = ramp(frame, at + 4, 24);
  return (
    <>
      {ring > 0 && ring < 1 ? <div style={{ position: "absolute", left: x - 14 - 26 * ring, top: y - 14 - 26 * ring, width: 28 + 52 * ring, height: 28 + 52 * ring, borderRadius: 999, boxSizing: "border-box", border: `2px solid rgba(20, 12, 4, ${0.3 * (1 - ring)})` }} /> : null}
      <div style={{ position: "absolute", left: x - 18, top: y - 18, width: 36, height: 36, borderRadius: 999, background: C.ink, border: `4px solid ${C.paper}`, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", opacity: p, transform: `scale(${lerp(0.4, 1, p)})` }}>
        <Ico name="home" size={14} color={C.paper} stroke={2.2} />
      </div>
      <div style={{ position: "absolute", left: x + 26, top: y - 17, ...rise(frame, at + 4, { x: -10, y: 0, dur: 14 }) }}>
        <Chip tone="paper" size={1.3}>
          {label}
        </Chip>
      </div>
    </>
  );
}

const NEEDS = ["Mobility help", "Medication reminders", "Meals", "Bathing", "Companionship"];

function RequestCard({ frame }: { frame: number }) {
  const at = (o: number) => MORPH_AT + 28 + o;
  return (
    <div style={{ width: "100%", height: "100%", boxSizing: "border-box", padding: 28, borderRadius: 36, background: C.paper, display: "flex", flexDirection: "column", gap: 22 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, height: 56 }}>
        <Av label="WH" size={52} tone="sand" />
        <Display size={36}>Walter Hayes</Display>
        <div style={{ flex: 1 }} />
        <Status tone="salmon" icon="home" size={1.15}>
          Home Fri, Oct 23
        </Status>
      </div>
      <div style={{ padding: 14, borderRadius: 24, background: C.beige, display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8, ...rise(frame, at(4), { y: 16 }) }}>
        {DAYS.map((day, i) => {
          const fill = ramp(frame, at(26 + i * 5), 12, EASE_OUT);
          return (
            <div key={day.d} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 14, color: SUB }}>{day.d}</span>
              <span style={{ fontFamily: F.display, fontWeight: 500, fontSize: 26, lineHeight: "28px", color: C.walnut }}>{day.n}</span>
              <div style={{ position: "relative", width: "100%", height: 150, boxSizing: "border-box", borderRadius: 14, border: "1.5px dashed rgba(40, 25, 16, 0.24)" }}>
                <div style={{ position: "absolute", inset: -1.5, borderRadius: 14, background: C.salmon, opacity: fill, transform: `scale(${lerp(0.85, 1, fill) + 0.05 * pulse(frame, at(30 + i * 5), 4, 10)})`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
                  <Ico name="sun" size={18} color={C.walnut} stroke={1.8} />
                  <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 15, color: C.walnut }}>8&ndash;11</span>
                  <span style={{ fontFamily: F.body, fontSize: 12, color: C.salmonText }}>AM</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {NEEDS.map((n, i) => (
          <div key={n} style={rise(frame, at(10 + i * 3), { y: 8, scale: 0.9, dur: 14 })}>
            <Chip tone="outline" size={1.3}>
              {n}
            </Chip>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, ...rise(frame, at(16), { y: 12 }) }}>
        {[
          ["Starts", "Sat, Oct 24"],
          ["Frequency", "Every morning"],
          ["Hours", "8:00 \u2013 11:00 AM"],
          ["Ongoing", "Until changed"],
        ].map(([label, value]) => (
          <div key={label} style={{ padding: "14px 16px", borderRadius: 16, background: C.beige }}>
            <Field label={label}>
              <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 18, color: C.walnut }}>{value}</span>
            </Field>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Org side: one Coverage page, scrolled from areas → caregivers → schedule ── */

const MAP = { x: 28, y: 104, w: 800, h: 596 };
const ZONES: { name: string; zip: string; poly: [number, number][]; on: boolean }[] = [
  { name: "Rockridge", zip: "94618", on: true, poly: [[40, 70], [290, 46], [320, 250], [150, 300], [34, 220]] },
  { name: "Temescal", zip: "94609", on: true, poly: [[306, 44], [536, 34], [556, 226], [334, 248]] },
  { name: "Piedmont", zip: "94611", on: true, poly: [[160, 316], [334, 266], [556, 244], [600, 404], [420, 530], [210, 490]] },
  { name: "Montclair", zip: "94619", on: false, poly: [[566, 40], [770, 70], [764, 340], [624, 420], [600, 236], [570, 226]] },
];
const MONTCLAIR = 3;
const centroid = (poly: [number, number][]) => ({ x: poly.reduce((s, p) => s + p[0], 0) / poly.length, y: poly.reduce((s, p) => s + p[1], 0) / poly.length });
const PIN = { x: 690, y: 210 };
const AREA_ROWS = [...ZONES.map((z) => ({ name: z.name, zip: z.zip, on: z.on })), { name: "Berkeley Hills", zip: "94708", on: false }, { name: "Alameda", zip: "94501", on: false }];
const AREAS = { x: 852, y: 104, w: 484, h: 596, rowH: 70 };
const areaRowY = (i: number) => AREAS.y + 16 + 56 + i * (AREAS.rowH + 6);

const CARE = { x: 28, y: 724, w: 800, h: 456 };
const RULES = { x: 852, y: 724, w: 484, h: 456 };
const SCHED = { x: 28, y: 1204, w: 1308, h: 596 };
const S1 = 620;
const S2 = 1180;

type Avail = "a" | "b" | "o";
const CAREGIVERS: { name: string; role: string; tone: AvTone; am: Avail[]; pm: Avail[] }[] = [
  { name: "Rosa Martinez", role: "CNA", tone: "salmon", am: ["a", "a", "b", "b", "a", "b", "a"], pm: ["o", "o", "a", "a", "b", "a", "b"] },
  { name: "Kevin Tran", role: "HHA", tone: "sage", am: ["o", "o", "a", "a", "b", "a", "b"], pm: ["a", "a", "b", "a", "a", "b", "a"] },
  { name: "Amara Okoye", role: "RN", tone: "sand", am: ["a", "b", "b", "a", "b", "a", "b"], pm: ["b", "a", "a", "b", "a", "a", "o"] },
  { name: "Luis Gomez", role: "HHA", tone: "sage", am: ["b", "b", "a", "b", "a", "b", "a"], pm: ["a", "o", "o", "a", "b", "a", "a"] },
];

const FREQUENCIES = [{ label: "One time" }, { label: "Weekly" }, { label: "Every weekday" }, { label: "Every morning" }, { label: "Custom" }];
const FREQ_SELECT = { x: RULES.x + 20, y: RULES.y + 20 + 60 + 22, w: 268, h: 42 };
const FREQ_MENU = { x: FREQ_SELECT.x, y: FREQ_SELECT.y + FREQ_SELECT.h + 8 };

const VISITS: { cg: string; tone: AvTone; label: string }[] = [
  { cg: "Rosa M.", tone: "salmon", label: "RM" },
  { cg: "Rosa M.", tone: "salmon", label: "RM" },
  { cg: "Kevin T.", tone: "sage", label: "KT" },
  { cg: "Kevin T.", tone: "sage", label: "KT" },
  { cg: "Rosa M.", tone: "salmon", label: "RM" },
  { cg: "Luis G.", tone: "sage", label: "LG" },
  { cg: "Rosa M.", tone: "salmon", label: "RM" },
];
const GRID = { top: 96, head: 44, hourH: 70, gutter: 64, start: 7, hours: 6 };
const GRID_COL = (SCHED.w - 48 - GRID.gutter) / 7;
const SEND_BTN = { w: 268, h: 52 };

const TOGGLE_CLICK = 58;
const FILL_AT = TOGGLE_CLICK + 2;
const SCROLL1 = { from: 104, to: 140 };
const FREQ_CLICK = 172;
const MORNING_CLICK = 208;
const SCROLL2 = { from: 236, to: 274 };
const VISITS_AT = 284;
const COVERED_AT = 336;
const SEND_CLICK = 396;

const scrollAt = (f: number) => keys(f, [SCROLL1.from, SCROLL1.to, SCROLL2.from, SCROLL2.to], [0, S1, S1, S2]);
/** World position of a page point under the scroll at frame f. */
const at = (x: number, y: number, f: number) => onPage(x, y - scrollAt(f));

const MONTCLAIR_TOGGLE = at(AREAS.x + AREAS.w - 16 - 16 - 18, areaRowY(MONTCLAIR) + AREAS.rowH / 2, TOGGLE_CLICK);
const FREQ_WORLD = at(FREQ_SELECT.x + FREQ_SELECT.w / 2, FREQ_SELECT.y + FREQ_SELECT.h / 2, FREQ_CLICK);
const MORNING_WORLD = at(FREQ_MENU.x + 120, FREQ_MENU.y + 6 + 3 * 42 + 21, MORNING_CLICK);
const SEND_WORLD = at(SCHED.x + SCHED.w - 24 - SEND_BTN.w / 2, SCHED.y + 24 + 28, SEND_CLICK);
const MONTCLAIR_C = centroid(ZONES[MONTCLAIR].poly);
const MONTCLAIR_WORLD = onPage(MAP.x + MONTCLAIR_C.x, MAP.y + MONTCLAIR_C.y);

const COVER_CAMS: CameraKey[] = [
  { f: 0, x: MONTCLAIR_WORLD.x, y: MONTCLAIR_WORLD.y, s: 3 },
  { f: 30, x: 960, y: 540, s: 1.04 },
  { f: 96, x: 960, y: 540, s: 1.06 },
  { f: 140, x: 900, y: 520, s: 1.12 },
  { f: 168, x: 1260, y: 470, s: 1.42 },
  { f: 222, x: 1270, y: 480, s: 1.44 },
  { f: 272, x: 960, y: 520, s: 1.06 },
  { f: 330, x: 900, y: 590, s: 1.2 },
  { f: 380, x: 990, y: 410, s: 1.32 },
  { f: COVER_LEN, x: 1000, y: 400, s: 1.36 },
];

function CoverageScene() {
  const frame = useCurrentFrame();
  const arrive = ramp(frame, 0, 18, EASE_OUT);
  const exit = ramp(frame, 440, 16, EASE_IN_OUT);
  const hover = frame < FREQ_CLICK + 12 ? 1 : keys(frame, [FREQ_CLICK + 12, MORNING_CLICK - 6], [1, 3]);
  const cur = track(frame, [
    { f: 30, x: 1560, y: 1000 },
    { f: TOGGLE_CLICK - 4, x: MONTCLAIR_TOGGLE.x + 2, y: MONTCLAIR_TOGGLE.y + 3 },
    { f: 96, x: MONTCLAIR_TOGGLE.x - 120, y: MONTCLAIR_TOGGLE.y + 200 },
    { f: 140, x: FREQ_WORLD.x - 120, y: FREQ_WORLD.y + 220 },
    { f: FREQ_CLICK - 4, x: FREQ_WORLD.x + 2, y: FREQ_WORLD.y + 3 },
    { f: FREQ_CLICK + 12, x: FREQ_WORLD.x + 10, y: FREQ_WORLD.y + 40 },
    { f: MORNING_CLICK - 4, x: MORNING_WORLD.x, y: MORNING_WORLD.y + 2 },
    { f: 250, x: MORNING_WORLD.x + 60, y: MORNING_WORLD.y + 200 },
    { f: 350, x: SEND_WORLD.x - 120, y: SEND_WORLD.y + 260 },
    { f: SEND_CLICK - 4, x: SEND_WORLD.x + 4, y: SEND_WORLD.y + 4 },
    { f: 430, x: SEND_WORLD.x + 60, y: SEND_WORLD.y + 120 },
  ]);
  const menuOpen = ramp(frame, FREQ_CLICK + 2, 10) * (1 - ramp(frame, MORNING_CLICK + 2, 8));
  const scroll = scrollAt(frame);
  return (
    <AbsoluteFill style={{ opacity: arrive * (1 - exit), filter: arrive < 1 || exit > 0 ? `blur(${Math.max((1 - arrive) * 12, exit * 16)}px)` : undefined, transform: `scale(${lerp(1, 0.94, exit)})` }}>
      <div style={camera(frame, COVER_CAMS)}>
        <div style={{ position: "absolute", left: SHELL.x, top: SHELL.y }}>
          <AppShell active={4} plain railReveal={(i) => ramp(frame, 6 + i * 2, 12)}>
            <div style={{ position: "absolute", left: 0, top: -scroll, width: PAGE.w, height: SCHED.y + SCHED.h + 40, backgroundImage: "radial-gradient(rgba(40, 25, 16, 0.09) 1px, transparent 1.3px)", backgroundSize: "18px 18px" }}>
              <CoveragePage frame={frame} />
              <Menu items={FREQUENCIES} open={menuOpen} hover={hover} selected={frame >= MORNING_CLICK ? 3 : 1} width={FREQ_SELECT.w} style={{ left: FREQ_MENU.x, top: FREQ_MENU.y }} />
            </div>
          </AppShell>
        </div>
        <ClickRing x={MONTCLAIR_TOGGLE.x} y={MONTCLAIR_TOGGLE.y} progress={ramp(frame, TOGGLE_CLICK - 1, 14)} />
        <ClickRing x={FREQ_WORLD.x} y={FREQ_WORLD.y} progress={ramp(frame, FREQ_CLICK - 1, 14)} />
        <ClickRing x={MORNING_WORLD.x} y={MORNING_WORLD.y} progress={ramp(frame, MORNING_CLICK - 1, 14)} />
        <ClickRing x={SEND_WORLD.x} y={SEND_WORLD.y} progress={ramp(frame, SEND_CLICK - 1, 14)} />
        <div style={{ opacity: ramp(frame, 30, 8) * (1 - ramp(frame, 428, 8)) }}>
          <Cursor x={cur.x} y={cur.y} pressed={press(frame, [TOGGLE_CLICK, FREQ_CLICK, MORNING_CLICK, SEND_CLICK])} />
        </div>
      </div>
    </AbsoluteFill>
  );
}

function CoveragePage({ frame }: { frame: number }) {
  const fill = ramp(frame, FILL_AT, 40, EASE_IN_OUT);
  const zones: Zone[] = ZONES.map((z, i) => ({ poly: z.poly, fill: i === MONTCLAIR ? fill : 1 }));
  return (
    <>
      <div style={{ position: "absolute", left: 28, top: 28, display: "flex", alignItems: "center", gap: 16, ...rise(frame, 4) }}>
        <Display size={46}>Coverage</Display>
        <Pill tone="beige" trailing="chevronDown">
          Sunrise Home Care
        </Pill>
      </div>
      <div style={{ position: "absolute", right: 28, top: 34, display: "flex", gap: 8, ...rise(frame, 6) }}>
        <Segmented items={["Map", "List"]} value={0} width={160} />
        <Pill icon="plus" tone="ink">
          Add area
        </Pill>
      </div>

      <div style={{ position: "absolute", left: MAP.x, top: MAP.y, width: MAP.w, height: MAP.h, borderRadius: 24, background: "#ECE2CD", overflow: "hidden", ...rise(frame, 4, { y: 20, dur: 26 }) }}>
        <Streets w={MAP.w} h={MAP.h} reveal={1} step={64} angle={-12} />
        <HalftoneZones width={MAP.w} height={MAP.h} zones={zones} step={11} />
        <svg width={MAP.w} height={MAP.h} style={{ position: "absolute", left: 0, top: 0 }}>
          {ZONES.map((z, i) => (
            <polygon key={z.name} points={z.poly.map((p) => p.join(",")).join(" ")} fill="none" stroke={C.walnut} strokeOpacity={i === MONTCLAIR ? 0.25 + 0.25 * fill : 0.4} strokeWidth={1.6} strokeDasharray={i === MONTCLAIR && fill < 1 ? "6 6" : undefined} strokeLinejoin="round" />
          ))}
        </svg>
        {ZONES.map((z, i) => {
          const c = centroid(z.poly);
          return (
            <div key={z.name} style={{ position: "absolute", left: c.x, top: c.y + (i === MONTCLAIR ? 60 : 0), transform: "translate(-50%, -50%)" }}>
              <Chip tone={i === MONTCLAIR && fill < 0.5 ? "dashed" : "paper"} size={1.15} style={i === MONTCLAIR && fill < 0.5 ? { background: "rgba(255, 252, 241, 0.6)" } : undefined}>
                {z.name}
              </Chip>
            </div>
          );
        })}
        <HomePin frame={frame} at={FILL_AT + 26} x={PIN.x} y={PIN.y} label="Walter H." />
      </div>

      <div style={{ position: "absolute", left: AREAS.x, top: AREAS.y, width: AREAS.w, height: AREAS.h, boxSizing: "border-box", padding: 16, borderRadius: 24, background: C.beige, ...rise(frame, 8, { x: 30, y: 0, dur: 26 }) }}>
        <div style={{ height: 44, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 4px 0 6px" }}>
          <Display size={28}>Service areas</Display>
          <Pill icon="plus" tone="paper" height={36} />
        </div>
        <div style={{ position: "absolute", left: 16, right: 16, top: 16 + 56, display: "flex", flexDirection: "column", gap: 6 }}>
          {AREA_ROWS.map((row, i) => {
            const on = i === MONTCLAIR ? ramp(frame, TOGGLE_CLICK + 2, 10, EASE_IN_OUT) : row.on ? 1 : 0;
            return (
              <div key={row.name} style={{ height: AREAS.rowH, boxSizing: "border-box", padding: "0 16px 0 14px", borderRadius: 16, background: C.paper, display: "flex", alignItems: "center", gap: 12, opacity: lerp(0.6, 1, on), ...rise(frame, 12 + i * 2, { y: 10, dur: 18 }) }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: on > 0.5 ? C.dot : "transparent", border: on > 0.5 ? "none" : "1.5px dashed rgba(40, 25, 16, 0.28)", boxSizing: "border-box", opacity: lerp(0.5, 0.9, on) }} />
                <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 16, color: C.walnut, whiteSpace: "nowrap" }}>{row.name}</span>
                <Chip tone="outline">{row.zip}</Chip>
                <div style={{ flex: 1 }} />
                <Toggle progress={on} />
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ position: "absolute", left: CARE.x, top: CARE.y, width: CARE.w, height: CARE.h, boxSizing: "border-box", padding: 16, borderRadius: 24, background: C.beige, ...rise(frame, 10, { y: 20, dur: 26 }) }}>
        <CaregiverGrid frame={frame} />
      </div>
      <div style={{ position: "absolute", left: RULES.x, top: RULES.y, width: RULES.w, height: RULES.h, boxSizing: "border-box", padding: 20, borderRadius: 24, background: C.beige, ...rise(frame, 12, { y: 20, dur: 26 }) }}>
        <VisitRules frame={frame} />
      </div>
      <div style={{ position: "absolute", left: SCHED.x, top: SCHED.y, width: SCHED.w, height: SCHED.h, boxSizing: "border-box", padding: 24, borderRadius: 24, background: C.paper, border: `1px solid ${C.line}` }}>
        <WeekSchedule frame={frame} />
      </div>
    </>
  );
}

const DAY_W = (CARE.w - 32 - 220) / 7;

function CaregiverGrid({ frame }: { frame: number }) {
  const cell = (v: Avail, k: number): CSSProperties => {
    const p = ramp(frame, SCROLL1.from + 8 + k * 0.7, 12, EASE_OUT);
    return {
      height: 20,
      borderRadius: 6,
      boxSizing: "border-box",
      background: v === "a" ? SAGE : v === "b" ? C.sand3 : "transparent",
      border: v === "o" ? "1.5px dashed rgba(40, 25, 16, 0.2)" : undefined,
      opacity: p * (v === "b" ? 0.7 : 1),
      transform: `scaleX(${lerp(0.4, 1, p)})`,
    };
  };
  return (
    <>
      <div style={{ height: 44, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 4px 0 6px" }}>
        <Display size={28}>Caregivers</Display>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: F.body, fontWeight: 500, fontSize: 12, color: SUB }}>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 14, height: 10, borderRadius: 3, background: SAGE }} />
            Open
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 14, height: 10, borderRadius: 3, background: C.sand3, opacity: 0.7 }} />
            Booked
          </span>
          <Segmented items={["This week", "Next"]} value={0} width={190} height={34} tone="soft" />
        </div>
      </div>
      <div style={{ display: "flex", padding: "14px 16px 8px 236px", fontFamily: F.ui, fontWeight: 600, fontSize: 13, color: SUB }}>
        {DAYS.map((d) => (
          <span key={d.d} style={{ width: DAY_W, textAlign: "center" }}>
            {d.d}
          </span>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {CAREGIVERS.map((cg, r) => (
          <div key={cg.name} style={{ height: 78, boxSizing: "border-box", padding: "0 16px 0 14px", borderRadius: 16, background: C.paper, display: "flex", alignItems: "center" }}>
            <div style={{ width: 222, display: "flex", alignItems: "center", gap: 10 }}>
              <Av label={cg.name.split(" ").map((s) => s[0]).join("")} size={38} tone={cg.tone} />
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 15, color: C.walnut, whiteSpace: "nowrap" }}>{cg.name}</span>
                <span style={{ fontFamily: F.body, fontSize: 12, color: SUB }}>{cg.role}</span>
              </div>
            </div>
            {DAYS.map((d, i) => (
              <div key={d.d} style={{ width: DAY_W, boxSizing: "border-box", padding: "0 4px", display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={cell(cg.am[i], r * 7 + i)} />
                <div style={cell(cg.pm[i], r * 7 + i + 2)} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

const CARE_NEEDS: { label: string; on: boolean }[] = [
  { label: "Mobility", on: true },
  { label: "Medication reminders", on: true },
  { label: "Meals", on: true },
  { label: "Bathing", on: true },
  { label: "Dementia care", on: false },
  { label: "Wound care", on: false },
];

function VisitRules({ frame }: { frame: number }) {
  const morning = frame >= MORNING_CLICK;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ height: 44, display: "flex", alignItems: "center", padding: "0 0 0 2px" }}>
        <Display size={28}>Visit rules</Display>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <Field label="Visit frequency" style={{ width: FREQ_SELECT.w }}>
          <SelectBox value={morning ? "Every morning" : "Weekly"} focused={frame >= FREQ_CLICK && frame < MORNING_CLICK + 4} style={{ background: C.paper }} />
        </Field>
        <Field label="Visit length" style={{ flex: 1 }}>
          <SelectBox value="3 hours" style={{ background: C.paper }} />
        </Field>
      </div>
      <Field label="Care needs">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {CARE_NEEDS.map((n) => (
            <Chip key={n.label} tone={n.on ? "salmon" : "dashed"} size={1.2} icon={n.on ? <Ico name="check" size={13} color={C.salmonText} stroke={2.6} /> : undefined}>
              {n.label}
            </Chip>
          ))}
        </div>
      </Field>
      <div style={{ height: 58, boxSizing: "border-box", padding: "0 16px", borderRadius: 16, background: C.paper, display: "flex", alignItems: "center", gap: 12, fontFamily: F.ui, fontWeight: 500, fontSize: 15, color: C.walnut }}>
        <Ico name="repeat" size={18} />
        Repeats until changed
        <div style={{ flex: 1 }} />
        <Toggle progress={ramp(frame, MORNING_CLICK + 8, 10, EASE_IN_OUT)} />
      </div>
    </div>
  );
}

function WeekSchedule({ frame }: { frame: number }) {
  const sent = ramp(frame, SEND_CLICK + 2, 10);
  const covered = ramp(frame, COVERED_AT, 12);
  const gridH = GRID.head + GRID.hours * GRID.hourH;
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 14, height: 56 }}>
        <Av label="WH" size={48} tone="sand" />
        <Display size={36}>Walter Hayes</Display>
        <Chip tone="outline" size={1.15}>
          7 visits / week
        </Chip>
        <Chip tone="outline" size={1.15}>
          21 hrs
        </Chip>
        <div style={{ opacity: covered, transform: `scale(${lerp(0.9, 1, covered) + 0.05 * pulse(frame, COVERED_AT + 4, 4, 12)})`, transformOrigin: "0 50%" }}>
          <Status tone="sage" icon="check" size={1.1}>
            Every morning covered
          </Status>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ position: "relative", width: SEND_BTN.w, height: SEND_BTN.h, transform: `scale(${1 - 0.05 * pulse(frame, SEND_CLICK - 2, 3, 8)})` }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 999, background: C.ink, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: F.ui, fontWeight: 600, fontSize: 16, color: C.paper, opacity: 1 - sent }}>
            Send to family&rsquo;s agent
            <Ico name="arrowRight" size={16} color={C.paper} stroke={2.2} />
          </div>
          <div style={{ position: "absolute", inset: 0, borderRadius: 999, background: C.salmon, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: F.ui, fontWeight: 600, fontSize: 16, color: C.ink, opacity: sent }}>
            <Ico name="check" size={16} color={C.ink} stroke={2.6} />
            Sent to Agent
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 24, right: 24, top: GRID.top, height: gridH, borderRadius: 18, border: `1px solid ${C.line}`, overflow: "hidden" }}>
        {DAYS.map((d, i) => (
          <div key={d.d} style={{ position: "absolute", left: GRID.gutter + i * GRID_COL, top: 0, width: GRID_COL, height: gridH, borderLeft: `1px solid ${C.line}`, boxSizing: "border-box" }}>
            <div style={{ height: GRID.head, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: F.ui, fontWeight: 600, fontSize: 14, color: C.walnut, borderBottom: `1px solid ${C.line}` }}>
              <span style={{ color: SUB }}>{d.d}</span>
              {d.n}
            </div>
          </div>
        ))}
        {Array.from({ length: GRID.hours }, (_, h) => {
          const hr = GRID.start + h;
          return (
            <div key={h} style={{ position: "absolute", left: 0, right: 0, top: GRID.head + h * GRID.hourH, height: 1, background: h ? C.line : "transparent" }}>
              <span style={{ position: "absolute", left: 12, top: 8, fontFamily: F.body, fontSize: 12, color: C.faint }}>{`${((hr - 1) % 12) + 1} ${hr < 12 ? "AM" : "PM"}`}</span>
            </div>
          );
        })}
        {VISITS.map((v, i) => {
          const p = ramp(frame, VISITS_AT + i * 6, 16, EASE_OUT);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: GRID.gutter + i * GRID_COL + 6,
                top: GRID.head + (8 - GRID.start) * GRID.hourH + 4,
                width: GRID_COL - 12,
                height: 3 * GRID.hourH - 8,
                boxSizing: "border-box",
                padding: 12,
                borderRadius: 14,
                background: v.tone === "salmon" ? C.salmon : SAGE,
                display: "flex",
                flexDirection: "column",
                gap: 8,
                opacity: p,
                transform: `translateY(${(1 - p) * -24}px) scale(${lerp(0.94, 1, p)})`,
                transformOrigin: "50% 0",
              }}
            >
              <Av label={v.label} size={32} tone="paper" />
              <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 15, color: v.tone === "salmon" ? C.walnut : SAGE_TEXT, whiteSpace: "nowrap" }}>{v.cg}</span>
              <span style={{ marginTop: "auto", fontFamily: F.body, fontSize: 12, color: v.tone === "salmon" ? C.salmonText : SAGE_TEXT }}>8:00 &ndash; 11:00</span>
            </div>
          );
        })}
        <div
          style={{
            position: "absolute",
            left: GRID.gutter + 6,
            top: GRID.head + (11 - GRID.start) * GRID.hourH + 4,
            width: GRID_COL - 12,
            height: GRID.hourH - 8,
            boxSizing: "border-box",
            padding: "0 12px",
            borderRadius: 14,
            background: C.ink,
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontFamily: F.ui,
            fontWeight: 600,
            fontSize: 14,
            color: C.paper,
            ...rise(frame, VISITS_AT + 46, { y: -12, dur: 16 }),
          }}
        >
          RN intake
          <span style={{ fontFamily: F.body, fontWeight: 400, fontSize: 12, color: "rgba(255, 252, 241, 0.6)" }}>Amara O.</span>
        </div>
      </div>
    </>
  );
}

/* ─── Match confirmed: the family's agent brings back the plan ────────────── */

const CONFIRM_CLICK = 116;
const DONE_TYPING = 138;
const DONE_AT = 158;
const THREAD = { w: 420, scale: 1.5, bottom: 120 };
const CONFIRM_BTN = { x: 960 - (THREAD.w / 2 - 190) * THREAD.scale, y: 1080 - THREAD.bottom - (12 + 22) * THREAD.scale };

const CONFIRM_CAMS: CameraKey[] = [
  { f: 0, x: 960, y: 560, s: 0.96 },
  { f: 60, x: 960, y: 600, s: 1.0 },
  { f: CONFIRM_CLICK - 10, x: 940, y: 700, s: 1.16 },
  { f: VIDEO4_HOMECARE_FRAMES - CONFIRM_AT, x: 950, y: 640, s: 1.1 },
];

function ConfirmScene() {
  const frame = useCurrentFrame();
  const arrive = ramp(frame, 0, 22, EASE_OUT);
  const cur = track(frame, [
    { f: 84, x: CONFIRM_BTN.x + 240, y: CONFIRM_BTN.y + 200 },
    { f: CONFIRM_CLICK - 4, x: CONFIRM_BTN.x + 4, y: CONFIRM_BTN.y + 4 },
    { f: 150, x: CONFIRM_BTN.x + 80, y: CONFIRM_BTN.y + 140 },
  ]);
  return (
    <AbsoluteFill style={{ opacity: arrive, filter: arrive < 1 ? `blur(${(1 - arrive) * 14}px)` : undefined, transform: `scale(${lerp(1.06, 1, arrive)})` }}>
      <div style={camera(frame, CONFIRM_CAMS)}>
        <div style={{ position: "absolute", left: 960 - THREAD.w / 2, bottom: THREAD.bottom, width: THREAD.w, display: "flex", flexDirection: "column", fontFamily: F.ios, transform: `scale(${THREAD.scale})`, transformOrigin: "50% 100%" }}>
          <Slot frame={frame} at={6} side="center">
            <TimeStamp day="Today" time="7:05 PM" />
          </Slot>
          <Slot frame={frame} at={12} side="in" dur={18}>
            <Bubble>Sunrise Home Care covers Dad&rsquo;s neighborhood and can be there every morning from Saturday.</Bubble>
          </Slot>
          <Slot frame={frame} at={34} side="in" dur={24}>
            <ConfirmCard frame={frame} />
          </Slot>
          <Slot frame={frame} at={DONE_TYPING} until={DONE_AT} side="in" dur={12}>
            <TypingBubble frame={frame} />
          </Slot>
          <Slot frame={frame} at={DONE_AT} side="in" dur={18}>
            <Bubble>Confirmed. Rosa will be there Saturday at 8:00.</Bubble>
          </Slot>
        </div>
        {frame < DONE_TYPING ? <ClickRing x={CONFIRM_BTN.x} y={CONFIRM_BTN.y} progress={ramp(frame, CONFIRM_CLICK - 1, 14)} /> : null}
        <div style={{ opacity: ramp(frame, 84, 8) * (1 - ramp(frame, 140, 10)) }}>
          <Cursor x={cur.x} y={cur.y} pressed={press(frame, [CONFIRM_CLICK])} size={24} />
        </div>
      </div>
    </AbsoluteFill>
  );
}

const MINI = { w: 356, h: 132 };
const MINI_ZONE: Zone[] = [{ poly: [[90, 18], [270, 10], [330, 70], [280, 124], [120, 122], [40, 74]], fill: 1 }];

function ConfirmCard({ frame }: { frame: number }) {
  const done = ramp(frame, CONFIRM_CLICK + 2, 10);
  return (
    <div style={{ width: 380, boxSizing: "border-box", padding: 12, borderRadius: 24, background: C.beige, display: "flex", flexDirection: "column", gap: 10, fontFamily: F.ui }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 4px 0" }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: C.salmon, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Ico name="home" size={20} stroke={1.9} />
        </div>
        <span style={{ fontFamily: F.display, fontWeight: 500, fontSize: 27, lineHeight: "32px", letterSpacing: "-0.02em", color: C.walnut }}>Sunrise Home Care</span>
      </div>
      <div style={{ position: "relative", width: MINI.w, height: MINI.h, borderRadius: 16, overflow: "hidden", background: "#ECE2CD" }}>
        <Streets w={MINI.w} h={MINI.h} reveal={1} step={34} angle={-12} />
        <HalftoneZones width={MINI.w} height={MINI.h} zones={MINI_ZONE} step={8} />
        <div style={{ position: "absolute", left: 196 - 11, top: 58 - 11, width: 22, height: 22, borderRadius: 999, background: C.ink, border: `3px solid ${C.paper}`, boxSizing: "border-box" }} />
        <div style={{ position: "absolute", right: 8, top: 8 }}>
          <Chip tone="paper">Montclair</Chip>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, padding: "8px 6px", borderRadius: 16, background: C.paper }}>
        {DAYS.map((d, i) => (
          <div key={d.d} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, ...rise(frame, 46 + i * 3, { y: 6, dur: 12 }) }}>
            <span style={{ fontWeight: 600, fontSize: 11, color: SUB }}>{d.d}</span>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: VISITS[i].tone === "salmon" ? C.salmon : SAGE, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 11, color: C.walnut }}>{VISITS[i].label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "2px 6px", fontSize: 13, fontWeight: 500, color: C.walnut }}>
        <span>Every morning</span>
        <span style={{ color: SUB }}>8:00 &ndash; 11:00 AM</span>
      </div>
      <ConfirmButton done={done} press={pulse(frame, CONFIRM_CLICK - 2, 3, 8)} pop={pulse(frame, CONFIRM_CLICK + 8, 4, 12)} />
    </div>
  );
}

function ConfirmButton({ done, press: p, pop }: { done: number; press: number; pop: number }) {
  return (
    <div style={{ position: "relative", height: 44 }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 999, background: C.ink, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 15, color: C.paper, opacity: 1 - done, transform: `scale(${1 - 0.05 * p})` }}>
        Confirm care plan
      </div>
      <div style={{ position: "absolute", inset: 0, borderRadius: 999, background: C.live, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontWeight: 600, fontSize: 15, color: "#FFF", opacity: done, transform: `scale(${lerp(0.94, 1, done) + 0.04 * pop})` }}>
        <Ico name="check" size={16} color="#FFF" stroke={2.8} />
        Confirmed &middot; starts Sat
      </div>
    </div>
  );
}