"use client";

import { type RefObject, useEffect, useRef } from "react";

import { p22Mackinac } from "@/lib/home/fonts";

/** Box lines (Doe salmon), the lighter salmon of the packets, and the dots, as R G B. */
const LINE_RGB = "232 165 133";
const PACKET_RGB = "252 207 184";

const DEG = Math.PI / 180;

/** World units: the tiling cell, the channel between boxes, and the box corner radius. */
const CELL = 1.2;
const GAP = 0.26;
const RADIUS = 0.3;
/** Region of the ground the tiling covers; it holds every view the camera passes through. */
const REGION = { kMin: -11, kMax: 11, mMin: -10, mMax: 3 };
const SIZES: [number, number][] = [
  [1, 1],
  [2, 1],
  [1, 2],
  [2, 2],
  [3, 2],
  [2, 3],
  [3, 1],
  [1, 1],
  [2, 1],
];
const HEIGHTS = [0.12, 0.3, 0.5];

/** Scene timeline, in seconds of scene time. */
const PACKETS_IN = 2.5;
const PACKETS_OUT = 10.4;
const CONVERT_AT = 10;
const CONVERT_SWEEP = 1.4;
const FLIGHT = 1.7;
const CAMERA_SETTLED = 11;
/** Screen fraction where the finished dot pattern begins. */
const DOT_BAND_TOP = 0.68;
const DOT_SPACING_PX = 20;
const PACKET_SPEED = 2.4;
const PACKET_TRAIL = 0.22;

type Outline = { pts: Float32Array; cum: Float32Array; len: number; y: number };
type Box = {
  top: Outline;
  base: Outline | null;
  inner: Outline | null;
  cx: number;
  cz: number;
  reveal: number;
  fade: number;
};
type Pose = { tx: number; tz: number; h: number; pitch: number; yaw: number };
type Packet = { k: number; m: number; dk: number; dm: number; p: number; trail: { x: number; z: number; t: number }[] };
type Dot = { x0: number; y0: number; z0: number; x1: number; z1: number; start: number };

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const ease = (t: number, a: number, b: number) => easeInOut(clamp01((t - a) / (b - a)));
const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** The camera over the scene: it starts close and angled, then pulls back, pans, and turns to a slight angle. */
function poseAt(t: number): Pose {
  const pull = ease(t, 0, 9);
  const drift = ease(t, 0, CAMERA_SETTLED);
  return {
    tx: lerp(-3, 0.5, drift),
    tz: lerp(-4.5, -3, drift),
    h: lerp(5, 10, pull),
    pitch: lerp(58, 74, pull) * DEG,
    yaw: lerp(-12, 4, drift) * DEG,
  };
}

/** A rounded rectangle on the ground (or at height y), as a closed polyline with cumulative lengths. */
function roundedRect(x0: number, z0: number, x1: number, z1: number, r: number, y: number): Outline {
  const pts: number[] = [];
  const arc = (cx: number, cz: number, a0: number) => {
    for (let s = 0; s <= 6; s++) {
      const a = a0 + (s / 6) * (Math.PI / 2);
      pts.push(cx + Math.cos(a) * r, cz + Math.sin(a) * r);
    }
  };
  arc(x1 - r, z0 + r, -Math.PI / 2);
  arc(x1 - r, z1 - r, 0);
  arc(x0 + r, z1 - r, Math.PI / 2);
  arc(x0 + r, z0 + r, Math.PI);
  pts.push(pts[0], pts[1]);
  const cum = new Float32Array(pts.length / 2);
  for (let i = 1; i < cum.length; i++) {
    cum[i] = cum[i - 1] + Math.hypot(pts[i * 2] - pts[i * 2 - 2], pts[i * 2 + 1] - pts[i * 2 - 1]);
  }
  return { pts: Float32Array.from(pts), cum, len: cum[cum.length - 1], y };
}

/** Evenly spaced points along an outline, for the dots the boxes break into. */
function resample(outline: Outline, spacing: number) {
  const out: number[] = [];
  const { pts, cum, len } = outline;
  let seg = 1;
  for (let d = 0; d < len; d += spacing) {
    while (seg < cum.length - 1 && cum[seg] < d) seg++;
    const t = (d - cum[seg - 1]) / (cum[seg] - cum[seg - 1] || 1);
    out.push(lerp(pts[seg * 2 - 2], pts[seg * 2], t), lerp(pts[seg * 2 - 1], pts[seg * 2 + 1], t));
  }
  return out;
}

/** Packs the region with rounded boxes of mixed sizes; the cells they leave between them are the channels. */
function buildTiling() {
  const rand = mulberry32(11);
  const cols = REGION.kMax - REGION.kMin;
  const rows = REGION.mMax - REGION.mMin;
  const owner = new Int32Array(cols * rows).fill(-1);
  const cell = (k: number, m: number) =>
    k < REGION.kMin || k >= REGION.kMax || m < REGION.mMin || m >= REGION.mMax
      ? -2
      : owner[(m - REGION.mMin) * cols + (k - REGION.kMin)];
  const boxes: Box[] = [];
  for (let m = REGION.mMin; m < REGION.mMax; m++) {
    for (let k = REGION.kMin; k < REGION.kMax; k++) {
      if (cell(k, m) !== -1) continue;
      let [w, d] = SIZES[Math.floor(rand() * SIZES.length)];
      const fits = (ww: number, dd: number) => {
        for (let a = 0; a < dd; a++) for (let b = 0; b < ww; b++) if (cell(k + b, m + a) !== -1) return false;
        return true;
      };
      while (!fits(w, d)) {
        if (w >= d && w > 1) w--;
        else if (d > 1) d--;
        else break;
      }
      const id = boxes.length;
      for (let a = 0; a < d; a++) for (let b = 0; b < w; b++) owner[(m + a - REGION.mMin) * cols + (k + b - REGION.kMin)] = id;
      const x0 = k * CELL + GAP / 2;
      const x1 = (k + w) * CELL - GAP / 2;
      const z0 = m * CELL + GAP / 2;
      const z1 = (m + d) * CELL - GAP / 2;
      const h = HEIGHTS[Math.floor(rand() * HEIGHTS.length)];
      const cx = (x0 + x1) / 2;
      const cz = (z0 + z1) / 2;
      const nested = w >= 2 && d >= 2 ? rand() < 0.6 : w + d >= 3 && rand() < 0.25;
      boxes.push({
        top: roundedRect(x0, z0, x1, z1, RADIUS, h),
        base: roundedRect(x0, z0, x1, z1, RADIUS, 0),
        inner: nested ? roundedRect(x0 + 0.3, z0 + 0.3, x1 - 0.3, z1 - 0.3, RADIUS * 0.7, h) : null,
        cx,
        cz,
        reveal: 0.35 + Math.min(4.2, Math.hypot(cx + 3, cz + 4.5) * 0.32),
        fade: CONVERT_AT,
      });
    }
  }

  /** Channel directions from each grid node: an edge is a channel when the cells on its two sides differ. */
  const channels = new Map<string, [number, number][]>();
  for (let m = REGION.mMin; m <= REGION.mMax; m++) {
    for (let k = REGION.kMin; k <= REGION.kMax; k++) {
      const dirs: [number, number][] = [];
      if (k < REGION.kMax && m > REGION.mMin && m < REGION.mMax && cell(k, m - 1) !== cell(k, m)) dirs.push([1, 0]);
      if (k > REGION.kMin && m > REGION.mMin && m < REGION.mMax && cell(k - 1, m - 1) !== cell(k - 1, m)) dirs.push([-1, 0]);
      if (m < REGION.mMax && k > REGION.kMin && k < REGION.kMax && cell(k - 1, m) !== cell(k, m)) dirs.push([0, 1]);
      if (m > REGION.mMin && k > REGION.kMin && k < REGION.kMax && cell(k - 1, m - 1) !== cell(k, m - 1)) dirs.push([0, -1]);
      if (dirs.length) channels.set(`${k},${m}`, dirs);
    }
  }
  return { boxes, channels };
}

/**
 * The /security hero scene, played once: interlocked rounded boxes draw in under a camera that pulls back, pans, and
 * turns; packets run cleanly through the channels between them; then the boxes break into dots that sweep down into
 * a dot pattern along the bottom of the hero, which keeps moving.
 */
function SecurityScene({ copyRef }: { copyRef: RefObject<HTMLDivElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const rand = mulberry32(5);
    const { boxes, channels } = buildTiling();
    const channelKeys = [...channels.keys()];

    let width = 0;
    let height = 0;
    let focal = 1;
    let centerY = 0;
    let quiet = { x: 0, y: 0, rx: 0, ry: 0 };
    let scene = 0;

    const cam = { x: 0, y: 0, z: 0, rx: 1, rz: 0, ux: 0, uy: 1, uz: 0, fx: 0, fy: -1, fz: 0 };
    const setCamera = (pose: Pose) => {
      const sp = Math.sin(pose.pitch);
      const cp = Math.cos(pose.pitch);
      const sy = Math.sin(pose.yaw);
      const cy = Math.cos(pose.yaw);
      cam.rx = cy;
      cam.rz = -sy;
      cam.ux = -sp * sy;
      cam.uy = cp;
      cam.uz = -sp * cy;
      cam.fx = -cp * sy;
      cam.fy = -sp;
      cam.fz = -cp * cy;
      const dist = pose.h / sp;
      cam.x = pose.tx - cam.fx * dist;
      cam.y = pose.h;
      cam.z = pose.tz - cam.fz * dist;
    };

    const out = { sx: 0, sy: 0, depth: 0 };
    const project = (x: number, y: number, z: number) => {
      const dx = x - cam.x;
      const dy = y - cam.y;
      const dz = z - cam.z;
      const depth = dx * cam.fx + dy * cam.fy + dz * cam.fz;
      if (depth < 0.4) return false;
      const k = focal / depth;
      out.sx = width / 2 + (dx * cam.rx + dz * cam.rz) * k;
      out.sy = centerY - (dx * cam.ux + dy * cam.uy + dz * cam.uz) * k;
      out.depth = depth;
      return true;
    };
    const ground = (sx: number, sy: number) => {
      const X = (sx - width / 2) / focal;
      const Y = (centerY - sy) / focal;
      const dx = cam.rx * X + cam.ux * Y + cam.fx;
      const dy = cam.uy * Y + cam.fy;
      const dz = cam.rz * X + cam.uz * Y + cam.fz;
      const t = -cam.y / dy;
      return { x: cam.x + dx * t, z: cam.z + dz * t };
    };

    /** Strokes the first `fraction` of an outline, so boxes draw themselves in. */
    const traceOutline = (outline: Outline, fraction: number) => {
      const { pts, cum, len, y } = outline;
      const target = len * fraction;
      let started = false;
      for (let i = 0; i < cum.length; i++) {
        let x = pts[i * 2];
        let z = pts[i * 2 + 1];
        if (cum[i] > target && i > 0) {
          const t = (target - cum[i - 1]) / (cum[i] - cum[i - 1] || 1);
          x = lerp(pts[i * 2 - 2], x, t);
          z = lerp(pts[i * 2 - 1], z, t);
        }
        if (!project(x, y, z)) {
          started = false;
        } else if (started) {
          ctx.lineTo(out.sx, out.sy);
        } else {
          ctx.moveTo(out.sx, out.sy);
          started = true;
        }
        if (cum[i] > target) break;
      }
    };

    const packets: Packet[] = [];
    const spawn = (packet: Packet) => {
      for (let tries = 0; tries < 80; tries++) {
        const key = channelKeys[Math.floor(rand() * channelKeys.length)];
        const [k, m] = key.split(",").map(Number);
        if (!project(k * CELL, 0, m * CELL)) continue;
        if (out.sx < 0 || out.sx > width || out.sy < 0 || out.sy > height * DOT_BAND_TOP) continue;
        const dirs = channels.get(key) ?? [];
        const [dk, dm] = dirs[Math.floor(rand() * dirs.length)];
        Object.assign(packet, { k, m, dk, dm, p: rand() });
        packet.trail.length = 0;
        return;
      }
    };
    const advance = (packet: Packet, dt: number) => {
      packet.p += PACKET_SPEED * dt;
      while (packet.p >= 1) {
        packet.p -= 1;
        packet.k += packet.dk;
        packet.m += packet.dm;
        if (!project(packet.k * CELL, 0, packet.m * CELL) || out.sx < -80 || out.sx > width + 80 || out.sy < -80 || out.sy > height + 80) {
          spawn(packet);
          return;
        }
        const dirs = (channels.get(`${packet.k},${packet.m}`) ?? []).filter(([dk, dm]) => dk !== -packet.dk || dm !== -packet.dm);
        if (!dirs.length) {
          packet.dk = -packet.dk;
          packet.dm = -packet.dm;
          continue;
        }
        const straight = dirs.find(([dk, dm]) => dk === packet.dk && dm === packet.dm);
        const [dk, dm] = straight && rand() < 0.55 ? straight : dirs[Math.floor(rand() * dirs.length)];
        packet.dk = dk;
        packet.dm = dm;
      }
      const x = (packet.k + packet.dk * packet.p) * CELL;
      const z = (packet.m + packet.dm * packet.p) * CELL;
      packet.trail.push({ x, z, t: scene });
      while (packet.trail.length > 2 && scene - packet.trail[0].t > PACKET_TRAIL) packet.trail.shift();
    };

    let dots: Dot[] = [];
    let dotsReady = false;
    /** Pairs points along the boxes on screen at the conversion with a dot lattice along the bottom of the final view. */
    const buildDots = () => {
      setCamera(poseAt(CONVERT_AT));
      const sources: { x: number; y: number; z: number; sx: number }[] = [];
      for (const box of boxes) {
        box.fade = project(box.cx, box.top.y, box.cz)
          ? CONVERT_AT + clamp01(out.sx / width) * CONVERT_SWEEP
          : CONVERT_AT;
        for (const outline of [box.top, box.inner]) {
          if (!outline) continue;
          const pts = resample(outline, 0.1);
          for (let i = 0; i < pts.length; i += 2) {
            if (!project(pts[i], outline.y, pts[i + 1])) continue;
            if (out.sx < 0 || out.sx > width || out.sy < 0 || out.sy > height) continue;
            sources.push({ x: pts[i], y: outline.y, z: pts[i + 1], sx: out.sx });
          }
        }
      }

      setCamera(poseAt(CAMERA_SETTLED));
      const corners = [
        ground(0, height * DOT_BAND_TOP),
        ground(width, height * DOT_BAND_TOP),
        ground(0, height),
        ground(width, height),
      ];
      const mid = ground(width / 2, height * ((1 + DOT_BAND_TOP) / 2));
      project(mid.x, 0, mid.z);
      const step = (DOT_SPACING_PX * out.depth) / focal;
      const xs = corners.map((c) => c.x);
      const zs = corners.map((c) => c.z);
      const targets: { x: number; z: number; sx: number }[] = [];
      for (let z = Math.floor(Math.min(...zs) / step) * step; z <= Math.max(...zs) + step; z += step) {
        for (let x = Math.floor(Math.min(...xs) / step) * step; x <= Math.max(...xs) + step; x += step) {
          if (!project(x, 0, z)) continue;
          if (out.sx < 0 || out.sx > width || out.sy < height * DOT_BAND_TOP || out.sy > height) continue;
          targets.push({ x, z, sx: out.sx });
        }
      }

      sources.sort((a, b) => a.sx - b.sx);
      targets.sort((a, b) => a.sx - b.sx);
      dots = targets.map((target, i) => {
        const source = sources[Math.floor((i / targets.length) * sources.length)] ?? { x: target.x, y: 0, z: target.z, sx: target.sx };
        return {
          x0: source.x,
          y0: source.y,
          z0: source.z,
          x1: target.x,
          z1: target.z,
          start: CONVERT_AT + clamp01(source.sx / width) * CONVERT_SWEEP,
        };
      });
      dotsReady = true;
    };

    const dotWave = (x: number, z: number) => 0.5 * Math.sin(x * 1.6 - scene * 1.4) * Math.cos(z * 1.2 + scene * 0.6);

    const draw = (showPackets: boolean) => {
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, width, height);
      setCamera(poseAt(scene));

      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      for (const box of boxes) {
        const reveal = clamp01((scene - box.reveal) / 0.9);
        const alpha = reveal > 0 ? 1 - smoothstep(box.fade, box.fade + 0.5, scene) : 0;
        if (alpha < 0.01) continue;
        const fraction = easeInOut(reveal);
        ctx.lineWidth = 1;
        if (box.base && box.top.y > 0.05) {
          ctx.strokeStyle = `rgb(${LINE_RGB} / ${0.28 * alpha})`;
          ctx.beginPath();
          traceOutline(box.base, fraction);
          ctx.stroke();
        }
        ctx.strokeStyle = `rgb(${LINE_RGB} / ${0.8 * alpha})`;
        ctx.beginPath();
        traceOutline(box.top, fraction);
        ctx.stroke();
        if (box.inner) {
          ctx.strokeStyle = `rgb(${LINE_RGB} / ${0.5 * alpha})`;
          ctx.beginPath();
          traceOutline(box.inner, clamp01((scene - box.reveal - 0.4) / 0.9));
          ctx.stroke();
        }
      }

      const packetAlpha = showPackets ? smoothstep(PACKETS_IN, PACKETS_IN + 0.7, scene) * (1 - smoothstep(PACKETS_OUT - 0.8, PACKETS_OUT, scene)) : 0;
      if (packetAlpha > 0.01) {
        ctx.strokeStyle = `rgb(${PACKET_RGB} / ${0.95 * packetAlpha})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (const packet of packets) {
          let started = false;
          for (const point of packet.trail) {
            if (!project(point.x, 0, point.z)) continue;
            if (started) ctx.lineTo(out.sx, out.sy);
            else {
              ctx.moveTo(out.sx, out.sy);
              started = true;
            }
          }
        }
        ctx.stroke();
      }

      if (dotsReady && scene >= CONVERT_AT) {
        ctx.fillStyle = `rgb(${LINE_RGB} / 0.85)`;
        ctx.beginPath();
        for (const dot of dots) {
          if (scene < dot.start) continue;
          const p = easeInOut(clamp01((scene - dot.start) / FLIGHT));
          const x = lerp(dot.x0, dot.x1, p);
          const z = lerp(dot.z0, dot.z1, p);
          const y = lerp(dot.y0, dotWave(dot.x1, dot.z1), p) + Math.sin(Math.PI * p) * 0.8;
          if (!project(x, y, z)) continue;
          const r = Math.min(2.4, Math.max(0.8, (1.5 * 9.5) / out.depth));
          ctx.moveTo(out.sx + r, out.sy);
          ctx.arc(out.sx, out.sy, r, 0, Math.PI * 2);
        }
        ctx.fill();
      }

      if (quiet.rx > 0) {
        ctx.globalCompositeOperation = "destination-out";
        ctx.save();
        ctx.translate(quiet.x, quiet.y);
        ctx.scale(quiet.rx, quiet.ry);
        const mask = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
        mask.addColorStop(0, "rgb(0 0 0 / 1)");
        mask.addColorStop(0.6, "rgb(0 0 0 / 0.92)");
        mask.addColorStop(1, "rgb(0 0 0 / 0)");
        ctx.fillStyle = mask;
        ctx.fillRect(-1, -1, 2, 2);
        ctx.restore();
        ctx.globalCompositeOperation = "source-over";
      }
    };

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      focal = Math.min(height * 0.95, Math.max(width * 0.62, height * 0.7));
      centerY = height * 0.5;
      const copy = copyRef.current?.getBoundingClientRect();
      quiet = copy
        ? {
            x: copy.left - rect.left + copy.width / 2,
            y: copy.top - rect.top + copy.height / 2,
            rx: copy.width * 0.72 + 24,
            ry: copy.height * 0.95 + 24,
          }
        : { x: 0, y: 0, rx: 0, ry: 0 };
      buildDots();
      if (reduceMotion) draw(false);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    if (reduceMotion) {
      scene = 7;
      draw(false);
      return () => observer.disconnect();
    }

    setCamera(poseAt(PACKETS_IN));
    const packetCount = width < 768 ? 9 : 16;
    for (let i = 0; i < packetCount; i++) {
      const packet: Packet = { k: 0, m: 0, dk: 1, dm: 0, p: 0, trail: [] };
      spawn(packet);
      packets.push(packet);
    }

    let raf = 0;
    let last = 0;
    let onScreen = true;
    const frame = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      scene += dt;
      if (scene > PACKETS_IN - 0.5 && scene < PACKETS_OUT) {
        setCamera(poseAt(scene));
        for (const packet of packets) advance(packet, dt);
      }
      draw(true);
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (raf || !onScreen || document.hidden) return;
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const visibility = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) start();
      else stop();
    });
    visibility.observe(canvas);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);
    start();

    return () => {
      stop();
      observer.disconnect();
      visibility.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [copyRef]);

  return <canvas ref={canvasRef} className="doehealth-security-hero__canvas" aria-hidden />;
}

/** Full-height brown hero for /security: the box scene behind the protocol introduction. */
export function DoeHealthSecurityHero() {
  const copyRef = useRef<HTMLDivElement>(null);

  return (
    <section className="doehealth-desk2-blank doehealth-desk2-blank--brown doehealth-desk2-nav-wash-surface doehealth-security-hero">
      <SecurityScene copyRef={copyRef} />
      <div className="doehealth-security-hero__copy">
        <div ref={copyRef} className="doehealth-security-hero__copy-inner">
          <p className="doehealth-security-hero__eyebrow">Introducing</p>
          <h1 className={`doehealth-security-hero__title ${p22Mackinac.className}`}>The Health Intelligence Protocol</h1>
          <p className="doehealth-security-hero__sub">
            We&rsquo;re reimagining security for the next era of AI in healthcare.
          </p>
        </div>
      </div>
    </section>
  );
}
