"use client";

import { useEffect, useRef } from "react";
import { ClinicWorkflowDiagram } from "@/components/herodesign/ClinicWorkflowDiagram";
import { MAIN_PAGE_BEIGE } from "@/lib/main-page-design-backdrop";

const GRID = 13;
const MAX_R = 2.2;
const MIN_R = 0.55;
const MAX_OPA = 0.36;
const MIN_OPA = 0.12;
const DOT_RGB = "153, 153, 153";

function waveAmp(wx: number, wy: number, phX: number, phY: number): number {
  const p1 = (wx + phX) * 0.007 + (wy + phY) * 0.013;
  const p2 = (wx + phX) * 0.0135 - (wy + phY) * 0.006;
  const a = (Math.cos(p1) + 1) * 0.5;
  const b = (Math.cos(p2 * 1.35 + 0.6) + 1) * 0.5;
  const c = (Math.cos(p1 * 2.1 + p2 * 0.8 - 0.4) + 1) * 0.5;
  const raw = a * 0.52 + b * 0.3 + c * 0.18;
  return 0.25 + raw * 0.75;
}

function displace(wx: number, wy: number, phX: number, phY: number): [number, number] {
  const q1 = (wx + phX * 0.4) * 0.0095 + (wy + phY * 0.4) * 0.0105;
  const q2 = (wx + phX * 0.4) * 0.0125 - (wy + phY * 0.4) * 0.008;
  const D = 4;
  return [
    Math.sin(q2 * 1.7 + 0.5) * D + Math.sin(q1 * 0.9 - 0.3) * D * 0.45,
    Math.cos(q1 * 1.5 - 0.4) * D + Math.cos(q2 * 1.1 + 0.8) * D * 0.4,
  ];
}

export default function HeroDesignPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phRef = useRef({ x: 0, y: 0 });
  const phVelRef = useRef({ x: 0.3, y: 0.2 });

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let W = 0;
    let H = 0;
    let dpr = 1;
    let raf = 0;
    let lastT = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const frame = (t: number) => {
      const dt = Math.min((t - lastT) / 16.667, 3);
      lastT = t;
      const ph = phRef.current;
      const phVel = phVelRef.current;

      const BASE_VEL = 0.25;
      phVel.x *= Math.pow(0.96, dt);
      phVel.y *= Math.pow(0.96, dt);
      if (Math.abs(phVel.x) < BASE_VEL) phVel.x += Math.sign(BASE_VEL) * 0.004 * dt;
      if (Math.abs(phVel.y) < BASE_VEL) phVel.y += Math.sign(BASE_VEL) * 0.003 * dt;
      ph.x += phVel.x * dt;
      ph.y += phVel.y * dt;

      ctx.clearRect(0, 0, W, H);
      const ox = -W / 2;
      const oy = -H / 2;

      for (let gi = Math.floor(ox / GRID) - 2; gi <= Math.ceil((ox + W) / GRID) + 2; gi++) {
        for (let gj = Math.floor(oy / GRID) - 2; gj <= Math.ceil((oy + H) / GRID) + 2; gj++) {
          const wx = gi * GRID;
          const wy = gj * GRID;
          const [ddx, ddy] = displace(wx, wy, ph.x, ph.y);
          const amp = waveAmp(wx + ddx * 0.4, wy + ddy * 0.4, ph.x, ph.y);
          const sx = wx + ddx - ox;
          const sy = wy + ddy - oy;
          const r = MIN_R + amp * (MAX_R - MIN_R);
          const alpha = MIN_OPA + amp * (MAX_OPA - MIN_OPA);
          ctx.beginPath();
          ctx.arc(sx, sy, r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${DOT_RGB},${alpha.toFixed(3)})`;
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame((t) => {
      lastT = t;
      raf = requestAnimationFrame(frame);
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div
      className="relative min-h-[100dvh] w-screen overflow-x-hidden"
      style={{ backgroundColor: MAIN_PAGE_BEIGE }}
    >
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 block" aria-hidden />

      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col">
        <header className="shrink-0 px-8 pb-2 pt-8">
          <p className="text-[11px] font-normal uppercase tracking-[0.18em] text-neutral-500">
            Clinic AI Workflow
          </p>
          <h1 className="mt-1 text-[22px] font-normal tracking-tight text-neutral-800">
            From first call to visit-ready chart
          </h1>
        </header>

        <div className="min-h-[1400px] flex-1 px-4 pb-12">
          <ClinicWorkflowDiagram />
        </div>
      </div>
    </div>
  );
}
