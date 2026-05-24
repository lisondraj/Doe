"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CreateBlockMenu, CREATE_BLOCK_MENU_H, CREATE_BLOCK_MENU_W } from "@/components/workflow/CreateBlockMenu";
import { MAIN_PAGE_BEIGE } from "@/lib/main-page-design-backdrop";

/* ─── Dot field constants ─────────────────────────────────────────────────── */

const GRID = 13;
const MAX_R = 2.2;
const MIN_R = 0.55;
const MAX_OPA = 0.36;
const MIN_OPA = 0.12;
const DOT_RGB = "153, 153, 153";

const BOX_W = CREATE_BLOCK_MENU_W;
const BOX_H = CREATE_BLOCK_MENU_H;
const PAN_THRESHOLD = 6;
const BOX_HW = BOX_W / 2;
const BOX_HH = BOX_H / 2;
const BOX_SPAWN_MARGIN = 16;

/* ─── Workflow types ──────────────────────────────────────────────────────── */

type WfBox = {
  id: string;
  cx: number;
  cy: number;
};

type WfConnection = {
  id: string;
  fromId: string;
  toId: string;
};

type ConnectDraft = {
  fromId: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  hoverToId: string | null;
};

type Viewport = { w: number; h: number };

type BoxPointerMode = "pending" | "move" | "connect";

type BoxPointerRef = {
  boxId: string;
  sx: number;
  sy: number;
  startCx: number;
  startCy: number;
  el: HTMLElement;
  mode: BoxPointerMode;
};

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

function screenToWorld(sx: number, sy: number, cam: { x: number; y: number }, vp: Viewport) {
  return { x: sx + cam.x - vp.w / 2, y: sy + cam.y - vp.h / 2 };
}

/** Keep the full block on-screen when spawning near viewport edges. */
function clampBoxSpawnToViewport(sx: number, sy: number, vp: Viewport) {
  const minX = BOX_HW + BOX_SPAWN_MARGIN;
  const maxX = Math.max(minX, vp.w - BOX_HW - BOX_SPAWN_MARGIN);
  const minY = BOX_HH + BOX_SPAWN_MARGIN;
  const maxY = Math.max(minY, vp.h - BOX_HH - BOX_SPAWN_MARGIN);
  return {
    sx: Math.min(maxX, Math.max(minX, sx)),
    sy: Math.min(maxY, Math.max(minY, sy)),
  };
}

/** Where a ray from box centre toward (wx, wy) meets the box edge. */
function boxEdgeAnchor(box: WfBox, wx: number, wy: number) {
  const dx = wx - box.cx;
  const dy = wy - box.cy;
  if (Math.abs(dx) < 1e-6 && Math.abs(dy) < 1e-6) {
    return { x: box.cx + BOX_HW, y: box.cy };
  }
  const scaleX = dx !== 0 ? BOX_HW / Math.abs(dx) : Infinity;
  const scaleY = dy !== 0 ? BOX_HH / Math.abs(dy) : Infinity;
  const scale = Math.min(scaleX, scaleY);
  return { x: box.cx + dx * scale, y: box.cy + dy * scale };
}

function pointInBox(wx: number, wy: number, box: WfBox) {
  return Math.abs(wx - box.cx) <= BOX_HW && Math.abs(wy - box.cy) <= BOX_HH;
}

function boxAtWorld(wx: number, wy: number, boxes: WfBox[], excludeId?: string) {
  for (let i = boxes.length - 1; i >= 0; i--) {
    const b = boxes[i];
    if (excludeId && b.id === excludeId) continue;
    if (pointInBox(wx, wy, b)) return b;
  }
  return null;
}

let idCounter = 0;
const nextId = () => `wf-${++idCounter}-${Date.now()}`;

/* ─── Page ────────────────────────────────────────────────────────────────── */

export default function WorkflowPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const worldLayerRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<SVGSVGElement>(null);
  const camRef = useRef({ x: 0, y: 0 });
  const phRef = useRef({ x: 0, y: 0 });
  const phVelRef = useRef({ x: 0.3, y: 0.2 });
  const dragRef = useRef<{ on: boolean; lx: number; ly: number }>({ on: false, lx: 0, ly: 0 });
  const pendingRef = useRef<{ sx: number; sy: number } | null>(null);
  const boxPointerRef = useRef<BoxPointerRef | null>(null);
  const viewportRef = useRef<Viewport>({ w: 1200, h: 800 });

  const boxesRef = useRef<WfBox[]>([]);
  const connectionsRef = useRef<WfConnection[]>([]);
  const connectDraftRef = useRef<ConnectDraft | null>(null);

  const [viewport, setViewport] = useState<Viewport>({ w: 1200, h: 800 });
  const [boxes, setBoxes] = useState<WfBox[]>([]);
  const [connections, setConnections] = useState<WfConnection[]>([]);
  const [connectDraft, setConnectDraft] = useState<ConnectDraft | null>(null);
  const [newBoxIds, setNewBoxIds] = useState<Set<string>>(new Set());
  const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);
  const selectedBoxIdRef = useRef<string | null>(null);

  const syncOverlayTransform = useCallback(() => {
    const vp = viewportRef.current;
    const cam = camRef.current;
    const tx = vp.w / 2 - cam.x;
    const ty = vp.h / 2 - cam.y;
    const t = `translate3d(${tx}px,${ty}px,0)`;
    if (worldLayerRef.current) worldLayerRef.current.style.transform = t;
    if (linesRef.current) linesRef.current.style.transform = t;
  }, []);

  const paintLines = useCallback(() => {
    const svg = linesRef.current;
    if (!svg) return;

    const parts: string[] = [
      `<defs>
        <marker id="wf-cap" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <circle cx="3" cy="3" r="2.25" fill="#BFBFBF"/>
        </marker>
      </defs>`,
    ];

    for (const c of connectionsRef.current) {
      const from = boxesRef.current.find((b) => b.id === c.fromId);
      const to = boxesRef.current.find((b) => b.id === c.toId);
      if (!from || !to) continue;
      const a = boxEdgeAnchor(from, to.cx, to.cy);
      const b = boxEdgeAnchor(to, from.cx, from.cy);
      parts.push(
        `<circle cx="${a.x}" cy="${a.y}" r="3" fill="#C8C8C8"/>`,
        `<circle cx="${b.x}" cy="${b.y}" r="3" fill="#C8C8C8"/>`,
        `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="#C8C8C8" stroke-width="1" stroke-linecap="round" marker-end="url(#wf-cap)"/>`,
      );
    }

    const draft = connectDraftRef.current;
    if (draft) {
      parts.push(
        `<circle cx="${draft.fromX}" cy="${draft.fromY}" r="3.5" fill="#A8A8A8"/>`,
        `<line x1="${draft.fromX}" y1="${draft.fromY}" x2="${draft.toX}" y2="${draft.toY}" stroke="#A8A8A8" stroke-width="1" stroke-linecap="round" stroke-dasharray="5 4"/>`,
        `<circle cx="${draft.toX}" cy="${draft.toY}" r="4" fill="none" stroke="#A8A8A8" stroke-width="1"/>`,
      );
    }

    svg.innerHTML = parts.join("");
  }, []);

  const spawnBox = useCallback((sx: number, sy: number) => {
    const vp = viewportRef.current;
    const safe = clampBoxSpawnToViewport(sx, sy, vp);
    const { x, y } = screenToWorld(safe.sx, safe.sy, camRef.current, vp);
    const id = nextId();
    const box = { id, cx: x, cy: y };
    boxesRef.current = [...boxesRef.current, box];
    setBoxes(boxesRef.current);
    setNewBoxIds((prev) => new Set(prev).add(id));
    window.setTimeout(() => {
      setNewBoxIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 480);
  }, []);

  const completeConnect = useCallback(
    (toBoxId: string) => {
      const draft = connectDraftRef.current;
      if (!draft || draft.fromId === toBoxId) return;
      const exists = connectionsRef.current.some(
        (c) =>
          (c.fromId === draft.fromId && c.toId === toBoxId) ||
          (c.fromId === toBoxId && c.toId === draft.fromId),
      );
      if (!exists) {
        connectionsRef.current = [
          ...connectionsRef.current,
          { id: nextId(), fromId: draft.fromId, toId: toBoxId },
        ];
        setConnections(connectionsRef.current);
      }
      connectDraftRef.current = null;
      setConnectDraft(null);
      paintLines();
    },
    [paintLines],
  );

  const cancelConnect = useCallback(() => {
    connectDraftRef.current = null;
    setConnectDraft(null);
    paintLines();
  }, [paintLines]);

  const deleteBox = useCallback(
    (boxId: string) => {
      boxesRef.current = boxesRef.current.filter((b) => b.id !== boxId);
      connectionsRef.current = connectionsRef.current.filter(
        (c) => c.fromId !== boxId && c.toId !== boxId,
      );
      setBoxes(boxesRef.current);
      setConnections(connectionsRef.current);
      if (connectDraftRef.current?.fromId === boxId) {
        cancelConnect();
      }
      setSelectedBoxId((prev) => (prev === boxId ? null : prev));
      paintLines();
    },
    [cancelConnect, paintLines],
  );

  useEffect(() => {
    boxesRef.current = boxes;
  }, [boxes]);

  useEffect(() => {
    connectionsRef.current = connections;
    paintLines();
  }, [connections, paintLines]);

  useEffect(() => {
    connectDraftRef.current = connectDraft;
    paintLines();
  }, [connectDraft, paintLines]);

  useEffect(() => {
    selectedBoxIdRef.current = selectedBoxId;
  }, [selectedBoxId]);

  /* ── Delete selected box with Backspace ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Backspace") return;
      const active = document.activeElement;
      if (
        active instanceof HTMLTextAreaElement ||
        active instanceof HTMLInputElement ||
        (active instanceof HTMLElement && active.isContentEditable)
      ) {
        return;
      }
      const id = selectedBoxIdRef.current;
      if (!id) return;
      e.preventDefault();
      deleteBox(id);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [deleteBox]);

  /* ── Dot canvas loop ── */
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
      viewportRef.current = { w: W, h: H };
      setViewport({ w: W, h: H });
      syncOverlayTransform();
      paintLines();
    };
    resize();
    window.addEventListener("resize", resize);

    const frame = (t: number) => {
      const dt = Math.min((t - lastT) / 16.667, 3);
      lastT = t;
      const cam = camRef.current;
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
      const ox = cam.x - W / 2;
      const oy = cam.y - H / 2;

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

      syncOverlayTransform();
      if (connectDraftRef.current) paintLines();

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
  }, [syncOverlayTransform, paintLines]);

  /* ── Canvas: pan or spawn box ── */
  useEffect(() => {
    const canvas = canvasRef.current!;

    const onDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      if (e.target !== canvas) return;
      setSelectedBoxId(null);
      pendingRef.current = { sx: e.clientX, sy: e.clientY };
      dragRef.current = { on: false, lx: e.clientX, ly: e.clientY };
    };

    const onMove = (e: MouseEvent) => {
      const pending = pendingRef.current;
      if (!pending) return;

      const dx = e.clientX - pending.sx;
      const dy = e.clientY - pending.sy;
      if (!dragRef.current.on && Math.hypot(dx, dy) > PAN_THRESHOLD) {
        dragRef.current.on = true;
        canvas.style.cursor = "grabbing";
      }

      if (dragRef.current.on) {
        const ddx = e.clientX - dragRef.current.lx;
        const ddy = e.clientY - dragRef.current.ly;
        dragRef.current.lx = e.clientX;
        dragRef.current.ly = e.clientY;
        camRef.current.x -= ddx;
        camRef.current.y -= ddy;
        syncOverlayTransform();
        paintLines();
      }
    };

    const onUp = () => {
      const pending = pendingRef.current;
      pendingRef.current = null;

      if (dragRef.current.on) {
        dragRef.current.on = false;
        canvas.style.cursor = connectDraftRef.current ? "crosshair" : "grab";
        return;
      }

      if (!pending || connectDraftRef.current) return;
      setSelectedBoxId(null);
      spawnBox(pending.sx, pending.sy);
    };

    window.addEventListener("mousedown", onDown);
    canvas.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousedown", onDown);
      canvas.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [spawnBox, syncOverlayTransform, paintLines]);

  /* ── Box pointer: drag = move; shift + drag out = connect line ── */
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const ptr = boxPointerRef.current;
      if (!ptr) return;

      const cam = camRef.current;
      const vp = viewportRef.current;
      const world = screenToWorld(e.clientX, e.clientY, cam, vp);
      const box = boxesRef.current.find((b) => b.id === ptr.boxId);
      if (!box) return;

      const dist = Math.hypot(e.clientX - ptr.sx, e.clientY - ptr.sy);
      const inside = pointInBox(world.x, world.y, box);

      if (ptr.mode === "pending" && dist > PAN_THRESHOLD) {
        if (e.shiftKey && !inside) {
          ptr.mode = "connect";
          const anchor = boxEdgeAnchor(box, world.x, world.y);
          const draft: ConnectDraft = {
            fromId: ptr.boxId,
            fromX: anchor.x,
            fromY: anchor.y,
            toX: world.x,
            toY: world.y,
            hoverToId: null,
          };
          connectDraftRef.current = draft;
          setConnectDraft(draft);
          document.body.style.cursor = "crosshair";
        } else {
          ptr.mode = "move";
          document.body.style.cursor = "grabbing";
        }
      }

      if (ptr.mode === "move") {
        const ddx = e.clientX - ptr.sx;
        const ddy = e.clientY - ptr.sy;
        const newCx = ptr.startCx + ddx;
        const newCy = ptr.startCy + ddy;
        const idx = boxesRef.current.findIndex((b) => b.id === ptr.boxId);
        if (idx >= 0) {
          boxesRef.current[idx] = { ...boxesRef.current[idx], cx: newCx, cy: newCy };
          ptr.el.style.left = `${newCx - BOX_HW}px`;
          ptr.el.style.top = `${newCy - BOX_HH}px`;
        }
        paintLines();
        return;
      }

      if (ptr.mode === "connect") {
        const fromBox = boxesRef.current.find((b) => b.id === ptr.boxId);
        if (!fromBox) return;
        const anchor = boxEdgeAnchor(fromBox, world.x, world.y);
        const hover = boxAtWorld(world.x, world.y, boxesRef.current, ptr.boxId);
        const draft: ConnectDraft = {
          fromId: ptr.boxId,
          fromX: anchor.x,
          fromY: anchor.y,
          toX: world.x,
          toY: world.y,
          hoverToId: hover?.id ?? null,
        };
        connectDraftRef.current = draft;
        setConnectDraft(draft);
        paintLines();
      }
    };

    const onUp = (e: MouseEvent) => {
      const ptr = boxPointerRef.current;
      if (!ptr) return;

      if (ptr.mode === "connect") {
        const world = screenToWorld(e.clientX, e.clientY, camRef.current, viewportRef.current);
        const target = boxAtWorld(world.x, world.y, boxesRef.current, ptr.boxId);
        if (target) {
          completeConnect(target.id);
        } else {
          cancelConnect();
        }
      } else if (ptr.mode === "move") {
        setBoxes([...boxesRef.current]);
        setSelectedBoxId(ptr.boxId);
      } else if (ptr.mode === "pending") {
        setSelectedBoxId(ptr.boxId);
      }

      boxPointerRef.current = null;
      document.body.style.cursor = "";
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && connectDraftRef.current) {
        cancelConnect();
        boxPointerRef.current = null;
        document.body.style.cursor = "";
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("keydown", onKey);
    };
  }, [completeConnect, cancelConnect, paintLines]);

  const onBoxPointerDown = useCallback((box: WfBox, e: React.MouseEvent, el: HTMLElement) => {
    e.stopPropagation();
    if (connectDraftRef.current) return;
    setSelectedBoxId(box.id);
    boxPointerRef.current = {
      boxId: box.id,
      sx: e.clientX,
      sy: e.clientY,
      startCx: box.cx,
      startCy: box.cy,
      el,
      mode: "pending",
    };
  }, []);

  return (
    <div className="relative h-[100dvh] w-screen overflow-hidden" style={{ backgroundColor: MAIN_PAGE_BEIGE }}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block"
        style={{ cursor: connectDraft ? "crosshair" : "grab", touchAction: "none" }}
      />

      <svg
        ref={linesRef}
        className="pointer-events-none absolute left-0 top-0 z-10 overflow-visible"
        style={{ width: viewport.w, height: viewport.h, willChange: "transform" }}
        aria-hidden
      />

      <div
        ref={worldLayerRef}
        className="pointer-events-none absolute left-0 top-0 z-20"
        style={{ willChange: "transform" }}
      >
        {boxes.map((box) => {
          const isNew = newBoxIds.has(box.id);
          const isSource = connectDraft?.fromId === box.id;
          const isTarget = connectDraft?.hoverToId === box.id;
          const isSelected = selectedBoxId === box.id;

          return (
            <div
              key={box.id}
              data-wf-box={box.id}
              className="pointer-events-auto absolute cursor-grab active:cursor-grabbing"
              style={{
                left: box.cx - BOX_HW,
                top: box.cy - BOX_HH,
                width: BOX_W,
                height: BOX_H,
              }}
              onMouseDown={(e) => onBoxPointerDown(box, e, e.currentTarget as HTMLElement)}
            >
              <CreateBlockMenu
                isNew={isNew}
                isSource={isSource}
                isTarget={isTarget}
                isSelected={isSelected}
              />
            </div>
          );
        })}
      </div>

      <style jsx global>{`
        @keyframes wfBoxBounce {
          0% {
            opacity: 0;
            transform: scale(0.96);
          }
          60% {
            opacity: 1;
            transform: scale(1.015);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .wf-box-bounce {
          transform-origin: center center;
          animation: wfBoxBounce 460ms cubic-bezier(0.34, 1.2, 0.64, 1) both;
        }
      `}</style>
    </div>
  );
}
