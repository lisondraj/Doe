"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { FrontDeskAgentBlock } from "@/components/herodesign/FrontDeskAgentBlock";
import { GoogleCalendarBlock } from "@/components/herodesign/GoogleCalendarBlock";
import { InsuranceVerifyBlock } from "@/components/herodesign/InsuranceVerifyBlock";
import { LoadingAppointmentBlock } from "@/components/herodesign/LoadingAppointmentBlock";
import { PhysicianCellBlock } from "@/components/herodesign/PhysicianCellBlock";
import { PreChartingEmrBlock } from "@/components/herodesign/PreChartingEmrBlock";
import { SendingIntakeFormBlock } from "@/components/herodesign/SendingIntakeFormBlock";
import { WorkflowBlockVariantProvider } from "@/components/herodesign/WorkflowBlockVariantContext";
import { workflowBlockTheme, type WorkflowBlockVariant } from "@/lib/herodesign/workflowBlockTheme";

const BLOCK_W = 248;

type LayoutRect = { id: string; x: number; y: number; w: number };
type MeasuredRect = LayoutRect & { h: number };

// Left-to-right order. calendar & physician share step 1 (appear in parallel).
const BLOCK_LAYOUT: LayoutRect[] = [
  { id: "front-desk",   x: 48,   y: 216, w: BLOCK_W },
  { id: "calendar",     x: 368,  y: 92,  w: BLOCK_W },
  { id: "physician",    x: 368,  y: 424, w: BLOCK_W },
  { id: "intake",       x: 688,  y: 214, w: BLOCK_W },
  { id: "insurance",    x: 1008, y: 96,  w: BLOCK_W },
  { id: "prechart-emr", x: 1008, y: 400, w: BLOCK_W },
  { id: "loading-appt", x: 1328, y: 228, w: BLOCK_W },
];

const BLOCK_STEP: Record<string, number> = {
  "front-desk":   0,
  "calendar":     1,
  "physician":    1,
  "intake":       2,
  "insurance":    3,
  "prechart-emr": 4,
  "loading-appt": 5,
};

// Path reveal steps match buildPaths array order
const PATH_REVEAL_STEPS = [1, 1, 2, 2, 3, 4, 5] as const;

const DIAGRAM_W   = 1624;
const DIAGRAM_H   = 660;
const WORKFLOW_GAP = 72;
const STEP_DELAY_MS    = 2200; // fallback
const INITIAL_DELAY_MS = 700;
const TOTAL_STEPS      = 6;

// Per-step delay before the NEXT step fires (index = current step)
const STEP_DELAYS_MS = [
  1100,  // step 0 → 1  (front-desk → calendar+physician, fast pull-back)
  2800,  // step 1 → 2
  2800,  // step 2 → 3
  2800,  // step 3 → 4
  2800,  // step 4 → 5
];

// front-desk center x = 48 + 248/2 = 172
// diagram center x = 1624/2 = 812
// panX = pre-scale translate so the focus point lands at diagram center
// visible center in diagram coords = DIAGRAM_W/2 - panX
// zoom-out camera per step — keep zoom gentle so nothing gets cropped:
const CAMERA: { zoom: number; panX: number }[] = [
  { zoom: 1.55, panX: 640 },  // step 0 — front-desk gently enlarged & centered
  { zoom: 1.28, panX: 320 },  // step 1 — pull back; calendar+physician visible
  { zoom: 1.10, panX: 60  },  // step 2 — pull back; intake visible
  { zoom: 1.03, panX: 10  },  // step 3 — near full; insurance visible
  { zoom: 1.0,  panX: 0   },  // step 4 — full view; prechart visible
  { zoom: 1.0,  panX: 0   },  // step 5 — settled; loading visible
];

// ─── helpers ────────────────────────────────────────────────────────────────

function anchor(rect: MeasuredRect, side: "left" | "right" | "top" | "bottom", t = 0.5) {
  switch (side) {
    case "left":   return { x: rect.x,          y: rect.y + rect.h * t };
    case "right":  return { x: rect.x + rect.w,  y: rect.y + rect.h * t };
    case "top":    return { x: rect.x + rect.w * t, y: rect.y };
    case "bottom": return { x: rect.x + rect.w * t, y: rect.y + rect.h };
  }
}

function symmetricCurve(
  x1: number, y1: number,
  x2: number, y2: number,
  tension = 0.48, maxHandle = 132,
) {
  const dx = x2 - x1, dy = y2 - y1;
  const ax = Math.abs(dx), ay = Math.abs(dy);
  if (ax < 0.5 && ay < 0.5) return `M ${x1} ${y1} L ${x2} ${y2}`;
  if (ax >= ay) {
    const k = Math.sign(dx) * Math.min(maxHandle, ax * tension);
    return `M ${x1} ${y1} C ${x1 + k} ${y1}, ${x2 - k} ${y2}, ${x2} ${y2}`;
  }
  const k = Math.sign(dy) * Math.min(maxHandle, ay * tension);
  return `M ${x1} ${y1} C ${x1} ${y1 + k}, ${x2} ${y2 - k}, ${x2} ${y2}`;
}

function buildPaths(blocks: Record<string, MeasuredRect>) {
  const front       = blocks["front-desk"];
  const calendar    = blocks["calendar"];
  const physician   = blocks["physician"];
  const intake      = blocks["intake"];
  const insurance   = blocks["insurance"];
  const prechartEmr = blocks["prechart-emr"];
  const loadingAppt = blocks["loading-appt"];
  if (!front || !calendar || !physician || !intake || !insurance || !prechartEmr || !loadingAppt) return [];

  const a             = anchor(front,       "right",  0.5);
  const bCal          = anchor(calendar,    "left",   0.5);
  const bPhy          = anchor(physician,   "left",   0.5);
  const calOut        = anchor(calendar,    "right",  0.5);
  const phyOut        = anchor(physician,   "right",  0.5);
  const intakeLeftTop = anchor(intake,      "left",   0.33);
  const intakeLeftBot = anchor(intake,      "left",   0.67);
  const intakeRight   = anchor(intake,      "right",  0.5);
  const insLeft       = anchor(insurance,   "left",   0.5);
  const insBottom     = anchor(insurance,   "bottom", 0.5);
  const prechartTop   = anchor(prechartEmr, "top",    0.5);
  const prechartRight = anchor(prechartEmr, "right",  0.5);
  const loadingLeft   = anchor(loadingAppt, "left",   0.5);

  return [
    { d: symmetricCurve(a.x, a.y, bCal.x, bCal.y),                             dots: [a, bCal],          marker: true  }, // [0] step 1
    { d: symmetricCurve(a.x, a.y, bPhy.x, bPhy.y),                             dots: [bPhy],             marker: true  }, // [1] step 1
    { d: symmetricCurve(calOut.x, calOut.y, intakeLeftTop.x, intakeLeftTop.y),  dots: [calOut, intakeLeftTop], marker: true }, // [2] step 2
    { d: symmetricCurve(phyOut.x, phyOut.y, intakeLeftBot.x, intakeLeftBot.y),  dots: [phyOut, intakeLeftBot], marker: true }, // [3] step 2
    { d: symmetricCurve(intakeRight.x, intakeRight.y, insLeft.x, insLeft.y),    dots: [intakeRight, insLeft],  marker: true }, // [4] step 3
    { d: `M ${insBottom.x} ${insBottom.y} L ${prechartTop.x} ${prechartTop.y}`, dots: [insBottom, prechartTop], marker: false }, // [5] step 4
    { d: symmetricCurve(prechartRight.x, prechartRight.y, loadingLeft.x, loadingLeft.y), dots: [prechartRight, loadingLeft], marker: true }, // [6] step 5
  ];
}

// ─── WorkflowConnections ────────────────────────────────────────────────────

function WorkflowConnections({
  blocks, stroke, dotFill, animStep,
}: {
  blocks:    Record<string, MeasuredRect>;
  stroke:    string;
  dotFill:   string;
  animStep:  number | null;
}) {
  const markerId = useId().replace(/:/g, "");
  const paths    = buildPaths(blocks);

  return (
    <svg
      className="pointer-events-none absolute inset-0 overflow-visible"
      width={DIAGRAM_W} height={DIAGRAM_H}
      viewBox={`0 0 ${DIAGRAM_W} ${DIAGRAM_H}`}
      aria-hidden
    >
      <defs>
        <marker id={markerId} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <circle cx="3" cy="3" r="2.1" fill={dotFill} />
        </marker>
      </defs>

      {paths.map((path, i) => {
        const isAnimated = animStep !== null;
        const revealed   = animStep === null || animStep >= PATH_REVEAL_STEPS[i];
        return (
          <g key={i}>
            <path
              d={path.d}
              fill="none"
              stroke={stroke}
              strokeWidth="1"
              strokeLinecap="round"
              markerEnd={path.marker ? `url(#${markerId})` : undefined}
              pathLength="1"
              strokeDasharray="1 0.0001"
              strokeDashoffset={revealed ? 0 : 1}
              style={{
                transition: isAnimated && revealed
                  ? "stroke-dashoffset 1.0s cubic-bezier(0.4,0,0.2,1)"
                  : "none",
                opacity: revealed ? 1 : 0,
              }}
            />
            {path.dots.map((pt, j) => (
              <circle
                key={j} cx={pt.x} cy={pt.y} r="3" fill={dotFill}
                style={{
                  opacity: revealed ? 1 : 0,
                  transition: isAnimated && revealed ? "opacity 0.25s ease 0.55s" : "none",
                }}
              />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

// ─── WorkflowDiagramLayer ───────────────────────────────────────────────────

function WorkflowDiagramLayer({
  variant, onDarkSurface = false, animStep,
}: {
  variant:       WorkflowBlockVariant;
  onDarkSurface?: boolean;
  /** null = no animation. -1 = waiting. 0–5 = current step. */
  animStep: number | null;
}) {
  const theme           = workflowBlockTheme(variant);
  const connectorStroke = onDarkSurface && variant === "light" ? "rgba(255,255,255,0.55)" : theme.connectorStroke;
  const connectorDot    = onDarkSurface && variant === "light" ? "rgba(255,255,255,0.65)" : theme.connectorDot;

  const blockRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [measured, setMeasured] = useState<Record<string, MeasuredRect>>(() =>
    Object.fromEntries(BLOCK_LAYOUT.map(({ id, x, y, w }) => [id, { id, x, y, w, h: 160 }])),
  );

  const measureBlocks = useCallback(() => {
    const next: Record<string, MeasuredRect> = {};
    for (const layout of BLOCK_LAYOUT) {
      const el = blockRefs.current[layout.id];
      next[layout.id] = { ...layout, h: el?.offsetHeight ?? 160 };
    }
    setMeasured(next);
  }, []);

  useLayoutEffect(() => {
    measureBlocks();
    const ro = new ResizeObserver(measureBlocks);
    for (const layout of BLOCK_LAYOUT) {
      const el = blockRefs.current[layout.id];
      if (el) ro.observe(el);
    }
    return () => ro.disconnect();
  }, [measureBlocks, variant]);

  const isAnimated = animStep !== null;

  // Compute camera: which step to read from CAMERA array
  // At step -1 (waiting), use step-0 values so camera is already positioned
  const camIndex = animStep === null ? null : Math.max(0, Math.min(animStep, CAMERA.length - 1));
  const cam = camIndex !== null ? CAMERA[camIndex] : null;

  const cameraTransform = cam
    ? `scale(${cam.zoom}) translateX(${cam.panX}px)`
    : "none";

  const blockStyle = (rect: LayoutRect) => ({ left: rect.x, top: rect.y, width: rect.w });

  return (
    <WorkflowBlockVariantProvider variant={variant}>
      <div className="relative" style={{ width: DIAGRAM_W, height: DIAGRAM_H }}>
        {/* Camera zoom/pan wrapper — both SVG and blocks scale together */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: cameraTransform,
            transformOrigin: "center center",
            transition: isAnimated && cam
              ? "transform 1.85s cubic-bezier(0.32, 0, 0.16, 1)"
              : "none",
          }}
        >
          <WorkflowConnections
            blocks={measured}
            stroke={connectorStroke}
            dotFill={connectorDot}
            animStep={animStep}
          />

          {BLOCK_LAYOUT.map((layout) => {
            const step     = BLOCK_STEP[layout.id] ?? 0;
            const revealed = animStep === null || animStep >= step;
            return (
              <div
                key={layout.id}
                ref={(el) => { blockRefs.current[layout.id] = el; }}
                className="absolute"
                style={{
                  ...blockStyle(layout),
                  opacity:   revealed ? 1 : 0,
                  transform: revealed ? "translateY(0)" : "translateY(16px)",
                  transition: isAnimated && revealed
                    ? "opacity 0.75s ease, transform 0.75s cubic-bezier(0.22,1,0.36,1)"
                    : "none",
                }}
              >
                {layout.id === "front-desk"   && <FrontDeskAgentBlock />}
                {layout.id === "calendar"     && <GoogleCalendarBlock />}
                {layout.id === "physician"    && <PhysicianCellBlock />}
                {layout.id === "intake"       && <SendingIntakeFormBlock />}
                {layout.id === "insurance"    && <InsuranceVerifyBlock />}
                {layout.id === "prechart-emr" && <PreChartingEmrBlock />}
                {layout.id === "loading-appt" && <LoadingAppointmentBlock />}
              </div>
            );
          })}
        </div>
      </div>
    </WorkflowBlockVariantProvider>
  );
}

// ─── ClinicWorkflowDiagram (public) ─────────────────────────────────────────

export type ClinicWorkflowDiagramLayout = "both" | "light" | "dark";

type ClinicWorkflowDiagramProps = {
  layout?:       ClinicWorkflowDiagramLayout;
  onDarkSurface?: boolean;
  animated?:     boolean;
};

export function ClinicWorkflowDiagram({
  layout        = "both",
  onDarkSurface = false,
  animated      = false,
}: ClinicWorkflowDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale]       = useState(1);
  const [animStep, setAnimStep] = useState<number | null>(animated ? -1 : null);
  const hasAnimated              = useRef(false);

  const isStacked = layout === "both";
  const canvasH   = isStacked ? DIAGRAM_H * 2 + WORKFLOW_GAP : DIAGRAM_H;

  const startAnimation = useCallback(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;
    let step = 0;
    const tick = () => {
      setAnimStep(step);
      const delay = STEP_DELAYS_MS[step] ?? STEP_DELAY_MS;
      step++;
      if (step < TOTAL_STEPS) setTimeout(tick, delay);
    };
    setTimeout(tick, INITIAL_DELAY_MS);
  }, []);

  useEffect(() => {
    if (!animated) return;
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) startAnimation(); },
      { threshold: 0.18 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [animated, startAnimation]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const pad = isStacked ? 32 : 16;
      const sx = (el.clientWidth  - pad) / DIAGRAM_W;
      const sy = (el.clientHeight - pad) / canvasH;
      setScale(Math.min(1, sx, sy));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => { ro.disconnect(); window.removeEventListener("resize", update); };
  }, [canvasH, isStacked]);

  const layerStep = animated ? animStep : null;

  return (
    <div
      ref={containerRef}
      className={`relative flex h-full w-full justify-center overflow-hidden ${
        isStacked ? "items-start overflow-y-auto py-2" : "items-center"
      }`}
    >
      <div
        className="relative shrink-0"
        style={{
          width:           DIAGRAM_W,
          height:          canvasH,
          transform:       `scale(${scale})`,
          transformOrigin: isStacked ? "top center" : "center center",
        }}
      >
        {(layout === "both" || layout === "dark") && (
          <WorkflowDiagramLayer variant="dark" onDarkSurface={onDarkSurface} animStep={layerStep} />
        )}

        {layout === "both" && (
          <div className="absolute left-0 right-0" style={{ top: DIAGRAM_H + WORKFLOW_GAP }}>
            <WorkflowDiagramLayer variant="light" onDarkSurface={onDarkSurface} animStep={layerStep} />
          </div>
        )}

        {layout === "light" && (
          <WorkflowDiagramLayer variant="light" onDarkSurface={onDarkSurface} animStep={layerStep} />
        )}
      </div>
    </div>
  );
}
