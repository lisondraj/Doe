"use client";

import { useCallback, useMemo, useRef, useState, type PointerEvent } from "react";

import { dmSans, suisseIntl } from "@/lib/home/fonts";
import {
  PRODUCT_AGENT_BUILDER_AGENTS,
  PRODUCT_AGENT_BUILDER_HEADER,
  PRODUCT_AGENT_BUILDER_KIND_LABEL,
  PRODUCT_AGENT_BUILDER_STATUS_LABEL,
  PRODUCT_AGENT_BUILDER_TOOLBAR,
  type ProductAgentBuilderAgent,
  type ProductAgentBuilderNode,
} from "@/lib/product/product-agent-builder-copy";
import "@/lib/product/product-agent-builder.css";
import "@/lib/product/product-landing.css";

const NODE_W = 208;
const NODE_H = 98;
const PORT = 10;
const CANVAS_W = 1100;
const CANVAS_H = 640;
const DEFAULT_PAN = { x: 56, y: 44 };

function findNode(nodes: readonly ProductAgentBuilderNode[], id: string) {
  return nodes.find((item) => item.id === id);
}

/** Route connectors from node edge ports instead of centers. */
function edgeGeometry(nodes: readonly ProductAgentBuilderNode[], fromId: string, toId: string) {
  const from = findNode(nodes, fromId);
  const to = findNode(nodes, toId);
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

/** Desktop /product Agent Builder — pannable canvas, agent library, node inspector. */
export function ProductAgentBuilderPanel() {
  const [agentId, setAgentId] = useState(PRODUCT_AGENT_BUILDER_AGENTS[0].id);
  const agent = useMemo(
    () => PRODUCT_AGENT_BUILDER_AGENTS.find((item) => item.id === agentId) ?? PRODUCT_AGENT_BUILDER_AGENTS[0],
    [agentId],
  );
  const [selectedNodeId, setSelectedNodeId] = useState(agent.defaultNodeId);
  const selectedNode = useMemo(
    () => findNode(agent.nodes, selectedNodeId) ?? findNode(agent.nodes, agent.defaultNodeId) ?? agent.nodes[0],
    [agent, selectedNodeId],
  );

  const [pan, setPan] = useState(DEFAULT_PAN);
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  const selectAgent = useCallback((next: ProductAgentBuilderAgent) => {
    setAgentId(next.id);
    setSelectedNodeId(next.defaultNodeId);
    setPan(DEFAULT_PAN);
  }, []);

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

  const liveIntegrations = agent.integrations.filter((item) => item.active).length;

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
          aria-label={`${agent.name} logic canvas`}
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
              {agent.edges.map((edge) => {
                const geo = edgeGeometry(agent.nodes, edge.from, edge.to);
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

            {agent.nodes.map((node) => {
              const selected = node.id === selectedNode.id;
              return (
                <button
                  key={node.id}
                  type="button"
                  data-pab-no-pan
                  className={`product-agent-builder-panel__node product-agent-builder-panel__node--${node.kind}${
                    selected ? " product-agent-builder-panel__node--editing" : ""
                  }`}
                  style={{ left: node.x, top: node.y, width: NODE_W, minHeight: NODE_H }}
                  aria-pressed={selected}
                  onClick={() => setSelectedNodeId(node.id)}
                >
                  <span className="product-agent-builder-panel__node-accent" aria-hidden />
                  <p className={`product-agent-builder-panel__node-kind m-0 ${suisseIntl.className}`}>
                    <span className="product-agent-builder-panel__node-dot" />
                    {PRODUCT_AGENT_BUILDER_KIND_LABEL[node.kind]}
                  </p>
                  <h2 className={`product-agent-builder-panel__node-title ${dmSans.className}`}>{node.title}</h2>
                  <p className={`product-agent-builder-panel__node-detail ${suisseIntl.className}`}>{node.detail}</p>
                  {selected ? (
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
                </button>
              );
            })}
          </div>
        </div>

        <aside className="product-agent-builder-panel__library" aria-label="Built agents" data-pab-no-pan>
          <div className="product-agent-builder-panel__library-head">
            <div className="min-w-0">
              <p className={`product-agent-builder-panel__library-eyebrow ${suisseIntl.className}`}>
                {PRODUCT_AGENT_BUILDER_TOOLBAR.libraryEyebrow}
              </p>
              <h2 className={`product-agent-builder-panel__library-title ${dmSans.className}`}>
                {PRODUCT_AGENT_BUILDER_TOOLBAR.libraryTitle}
              </h2>
            </div>
            <span className={`product-agent-builder-panel__library-count ${suisseIntl.className}`}>
              {PRODUCT_AGENT_BUILDER_AGENTS.length}
            </span>
          </div>
          <ul className="product-agent-builder-panel__library-list">
            {PRODUCT_AGENT_BUILDER_AGENTS.map((item) => {
              const active = item.id === agent.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`product-agent-builder-panel__library-item${
                      active ? " product-agent-builder-panel__library-item--active" : ""
                    }`}
                    aria-current={active ? "true" : undefined}
                    onClick={() => selectAgent(item)}
                  >
                    <span className="product-agent-builder-panel__library-item-top">
                      <span className={`product-agent-builder-panel__library-item-name ${dmSans.className}`}>
                        {item.name}
                      </span>
                      <span
                        className={`product-agent-builder-panel__status product-agent-builder-panel__status--${item.status} ${suisseIntl.className}`}
                      >
                        {PRODUCT_AGENT_BUILDER_STATUS_LABEL[item.status]}
                      </span>
                    </span>
                    <span className={`product-agent-builder-panel__library-item-meta ${suisseIntl.className}`}>
                      {item.line} · {item.version}
                    </span>
                    <span className={`product-agent-builder-panel__library-item-foot ${suisseIntl.className}`}>
                      <span>{item.updated}</span>
                      <span>{item.callsToday} calls today</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        <div className="product-agent-builder-panel__toolbar" data-pab-no-pan>
          <div className="product-agent-builder-panel__toolbar-copy min-w-0">
            <p className={`product-agent-builder-panel__toolbar-eyebrow ${suisseIntl.className}`}>
              {agent.clinic} · {agent.line}
            </p>
            <h2 className={`product-agent-builder-panel__toolbar-title ${dmSans.className}`}>{agent.name}</h2>
            <p className={`product-agent-builder-panel__toolbar-meta ${suisseIntl.className}`}>
              {agent.nodes.length} nodes · {agent.edges.length} connections · {agent.version}
            </p>
          </div>
          <div className="product-agent-builder-panel__toolbar-actions">
            <span
              className={`product-agent-builder-panel__status product-agent-builder-panel__status--${agent.status} ${suisseIntl.className}`}
            >
              {PRODUCT_AGENT_BUILDER_STATUS_LABEL[agent.status]}
            </span>
            <button type="button" className={`product-agent-builder-panel__tool-btn ${suisseIntl.className}`}>
              {PRODUCT_AGENT_BUILDER_TOOLBAR.test}
            </button>
            <button
              type="button"
              className={`product-agent-builder-panel__tool-btn product-agent-builder-panel__tool-btn--primary ${suisseIntl.className}`}
            >
              {PRODUCT_AGENT_BUILDER_TOOLBAR.publish}
            </button>
            <button
              type="button"
              className={`product-agent-builder-panel__tool-btn ${suisseIntl.className}`}
              onClick={() => setPan(DEFAULT_PAN)}
            >
              {PRODUCT_AGENT_BUILDER_TOOLBAR.resetView}
            </button>
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
                {PRODUCT_AGENT_BUILDER_TOOLBAR.editingEyebrow}
              </p>
              <span
                className={`product-agent-builder-panel__status product-agent-builder-panel__status--${agent.status} ${suisseIntl.className}`}
              >
                {PRODUCT_AGENT_BUILDER_STATUS_LABEL[agent.status]}
              </span>
            </div>
            <p className={`product-agent-builder-panel__inspector-kind ${suisseIntl.className}`}>
              {PRODUCT_AGENT_BUILDER_KIND_LABEL[selectedNode.kind]}
            </p>
            <h2 className={`product-agent-builder-panel__inspector-title ${dmSans.className}`}>
              {selectedNode.title}
            </h2>
            <p className={`product-agent-builder-panel__inspector-summary ${suisseIntl.className}`}>
              {selectedNode.summary ?? selectedNode.detail}
            </p>
            <p className={`product-agent-builder-panel__agent-meta ${suisseIntl.className}`}>
              {agent.name} · {agent.line}
            </p>
            {selectedNode.fields?.length ? (
              <div className="product-agent-builder-panel__fields">
                {selectedNode.fields.map((field) => (
                  <div key={field.id} className="product-agent-builder-panel__field">
                    <p className={`product-agent-builder-panel__field-label ${suisseIntl.className}`}>{field.label}</p>
                    <p className={`product-agent-builder-panel__field-value ${dmSans.className}`}>{field.value}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </section>

          <section className="product-agent-builder-panel__integrations" aria-label="Integrations">
            <div className="product-agent-builder-panel__integrations-head">
              <div className="min-w-0">
                <p className={`product-agent-builder-panel__integrations-eyebrow ${suisseIntl.className}`}>
                  {PRODUCT_AGENT_BUILDER_TOOLBAR.integrationsEyebrow}
                </p>
                <h2 className={`product-agent-builder-panel__integrations-title ${dmSans.className}`}>
                  {PRODUCT_AGENT_BUILDER_TOOLBAR.integrationsTitle}
                </h2>
              </div>
              <span className={`product-agent-builder-panel__integrations-count ${suisseIntl.className}`}>
                {liveIntegrations} live
              </span>
            </div>
            <ul className="product-agent-builder-panel__integrations-list">
              {agent.integrations.map((item) => (
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
