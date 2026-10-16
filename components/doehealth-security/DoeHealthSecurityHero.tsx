"use client";

import { useEffect, useRef } from "react";

import { p22Mackinac } from "@/lib/home/fonts";

/** Grid lines (Doe salmon) and the brighter salmon of the packets and checkpoints, as R G B. */
const LINE_RGB = "232 165 133";
const GLOW_RGB = "252 207 184";

/** World units: grid cell size and the step lines are sampled at along their length. */
const CELL = 0.7;
const SAMPLE = 0.2;

/** Camera: high above the ground plane, tilted down steeply so the grid reads as seen from above. */
const CAM_HEIGHT = 9;
const PITCH = (62 * Math.PI) / 180;
const SIN_P = Math.sin(PITCH);
const COS_P = Math.cos(PITCH);

/** The cloud bank: overlapping round puffs on the ground plane. The grid only exists inside them, raised in the middle. */
const PUFFS = [
  ...[-10.5, -7, -3.5, 0, 3.5, 7, 10.5].map((x, k) => ({ x, z: -8 - (k % 2) * 1.2, r: 1.7 })),
  ...[-8.75, -5.25, -1.75, 1.75, 5.25, 8.75].map((x) => ({ x, z: -6, r: 2.2 })),
  ...[-10.5, -7, -3.5, 0, 3.5, 7, 10.5].map((x, k) => ({ x, z: -3.6 - (k % 2) * 0.5, r: 1.9 })),
];

/** The rim is traced where the density crosses the middle of the cloud mask. */
const RIM_LEVEL = 0.49;

/** The dot field uses a finer step on the same lattice, so every grid line passes through a row of dots. */
const DOT_STEP = CELL / 3;

const PACKET_COUNT = 9;
const PACKET_SPEED = 1.9;
const TRAIL_SECONDS = 1.1;
const CHECKPOINT_COUNT = 14;
const PULSE_SECONDS = 1.6;
/** Segments and dots are batched into this many alpha levels, so each frame strokes a handful of paths. */
const ALPHA_BUCKETS = 12;

type Sample = { x: number; z: number; h: number; m: number };
type TrailPoint = { x: number; z: number; h: number; t: number };
type Packet = {
  i: number;
  j: number;
  di: number;
  dj: number;
  p: number;
  age: number;
  life: number;
  trail: TrailPoint[];
};
type Checkpoint = { i: number; j: number; m: number; h: number; pulse: number };

function smoothstep(a: number, b: number, v: number) {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

function density(x: number, z: number) {
  let d = 0;
  for (const puff of PUFFS) {
    const dx = x - puff.x;
    const dz = z - puff.z;
    d += Math.exp(-(dx * dx + dz * dz) / (puff.r * puff.r));
  }
  return d;
}

const cloudMask = (d: number) => smoothstep(0.42, 0.56, d);
const cloudHeight = (d: number) => 1.6 * smoothstep(0.3, 1.6, d);

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

/** Grid lines inside the cloud, split into runs wherever a line leaves the cloud. */
function buildLines() {
  const lines: Sample[][] = [];
  const xMin = -15;
  const xMax = 15;
  const zMin = -14;
  const zMax = -0.5;
  const pushRuns = (points: { x: number; z: number }[]) => {
    let run: Sample[] = [];
    for (const { x, z } of points) {
      const d = density(x, z);
      const m = cloudMask(d);
      if (m > 0.005) {
        run.push({ x, z, h: cloudHeight(d), m });
      } else {
        if (run.length > 1) lines.push(run);
        run = [];
      }
    }
    if (run.length > 1) lines.push(run);
  };
  for (let i = Math.ceil(xMin / CELL); i <= Math.floor(xMax / CELL); i++) {
    const points = [];
    for (let z = zMin; z <= zMax; z += SAMPLE) points.push({ x: i * CELL, z });
    pushRuns(points);
  }
  for (let j = Math.ceil(zMin / CELL); j <= Math.floor(zMax / CELL); j++) {
    const points = [];
    for (let x = xMin; x <= xMax; x += SAMPLE) points.push({ x, z: j * CELL });
    pushRuns(points);
  }
  return lines;
}

/** The cloud outline as world-space segments [x0, z0, x1, z1, ...], traced once with marching squares. */
function buildRim() {
  const step = 0.1;
  const xMin = -15;
  const zMin = -14;
  const cols = Math.round(30 / step);
  const rows = Math.round(14 / step);
  const field = new Float32Array((cols + 1) * (rows + 1));
  for (let r = 0; r <= rows; r++) {
    for (let c = 0; c <= cols; c++) {
      field[r * (cols + 1) + c] = density(xMin + c * step, zMin + r * step) - RIM_LEVEL;
    }
  }
  const segments: number[] = [];
  const at = (c: number, r: number) => field[r * (cols + 1) + c];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const corners = [
        { x: c, z: r, v: at(c, r) },
        { x: c + 1, z: r, v: at(c + 1, r) },
        { x: c + 1, z: r + 1, v: at(c + 1, r + 1) },
        { x: c, z: r + 1, v: at(c, r + 1) },
      ];
      const hits: number[] = [];
      for (let e = 0; e < 4; e++) {
        const a = corners[e];
        const b = corners[(e + 1) % 4];
        if (a.v > 0 === b.v > 0) continue;
        const t = a.v / (a.v - b.v);
        hits.push(xMin + (a.x + (b.x - a.x) * t) * step, zMin + (a.z + (b.z - a.z) * t) * step);
      }
      for (let k = 0; k + 3 < hits.length; k += 4) segments.push(hits[k], hits[k + 1], hits[k + 2], hits[k + 3]);
    }
  }
  return segments;
}

/**
 * The /security hero visual: a camera high above a salmon line grid shaped like a cloud bank, panning slowly.
 * Packets run along the grid lines and pulse the checkpoints they pass; toward the bottom of the hero the grid
 * dissolves into the same lattice as a field of dots that rides a slow wave across the full width.
 */
function SecurityGridCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const rand = mulberry32(7);
    const lines = buildLines();
    const rim = buildRim();

    const nodeOk = new Map<string, boolean>();
    const isOk = (i: number, j: number) => {
      const key = `${i},${j}`;
      let ok = nodeOk.get(key);
      if (ok === undefined) {
        ok = cloudMask(density(i * CELL, j * CELL)) > 0.6;
        nodeOk.set(key, ok);
      }
      return ok;
    };

    const innerNodes: { i: number; j: number; m: number; h: number }[] = [];
    for (let i = -22; i <= 22; i++) {
      for (let j = -20; j <= 0; j++) {
        const d = density(i * CELL, j * CELL);
        const m = cloudMask(d);
        if (m > 0.85) innerNodes.push({ i, j, m, h: cloudHeight(d) });
      }
    }

    const checkpoints: Checkpoint[] = [];
    const shuffled = [...innerNodes].sort(() => rand() - 0.5);
    for (const node of shuffled) {
      if (checkpoints.length >= CHECKPOINT_COUNT) break;
      if (checkpoints.some((c) => Math.abs(c.i - node.i) + Math.abs(c.j - node.j) < 4)) continue;
      checkpoints.push({ ...node, pulse: -10 });
    }
    const checkpointAt = new Map(checkpoints.map((c) => [`${c.i},${c.j}`, c]));

    const DIRS: [number, number][] = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];

    const spawn = (packet: Packet) => {
      for (let tries = 0; tries < 200; tries++) {
        const node = innerNodes[Math.floor(rand() * innerNodes.length)];
        const dirs = DIRS.filter(([di, dj]) => isOk(node.i + di, node.j + dj));
        if (!dirs.length) continue;
        const [di, dj] = dirs[Math.floor(rand() * dirs.length)];
        packet.i = node.i;
        packet.j = node.j;
        packet.di = di;
        packet.dj = dj;
        packet.p = 0;
        packet.age = 0;
        packet.life = 6 + rand() * 7;
        packet.trail.length = 0;
        return;
      }
    };

    const packets: Packet[] = Array.from({ length: PACKET_COUNT }, () => {
      const packet: Packet = { i: 0, j: 0, di: 1, dj: 0, p: 0, age: 0, life: 1, trail: [] };
      spawn(packet);
      packet.age = rand() * packet.life * 0.6;
      return packet;
    });

    let simTime = 0;

    const turn = (packet: Packet) => {
      const straight: [number, number] = [packet.di, packet.dj];
      const left: [number, number] = [-packet.dj, packet.di];
      const right: [number, number] = [packet.dj, -packet.di];
      const roll = rand();
      const order = roll < 0.6 ? [straight, left, right] : roll < 0.8 ? [left, right, straight] : [right, left, straight];
      const next = order.find(([di, dj]) => isOk(packet.i + di, packet.j + dj));
      if (!next) {
        spawn(packet);
        return;
      }
      packet.di = next[0];
      packet.dj = next[1];
    };

    const step = (dt: number) => {
      simTime += dt;
      for (const packet of packets) {
        packet.age += dt;
        if (packet.age > packet.life) {
          spawn(packet);
          continue;
        }
        packet.p += PACKET_SPEED * dt;
        while (packet.p >= 1) {
          packet.p -= 1;
          packet.i += packet.di;
          packet.j += packet.dj;
          const checkpoint = checkpointAt.get(`${packet.i},${packet.j}`);
          if (checkpoint && simTime - checkpoint.pulse > PULSE_SECONDS * 0.6) checkpoint.pulse = simTime;
          turn(packet);
        }
        const x = (packet.i + packet.di * packet.p) * CELL;
        const z = (packet.j + packet.dj * packet.p) * CELL;
        packet.trail.push({ x, z, h: cloudHeight(density(x, z)), t: simTime });
        while (packet.trail.length && simTime - packet.trail[0].t > TRAIL_SECONDS) packet.trail.shift();
      }
    };

    let width = 0;
    let height = 0;
    let focal = 1;
    let centerY = 0;
    const cam = { x: 0, z: 0 };
    const out = { sx: 0, sy: 0, depth: 0 };

    const project = (x: number, y: number, z: number) => {
      const dx = x - cam.x;
      const dy = y - CAM_HEIGHT;
      const dz = z - cam.z;
      const camY = dy * COS_P - dz * SIN_P;
      const depth = -dy * SIN_P - dz * COS_P;
      if (depth < 0.5) return false;
      const k = focal / depth;
      out.sx = width / 2 + dx * k;
      out.sy = centerY - camY * k;
      out.depth = depth;
      return true;
    };

    const breathe = (h: number, x: number, z: number) => h * (1 + 0.08 * Math.sin(simTime * 0.5 + x * 0.35 + z * 0.25));
    const lineFade = (sy: number) => 1 - smoothstep(height * 0.58, height * 0.76, sy);
    const dotFade = (sy: number) => smoothstep(height * 0.56, height * 0.78, sy);

    const buckets: number[][] = Array.from({ length: ALPHA_BUCKETS }, () => []);
    const bucketOf = (a: number) => Math.min(ALPHA_BUCKETS - 1, Math.floor(a * ALPHA_BUCKETS));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      cam.x = 1.8 * Math.sin(simTime * 0.06);
      cam.z = 0.7 * Math.sin(simTime * 0.045 + 1);

      for (const bucket of buckets) bucket.length = 0;
      for (const run of lines) {
        let prevOk = false;
        let px = 0;
        let py = 0;
        let pm = 0;
        for (const s of run) {
          const ok = project(s.x, breathe(s.h, s.x, s.z), s.z);
          if (ok && prevOk) {
            const a = Math.min(pm, s.m) * lineFade((py + out.sy) / 2);
            if (a > 0.02) buckets[bucketOf(a)].push(px, py, out.sx, out.sy);
          }
          prevOk = ok;
          px = out.sx;
          py = out.sy;
          pm = s.m;
        }
      }
      ctx.lineWidth = 1;
      buckets.forEach((coords, b) => {
        if (!coords.length) return;
        ctx.strokeStyle = `rgb(${LINE_RGB} / ${((b + 0.5) / ALPHA_BUCKETS) * 0.5})`;
        ctx.beginPath();
        for (let k = 0; k < coords.length; k += 4) {
          ctx.moveTo(coords[k], coords[k + 1]);
          ctx.lineTo(coords[k + 2], coords[k + 3]);
        }
        ctx.stroke();
      });

      for (const bucket of buckets) bucket.length = 0;
      for (let k = 0; k < rim.length; k += 4) {
        if (!project(rim[k], 0, rim[k + 1])) continue;
        const x0 = out.sx;
        const y0 = out.sy;
        if (!project(rim[k + 2], 0, rim[k + 3])) continue;
        const a = lineFade((y0 + out.sy) / 2);
        if (a > 0.02) buckets[bucketOf(a)].push(x0, y0, out.sx, out.sy);
      }
      ctx.lineWidth = 1.2;
      buckets.forEach((coords, b) => {
        if (!coords.length) return;
        ctx.strokeStyle = `rgb(${GLOW_RGB} / ${((b + 0.5) / ALPHA_BUCKETS) * 0.6})`;
        ctx.beginPath();
        for (let k = 0; k < coords.length; k += 4) {
          ctx.moveTo(coords[k], coords[k + 1]);
          ctx.lineTo(coords[k + 2], coords[k + 3]);
        }
        ctx.stroke();
      });

      for (const bucket of buckets) bucket.length = 0;
      const iMin = Math.floor((cam.x - 11) / DOT_STEP);
      const iMax = Math.ceil((cam.x + 11) / DOT_STEP);
      const jMin = Math.floor((cam.z - 5.6) / DOT_STEP);
      const jMax = Math.ceil((cam.z + 3) / DOT_STEP);
      for (let j = jMin; j <= jMax; j++) {
        for (let i = iMin; i <= iMax; i++) {
          const x = i * DOT_STEP;
          const z = j * DOT_STEP;
          const y = 0.32 * Math.sin(x * 0.7 - simTime * 1.2) * Math.cos(z * 0.45 + simTime * 0.45) + 0.05;
          if (!project(x, y, z)) continue;
          const a = dotFade(out.sy);
          if (a < 0.02) continue;
          if (out.sx < -4 || out.sx > width + 4 || out.sy > height + 4) continue;
          const r = Math.min(2.6, Math.max(0.6, (1.2 * 8) / out.depth));
          buckets[bucketOf(a)].push(out.sx, out.sy, r);
        }
      }
      buckets.forEach((dots, b) => {
        if (!dots.length) return;
        ctx.fillStyle = `rgb(${LINE_RGB} / ${((b + 0.5) / ALPHA_BUCKETS) * 0.8})`;
        ctx.beginPath();
        for (let k = 0; k < dots.length; k += 3) {
          ctx.moveTo(dots[k] + dots[k + 2], dots[k + 1]);
          ctx.arc(dots[k], dots[k + 1], dots[k + 2], 0, Math.PI * 2);
        }
        ctx.fill();
      });

      for (const c of checkpoints) {
        const x = c.i * CELL;
        const z = c.j * CELL;
        if (!project(x, breathe(c.h, x, z), z)) continue;
        const a = lineFade(out.sy) * c.m;
        if (a < 0.02) continue;
        const r = Math.min(5, Math.max(1.5, 34 / out.depth));
        ctx.strokeStyle = `rgb(${GLOW_RGB} / ${0.55 * a})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(out.sx, out.sy, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = `rgb(${GLOW_RGB} / ${0.8 * a})`;
        ctx.beginPath();
        ctx.arc(out.sx, out.sy, r * 0.35, 0, Math.PI * 2);
        ctx.fill();
        const age = simTime - c.pulse;
        if (age >= 0 && age < PULSE_SECONDS) {
          const k = age / PULSE_SECONDS;
          const grow = 1 - (1 - k) ** 3;
          ctx.strokeStyle = `rgb(${GLOW_RGB} / ${(1 - k) * 0.75 * a})`;
          ctx.beginPath();
          ctx.arc(out.sx, out.sy, r * (1 + 3.5 * grow), 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      ctx.lineWidth = 1.6;
      ctx.lineCap = "round";
      for (const packet of packets) {
        const life = smoothstep(0, 0.6, packet.age) * (1 - smoothstep(packet.life - 0.8, packet.life, packet.age));
        const trail = packet.trail;
        if (trail.length < 2 || life < 0.01) continue;
        let prevOk = false;
        let px = 0;
        let py = 0;
        for (let k = 0; k < trail.length; k++) {
          const point = trail[k];
          const ok = project(point.x, breathe(point.h, point.x, point.z) + 0.02, point.z);
          if (ok && prevOk) {
            const a = (k / trail.length) ** 1.5 * 0.9 * life * lineFade(out.sy);
            if (a > 0.01) {
              ctx.strokeStyle = `rgb(${GLOW_RGB} / ${a})`;
              ctx.beginPath();
              ctx.moveTo(px, py);
              ctx.lineTo(out.sx, out.sy);
              ctx.stroke();
            }
          }
          prevOk = ok;
          px = out.sx;
          py = out.sy;
        }
        const head = trail[trail.length - 1];
        if (!project(head.x, breathe(head.h, head.x, head.z) + 0.02, head.z)) continue;
        const a = life * lineFade(out.sy);
        if (a < 0.02) continue;
        const glow = ctx.createRadialGradient(out.sx, out.sy, 0, out.sx, out.sy, 11);
        glow.addColorStop(0, `rgb(${GLOW_RGB} / ${0.55 * a})`);
        glow.addColorStop(1, `rgb(${GLOW_RGB} / 0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(out.sx, out.sy, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgb(255 252 241 / ${0.95 * a})`;
        ctx.beginPath();
        ctx.arc(out.sx, out.sy, 1.8, 0, Math.PI * 2);
        ctx.fill();
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
      centerY = height * (width < 768 ? 0.46 : 0.56);
      if (reduceMotion) draw();
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    if (reduceMotion) {
      for (let k = 0; k < 120; k++) step(1 / 30);
      draw();
      return () => observer.disconnect();
    }

    let raf = 0;
    let last = 0;
    let onScreen = true;
    const frame = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      step(dt);
      draw();
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
  }, []);

  return <canvas ref={canvasRef} className="doehealth-security-hero__canvas" aria-hidden />;
}

/** Full-height brown hero for /security: the grid visual behind the protocol introduction. */
export function DoeHealthSecurityHero() {
  return (
    <section className="doehealth-desk2-blank doehealth-desk2-blank--brown doehealth-desk2-nav-wash-surface doehealth-security-hero">
      <SecurityGridCanvas />
      <div className="doehealth-security-hero__copy">
        <div className="doehealth-security-hero__copy-inner">
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
