"use client";

import { dmSans, suisseIntl } from "@/lib/home/fonts";
import {
  PRODUCT_AGENT_BUILDER_EDGES,
  PRODUCT_AGENT_BUILDER_EDITING,
  PRODUCT_AGENT_BUILDER_HEADER,
  PRODUCT_AGENT_BUILDER_INTEGRATIONS,
  PRODUCT_AGENT_BUILDER_NODES,
} from "@/lib/product/product-agent-builder-copy";
import "@/lib/product/product-agent-builder.css";
import "@/lib/product/product-landing.css";

const NODE_W = 200;
const NODE_H = 92;

function nodeCenter(id: string) {
  const node = PRODUCT_AGENT_BUILDER_NODES.find((item) => item.id === id);
  if (!node) return { x: 0, y: 0 };
  return { x: node.x, y: node.y };
}

function edgePath(fromId: string, toId: string) {
  const from = nodeCenter(fromId);
  const to = nodeCenter(toId);
  const dx = Math.max(48, Math.abs(to.x - from.x) * 0.42);
  const midY = (from.y + to.y) / 2;
  if (Math.abs(to.y - from.y) < 24) {
    return `M ${from.x} ${from.y} C ${from.x + dx} ${from.y}, ${to.x - dx} ${to.y}, ${to.x} ${to.y}`;
  }
  return `M ${from.x} ${from.y} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}`;
}

function edgeLabelPoint(fromId: string, toId: string) {
  const from = nodeCenter(fromId);
  const to = nodeCenter(toId);
  return { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 - 10 };
}

/** Desktop /product Agent Builder — voice-agent logic canvas with integrations. */
export function ProductAgentBuilderPanel() {
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
          <div className="min-w-0">
            <h1 className="product-landing-header__title m-0 font-normal tracking-tight">
              {PRODUCT_AGENT_BUILDER_HEADER.title}
            </h1>
            <p className={`product-agent-builder-panel__meta ${dmSans.className}`}>
              {PRODUCT_AGENT_BUILDER_HEADER.subtitle}
            </p>
          </div>
        </header>
      </div>

      <div className="product-agent-builder-panel__body">
        <div className="product-agent-builder-panel__canvas-wrap" aria-label="Voice agent logic canvas">
          <div className="product-agent-builder-panel__canvas">
            <svg className="product-agent-builder-panel__edges" aria-hidden>
              {PRODUCT_AGENT_BUILDER_EDGES.map((edge) => {
                const labelPoint = edge.label ? edgeLabelPoint(edge.from, edge.to) : null;
                return (
                  <g key={edge.id}>
                    <path className="product-agent-builder-panel__edge" d={edgePath(edge.from, edge.to)} />
                    {edge.label && labelPoint ? (
                      <text
                        className={`product-agent-builder-panel__edge-label ${suisseIntl.className}`}
                        x={labelPoint.x}
                        y={labelPoint.y}
                        textAnchor="middle"
                      >
                        {edge.label}
                      </text>
                    ) : null}
                  </g>
                );
              })}
            </svg>

            {PRODUCT_AGENT_BUILDER_NODES.map((node) => (
              <article
                key={node.id}
                className={`product-agent-builder-panel__node product-agent-builder-panel__node--${node.kind}${
                  node.editing ? " product-agent-builder-panel__node--editing" : ""
                }`}
                style={{ left: node.x, top: node.y, width: NODE_W, minHeight: NODE_H }}
                aria-current={node.editing ? "true" : undefined}
              >
                <p className={`product-agent-builder-panel__node-kind m-0 ${suisseIntl.className}`}>
                  <span className="product-agent-builder-panel__node-dot" />
                  {node.kind}
                </p>
                <h2 className={`product-agent-builder-panel__node-title ${dmSans.className}`}>{node.title}</h2>
                <p className={`product-agent-builder-panel__node-detail ${suisseIntl.className}`}>{node.detail}</p>
                {node.editing ? (
                  <span className={`product-agent-builder-panel__node-badge ${suisseIntl.className}`}>Editing</span>
                ) : null}
              </article>
            ))}
          </div>
        </div>

        <aside className="product-agent-builder-panel__inspector" aria-label="Node editor and integrations">
          <section className="product-agent-builder-panel__inspector-card" aria-label="Editing node">
            <p className={`product-agent-builder-panel__inspector-eyebrow ${suisseIntl.className}`}>
              {PRODUCT_AGENT_BUILDER_EDITING.eyebrow}
            </p>
            <h2 className={`product-agent-builder-panel__inspector-title ${dmSans.className}`}>
              {PRODUCT_AGENT_BUILDER_EDITING.title}
            </h2>
            <div className="mt-4">
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
              <h2 className={`product-agent-builder-panel__integrations-title ${suisseIntl.className}`}>
                Integrations
              </h2>
            </div>
            <ul className="product-agent-builder-panel__integrations-list">
              {PRODUCT_AGENT_BUILDER_INTEGRATIONS.map((item) => (
                <li
                  key={item.id}
                  className={`product-agent-builder-panel__integration${
                    item.active ? " product-agent-builder-panel__integration--active" : ""
                  }`}
                >
                  <div className="min-w-0">
                    <p className={`product-agent-builder-panel__integration-name ${dmSans.className}`}>{item.name}</p>
                    <p className={`product-agent-builder-panel__integration-meta ${suisseIntl.className}`}>
                      {item.category}
                    </p>
                  </div>
                  <span className={`product-agent-builder-panel__integration-status ${suisseIntl.className}`}>
                    {item.active ? "On" : "Off"}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
