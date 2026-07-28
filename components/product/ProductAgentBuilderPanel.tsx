"use client";

import { useCallback, useRef, useState, type PointerEvent } from "react";

import { dmSans, suisseIntl } from "@/lib/home/fonts";
import {
  PRODUCT_AGENT_BUILDER_EDGES,
  PRODUCT_AGENT_BUILDER_EDITING,
  PRODUCT_AGENT_BUILDER_HEADER,
  PRODUCT_AGENT_BUILDER_INTEGRATIONS,
  PRODUCT_AGENT_BUILDER_KIND_LABEL,
  PRODUCT_AGENT_BUILDER_NODES,
  type ProductAgentBuilderNode,
} from "@/lib/product/product-agent-builder-copy";
import "@/lib/product/product-agent-builder.css";
import "@/lib/product/product-landing.css";

const NODE_W = 208;
const NODE_H = 98;
const PORT = 10;
const CANVAS_W = 1100;
const CANVAS_H = 640;

function nodeById(id: string): ProductAgentBuilderNode | undefined {
  return PRODUCT_AGENT_BUILDER_NODES.find((item) => item.id === id);
}

/** Route connectors from node edge ports instead of centers. */
function edgeGeometry(fromId: string, toId: string) {
  const from = nodeById(fromId);
  const to = nodeById(toId);
  if (!from || !to) {
    return { x1: 0, y1: 0, x2: 0, y2: 0, path: "", labelX: 0, labelY: 0 };
  }

  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const mostlyVertical = Math.abs(dy) > Math.abs(dx) * 0.75;

  let x1: number;
  let y1: number;
  let x2: number;
  let y2: number;

  if (mostlyVertical) {
    const down = dy > 0;
    x1 = from.x;
    y1 = from.y + (down ? NODE_H / 2 - 4 : -(NODE_H / 2 - 4));
    x2 = to.x;
    y2 = to.y + (down ? -(NODE_H / 2 - 4) : NODE_H / 2 - 4);
  } else {
    const right = dx >= 0;
    x1 = from.x + (right ? NODE_W / 2 - 4 : -(NODE_W / 2 - 4));
    y1 = from.y;
    x2 = to.x + (right ? -(NODE_W / 2 - 4) : NODE_W / 2 - 4);
    y2 = to.y;
  }

  const spanX = Math.abs(x2 - x1);
  const spanY = Math.abs(y2 - y1);
  const c1x = mostlyVertical ? x1 : x1 + (x2 - x1) * 0.45;
  const c1y = mostlyVertical ? y1 + (y2 - y1) * 0.35 : y1;
  const c2x = mostlyVertical ? x2 : x2 - (x2 - x1) * 0.45;
  const c2y = mostlyVertical ? y2 - (y2 - y1) * 0.35 : y2;
  const soften = Math.max(36, Math.min(120, Math.max(spanX, spanY) * 0.38));

  const path = mostlyVertical
    ? `M ${x1} ${y1} C ${x1} ${y1 + Math.sign(y2 - y1) * soften}, ${x2} ${y2 - Math.sign(y2 - y1) * soften}, ${x2} ${y2}`
    : `M ${x1} ${y1} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${x2} ${y2}`;

  return {
    x1,
    y1,
    x2,
    y2,
    path,
    labelX: (x1 + x2) / 2,
    labelY: (y1 + y2) / 2 - (mostlyVertical ? 0 : 14),
  };
}

/** Desktop /product Agent Builder — pannable voice-agent canvas with floating inspectors. */
export function ProductAgentBuilderPanel() {
  const [pan, setPan] = useState({ x: 48, y: 36 });
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  const onPointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (event.button !== 0) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("[data-pab-no-pan]")) return;

      dragRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        originX: pan.x,
        originY: pan.y,
      };
      setDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [pan.x, pan.y],
  );

  const onPointerMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    setPan({
      x: drag.originX + (event.clientX - drag.startX),
      y: drag.originY + (event.clientY - drag.startY),
    });
  }, []);

  const endDrag = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }, []);

  return (
    <div className="product-agent-builder-panel product-landing-panel flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="product-landing-console-shell shrink-0">
        <header className={`product-landing-header flex items-center gap-2 ${suisseIntl.className}`}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className="product-landing-header__icon shrink-0"
          >
            <path d="m12 3 1.912 5.813L20 12l-6.088 3.187L12 21l-1.912-5.813L4 12l6.088-3.187L12 3Z" />
          </svg>
          <h1 className="product-landing-header__title m-0 font-normal tracking-tight">
            {PRODUCT_AGENT_BUILDER_HEADER.title}
          </h1>
        </header>
      </div>

      <div className="product-agent-builder-panel__body">
        <div
          className={`product-agent-builder-panel__canvas-wrap${
            dragging ? " product-agent-builder-panel__canvas-wrap--dragging" : ""
          }`}
          aria-label="Voice agent logic canvas"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <div
            className="product-agent-builder-panel__canvas"
            style={{
              width: CANVAS_W,
              height: CANVAS_H,
              transform: `translate(${pan.x}px, ${pan.y}px)`,
            }}
          >
            <svg className="product-agent-builder-panel__edges" aria-hidden>
              <defs>
                <marker
                  id="product-agent-builder-arrow"
                  viewBox="0 0 12 12"
                  refX="10"
                  refY="6"
                  markerWidth="8"
                  markerHeight="8"
                  orient="auto-start-reverse"
                >
                  <path d="M 1 1 L 10 6 L 1 11 Z" className="product-agent-builder-panel__arrow-head" />
                </marker>
                <linearGradient id="product-agent-builder-edge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(232, 192, 142, 0.22)" />
                  <stop offset="50%" stopColor="rgba(212, 165, 116, 0.72)" />
                  <stop offset="100%" stopColor="rgba(232, 192, 142, 0.28)" />
                </linearGradient>
              </defs>
              {PRODUCT_AGENT_BUILDER_EDGES.map((edge) => {
                const geo = edgeGeometry(edge.from, edge.to);
                return (
                  <g key={edge.id} className="product-agent-builder-panel__edge-group">
                    <path className="product-agent-builder-panel__edge-glow" d={geo.path} />
                    <path
                      className="product-agent-builder-panel__edge"
                      d={geo.path}
                      markerEnd="url(#product-agent-builder-arrow)"
                    />
                    <circle className="product-agent-builder-panel__port" cx={geo.x1} cy={geo.y1} r={3.2} />
                    <circle className="product-agent-builder-panel__port" cx={geo.x2} cy={geo.y2} r={3.2} />
                    {edge.label ? (
                      <g transform={`translate(${geo.labelX}, ${geo.labelY})`}>
                        <rect
                          className="product-agent-builder-panel__edge-label-bg"
                          x={-34}
                          y={-11}
                          width={68}
                          height={22}
                          rx={11}
                        />
                        <text
                          className={`product-agent-builder-panel__edge-label ${suisseIntl.className}`}
                          textAnchor="middle"
                          dominantBaseline="central"
                        >
                          {edge.label}
                        </text>
                      </g>
                    ) : null}
                  </g>
                );
              })}
            </svg>

            {PRODUCT_AGENT_BUILDER_NODES.map((node) => (
              <article
                key={node.id}
                data-pab-no-pan
                className={`product-agent-builder-panel__node product-agent-builder-panel__node--${node.kind}${
                  node.editing ? " product-agent-builder-panel__node--editing" : ""
                }`}
                style={{ left: node.x, top: node.y, width: NODE_W, minHeight: NODE_H }}
                aria-current={node.editing ? "true" : undefined}
              >
                <span className="product-agent-builder-panel__node-accent" aria-hidden />
                <p className={`product-agent-builder-panel__node-kind m-0 ${suisseIntl.className}`}>
                  <span className="product-agent-builder-panel__node-dot" />
                  {PRODUCT_AGENT_BUILDER_KIND_LABEL[node.kind]}
                </p>
                <h2 className={`product-agent-builder-panel__node-title ${dmSans.className}`}>{node.title}</h2>
                <p className={`product-agent-builder-panel__node-detail ${suisseIntl.className}`}>{node.detail}</p>
                {node.editing ? (
                  <span className={`product-agent-builder-panel__node-badge ${suisseIntl.className}`}>Editing</span>
                ) : null}
                <span
                  className="product-agent-builder-panel__node-port product-agent-builder-panel__node-port--left"
                  style={{ top: NODE_H / 2, width: PORT, height: PORT }}
                  aria-hidden
                />
                <span
                  className="product-agent-builder-panel__node-port product-agent-builder-panel__node-port--right"
                  style={{ top: NODE_H / 2, width: PORT, height: PORT }}
                  aria-hidden
                />
              </article>
            ))}
          </div>
        </div>

        <aside
          className="product-agent-builder-panel__inspector"
          aria-label="Node editor and integrations"
          data-pab-no-pan
        >
          <section className="product-agent-builder-panel__inspector-card" aria-label="Editing node">
            <div className="product-agent-builder-panel__inspector-head">
              <p className={`product-agent-builder-panel__inspector-eyebrow ${suisseIntl.className}`}>
                {PRODUCT_AGENT_BUILDER_EDITING.eyebrow}
              </p>
              <span className={`product-agent-builder-panel__status ${suisseIntl.className}`}>
                {PRODUCT_AGENT_BUILDER_HEADER.agentStatus}
              </span>
            </div>
            <p className={`product-agent-builder-panel__inspector-kind ${suisseIntl.className}`}>
              {PRODUCT_AGENT_BUILDER_EDITING.kind}
            </p>
            <h2 className={`product-agent-builder-panel__inspector-title ${dmSans.className}`}>
              {PRODUCT_AGENT_BUILDER_EDITING.title}
            </h2>
            <p className={`product-agent-builder-panel__inspector-summary ${suisseIntl.className}`}>
              {PRODUCT_AGENT_BUILDER_EDITING.summary}
            </p>
            <p className={`product-agent-builder-panel__agent-meta ${suisseIntl.className}`}>
              {PRODUCT_AGENT_BUILDER_HEADER.agentName} · {PRODUCT_AGENT_BUILDER_HEADER.subtitle}
            </p>
            <div className="product-agent-builder-panel__fields">
              {PRODUCT_AGENT_BUILDER_EDITING.fields.map((field) => (
                <div key={field.id} className="product-agent-builder-panel__field">
                  <p className={`product-agent-builder-panel__field-label ${suisseIntl.className}`}>{field.label}</p>
                  <p className={`product-agent-builder-panel__field-value ${dmSans.className}`}>{field.value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="product-agent-builder-panel__integrations" aria-label="Integrations">
            <div className="product-agent-builder-panel__integrations-head">
              <div className="min-w-0">
                <p className={`product-agent-builder-panel__integrations-eyebrow ${suisseIntl.className}`}>
                  Connected systems
                </p>
                <h2 className={`product-agent-builder-panel__integrations-title ${dmSans.className}`}>
                  Integrations
                </h2>
              </div>
              <span className={`product-agent-builder-panel__integrations-count ${suisseIntl.className}`}>
                {PRODUCT_AGENT_BUILDER_INTEGRATIONS.filter((item) => item.active).length} live
              </span>
            </div>
            <ul className="product-agent-builder-panel__integrations-list">
              {PRODUCT_AGENT_BUILDER_INTEGRATIONS.map((item) => (
                <li
                  key={item.id}
                  className={`product-agent-builder-panel__integration${
                    item.active ? " product-agent-builder-panel__integration--active" : ""
                  }`}
                >
                  <span
                    className={`product-agent-builder-panel__integration-swatch${
                      item.active ? " product-agent-builder-panel__integration-swatch--on" : ""
                    }`}
                    aria-hidden
                  />
                  <div className="product-agent-builder-panel__integration-copy min-w-0">
                    <div className="product-agent-builder-panel__integration-top">
                      <p className={`product-agent-builder-panel__integration-name ${dmSans.className}`}>{item.name}</p>
                      <span className={`product-agent-builder-panel__integration-status ${suisseIntl.className}`}>
                        {item.active ? "On" : "Off"}
                      </span>
                    </div>
                    <p className={`product-agent-builder-panel__integration-meta ${suisseIntl.className}`}>
                      {item.category}
                    </p>
                    <p className={`product-agent-builder-panel__integration-detail ${suisseIntl.className}`}>
                      {item.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
