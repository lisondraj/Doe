import { createContext, useContext, type CSSProperties, type ReactNode } from "react";
import { AbsoluteFill, Audio, Easing, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";

import { DotSphere, DotWave, FlowLines, Stage } from "./backdrops";
import { EASE_IN, EASE_IN_OUT, EASE_OUT, blink, camera, fly, keys, lerp, pulse, ramp, typed } from "./motion";
import { C, F } from "./theme";
import { Bubble, Slot, TimeStamp, TypingBubble } from "./imessage";
import { AppShell, Button, Caret, Chip, ClickRing, Cursor, Icon, Label, ShadowsContext, StatusDot, Toggle, type ChipTone, type IconName } from "./ui";

const SCENES = { index: { from: 0, dur: 178 }, code: { from: 148, dur: 104 }, services: { from: 228, dur: 284 }, providers: { from: 494, dur: 238 }, search: { from: 722, dur: 329 } };

/** Scenes are authored on a 1× clock. Up to the end of the code they play PACE× slower, then FAST_PACE× after. */
const PACE = 1.2;
const FAST_PACE = 0.68;
const FAST_FROM = SCENES.services.from;
const pacedExact = (f: number) => (f <= FAST_FROM ? f * PACE : FAST_FROM * PACE + (f - FAST_FROM) * FAST_PACE);
const paced = (f: number) => Math.round(pacedExact(f));
const unpaced = (r: number) => (r <= FAST_FROM * PACE ? r / PACE : FAST_FROM + (r - FAST_FROM * PACE) / FAST_PACE);
const span = (from: number, dur: number) => paced(from + dur) - paced(from);

const SceneStart = createContext(0);
const useSceneFrame = () => {
  const start = useContext(SceneStart);
  return unpaced(useCurrentFrame() + paced(start)) - start;
};

function PacedSequence({ scene, name, children }: { scene: { from: number; dur: number }; name: string; children: ReactNode }) {
  return (
    <Sequence from={paced(scene.from)} durationInFrames={span(scene.from, scene.dur)} name={name}>
      <SceneStart.Provider value={scene.from}>{children}</SceneStart.Provider>
    </Sequence>
  );
}

/** Sofia's new card is part-way through being filled in when the carousel leaves. */
const PROVIDERS_EXIT_AT = 214;

export const VIDEO1_STRUCTURED_FRAMES = paced(SCENES.search.from + SCENES.search.dur);

export function Video1Structured() {
  return (
    <ShadowsContext.Provider value={false}>
      <Sequence from={paced(ASK_AT)} layout="none" name="ONE audio">
        <Audio src={staticFile("video1/ONE.mp3")} />
      </Sequence>
      <Video1StructuredStage />
    </ShadowsContext.Provider>
  );
}

function Video1StructuredStage() {
  const frame = useCurrentFrame();
  const linesIn = ramp(frame, paced(SCENES.services.from), span(SCENES.services.from, 30), EASE_IN_OUT);
  /** Lines hand over to the dot wave as the AI input scene starts. */
  const waveIn = ramp(frame, paced(SCENES.search.from), span(SCENES.search.from, 24), EASE_IN_OUT);
  return (
    <Stage
      backdrop={
        <>
          <div style={{ position: "absolute", inset: 0, opacity: 1 - waveIn }}>
            <FlowLines opacity={0.05 * linesIn} />
          </div>
          <div style={{ position: "absolute", inset: 0, opacity: waveIn }}>
            <DotWave top={0.44} amp={70} />
          </div>
        </>
      }
    >
      <PacedSequence scene={SCENES.index} name="Index sphere">
        <IndexScene />
      </PacedSequence>
      {/* Providers sits under Services so the shared shell cross-fades in place. */}
      <PacedSequence scene={SCENES.providers} name="Providers carousel">
        <ProvidersScene />
      </PacedSequence>
      <PacedSequence scene={SCENES.services} name="Services edit bar">
        <ServicesScene />
      </PacedSequence>
      <PacedSequence scene={SCENES.search} name="Agent search">
        <AgentSearchScene />
      </PacedSequence>
      {/* Sits on top so the hard cut lands on Services already mid-entrance. */}
      <PacedSequence scene={SCENES.code} name="Infrastructure code">
        <CodeScene />
      </PacedSequence>
    </Stage>
  );
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const mix = (a: string, b: string, t: number) => {
  const pa = rgb(a);
  const pb = rgb(b);
  return `rgb(${pa.map((v, i) => Math.round(lerp(v, pb[i], t))).join(", ")})`;
};

/* ─── Index sphere → a vague agent ─────────────────────────────────────────── */

const SPHERE = { x: 960, y: 560, r: 410 };
const SPHERE_AT = 12;
/** The sphere’s dots burst outward and the ground flashes to white, straight into the thread. */
const BURST_AT = 52;
const BURST_DUR = 13;
/** White is fully in just before the last dots clear. */
const WHITE_AT = BURST_AT + 4;
const WHITE_DUR = 8;

const STAMP_AT = WHITE_AT + 4;
const ASK_AT = STAMP_AT + 6;
const AGENT_TYPING_AT = ASK_AT + 24;
const AGENT_AT = AGENT_TYPING_AT + 18;
/** One camera pans down from the thread through the code; the white fades to beige as it goes. */
const PAN_FROM = AGENT_AT + 40;
const INDEX_END = PAN_FROM + 30;

const ASK = "Can you find a pediatric ENT near Mission that takes Harbor Mutual? My son keeps getting ear infections.";
const AGENT_REPLY = "I can’t seem to find any pediatric ENT clinics that take Harbor Mutual near you. You could try calling your insurance.";

function IndexScene() {
  const frame = useSceneFrame();
  const raw = useCurrentFrame();
  if (frame >= INDEX_END) return null;
  const sphereIn = ramp(frame, SPHERE_AT, 26, EASE_IN_OUT);
  /** Both accelerate into the white so the dots are still flying when it lands. */
  const burst = ramp(frame, BURST_AT, BURST_DUR, Easing.bezier(0.35, 0, 0.85, 0.6));
  const zoom = ramp(frame, BURST_AT - 2, BURST_DUR + 2, Easing.bezier(0.5, 0, 0.9, 0.5));
  const white = ramp(frame, WHITE_AT, WHITE_DUR, EASE_IN_OUT);
  const paperOut = ramp(frame, PAN_FROM + 6, 22, EASE_IN_OUT);

  return (
    <AbsoluteFill>
      {burst < 1 ? (
        <div style={{ position: "absolute", inset: 0, opacity: sphereIn, transform: `translateY(${lerp(0, 540 - SPHERE.y, zoom)}px) scale(${lerp(0.92, 1, sphereIn) * lerp(1, 1.6, zoom)})`, transformOrigin: `${SPHERE.x}px ${SPHERE.y}px` }}>
          <DotSphere cx={SPHERE.x} cy={SPHERE.y} radius={SPHERE.r} burst={burst} spin={Math.min(raw, paced(BURST_AT))} />
        </div>
      ) : null}
      {white > 0 ? (
        <>
          <AbsoluteFill style={{ background: C.paper, opacity: white * (1 - paperOut) }} />
          <AbsoluteFill style={{ opacity: white, transform: `translateY(${-panY(frame - PAN_FROM)}px)` }}>
            <AgentThread frame={frame} />
          </AbsoluteFill>
        </>
      ) : null}
    </AbsoluteFill>
  );
}

/** The same thread pieces as the phone scenes, scaled up and floating on the white (no phone). */
const THREAD = { w: 400, scale: 2.2, top: 540 - 14 * 2.2 };
/** Unscaled row heights; the camera drifts down by half of each new row so the newest message stays centred. */
const ASK_ROW_H = 106;
const TYPING_ROW_H = 52;
const REPLY_ROW_H = 106;

function AgentThread({ frame }: { frame: number }) {
  const follow = (ASK_ROW_H / 2 + 14) * ramp(frame, ASK_AT, 20, EASE_IN_OUT) + (TYPING_ROW_H / 2) * ramp(frame, AGENT_TYPING_AT, 16, EASE_IN_OUT) + ((REPLY_ROW_H - TYPING_ROW_H / 2) / 2) * ramp(frame, AGENT_AT, 20, EASE_IN_OUT);
  const drift = lerp(1, 1.04, ramp(frame, STAMP_AT, INDEX_END - STAMP_AT, EASE_IN_OUT));
  return (
    <div
      style={{
        position: "absolute",
        left: 960 - THREAD.w / 2,
        top: THREAD.top,
        width: THREAD.w,
        transform: `translateY(${-follow * THREAD.scale}px) scale(${THREAD.scale * drift})`,
        transformOrigin: "50% 0",
        display: "flex",
        flexDirection: "column",
        fontFamily: F.ios,
      }}
    >
      <Slot frame={frame} at={STAMP_AT} side="center">
        <TimeStamp day="Today" time="9:41 AM" />
      </Slot>
      <Slot frame={frame} at={ASK_AT} side="out" dur={20}>
        <Bubble out>{ASK}</Bubble>
      </Slot>
      <Slot frame={frame} at={AGENT_TYPING_AT} until={AGENT_AT} side="in" dur={14}>
        <TypingBubble frame={frame} />
      </Slot>
      <Slot frame={frame} at={AGENT_AT} side="in" dur={20}>
        <Bubble>{AGENT_REPLY}</Bubble>
      </Slot>
    </div>
  );
}

/* ─── Infrastructure flythrough · Doe’s machine-readable index ─────────────── */

const CODE = { size: 86, lh: 116, x: 400, top: 40 };
/** The camera speeds up off the thread, cruises, then eases to a crawl while the final match is written. */
const PAN_ACCEL = 28;
const PAN_CRUISE_END = 37;
const PAN_SLOW_END = 52;
const PAN_CRAWL = 0.12;
/** Each line of the final match is written as it rises past here, so the end is typed while the camera settles. */
const BUILD_Y = 860;
const BUILD_CPS = 300;
const FILLER_BLOCKS = 2;
const CODE_EXIT_AT = SCENES.services.from - SCENES.code.from;
const CODE_FONT = F.display;
/** The line-number gutter is the Services shell's 64px rail seen this close; the cut pulls the camera back out to the whole shell. */
const CODE_SHELL_S = 3.75;
const GUTTER_W = 64 * CODE_SHELL_S;
const GUTTER_NUM = { size: 46, right: 48 };
const GUTTER_DUR = 10;
/** The gutter starts fading in while the first line is still this far from the top. */
const GUTTER_FROM_Y = 400;
/** After the cut the code keeps easing up at the crawl speed while it shrinks away. */
const exitDrift = (f: number) => PAN_SPEED * PAN_CRAWL * 10 * (1 - Math.exp(-Math.max(0, f) / 10));

/** Doe brown, a touch lighter than walnut. */
const CODE_BROWN = "#4A3324";
const INK = { punct: C.sand3, key: CODE_BROWN, string: C.alert, number: C.dot, keyword: C.dot, fn: CODE_BROWN, comment: C.sand3, regex: C.alert };

const CODE_BLOCKS: string[][] = [
  [
    "// doe://atlantic-pediatric-ent/index/providers/prv_alvarez_m",
    "const provider = {",
    '  "id": "prv_alvarez_m",',
    '  "name": "Dr. Maria Alvarez, MD",',
    '  "specialty": ⟪"pediatric_ent"⟫,',
    '  "board_certified": true,',
    '  "ages": { "min_months": 6, "max_years": 18 },',
    '  ⟪"accepting_new_patients"⟫: true,',
    '  "locations": ["loc_mission_2380"],',
    '  "services": [⟪"ear_tube_insertion"⟫, "tonsillectomy", "hearing_screen"],',
    '  "languages": ["en", "es"],',
    "};",
  ],
  [
    "// synonym + regex matching → canonical tags",
    "const SYNONYMS = {",
    "  ear_tube_insertion: [/ear\\s?tubes?/i, ⟪/tympanostomy/i⟫, /myringotomy/i, /pe\\s?tubes?/i],",
    "  pediatric_ent: [/peds?\\s?ent/i, /pediatric\\s(ear|otolaryngolog)/i, /kids?\\s?ent/i],",
    "  recurrent_otitis_media: [/ear\\s?infections?/i, /otitis/i, /\\baom\\b/i],",
    "  hearing_screen: [/hearing\\s(test|check)/i, /audiogram/i, /tympanometry/i],",
    "};",
  ],
  [
    "{",
    '  "service": "ear_tube_insertion",',
    '  "cpt": ["69436", "69433"],',
    '  "conditions": [⟪"recurrent_otitis_media"⟫, "otitis_media_with_effusion"],',
    '  "setting": "ambulatory_surgery",',
    '  "duration_min": 15,',
    '  "referral_required": false,',
    '  "pre_visit": ["audiogram", "tympanometry"],',
    '  "price": { "self_pay": 2850.00, "estimate_confidence": 0.94 },',
    "}",
  ],
  [
    '"insurance": {',
    '  ⟪"harbor_mutual"⟫: { "in_network": true, "referral": "pcm_required", "copay": 0.00 },',
    '  "harbor_select": { "in_network": true, "referral": "not_required", "copay": 40.00 },',
    '  "blue_shield_ppo": { "in_network": true, "copay": 45.00 },',
    '  "medi_cal": { "in_network": false },',
    "},",
  ],
  [
    "const availability = await slots.find({",
    '  provider: "prv_alvarez_m",',
    '  service: "ear_tube_consult",',
    '  window: { from: "2026-10-14", to: "2026-10-18" },',
    "  min_age_months: 6,",
    "});",
    '// → ["2026-10-14T09:40", "2026-10-15T13:20", "2026-10-17T08:00"]',
  ],
  [
    'ontology.relate("recurrent_otitis_media", "treated_by", "ear_tube_insertion", 0.97);',
    'ontology.relate("ear_tube_insertion", "performed_by", "pediatric_ent", 0.99);',
    'ontology.relate("pediatric_ent", "subspecialty_of", "otolaryngology", 1.00);',
    'ontology.relate("hearing_screen", "precedes", "ear_tube_insertion", 0.82);',
  ],
  [
    "async function match(query, patient) {",
    '  const intent = parse(query);         // "ear tubes" → ear_tube_insertion',
    "  const candidates = index.search({",
    '    specialty: "pediatric_ent",',
    "    services: intent.services,",
    "    insurance: patient.plan,           // harbor_mutual",
    '    near: { zip: "94110", radius_mi: 5 },',
    "    accepting_new_patients: true,",
    "  });",
    "  return rank(candidates, { semantic: 0.45, network: 0.30, availability: 0.25 });",
    "}",
  ],
  [
    "[",
    '  { "clinic": "atlantic_pediatric_ent", "provider": "prv_alvarez_m", ⟪"confidence": 0.98⟫, "next_slot": "Wed 9:40 AM" },',
    '  { "clinic": "twin_peaks_ent_group", "provider": "prv_okafor_d", "confidence": 0.71, "reason": "adult_only" },',
    '  { "clinic": "bernal_heights_clinic", "provider": null, "confidence": 0.12, "reason": "no_ent_service" },',
    "]",
  ],
  ['rules.referral("harbor_mutual", {', '  requires: "pcm_referral",', "  auto_request: true,", "  turnaround_hours: 24,", '  fallback: "point_of_service",', "});"],
];

const BUILD_BLOCK = [
  "// match → the clinic the generic agent couldn’t find",
  'const result = await match("pediatric ENT near Mission, Harbor Mutual, ear tubes", patient);',
  "{",
  '  "clinic": "atlantic_pediatric_ent",',
  '  "provider": "prv_alvarez_m",',
  '  "service": "ear_tube_insertion",',
  '  "insurance": "harbor_mutual",',
  '  "accepting_new_patients": true,',
  '  "confidence": 0.98,',
  '  "next_slot": "2026-10-14T09:40",',
  "}",
];

type CodeLine = { text: string; build?: number; caretUntil?: number };

const unmark = (raw: string) => raw.replace(/[⟪⟫]/g, "");

/** Filler is whole blocks, then the final match. */
const FILLER: CodeLine[] = CODE_BLOCKS.slice(0, FILLER_BLOCKS).flatMap((block) => [...block, ""].map((raw) => ({ text: unmark(raw) })));
const FILLER_ROWS = FILLER.length;
const CODE_LINES: CodeLine[] = [...FILLER, ...BUILD_BLOCK.map((text) => ({ text }))];

const rowTop = (row: number) => 1080 + CODE.top + row * CODE.lh;
const PAN_DIST = rowTop(CODE_LINES.length - 1) - BUILD_Y;
/** Camera offset on the code clock (0 = the moment the pan leaves the thread). */
const panShape = (t: number) => EASE_IN_OUT(clamp01(t / PAN_ACCEL)) * lerp(1, PAN_CRAWL, EASE_IN_OUT(clamp01((t - PAN_CRUISE_END) / (PAN_SLOW_END - PAN_CRUISE_END))));
const PAN_STEP = 0.25;
const PAN_TABLE = (() => {
  const out = [0];
  for (let t = 0; t < CODE_EXIT_AT; t += PAN_STEP) out.push(out[out.length - 1] + PAN_STEP * panShape(t + PAN_STEP / 2));
  return out;
})();
const PAN_SPEED = PAN_DIST / PAN_TABLE[PAN_TABLE.length - 1];
function panY(f: number) {
  const i = Math.min(PAN_TABLE.length - 1, Math.max(0, f) / PAN_STEP);
  const lo = Math.floor(i);
  return PAN_SPEED * lerp(PAN_TABLE[lo], PAN_TABLE[Math.min(lo + 1, PAN_TABLE.length - 1)], i - lo);
}
CODE_LINES.forEach((line, row) => {
  if (row < FILLER_ROWS) return;
  let f = 0;
  while (f < CODE_EXIT_AT && rowTop(row) - panY(f) > BUILD_Y + 30) f += 0.25;
  line.build = f;
});
/** The frame the gutter starts fading in, as the first line nears the top. */
const GUTTER_AT = (() => {
  let f = 0;
  while (f < CODE_EXIT_AT && rowTop(0) - panY(f) > GUTTER_FROM_Y) f += 0.25;
  return f;
})();

CODE_LINES.forEach((line, row) => {
  if (line.build !== undefined) line.caretUntil = CODE_LINES[row + 1]?.build ?? Infinity;
});

const TOKEN = /(\/\/.*$)|("(?:[^"\\]|\\.)*")(?=\s*:)|("(?:[^"\\]|\\.)*")|(\/(?![/\s])(?:[^/\\\n]|\\.)+\/[gimsu]*)|(\b\d+(?:\.\d+)?\b)|(\b(?:const|let|async|await|function|return|true|false|null|new)\b)|(\b[A-Za-z_]\w*(?=\())|(\b[A-Za-z_]\w*(?=:))/g;

function tokenize(text: string) {
  const out: { text: string; color: string; start: number }[] = [];
  let last = 0;
  for (const m of Array.from(text.matchAll(TOKEN))) {
    const at = m.index ?? 0;
    if (at > last) out.push({ text: text.slice(last, at), color: INK.punct, start: last });
    const color = m[1] ? INK.comment : m[2] ? INK.key : m[3] ? INK.string : m[4] ? INK.regex : m[5] ? INK.number : m[6] ? INK.keyword : m[7] ? INK.fn : INK.key;
    out.push({ text: m[0], color, start: at });
    last = at + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last), color: INK.punct, start: last });
  return out;
}

function CodeScene() {
  const frame = useSceneFrame();
  const exited = frame >= CODE_EXIT_AT;
  const cam = exited ? PAN_DIST + exitDrift(frame - CODE_EXIT_AT) : panY(frame);
  const first = Math.max(0, Math.floor((cam - 1080 - CODE.top) / CODE.lh) - 1);
  const count = Math.ceil(1080 / CODE.lh) + 3;
  const gutter = exited ? 1 : ramp(frame, GUTTER_AT, GUTTER_DUR, EASE_IN_OUT);
  const numbersIn = exited ? 1 : ramp(frame, GUTTER_AT + 3, GUTTER_DUR, EASE_IN_OUT);
  const rows = Array.from({ length: count }, (_, k) => first + k).filter((i) => i < CODE_LINES.length);
  const numbers = rows.map((i) => {
    const line = CODE_LINES[i];
    if (gutter <= 0 || (line.build !== undefined && frame < line.build)) return null;
    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: 0,
          opacity: numbersIn,
          width: GUTTER_W - GUTTER_NUM.right,
          top: rowTop(i) - cam,
          height: CODE.lh,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          fontFamily: F.ui,
          fontWeight: 500,
          fontSize: GUTTER_NUM.size,
          color: "rgba(255, 252, 241, 0.5)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {i + 1}
      </div>
    );
  });
  const code = rows.map((i) => <CodeRow key={i} frame={frame} line={CODE_LINES[i]} y={rowTop(i) - cam} />);

  if (exited) {
    const f = frame - CODE_EXIT_AT;
    return (
      <AbsoluteFill style={{ overflow: "hidden", opacity: 1 - ramp(f, 0, 9, EASE_IN_OUT) }}>
        <div style={servicesCam(f)}>
          <div style={{ position: "absolute", left: SERVICES_CAM[0].x - 960 / CODE_SHELL_S, top: 540 - 540 / CODE_SHELL_S, width: 1920, height: 1080, transform: `scale(${1 / CODE_SHELL_S})`, transformOrigin: "0 0" }}>
            {numbers}
            {code}
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {gutter > 0 ? <div style={{ position: "absolute", left: 0, top: 0, width: GUTTER_W, height: 1080, background: C.ink, opacity: gutter }} /> : null}
      {numbers}
      {code}
    </AbsoluteFill>
  );
}

function CodeRow({ frame, line, y }: { frame: number; line: CodeLine; y: number }) {
  const built = line.build === undefined ? line.text : typed(line.text, frame, line.build, BUILD_CPS);
  const typing = line.build !== undefined && built.length > 0 && built.length < line.text.length && frame < (line.caretUntil ?? Infinity);
  const tokens = tokenize(line.text).filter((tk) => tk.start < built.length);

  return (
    <div style={{ position: "absolute", left: CODE.x, top: y, height: CODE.lh, display: "flex", alignItems: "center", whiteSpace: "pre", fontFamily: CODE_FONT, fontWeight: 500, fontSize: CODE.size, letterSpacing: "-0.015em" }}>
      {tokens.map((tk) => (
        <span key={tk.start} style={{ color: tk.color }}>
          {tk.text.slice(0, built.length - tk.start)}
        </span>
      ))}
      {typing ? <span style={{ width: "0.45em", height: CODE.size * 1.05, marginLeft: 2, background: CODE_BROWN }} /> : null}
    </div>
  );
}

/* ─── Services product + edit bar ──────────────────────────────────────────── */

const SHELL = { x: 240, y: 90 };
const EDIT_FOCUS = { x: 1457, y: 322 };
/** Opens on the rail filling the code's gutter, then pulls back to the whole shell. */
const SERVICES_CAM = [
  { f: 0, x: SHELL.x + 960 / CODE_SHELL_S, y: 540, s: CODE_SHELL_S },
  { f: 44, x: 960, y: 540, s: 1.12 },
  { f: 76, x: 960, y: 540, s: 1.12 },
  { f: 116, x: EDIT_FOCUS.x, y: EDIT_FOCUS.y, s: 2.35 },
  { f: 212, x: EDIT_FOCUS.x, y: EDIT_FOCUS.y, s: 2.35 },
  { f: 252, x: 960, y: 540, s: 1 },
];
/** The pull-back leaves already moving, so the code's crawl carries straight into it. */
const PULL_BACK_EASE = Easing.bezier(0.2, 0.3, 0.3, 1);
const servicesCam = (f: number) => camera(f, SERVICES_CAM, f < SERVICES_CAM[1].f ? PULL_BACK_EASE : undefined);
const GRID = { x: 28, y: 158, colW: (908 - 24) / 3, rowH: 210, gap: 12 };
/** Edit panel sits in the page's 28px padding, one grid gap to the right of the cards. */
const PANEL_X = GRID.x + 3 * GRID.colW + 3 * GRID.gap;
const PANEL = { x: PANEL_X, y: 28, w: 1364 - 28 - PANEL_X, h: 876 - 56 };
/** Rail "Providers" icon in world space: shell origin + rail center + fourth icon. */
const RAIL_PROVIDERS = { x: SHELL.x + 32, y: SHELL.y + 473 };
const HANDOFF_AT = SCENES.providers.from - SCENES.services.from;
const SECOND_PICK_AT = 61;

type Service = { name: string; price: string; icon: IconName; chips: { label: string; tone: ChipTone }[]; off?: boolean };

const SERVICES: Service[] = [
  { name: "New Patient Visit", price: "$225", icon: "user", chips: [{ label: "Tue", tone: "outline" }] },
  {
    name: "Ear Tube Consult",
    price: "$225",
    icon: "ear",
    chips: [
      { label: "Referral", tone: "outline" },
      { label: "Tue", tone: "outline" },
    ],
  },
  {
    name: "Tonsils and Adenoids",
    price: "$225",
    icon: "pill",
    chips: [
      { label: "Referral", tone: "outline" },
      { label: "Oct 21", tone: "outline" },
    ],
  },
  { name: "Hearing Test", price: "$140", icon: "headset", chips: [{ label: "Today", tone: "green" }] },
  {
    name: "Ear Tube Surgery",
    price: "$2,850",
    icon: "plus",
    chips: [
      { label: "Prior auth", tone: "salmon" },
      { label: "Request only", tone: "outline" },
    ],
  },
  {
    name: "Tongue-Tie Release",
    price: "$395",
    icon: "doc",
    chips: [
      { label: "Self-pay only", tone: "ink" },
      { label: "Wed", tone: "outline" },
    ],
  },
  { name: "Earwax Removal", price: "$95", icon: "clock", chips: [{ label: "Today", tone: "green" }] },
  { name: "Swim Earplugs", price: "$75", icon: "shield", chips: [{ label: "Self-pay only", tone: "neutral" }] },
  { name: "Hearing Aid Fitting", price: "$1,800", icon: "headset", chips: [{ label: "Hidden from agents", tone: "neutral" }], off: true },
];

function ServicesScene() {
  const frame = useSceneFrame();
  const cam = servicesCam(frame);
  const enter = ramp(frame, 4, 20, EASE_IN_OUT);
  const leave = ramp(frame, HANDOFF_AT + 2, 14, EASE_IN_OUT);
  const move = ramp(frame, -24, 56, EASE_IN_OUT);
  const moveSecond = ramp(frame, 42, 14, EASE_IN_OUT);
  const panel = ramp(frame, 40, 24);
  const selected = [frame >= 39 ? 1 : -1, frame >= SECOND_PICK_AT ? 4 : -1];
  const toRail = ramp(frame, 234, 28, EASE_IN_OUT);
  const railClick = 262;

  return (
    <AbsoluteFill style={{ opacity: 1 - leave }}>
      <div style={cam}>
        <div style={{ position: "absolute", left: SHELL.x, top: SHELL.y }}>
          <AppShell active={frame >= railClick ? 3 : 2} railReveal={(i) => ramp(frame, 10 + i * 2, 12, EASE_OUT)}>
            <ServicesMain selected={selected} />
            <div
              style={{
                position: "absolute",
                left: PANEL.x,
                top: PANEL.y,
                width: PANEL.w,
                height: PANEL.h,
                borderRadius: 22,
                boxSizing: "border-box",
                border: "1.5px dashed rgba(40, 25, 16, 0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: F.ui,
                fontSize: 16,
                color: C.muted,
                opacity: 1 - panel,
              }}
            >
              Select a service to edit
            </div>
            <div style={{ position: "absolute", left: PANEL.x, top: PANEL.y, width: PANEL.w, height: PANEL.h, opacity: panel, transform: `translateX(${(1 - panel) * 80}px)` }}>
              <EditPanel frame={frame} />
            </div>
            {enter < 1 ? <div style={{ position: "absolute", inset: 0, background: C.beige, opacity: 1 - enter }} /> : null}
          </AppShell>
        </div>
        <div style={{ opacity: 1 - ramp(frame, 70, 10) }}>
          <Cursor x={lerp(1580, 790, move)} y={lerp(lerp(1100, 372, move), 594, moveSecond)} pressed={Math.max(pulse(frame, 36, 3, 6), pulse(frame, SECOND_PICK_AT - 3, 3, 6))} />
        </div>
        <ClickRing x={RAIL_PROVIDERS.x} y={RAIL_PROVIDERS.y} progress={ramp(frame, railClick + 1, 16)} />
        <div style={{ opacity: ramp(frame, 232, 8) }}>
          <Cursor x={lerp(1500, RAIL_PROVIDERS.x, toRail)} y={lerp(1020, RAIL_PROVIDERS.y, toRail)} pressed={pulse(frame, railClick, 3, 6)} />
        </div>
      </div>
    </AbsoluteFill>
  );
}

function ServicesMain({ selected }: { selected: number[] }) {
  return (
    <>
      <div style={{ position: "absolute", left: 28, top: 28, fontFamily: F.display, fontWeight: 500, fontSize: 46, lineHeight: "50px", letterSpacing: "-0.025em", color: C.walnut }}>Services</div>
      <div style={{ position: "absolute", left: 28, top: 34, width: 908, display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <div style={{ display: "flex", height: 38, padding: 3, gap: 2, borderRadius: 999, boxSizing: "border-box", background: C.beige }}>
          <div style={{ width: 40, borderRadius: 999, background: C.paper, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="grid" size={15} />
          </div>
          <div style={{ width: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="list" size={15} color={C.muted} />
          </div>
        </div>
        <div style={{ width: 38, height: 38, borderRadius: 999, background: C.beige, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="search" size={16} />
        </div>
        <Button height={38} icon={<Icon name="plus" size={14} color={C.paper} />} style={{ fontSize: 14 }}>
          Add service
        </Button>
      </div>
      <div style={{ position: "absolute", left: 28, top: 98, width: 908, height: 40, display: "flex", gap: 10 }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", padding: 4, borderRadius: 999, boxSizing: "border-box", background: C.beige }}>
          {[
            ["All", "9"],
            ["Ears", "4"],
            ["Throat", "2"],
            ["Hearing", "2"],
            ["General", "1"],
          ].map(([label, count], i) => (
            <div
              key={label}
              style={{
                flex: 1,
                height: 32,
                borderRadius: 999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                background: i === 0 ? C.paper : "transparent",
                fontFamily: F.ui,
                fontWeight: 500,
                fontSize: 14,
                color: i === 0 ? C.walnut : C.muted,
              }}
            >
              {label}
              <span style={{ fontSize: 13, color: C.faint }}>{count}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 16px", borderRadius: 999, background: C.beige, fontFamily: F.ui, fontWeight: 500, fontSize: 14, color: C.walnut }}>
          <span style={{ color: C.muted }}>Insurance</span>
          <Toggle on />
          <span>Self-pay prices</span>
        </div>
      </div>
      {SERVICES.map((service, i) => (
        <ServiceCard key={service.name} service={service} hue={SERVICE_HUES[i]} selected={selected.includes(i)} style={{ left: GRID.x + (i % 3) * (GRID.colW + GRID.gap), top: GRID.y + Math.floor(i / 3) * (GRID.rowH + GRID.gap) }} />
      ))}
    </>
  );
}

/** Doe's secondary hues (peach, sage, sand), scattered across the services so no pattern repeats. */
const SERVICE_HUES = [C.salmon, "#D6DEC6", C.sand2, C.sand2, C.salmon, "#D6DEC6", "#D6DEC6", C.salmon, C.sand2];

function ServiceCard({ service, hue, selected, style }: { service: Service; hue: string; selected: boolean; style: CSSProperties }) {
  return (
    <div
      style={{
        position: "absolute",
        width: GRID.colW,
        height: GRID.rowH,
        boxSizing: "border-box",
        padding: 18,
        borderRadius: 18,
        display: "flex",
        flexDirection: "column",
        background: service.off ? C.beige : C.paper,
        border: selected ? `1.5px solid ${C.walnut}` : `1px solid ${C.line}`,
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ width: 34, height: 34, borderRadius: 999, background: hue }} />
        <Toggle on={!service.off} />
      </div>
      <div style={{ marginTop: "auto", fontFamily: F.ui, fontWeight: 600, fontSize: 16, color: service.off ? C.muted : C.walnut }}>{service.name}</div>
      <div style={{ fontFamily: F.display, fontWeight: 500, fontSize: 30, lineHeight: "36px", letterSpacing: "-0.02em", color: service.off ? C.faint : C.walnut }}>{service.price}</div>
      <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
        {service.chips.map((chip) => (
          <Chip key={chip.label} tone={chip.tone}>
            {chip.label}
          </Chip>
        ))}
      </div>
    </div>
  );
}

function EditPanel({ frame }: { frame: number }) {
  return (
    <div style={{ position: "absolute", inset: 0, boxSizing: "border-box", padding: 23, borderRadius: 22, background: C.ink, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 34 }}>
        <div style={{ fontFamily: F.display, fontWeight: 500, fontSize: 24, letterSpacing: "-0.02em", color: C.paper }}>{frame >= SECOND_PICK_AT ? 2 : 1} selected</div>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(255, 252, 241, 0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="x" size={16} color={C.paper} />
        </div>
      </div>
      <EditCard frame={frame} />
      <div style={fly(frame, { at: SECOND_PICK_AT, y: 24, dur: 18, blur: 0 })}>
        <SurgeryEditCard />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          height: 44,
          padding: "0 16px",
          borderRadius: 14,
          background: "rgba(255, 252, 241, 0.08)",
          fontFamily: F.ui,
          fontSize: 15,
          color: C.paper,
          ...fly(frame, { at: 214, y: 12, dur: 16, blur: 0 }),
        }}
      >
        <StatusDot color={C.live} />
        Saved · live for agents now
      </div>
      <div style={{ marginTop: "auto", display: "flex", gap: 10 }}>
        <Button tone="salmon" style={{ flex: 1, fontSize: 15 }}>
          Save changes
        </Button>
        <Button tone="outline" style={{ color: C.paper, border: "1px solid rgba(255, 252, 241, 0.2)", fontSize: 15 }}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

const NEW_PRICE = "$245";

function EditCard({ frame }: { frame: number }) {
  const focused = frame >= 134;
  const selectAll = frame >= 140 && frame < 146;
  const typing = frame >= 146;
  const value = typing ? typed(NEW_PRICE, frame, 146, 9) : "$225";
  const seg = ramp(frame, 178, 14, EASE_IN_OUT);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: 18, borderRadius: 18, background: C.paper }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 34, height: 34, borderRadius: 999, background: SERVICE_HUES[1], flexShrink: 0 }} />
          <div style={{ fontFamily: F.display, fontWeight: 500, fontSize: 26, lineHeight: "32px", letterSpacing: "-0.02em", color: C.walnut }}>Ear Tube Consult</div>
        </div>
        <div style={{ marginTop: 8 }}>
          <Icon name="x" size={14} color="rgba(40, 25, 16, 0.4)" />
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <EditField label="Self-pay">
          <div style={{ height: 40, display: "flex", alignItems: "center", padding: "0 12px", borderRadius: 10, boxSizing: "border-box", background: C.paper, border: `1.5px solid ${focused ? C.walnut : C.line2}` }}>
            <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 15, color: C.walnut, background: selectAll ? "rgba(252, 207, 184, 0.9)" : "transparent", borderRadius: 3 }}>{value}</span>
            {focused ? <Caret height={18} width={1.5} visible={typing && frame < 166 ? 1 : blink(frame)} /> : null}
          </div>
        </EditField>
        <EditField label="Insurance">
          <SelectBox value="14 plans" />
        </EditField>
        <EditField label="Length">
          <SelectBox value="30 min" />
        </EditField>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <Label style={{ fontSize: 12 }}>Referral</Label>
        <div style={{ position: "relative", display: "flex", height: 36, padding: 3, borderRadius: 10, boxSizing: "border-box", background: C.beige }}>
          <div style={{ position: "absolute", top: 3, bottom: 3, left: `calc(3px + ${seg} * (100% - 6px) / 3)`, width: "calc((100% - 6px) / 3)", borderRadius: 8, background: C.paper }} />
          {["Never", "Some plans", "Always"].map((label, i) => (
            <div
              key={label}
              style={{ position: "relative", flex: 1, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.ui, fontWeight: 500, fontSize: 13, color: Math.round(seg) === i ? C.walnut : "rgba(40, 25, 16, 0.48)" }}
            >
              {label}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6, height: 28, paddingTop: 2 }}>
          {[
            { label: "BlueChoice", at: 194 },
            { label: "Harbor Mutual", at: 202 },
          ].map((chip) => (
            <div key={chip.label} style={fly(frame, { at: chip.at, y: 6, scale: 0.8, dur: 14, blur: 0 })}>
              <Chip tone="salmon" trailing={<Icon name="x" size={10} color={C.salmonText} stroke={2.2} />}>
                {chip.label}
              </Chip>
            </div>
          ))}
          <div style={fly(frame, { at: 208, y: 6, scale: 0.8, dur: 14, blur: 0 })}>
            <Chip tone="dashed">Add plan</Chip>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Second selection: same edit card layout, settled values. */
function SurgeryEditCard() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: 18, borderRadius: 18, background: C.paper }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 34, height: 34, borderRadius: 999, background: SERVICE_HUES[4], flexShrink: 0 }} />
          <div style={{ fontFamily: F.display, fontWeight: 500, fontSize: 26, lineHeight: "32px", letterSpacing: "-0.02em", color: C.walnut }}>Ear Tube Surgery</div>
        </div>
        <div style={{ marginTop: 8 }}>
          <Icon name="x" size={14} color="rgba(40, 25, 16, 0.4)" />
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <EditField label="Self-pay">
          <div style={{ height: 40, display: "flex", alignItems: "center", padding: "0 12px", borderRadius: 10, boxSizing: "border-box", background: C.paper, border: `1.5px solid ${C.line2}` }}>
            <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 15, color: C.walnut }}>$2,850</span>
          </div>
        </EditField>
        <EditField label="Insurance">
          <SelectBox value="9 plans" />
        </EditField>
        <EditField label="Length">
          <SelectBox value="60 min" />
        </EditField>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <Label style={{ fontSize: 12 }}>Referral</Label>
        <div style={{ position: "relative", display: "flex", height: 36, padding: 3, borderRadius: 10, boxSizing: "border-box", background: C.beige }}>
          <div style={{ position: "absolute", top: 3, bottom: 3, left: "calc(3px + 2 * (100% - 6px) / 3)", width: "calc((100% - 6px) / 3)", borderRadius: 8, background: C.paper }} />
          {["Never", "Some plans", "Always"].map((label, i) => (
            <div key={label} style={{ position: "relative", flex: 1, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.ui, fontWeight: 500, fontSize: 13, color: i === 2 ? C.walnut : "rgba(40, 25, 16, 0.48)" }}>
              {label}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6, height: 28, paddingTop: 2 }}>
          <Chip tone="salmon">Prior auth</Chip>
          <Chip tone="outline">Request only</Chip>
        </div>
      </div>
    </div>
  );
}

function EditField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
      <Label style={{ fontSize: 12 }}>{label}</Label>
      {children}
    </div>
  );
}

function SelectBox({ value }: { value: string }) {
  return (
    <div style={{ height: 40, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px", borderRadius: 10, boxSizing: "border-box", background: C.beige }}>
      <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 15, color: C.walnut }}>{value}</span>
      <Icon name="chevronDown" size={12} color="rgba(40, 25, 16, 0.48)" />
    </div>
  );
}

/* ─── Providers carousel (Paper: Pulse 03a General Info) ───────────────────── */

type Provider = { name: string; tag: string; type: string; role: string; tile: string; facts: [string, string][] };

const PROVIDERS: Provider[] = [
  {
    name: "Priya Raman",
    tag: "AuD",
    type: "Audiology",
    role: "Audiologist",
    tile: "#E9DCC7",
    facts: [
      ["Specialty", "Audiology"],
      ["Clinic", "Mission"],
      ["In practice", "8 years"],
      ["Speaks", "English, Tamil"],
      ["Plans", "11 accepted"],
      ["NPI", "1639204871"],
    ],
  },
  {
    name: "Dr. Daniel Reyes",
    tag: "MD",
    type: "Pediatric ENT",
    role: "Staff Physician",
    tile: "#E9DCC7",
    facts: [
      ["Specialty", "Pediatric ENT"],
      ["Clinic", "Mission"],
      ["In practice", "15 years"],
      ["Speaks", "English, Spanish"],
      ["Plans", "14 accepted"],
      ["NPI", "1902837465"],
    ],
  },
  {
    name: "Dr. Maya Okafor",
    tag: "MD",
    type: "Otolaryngology",
    role: "Staff Physician",
    tile: "#F7DCCB",
    facts: [
      ["Specialty", "Otolaryngology"],
      ["Clinic", "Mission"],
      ["In practice", "12 years"],
      ["Speaks", "English +2"],
      ["Plans", "9 accepted"],
      ["NPI", "1487220391"],
    ],
  },
  {
    name: "Dr. Jun Lee",
    tag: "MD",
    type: "Head & neck surgery",
    role: "Surgeon",
    tile: "#F7DCCB",
    facts: [
      ["Specialty", "Head & neck"],
      ["Clinic", "Mission"],
      ["In practice", "18 years"],
      ["Speaks", "English, Korean"],
      ["Plans", "10 accepted"],
      ["NPI", "1558329014"],
    ],
  },
  {
    name: "Dr. Ruth Chen",
    tag: "MD",
    type: "Laryngology",
    role: "Staff Physician",
    tile: "#F7DCCB",
    facts: [
      ["Specialty", "Laryngology"],
      ["Clinic", "Sunset"],
      ["In practice", "11 years"],
      ["Speaks", "English, Mandarin"],
      ["Plans", "9 accepted"],
      ["NPI", "1720493386"],
    ],
  },
  {
    name: "Dr. Omar Haddad",
    tag: "MD",
    type: "Otology",
    role: "Staff Physician",
    tile: "#E9DCC7",
    facts: [
      ["Specialty", "Otology"],
      ["Clinic", "Sunset"],
      ["In practice", "7 years"],
      ["Speaks", "English, Arabic"],
      ["Plans", "8 accepted"],
      ["NPI", "1093847562"],
    ],
  },
  {
    name: "Dr. Lena Park",
    tag: "AuD",
    type: "Pediatric audiology",
    role: "Audiologist",
    tile: "#E9DCC7",
    facts: [
      ["Specialty", "Audiology"],
      ["Clinic", "Noe Valley"],
      ["In practice", "6 years"],
      ["Speaks", "English, Korean"],
      ["Plans", "10 accepted"],
      ["NPI", "1265093847"],
    ],
  },
];

/** Added live through "Add Provider", so she isn't in the list yet. */
const NEW_PROVIDER: Provider = {
  name: "Dr. Sofia Alvarez",
  tag: "DO",
  type: "Allergy",
  role: "Staff Physician",
  tile: "#F7DCCB",
  facts: [
    ["Specialty", "Allergy"],
    ["Clinic", "Noe Valley"],
    ["In practice", "9 years"],
    ["Speaks", "English, Spanish"],
    ["Plans", "12 accepted"],
    ["NPI", "1376540298"],
  ],
};

const CAROUSEL = { x: 40, focusTop: 258, rowH: 64, cardH: 340, gap: 8, width: 840 };
const ROW_TONES = { focus: C.beige, near: "#FAF6EC", far: "#F6F0E2" };
const ABOVE = { at: [0, 1, 2, 2.7], opacity: [1, 0.7, 0.35, 0] };
const BELOW = { at: [0, 1, 2, 3, 3.7], opacity: [1, 0.7, 0.4, 0.2, 0] };

/** Item tops for a fractional focus index, keeping the focused card's center fixed. */
function carouselLayout(items: { height: number; gap: number }[], focus: number) {
  const centers: number[] = [];
  let y = 0;
  for (const item of items) {
    centers.push(y + item.height / 2);
    y += item.height + item.gap;
  }
  const i0 = Math.min(items.length - 1, Math.floor(focus));
  const i1 = Math.min(items.length - 1, i0 + 1);
  const anchor = lerp(centers[i0], centers[i1], focus - i0);
  const shift = CAROUSEL.focusTop + CAROUSEL.cardH / 2 - anchor;
  return items.map((item, i) => centers[i] - item.height / 2 + shift);
}

/** The blank card is inserted under Maya Okafor (index 2). */
const NEW_SLOT = 3;
/** The wave runs vertically in the space right of the list and fades out as it reaches the cards. */
const WAVE_SIDE = { x: CAROUSEL.x + CAROUSEL.width - 160, w: 1364 - (CAROUSEL.x + CAROUSEL.width - 160) };
const ADD_CLICK_AT = 100;
const NAME_CLICK_AT = 138;
const ADD_BUTTON = { x: SHELL.x + 64 + 813, y: SHELL.y + 12 + 65 };
const NAME_FIELD = { x: SHELL.x + 64 + CAROUSEL.x + 308 + 120, y: SHELL.y + 12 + CAROUSEL.focusTop + 90 };

function ProvidersScene() {
  const frame = useSceneFrame();
  const insert = ramp(frame, ADD_CLICK_AT + 4, 30, EASE_IN_OUT);
  const focus = keys(frame, [40, 66], [1, 2]) + insert;
  const providerD = (i: number) => (i < NEW_SLOT ? i - focus : i + 1 - focus - (1 - insert));
  const rowHeight = (d: number) => lerp(CAROUSEL.cardH, CAROUSEL.rowH, Math.min(1, Math.abs(d)));
  const items = [
    ...PROVIDERS.slice(0, NEW_SLOT).map((_, i) => ({ height: rowHeight(providerD(i)), gap: CAROUSEL.gap })),
    { height: CAROUSEL.cardH * insert, gap: CAROUSEL.gap * insert },
    ...PROVIDERS.slice(NEW_SLOT).map((_, j) => ({ height: rowHeight(providerD(NEW_SLOT + j)), gap: CAROUSEL.gap })),
  ];
  const tops = carouselLayout(items, focus);
  const itemIndex = (i: number) => (i < NEW_SLOT ? i : i + 1);
  const cam = camera(frame, [
    { f: 0, x: 960, y: 540, s: 1 },
    { f: 24, x: 960, y: 540, s: 1 },
    { f: 84, x: 900, y: 440, s: 1.12 },
    { f: 104, x: 900, y: 440, s: 1.12 },
    { f: 152, x: 840, y: 540, s: 1.2 },
    { f: 234, x: 830, y: 548, s: 1.25 },
  ]);
  const leave = ramp(frame, PROVIDERS_EXIT_AT, 18, EASE_IN);
  const waveIn = ramp(frame, 10, 40, EASE_IN_OUT);
  const startFocus = 1;
  const toAdd = ramp(frame, 74, 24, EASE_IN_OUT);
  const toName = ramp(frame, 110, 26, EASE_IN_OUT);

  return (
    <AbsoluteFill>
      <div style={cam}>
        <div style={{ position: "absolute", left: SHELL.x, top: SHELL.y, opacity: 1 - leave, transform: `translateY(${-80 * leave}px)` }}>
          <AppShell active={3} plain>
            <div style={{ position: "absolute", left: WAVE_SIDE.x, top: 0, width: WAVE_SIDE.w, height: 876, opacity: waveIn }}>
              <DotWave width={WAVE_SIDE.w} height={876} top={0.05} amp={50} vertical fade={0.45} />
            </div>
            <div style={fly(frame, { at: 6, y: 16, dur: 20, blur: 0 })}>
              <ProvidersHeader press={pulse(frame, ADD_CLICK_AT, 3, 8)} />
            </div>
            <div style={{ position: "absolute", left: CAROUSEL.x, top: 0, width: CAROUSEL.width, height: 876 }}>
              {PROVIDERS.map((provider, i) => (
                <CarouselItem key={provider.name} provider={provider} d={providerD(i)} top={tops[itemIndex(i)]} height={items[itemIndex(i)].height} enter={ramp(frame, 10 + Math.abs(i - startFocus) * 4, 22)} />
              ))}
              <NewProviderCard frame={frame} top={tops[NEW_SLOT]} height={items[NEW_SLOT].height} open={insert} />
            </div>
            <div style={fly(frame, { at: 22, y: 12, dur: 18, blur: 0 })}>
              <ViewToggle />
            </div>
          </AppShell>
        </div>
        <div style={{ opacity: ramp(frame, 72, 8) * (1 - ramp(frame, NAME_CLICK_AT + 10, 10)) }}>
          <Cursor x={lerp(lerp(1480, ADD_BUTTON.x, toAdd), NAME_FIELD.x, toName)} y={lerp(lerp(980, ADD_BUTTON.y, toAdd), NAME_FIELD.y, toName)} pressed={Math.max(pulse(frame, ADD_CLICK_AT, 3, 6), pulse(frame, NAME_CLICK_AT, 3, 6))} />
        </div>
      </div>
    </AbsoluteFill>
  );
}

type TypedField = { label: string; text: string; at: number; cps: number };

const NEW_TYPING: { name: TypedField; fields: TypedField[] } = {
  name: { label: "Name", text: NEW_PROVIDER.name, at: 142, cps: 24 },
  fields: [
    { label: "Credential", text: NEW_PROVIDER.tag, at: 184, cps: 20 },
    { label: "Specialty", text: NEW_PROVIDER.type, at: 190, cps: 26 },
    { label: "Clinic", text: "Noe Valley", at: 216, cps: 22 },
    { label: "In practice", text: "9 years", at: 999, cps: 20 },
    { label: "Plans", text: "12 accepted", at: 999, cps: 20 },
    { label: "NPI", text: "1376540298", at: 999, cps: 20 },
  ],
};
const AGENTS_TOGGLE_AT = 168;

/** Blank card opened by "Add Provider"; Sofia's details are typed into its fields. */
function NewProviderCard({ frame, top, height, open }: { frame: number; top: number; height: number; open: number }) {
  if (open <= 0.001) return null;
  const content = clamp01((open - 0.55) / 0.4);
  const name = typed(NEW_TYPING.name.text, frame, NEW_TYPING.name.at, NEW_TYPING.name.cps);
  const started = [NEW_TYPING.name, ...NEW_TYPING.fields].filter((f) => frame >= f.at);
  const active = frame >= NAME_CLICK_AT ? (started[started.length - 1] ?? NEW_TYPING.name) : null;
  const caret = (field: TypedField, size: number) =>
    active === field ? <Caret height={size} width={size > 24 ? 2.5 : 1.5} visible={frame >= field.at && typed(field.text, frame, field.at, field.cps).length < field.text.length ? 1 : blink(frame)} /> : null;
  const agentsIn = ramp(frame, AGENTS_TOGGLE_AT - 6, 10);
  const agentsOn = ramp(frame, AGENTS_TOGGLE_AT + 4, 10, EASE_IN_OUT);

  return (
    <div style={{ position: "absolute", left: 0, top, width: CAROUSEL.width, height, borderRadius: 24, overflow: "hidden", background: ROW_TONES.focus, opacity: Math.min(1, open * 1.6) }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: CAROUSEL.width, height: CAROUSEL.cardH, opacity: content, transform: `translateY(${(1 - content) * 10}px)` }}>
        <div style={{ position: "absolute", left: 20, top: 20, width: 260, height: 298, borderRadius: 16, background: C.paper, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <div style={{ width: 52, height: 52, borderRadius: 999, background: C.beige, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="plus" size={20} stroke={2} />
          </div>
          <div style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 14, color: C.muted }}>Add photo</div>
        </div>
        <div style={{ position: "absolute", left: 308, top: 24, right: 22, bottom: 20, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 24 }}>
            <div style={{ fontFamily: F.body, fontWeight: 500, fontSize: 13, color: C.muted }}>New provider</div>
            <Icon name="x" size={14} color="rgba(40, 25, 16, 0.4)" />
          </div>
          <div style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px", borderRadius: 14, background: C.paper }}>
            <div style={{ display: "flex", alignItems: "center", whiteSpace: "nowrap" }}>
              <span style={{ fontFamily: F.display, fontWeight: 500, fontSize: 34, letterSpacing: "-0.02em", color: name ? C.walnut : "rgba(40, 25, 16, 0.3)" }}>{name || (active ? "" : "Full name")}</span>
              {caret(NEW_TYPING.name, 34)}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, opacity: agentsIn, transform: `translateX(${(1 - agentsIn) * 8}px)` }}>
              <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 14, color: agentsOn > 0.5 ? C.walnut : C.muted }}>Accepting Agents</span>
              <Toggle progress={agentsOn} />
            </div>
          </div>
          <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 8 }}>
            {NEW_TYPING.fields.map((field) => (
              <div key={field.label} style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 3, padding: "0 14px", borderRadius: 14, background: C.paper }}>
                <div style={{ fontFamily: F.body, fontWeight: 500, fontSize: 12, lineHeight: "16px", color: "rgba(40, 25, 16, 0.5)" }}>{field.label}</div>
                <div style={{ height: 20, display: "flex", alignItems: "center", fontFamily: F.ui, fontWeight: 500, fontSize: 15, lineHeight: "20px", color: C.walnut, whiteSpace: "nowrap" }}>
                  {typed(field.text, frame, field.at, field.cps)}
                  {caret(field, 17)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProvidersHeader({ press = 0 }: { press?: number }) {
  return (
    <div style={{ position: "absolute", left: 40, top: 40, width: CAROUSEL.width, height: 50, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ fontFamily: F.display, fontWeight: 500, fontSize: 46, lineHeight: "50px", letterSpacing: "-0.025em", color: C.walnut }}>Providers</div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 38, height: 38, borderRadius: 999, background: "rgba(40, 25, 16, 0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="search" size={16} stroke={2} />
        </div>
        <div style={{ display: "flex", alignItems: "center", height: 38, padding: "0 16px 0 12px", gap: 6, borderRadius: 999, background: C.ink, transform: `scale(${1 - 0.08 * press})` }}>
          <Icon name="plus" size={14} color={C.paper} stroke={2} />
          <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 14, lineHeight: "18px", color: C.paper }}>Add Provider</span>
        </div>
      </div>
    </div>
  );
}

function ViewToggle() {
  return (
    <div
      style={{ position: "absolute", left: 40, top: 824, width: 160, height: 38, boxSizing: "border-box", display: "flex", alignItems: "center", gap: 2, padding: 4, borderRadius: 999, background: C.paper, border: "1px solid rgba(40, 25, 16, 0.09)" }}
    >
      <div style={{ display: "flex", alignItems: "center", height: 30, padding: "0 13px 0 10px", gap: 6, borderRadius: 999, background: C.ink }}>
        <Icon name="grid" size={14} color={C.paper} stroke={1.6} />
        <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 13, lineHeight: "16px", color: C.paper }}>Cards</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", height: 30, padding: "0 13px 0 10px", gap: 6, borderRadius: 999 }}>
        <Icon name="list" size={14} color="rgba(40, 25, 16, 0.62)" stroke={1.8} />
        <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 13, lineHeight: "16px", color: "rgba(40, 25, 16, 0.62)" }}>List</span>
      </div>
    </div>
  );
}

/** Row and card geometry from the Paper carousel; the tile and name morph between the two. */
const MORPH = { tile: { row: { x: 22, y: 8, w: 48, h: 48, r: 12 }, card: { x: 20, y: 20, w: 260, h: 298, r: 16 } }, name: { row: { x: 84, y: 16, scale: 28 / 40 }, card: { x: 308, y: 28, scale: 1 } } };

function CarouselItem({ provider, d, top, height, enter }: { provider: Provider; d: number; top: number; height: number; enter: number }) {
  const ad = Math.abs(d);
  const band = d < 0 ? ABOVE : BELOW;
  const opacity = interpolate(ad, band.at, band.opacity, { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * enter;
  if (opacity <= 0.001) return null;
  const open = EASE_IN_OUT(1 - Math.min(1, ad));
  const background = ad <= 1 ? mix(ROW_TONES.focus, ROW_TONES.near, ad) : mix(ROW_TONES.near, ROW_TONES.far, Math.min(1, ad - 1));
  const { tile, name } = MORPH;
  const rowOnly = clamp01(1 - open * 2.2);
  const cardOnly = clamp01((open - 0.55) / 0.4);

  return (
    <div style={{ position: "absolute", left: 0, top, width: CAROUSEL.width, height, borderRadius: lerp(20, 24, open), overflow: "hidden", background, opacity, transform: `translateY(${(1 - enter) * 40}px)` }}>
      <div
        style={{
          position: "absolute",
          left: lerp(tile.row.x, tile.card.x, open),
          top: lerp(tile.row.y, tile.card.y, open),
          width: lerp(tile.row.w, tile.card.w, open),
          height: lerp(tile.row.h, tile.card.h, open),
          borderRadius: lerp(tile.row.r, tile.card.r, open),
          background: mix(provider.tile, C.salmon, open),
        }}
      />
      <div
        style={{
          position: "absolute",
          left: lerp(name.row.x, name.card.x, open),
          top: lerp(name.row.y, name.card.y, open),
          transform: `scale(${lerp(name.row.scale, name.card.scale, open)})`,
          transformOrigin: "0 0",
          whiteSpace: "nowrap",
          fontFamily: F.display,
          fontWeight: 500,
          fontSize: 40,
          lineHeight: "44px",
          letterSpacing: lerp(-0.015, -0.02, open) + "em",
          color: C.walnut,
        }}
      >
        {provider.name}
        <span style={{ opacity: cardOnly }}>, {provider.tag}</span>
      </div>
      <div style={{ position: "absolute", right: 22, top: 20, height: 24, display: "flex", gap: 14, opacity: rowOnly }}>
        <div style={rowChip}>{provider.tag}</div>
        <div style={rowChip}>{provider.type}</div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, width: CAROUSEL.width, height: CAROUSEL.cardH, opacity: cardOnly, transform: `translateY(${(1 - cardOnly) * 10}px)` }}>
        <ProviderCardDetails provider={provider} />
      </div>
    </div>
  );
}

const rowChip: CSSProperties = { display: "flex", alignItems: "center", height: 24, padding: "0 9px", flexShrink: 0, borderRadius: 999, background: C.beige, fontFamily: F.body, fontWeight: 500, fontSize: 12, lineHeight: "16px", color: C.walnut };

const outlineChip: CSSProperties = {
  display: "flex",
  alignItems: "center",
  height: 30,
  padding: "0 14px",
  boxSizing: "border-box",
  borderRadius: 999,
  border: "1px solid rgba(40, 25, 16, 0.2)",
  fontFamily: F.ui,
  fontWeight: 500,
  fontSize: 14,
  lineHeight: "18px",
  color: C.walnut,
  whiteSpace: "nowrap",
};

/** Everything in the open card except the morphing tile and name. */
function ProviderCardDetails({ provider }: { provider: Provider }) {
  return (
    <div style={{ width: "100%", height: "100%", boxSizing: "border-box", padding: "20px 22px 20px 20px", display: "flex", gap: 28 }}>
      <div style={{ width: 260, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "8px 0 6px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", gap: 12, height: 44 }}>
            <div style={{ width: 32, height: 32, flexShrink: 0, borderRadius: 999, background: "rgba(40, 25, 16, 0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width={14} height={14} viewBox="0 0 24 24" style={{ display: "block" }}>
                <path d="M4 20h4L19 9l-4-4L4 16v4z" fill="none" stroke={C.walnut} strokeWidth={2} strokeLinejoin="round" />
                <path d="M13.5 6.5l4 4" fill="none" stroke={C.walnut} strokeWidth={2} strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <div style={outlineChip}>{provider.role}</div>
            <div style={outlineChip}>{provider.type}</div>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", rowGap: 16, padding: "16px 18px", borderRadius: 16, background: C.paper }}>
          {provider.facts.map(([label, value]) => (
            <div key={label} style={{ width: 150, flexShrink: 0, display: "flex", flexDirection: "column", gap: 3 }}>
              <div style={{ fontFamily: F.body, fontWeight: 500, fontSize: 12, lineHeight: "16px", color: "rgba(40, 25, 16, 0.5)" }}>{label}</div>
              <div style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 15, lineHeight: "20px", color: C.walnut }}>{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Agent search: best clinic, directions, what they offer ───────────────── */

const QUERY = "Find me a pediatric ENT near Mission who takes Harbor Mutual and can see my son for ear tubes this week.";

/** The query is typed at full size, then tucks to the top of a results stack the camera pans down. */
const QUERY_BOX = { x: 160, w: 1600, top: 330, h: 404 };
const STACK = { x: 460, w: 1000, top: 110, gap: 24 };
const COMPACT = STACK.w / QUERY_BOX.w;
const MAP_BOX = { top: STACK.top + QUERY_BOX.h * COMPACT + STACK.gap, pad: 16 };
const MAP = { w: STACK.w - MAP_BOX.pad * 2, h: 420, step: 78, angle: (-12 * Math.PI) / 180 };
const OFFER_BOX = { top: MAP_BOX.top + MAP.h + MAP_BOX.pad * 2 + STACK.gap, pad: 16, tileH: 84 };
const OFFER_BOX_H = OFFER_BOX.pad * 2 + OFFER_BOX.tileH;
const CLINIC_BOX = { top: OFFER_BOX.top + OFFER_BOX_H + STACK.gap, h: 200 };
const ACTIONS = { top: CLINIC_BOX.top + CLINIC_BOX.h + STACK.gap, h: 64 };
const RESULTS_MID = (OFFER_BOX.top + ACTIONS.top + ACTIONS.h) / 2;

const TYPE = { at: 26, cps: 34 };
const SEND_AT = 120;
const SEND_BUTTON = { x: QUERY_BOX.x + QUERY_BOX.w - 56 - 36, y: QUERY_BOX.top + QUERY_BOX.h - 40 - 36 };
const BOOK_AT = 326;
const BOOK_BUTTON = { x: STACK.x + 400, y: ACTIONS.top + ACTIONS.h / 2 };

const OFFERS = [
  { name: "Ear Tube Consult", price: "$245" },
  { name: "Hearing Test", price: "$140" },
  { name: "Ear Tube Surgery", price: "$2,850" },
];

const resultBox: CSSProperties = { position: "absolute", left: STACK.x, width: STACK.w, boxSizing: "border-box", borderRadius: 32, background: C.paper };

function AgentSearchScene() {
  const frame = useSceneFrame();
  const text = typed(QUERY, frame, TYPE.at, TYPE.cps);
  const typing = text.length > 0 && text.length < QUERY.length;
  const lift = ramp(frame, SEND_AT + 4, 34, EASE_IN_OUT);
  const toSend = ramp(frame, 98, 20, EASE_IN_OUT);
  const toBook = ramp(frame, 298, 26, EASE_IN_OUT);
  const mapCenter = MAP_BOX.top + MAP.h / 2 + MAP_BOX.pad;
  const cam = camera(frame, [
    { f: 0, x: 950, y: 524, s: 1.24 },
    { f: 22, x: 950, y: 524, s: 1.24 },
    { f: 116, x: 960, y: 540, s: 1 },
    { f: SEND_AT + 4, x: 960, y: 540, s: 1 },
    { f: 172, x: 960, y: mapCenter, s: 1.2 },
    { f: 226, x: 960, y: mapCenter + 10, s: 1.26 },
    { f: 264, x: 960, y: (OFFER_BOX.top + CLINIC_BOX.top + CLINIC_BOX.h) / 2, s: 1.16 },
    { f: 302, x: 960, y: RESULTS_MID, s: 1.18 },
    { f: 360, x: 960, y: RESULTS_MID + 8, s: 1.24 },
  ]);

  return (
    <AbsoluteFill>
      <div style={cam}>
        <div style={{ position: "absolute", left: QUERY_BOX.x, top: lerp(QUERY_BOX.top, STACK.top, lift), width: QUERY_BOX.w, ...fly(frame, { at: 0, y: 90, scale: 0.92, dur: 26 }) }}>
          <div style={{ transform: `scale(${lerp(1, COMPACT, lift)})`, transformOrigin: "50% 0" }}>
            <QueryCard frame={frame} text={text} typing={typing} />
          </div>
        </div>

        <div style={{ ...resultBox, top: MAP_BOX.top, padding: MAP_BOX.pad, ...fly(frame, { at: SEND_AT + 22, y: 80, scale: 0.96, dur: 26 }) }}>
          <ClinicMap frame={frame} />
        </div>

        <div style={{ ...resultBox, top: OFFER_BOX.top, height: OFFER_BOX_H, padding: OFFER_BOX.pad, ...fly(frame, { at: 226, y: 70, scale: 0.97, dur: 24 }) }}>
          <OfferTiles frame={frame} />
        </div>

        <div style={{ ...resultBox, top: CLINIC_BOX.top, height: CLINIC_BOX.h, padding: "16px 16px 16px 36px", ...fly(frame, { at: 254, y: 70, scale: 0.97, dur: 24 }) }}>
          <ClinicCard frame={frame} />
        </div>

        <div style={{ position: "absolute", left: STACK.x, top: ACTIONS.top, width: STACK.w }}>
          <BookActions frame={frame} />
        </div>

        <ClickRing x={SEND_BUTTON.x} y={SEND_BUTTON.y} progress={ramp(frame, SEND_AT + 1, 16)} />
        <div style={{ opacity: ramp(frame, 96, 8) * (1 - ramp(frame, SEND_AT + 6, 10)) }}>
          <Cursor x={lerp(1520, SEND_BUTTON.x, toSend)} y={lerp(1000, SEND_BUTTON.y, toSend)} pressed={pulse(frame, SEND_AT, 3, 6)} />
        </div>
        <ClickRing x={BOOK_BUTTON.x} y={BOOK_BUTTON.y} progress={ramp(frame, BOOK_AT + 1, 16)} />
        <div style={{ opacity: ramp(frame, 296, 8) }}>
          <Cursor x={lerp(1340, BOOK_BUTTON.x, toBook)} y={lerp(OFFER_BOX.top + OFFER_BOX_H + 160, BOOK_BUTTON.y, toBook)} pressed={pulse(frame, BOOK_AT, 3, 6)} />
        </div>
      </div>
    </AbsoluteFill>
  );
}

function QueryCard({ frame, text, typing }: { frame: number; text: string; typing: boolean }) {
  return (
    <div style={{ height: QUERY_BOX.h, boxSizing: "border-box", padding: "44px 56px 40px", borderRadius: 44, background: C.paper, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex" }}>
        <div style={{ display: "flex", alignItems: "center", height: 48, padding: "0 22px", borderRadius: 999, background: C.ink, fontFamily: F.ui, fontWeight: 500, fontSize: 24, color: C.paper }}>Mia&rsquo;s Agent</div>
      </div>
      <div style={{ minHeight: 140, marginTop: 24, fontFamily: F.ui, fontWeight: 500, fontSize: 56, lineHeight: "70px", letterSpacing: "-0.015em", color: C.walnut }}>
        {text.length === 0 ? <span style={{ color: "rgba(40, 25, 16, 0.32)" }}>Ask anything about your care</span> : text}
        <Caret height={56} width={4} visible={typing ? 1 : blink(frame)} />
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
        <div style={{ display: "flex", gap: 10 }}>
          <div>
            <Chip tone="sand" size={1.7} icon={<Icon name="paperclip" size={21} />}>
              Leo&rsquo;s Records
            </Chip>
          </div>
          <div>
            <Chip tone="sand" size={1.7} icon={<Icon name="shield" size={21} />}>
              Harbor Mutual
            </Chip>
          </div>
        </div>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 999,
            background: text.length === QUERY.length ? C.ink : "rgba(40, 25, 16, 0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${1 - 0.1 * pulse(frame, SEND_AT, 3, 8)})`,
          }}
        >
          <Icon name="arrowUp" size={30} color={C.paper} stroke={2.4} />
        </div>
      </div>
    </div>
  );
}

const CLINIC_NAME = "Atlantic Pediatric ENT";
const CLINIC_CHECKS = ["Takes Harbor Mutual", "Ear Tubes", "Wed 9:40 AM"];

function ClinicCard({ frame }: { frame: number }) {
  return (
    <div style={{ display: "flex", gap: 28, height: "100%" }}>
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center", gap: 18 }}>
        <div style={{ fontFamily: F.display, fontWeight: 500, fontSize: 50, lineHeight: "54px", letterSpacing: "-0.025em", color: C.walnut, whiteSpace: "nowrap" }}>{CLINIC_NAME}</div>
        <div style={{ display: "flex", ...fly(frame, { at: 264, y: 8, dur: 14, blur: 0 }) }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: 50,
              padding: "0 22px",
              boxSizing: "border-box",
              borderRadius: 999,
              border: "1.5px solid rgba(40, 25, 16, 0.22)",
              fontFamily: F.ui,
              fontWeight: 500,
              fontSize: 22,
              color: C.walnut,
              whiteSpace: "nowrap",
            }}
          >
            Dr. Sofia Alvarez, DO
          </div>
        </div>
      </div>
      <div style={{ width: 300, flexShrink: 0, display: "flex", flexDirection: "column", justifyContent: "center", gap: 16 }}>
        {CLINIC_CHECKS.map((label, i) => (
          <div
            key={label}
            style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: F.ui, fontWeight: 500, fontSize: 19, lineHeight: "24px", color: C.liveText, whiteSpace: "nowrap", ...fly(frame, { at: 270 + i * 6, x: 10, y: 0, dur: 14, blur: 0 }) }}
          >
            <Icon name="check" size={19} color={C.liveText} stroke={2.6} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

function OfferTiles({ frame }: { frame: number }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
      {OFFERS.map((offer, i) => (
        <div
          key={offer.name}
          style={{
            height: OFFER_BOX.tileH,
            boxSizing: "border-box",
            padding: "0 20px",
            borderRadius: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            background: C.beige,
            ...fly(frame, { at: 234 + i * 7, y: 14, dur: 16, blur: 0 }),
          }}
        >
          <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 19, lineHeight: "24px", color: C.walnut, whiteSpace: "nowrap" }}>{offer.name}</div>
          <div style={{ fontFamily: F.display, fontWeight: 500, fontSize: 30, lineHeight: "34px", letterSpacing: "-0.02em", color: C.walnut }}>{offer.price}</div>
        </div>
      ))}
    </div>
  );
}

function BookActions({ frame }: { frame: number }) {
  return (
    <div style={{ display: "flex", gap: 12, ...fly(frame, { at: 284, y: 16, dur: 18, blur: 0 }) }}>
      <div style={{ flex: 1, transform: `scale(${1 - 0.04 * pulse(frame, BOOK_AT, 3, 8)})` }}>
        <Button tone="ink" height={ACTIONS.h} icon={<Icon name="calendar" size={22} color={C.paper} />} style={{ fontSize: 22 }}>
          Book Wed 9:40 AM
        </Button>
      </div>
      <Button tone="sand" height={ACTIONS.h} icon={<Icon name="mapPin" size={22} />} style={{ fontSize: 22, background: C.paper }}>
        Directions
      </Button>
    </div>
  );
}

/** Grid space (street units) → map pixels, on a street grid tilted like the Mission. */
function toMap(gx: number, gy: number) {
  const x = gx * MAP.step;
  const y = gy * MAP.step;
  const cos = Math.cos(MAP.angle);
  const sin = Math.sin(MAP.angle);
  return { x: MAP.w / 2 + x * cos - y * sin, y: MAP.h / 2 + x * sin + y * cos };
}

const ROUTE = [
  [-3, 1.8],
  [-3, 0],
  [1, 0],
  [1, -1.7],
].map(([gx, gy]) => toMap(gx, gy));
const ROUTE_D = ROUTE.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
const ROUTE_LEN = ROUTE.slice(1).reduce((sum, p, i) => sum + Math.hypot(p.x - ROUTE[i].x, p.y - ROUTE[i].y), 0);
const HOME = ROUTE[0];
const CLINIC = ROUTE[ROUTE.length - 1];
const MAJOR = { vertical: 1, horizontal: 0 };
const STREETS = Array.from({ length: 13 }, (_, i) => i - 6);
const PARK_INSET = 9 / MAP.step;
const PARK = [
  [-2 + PARK_INSET, 1 + PARK_INSET],
  [-1 - PARK_INSET, 1 + PARK_INSET],
  [-1 - PARK_INSET, 2 - PARK_INSET],
  [-2 + PARK_INSET, 2 - PARK_INSET],
]
  .map(([gx, gy]) => toMap(gx, gy))
  .map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
  .join(" ");
const ANGLE_DEG = (MAP.angle * 180) / Math.PI;
/** Leaves home quickly and settles into the clinic. */
const ROUTE_EASE = Easing.bezier(0.3, 0.55, 0.35, 1);

function StreetLabel({ at, rotate, children }: { at: { x: number; y: number }; rotate: number; children: string }) {
  return (
    <text
      x={at.x}
      y={at.y}
      transform={`rotate(${rotate.toFixed(2)} ${at.x.toFixed(1)} ${at.y.toFixed(1)})`}
      textAnchor="middle"
      dominantBaseline="central"
      fontFamily="Inter, system-ui, sans-serif"
      fontWeight={500}
      fontSize={11}
      letterSpacing="0.03em"
      fill="rgba(40, 25, 16, 0.5)"
    >
      {children}
    </text>
  );
}

function ClinicMap({ frame }: { frame: number }) {
  const homeIn = ramp(frame, 164, 14);
  const draw = ramp(frame, 172, 44, ROUTE_EASE);
  const pinIn = ramp(frame, 216, 14);
  const ring = ramp(frame, 220, 22);
  const eta = ramp(frame, 222, 16);

  return (
    <div style={{ position: "relative", width: MAP.w, height: MAP.h, flexShrink: 0, borderRadius: 20, overflow: "hidden", background: "#ECE2CD" }}>
      <svg width={MAP.w} height={MAP.h} style={{ position: "absolute", left: 0, top: 0 }}>
        <polygon points={PARK} fill="rgba(110, 154, 91, 0.24)" />
        {STREETS.map((k) => {
          const a = toMap(k, -8);
          const b = toMap(k, 8);
          return <line key={`v${k}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={C.paper} strokeWidth={k === MAJOR.vertical ? 16 : 8} />;
        })}
        {STREETS.map((k) => {
          const a = toMap(-8, k);
          const b = toMap(8, k);
          return <line key={`h${k}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={C.paper} strokeWidth={k === MAJOR.horizontal ? 16 : 8} />;
        })}
        <StreetLabel at={toMap(MAJOR.vertical, 1.45)} rotate={ANGLE_DEG + 90}>
          Mission St
        </StreetLabel>
        <StreetLabel at={toMap(2.5, MAJOR.horizontal)} rotate={ANGLE_DEG}>
          24th St
        </StreetLabel>
        <StreetLabel at={toMap(-1.5, 1.5)} rotate={ANGLE_DEG}>
          Garfield Sq
        </StreetLabel>
        <path d={ROUTE_D} fill="none" stroke={C.ink} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${ROUTE_LEN} ${ROUTE_LEN}`} strokeDashoffset={ROUTE_LEN * (1 - draw)} />
      </svg>

      <div style={{ position: "absolute", left: HOME.x - 11, top: HOME.y - 11, width: 22, height: 22, boxSizing: "border-box", borderRadius: 999, background: C.ink, border: `4px solid ${C.paper}`, transform: `scale(${homeIn})` }} />
      <div style={{ position: "absolute", left: HOME.x + 18, top: HOME.y - 15, ...fly(frame, { at: 166, x: -8, y: 0, dur: 14, blur: 0 }) }}>
        <Chip tone="paper" size={1.15}>
          Home
        </Chip>
      </div>

      {ring > 0 && ring < 1 ? (
        <div
          style={{
            position: "absolute",
            left: CLINIC.x - 11 - 18 * ring,
            top: CLINIC.y - 11 - 18 * ring,
            width: 22 + 36 * ring,
            height: 22 + 36 * ring,
            boxSizing: "border-box",
            borderRadius: 999,
            border: `2px solid rgba(20, 12, 4, ${0.3 * (1 - ring)})`,
          }}
        />
      ) : null}
      <div
        style={{
          position: "absolute",
          left: CLINIC.x - 11,
          top: CLINIC.y - 11,
          width: 22,
          height: 22,
          boxSizing: "border-box",
          borderRadius: 999,
          background: C.ink,
          border: `4px solid ${C.paper}`,
          opacity: pinIn,
          transform: `scale(${lerp(0.5, 1, pinIn)})`,
        }}
      />
      <div style={{ position: "absolute", left: CLINIC.x + 18, top: CLINIC.y - 15, ...fly(frame, { at: 220, x: -10, y: 0, dur: 14, blur: 0 }) }}>
        <Chip tone="paper" size={1.15}>
          {CLINIC_NAME}
        </Chip>
      </div>

      <div style={{ position: "absolute", left: 16, top: 16, opacity: eta, transform: `translateY(${(1 - eta) * -8}px)` }}>
        <Chip tone="paper" size={1.25} icon={<Icon name="clock" size={16} />}>
          9 min drive · 2.1 mi
        </Chip>
      </div>
    </div>
  );
}
