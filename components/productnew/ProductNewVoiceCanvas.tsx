"use client";

import { useMemo, useState } from "react";

import {
  PRODUCTNEW_AGENT_NOTES,
  PRODUCTNEW_INTEGRATIONS,
  PRODUCTNEW_WORKFLOWS,
  type ProductNewCanvasEdge,
  type ProductNewCanvasNode,
  type ProductNewWorkflow,
} from "@/lib/productnew/productnew-voice-copy";

type CanvasTab = "build" | "integrations" | "notes";

const CANVAS_TABS: readonly { id: CanvasTab; label: string }[] = [
  { id: "build", label: "Build" },
  { id: "integrations", label: "Integrations" },
  { id: "notes", label: "Notes" },
];

let draftCount = 0;

function createDraftWorkflow(): ProductNewWorkflow {
  draftCount += 1;
  return {
    id: `draft-${Date.now()}-${draftCount}`,
    name: `Untitled workflow ${draftCount}`,
    status: "draft",
    updated: "Draft · just created",
    agent: {
      name: "Untitled agent",
      line: "Not assigned to a line yet",
      greeting: "Hi, thanks for calling. How can I help you today?",
      language: "English",
      voice: "Calm, clear clinic tone",
      hours: "Not set",
      intents: [],
      handoffs: [],
    },
    nodes: [
      { id: "line", type: "trigger", label: "Trigger", detail: "Choose a line", x: 14, y: 50 },
      { id: "greeting", type: "speech", label: "Opening greeting", x: 42, y: 50 },
    ],
    edges: [{ from: "line", to: "greeting" }],
  };
}

function nodeCenter(node: ProductNewCanvasNode) {
  return { x: node.x, y: node.y };
}

function CanvasNode({
  node,
  selected,
  onSelect,
}: {
  node: ProductNewCanvasNode;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      className={`productnew-canvas-node productnew-canvas-node--${node.type}${selected ? " productnew-canvas-node--selected" : ""}`}
      style={{ left: `${node.x}%`, top: `${node.y}%` }}
      onClick={onSelect}
    >
      <span className="productnew-canvas-node__label">{node.label}</span>
      {node.detail ? <span className="productnew-canvas-node__detail">{node.detail}</span> : null}
    </button>
  );
}

function CanvasFlow({
  nodes,
  edges,
  selectedId,
  onSelect,
}: {
  nodes: readonly ProductNewCanvasNode[];
  edges: readonly ProductNewCanvasEdge[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const nodeMap = useMemo(() => new Map(nodes.map((node) => [node.id, node])), [nodes]);

  return (
    <div className="productnew-canvas-flow">
      <svg className="productnew-canvas-flow__edges" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        {edges.map((edge) => {
          const from = nodeMap.get(edge.from);
          const to = nodeMap.get(edge.to);
          if (!from || !to) return null;

          const a = nodeCenter(from);
          const b = nodeCenter(to);

          return (
            <path
              key={`${edge.from}-${edge.to}`}
              d={`M ${a.x} ${a.y} C ${(a.x + b.x) / 2} ${a.y}, ${(a.x + b.x) / 2} ${b.y}, ${b.x} ${b.y}`}
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="0.35"
            />
          );
        })}
      </svg>

      {nodes.map((node) => (
        <CanvasNode key={node.id} node={node} selected={selectedId === node.id} onSelect={() => onSelect(node.id)} />
      ))}
    </div>
  );
}

function BuildTab({ workflow }: { workflow: ProductNewWorkflow }) {
  const agent = workflow.agent;

  return (
    <div className="productnew-canvas-panel__scroll">
      <div className="productnew-build-block">
        <h3 className="productnew-build-block__title">{agent.name}</h3>
        <p className="productnew-build-block__line">{agent.line}</p>
      </div>

      <div className="productnew-build-block">
        <h3 className="productnew-build-block__title">Opening greeting</h3>
        <p className="productnew-build-block__body">{agent.greeting}</p>
      </div>

      <div className="productnew-build-grid">
        <div className="productnew-build-block">
          <h3 className="productnew-build-block__title">Languages</h3>
          <p className="productnew-build-block__body">{agent.language}</p>
        </div>
        <div className="productnew-build-block">
          <h3 className="productnew-build-block__title">Voice</h3>
          <p className="productnew-build-block__body">{agent.voice}</p>
        </div>
      </div>

      <p className="productnew-build-block__meta">{agent.hours}</p>

      {agent.intents.length > 0 ? (
        <ul className="productnew-build-list">
          {agent.intents.map((intent) => (
            <li key={intent.id} className="productnew-build-list__item">
              <span className="productnew-build-list__label">{intent.label}</span>
              <span className="productnew-build-list__detail">{intent.action}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {agent.handoffs.length > 0 ? (
        <ul className="productnew-build-list">
          {agent.handoffs.map((handoff) => (
            <li key={handoff.id} className="productnew-build-list__item">
              <span className="productnew-build-list__label">{handoff.label}</span>
              <span className="productnew-build-list__detail">{handoff.detail}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function IntegrationsTab() {
  const [query, setQuery] = useState("");

  const filtered = PRODUCTNEW_INTEGRATIONS.filter(
    (item) =>
      !query.trim() ||
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="productnew-canvas-panel__scroll">
      <label className="productnew-canvas-search">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search integrations"
          className="productnew-canvas-search__input"
        />
      </label>

      <ul className="productnew-integration-list">
        {filtered.map((integration) => (
          <li key={integration.id} className="productnew-integration-list__item">
            <div className="productnew-integration-list__copy">
              <span className="productnew-integration-list__name">{integration.name}</span>
              <span className="productnew-integration-list__category">{integration.category}</span>
            </div>
            <span
              className={`productnew-integration-list__state${integration.connected ? " productnew-integration-list__state--on" : ""}`}
            >
              {integration.connected ? "Connected" : "Add"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NotesTab() {
  return (
    <div className="productnew-canvas-panel__scroll">
      <ul className="productnew-notes-list">
        {PRODUCTNEW_AGENT_NOTES.map((note) => (
          <li key={note.id} className="productnew-notes-list__item">
            <h3 className="productnew-notes-list__title">{note.title}</h3>
            <p className="productnew-notes-list__body">{note.body}</p>
          </li>
        ))}
      </ul>
      <button type="button" className="productnew-notes-add">
        Add note
      </button>
    </div>
  );
}

/** Visual canvas voice agent builder: multiple workflows (draft/live), flow editor, and an integrations panel. */
export function ProductNewVoiceCanvas() {
  const [workflows, setWorkflows] = useState<readonly ProductNewWorkflow[]>(PRODUCTNEW_WORKFLOWS);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState(PRODUCTNEW_WORKFLOWS[0]?.id ?? "");
  const [tab, setTab] = useState<CanvasTab>("build");
  const [selectedNodeId, setSelectedNodeId] = useState("greeting");

  const workflow = workflows.find((item) => item.id === selectedWorkflowId) ?? workflows[0];

  const handleSelectWorkflow = (id: string) => {
    setSelectedWorkflowId(id);
    setSelectedNodeId("greeting");
    setTab("build");
  };

  const handleNewWorkflow = () => {
    const draft = createDraftWorkflow();
    setWorkflows((current) => [...current, draft]);
    handleSelectWorkflow(draft.id);
  };

  const handleTogglePublish = () => {
    if (!workflow) return;
    setWorkflows((current) =>
      current.map((item) =>
        item.id === workflow.id
          ? {
              ...item,
              status: item.status === "live" ? "draft" : "live",
              updated: item.status === "live" ? "Draft · unpublished just now" : "Live · published just now",
            }
          : item,
      ),
    );
  };

  if (!workflow) return null;

  return (
    <div className="productnew-voice-canvas">
      <div className="productnew-workflow-strip">
        <ul className="productnew-workflow-list">
          {workflows.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className={`productnew-workflow-card${item.id === workflow.id ? " productnew-workflow-card--active" : ""}`}
                onClick={() => handleSelectWorkflow(item.id)}
              >
                <span className="productnew-workflow-card__name">{item.name}</span>
                <span
                  className={`productnew-workflow-card__status${item.status === "live" ? " productnew-workflow-card__status--live" : ""}`}
                >
                  {item.status === "live" ? "Live" : "Draft"}
                </span>
                <span className="productnew-workflow-card__meta">{item.updated}</span>
              </button>
            </li>
          ))}
        </ul>
        <button type="button" className="productnew-workflow-add" onClick={handleNewWorkflow}>
          + New workflow
        </button>
      </div>

      <header className="productnew-voice-canvas__header">
        <div>
          <h1 className="productnew-voice-canvas__title">{workflow.name}</h1>
          <p className="productnew-voice-canvas__meta">{workflow.agent.line}</p>
        </div>
        <div className="productnew-dashboard__header-actions">
          <button type="button" className="productnew-dashboard__btn productnew-dashboard__btn--outline" onClick={handleTogglePublish}>
            {workflow.status === "live" ? "Unpublish" : "Publish"}
          </button>
        </div>
      </header>

      <div className="productnew-voice-canvas__body">
        <div className="productnew-voice-canvas__stage">
          <CanvasFlow
            nodes={workflow.nodes}
            edges={workflow.edges}
            selectedId={selectedNodeId}
            onSelect={setSelectedNodeId}
          />
        </div>

        <aside className="productnew-canvas-panel" aria-label="Voice agent builder">
          <div className="productnew-canvas-panel__tabs" role="tablist">
            {CANVAS_TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={tab === item.id}
                className={`productnew-canvas-panel__tab${tab === item.id ? " productnew-canvas-panel__tab--active" : ""}`}
                onClick={() => setTab(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="productnew-canvas-panel__content" role="tabpanel">
            {tab === "build" ? <BuildTab workflow={workflow} /> : null}
            {tab === "integrations" ? <IntegrationsTab /> : null}
            {tab === "notes" ? <NotesTab /> : null}
          </div>
        </aside>
      </div>
    </div>
  );
}
