import { NextResponse } from "next/server";

import { FLOW, MCP_TOOLS } from "@/lib/demo/demo-docs";
import { type AgentAction, DemoError } from "@/lib/demo/demo-engine";
import { clientIp, rateLimit } from "@/lib/demo/demo-guard";
import { CORS, MAX_BODY, originOf } from "@/lib/demo/demo-http";
import { agentAct, agentState, catalog, connect, mcpTouch, shareForms } from "@/lib/demo/demo-service";

export const dynamic = "force-dynamic";

/**
 * /demo's MCP server over Streamable HTTP. It's stateless and answers every request with JSON: tools take the
 * session_token doe_connect returns, so no MCP session is needed.
 */
const PROTOCOL = "2025-06-18";
const SERVER = { name: "doe-demo", title: "Doe · Dr. Brooks' Migraine Clinic", version: "1.0.0" };

type Rpc = { jsonrpc?: string; id?: string | number | null; method?: string; params?: Record<string, unknown> };

async function callTool(name: string, args: Record<string, unknown>, ip: string, visitId: string | null, origin: string) {
  const { session_token, ...rest } = args;
  switch (name) {
    case "doe_connect":
      return connect({
        channel: "mcp",
        agentName: rest.agent_name,
        userName: rest.user_name,
        userLocation: rest.user_location,
        userPhone: rest.user_phone,
        request: rest.request,
        consent: { terms: rest.consent_terms, phi: rest.consent_phi, connected: rest.stay_connected, network: rest.join_network },
      }, ip, visitId, origin);
    case "doe_clinic_info":
      return catalog();
    case "doe_share_forms":
      return shareForms(session_token, origin, rest.expires_days, "mcp");
    case "doe_get_session":
      return agentState(session_token);
    case "doe_select_plan":
      return agentAct(session_token, { type: "select_plan", plan: { kind: rest.kind, id: rest.id } } as AgentAction, "mcp");
    default: {
      if (!MCP_TOOLS.some((t) => t.name === name)) throw new DemoError(404, `Unknown tool ${name}.`);
      return agentAct(session_token, { type: name.replace(/^doe_/, ""), ...rest } as AgentAction, "mcp");
    }
  }
}

async function handle(msg: Rpc, ip: string, visitId: string | null, origin: string): Promise<Record<string, unknown> | null> {
  const id = msg.id ?? null;
  const ok = (result: unknown) => ({ jsonrpc: "2.0", id, result });
  const fail = (code: number, message: string) => ({ jsonrpc: "2.0", id, error: { code, message } });
  if (!msg.method) return fail(-32600, "Invalid request.");
  if (msg.id === undefined) return null; // notifications

  switch (msg.method) {
    case "initialize":
      return ok({
        protocolVersion: typeof msg.params?.protocolVersion === "string" ? msg.params.protocolVersion : PROTOCOL,
        capabilities: { tools: { listChanged: false } },
        serverInfo: SERVER,
        instructions: `You're booking care for your user at Dr. Brooks' Migraine Clinic. Your user does not see this clinic's agent pages. ${FLOW.map((s, i) => `${i + 1}. ${s}`).join(" ")}`,
      });
    case "ping":
      return ok({});
    case "tools/list":
      return ok({ tools: MCP_TOOLS });
    case "tools/call": {
      const name = msg.params?.name;
      if (typeof name !== "string") return fail(-32602, "params.name is required.");
      const args = (msg.params?.arguments ?? {}) as Record<string, unknown>;
      try {
        if (name === "doe_connect") rateLimit("connect", ip);
        const result = await callTool(name, args, ip, visitId, origin);
        return ok({ content: [{ type: "text", text: JSON.stringify(result, null, 2) }], structuredContent: result });
      } catch (error) {
        const message = error instanceof DemoError ? error.message : "Something went wrong. Try again.";
        if (!(error instanceof DemoError)) console.error("[demo mcp]", error instanceof Error ? error.message : error);
        return ok({ content: [{ type: "text", text: message }], isError: true });
      }
    }
    case "resources/list":
      return ok({ resources: [] });
    case "prompts/list":
      return ok({ prompts: [] });
    default:
      return fail(-32601, `Method ${msg.method} not found.`);
  }
}

export async function POST(request: Request) {
  const ip = clientIp(request);
  try {
    rateLimit("mcp", ip);
  } catch (error) {
    return NextResponse.json({ jsonrpc: "2.0", id: null, error: { code: -32000, message: error instanceof Error ? error.message : "Too many requests." } }, { status: 429, headers: CORS });
  }
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY) {
    return NextResponse.json({ jsonrpc: "2.0", id: null, error: { code: -32600, message: "Request body is too large." } }, { status: 413, headers: CORS });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error." } }, { status: 400, headers: CORS });
  }
  const batch = Array.isArray(body);
  const messages = ((batch ? body : [body]) as Rpc[]).slice(0, 10);
  /** Each request is recorded on the agent's visit first, so the clinic sees it from the handshake on. */
  let visitId: string | null = request.headers.get("mcp-session-id");
  for (const m of messages) {
    if (!m?.method || m.id === undefined) continue;
    /** Calls with a session token are already logged on that session; a new visit would show up as a second agent. */
    const args = (m.params?.arguments ?? {}) as Record<string, unknown>;
    if (m.method === "tools/call" && typeof args.session_token === "string" && args.session_token) continue;
    try {
      visitId = await mcpTouch({
        headerId: visitId,
        ip,
        userAgent: request.headers.get("user-agent"),
        method: m.method,
        tool: m.method === "tools/call" && typeof m.params?.name === "string" ? m.params.name : null,
        clientInfo: m.method === "initialize" ? ((m.params?.clientInfo ?? null) as Record<string, unknown> | null) : null,
      });
    } catch (error) {
      console.error("[demo mcp visit]", error instanceof Error ? error.message : error);
    }
  }
  const origin = originOf(request);
  const replies = (await Promise.all(messages.map((m) => handle(m, ip, visitId, origin)))).filter(Boolean);
  const headers: Record<string, string> = { ...CORS, "MCP-Protocol-Version": PROTOCOL };
  if (visitId) headers["Mcp-Session-Id"] = visitId;
  if (!replies.length) return new NextResponse(null, { status: 202, headers });
  return NextResponse.json(batch ? replies : replies[0], { headers });
}

/** No server-initiated stream: every reply comes back on the POST. */
export function GET() {
  return new NextResponse(null, { status: 405, headers: { ...CORS, Allow: "POST" } });
}

export function DELETE() {
  return new NextResponse(null, { status: 405, headers: { ...CORS, Allow: "POST" } });
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}
