/**
 * Doe's own agent-readable files: /llms.txt, /openapi.json, /.well-known/mcp.json and /robots.txt. Built from
 * lib/demo/demo-docs so they agree with the JSON at /api/demo/v1 and the MCP server's tools/list.
 */
import { API_BASE, FLOW, MCP_PATH, MCP_TOOLS, apiDocs } from "@/lib/demo/demo-docs";

const NAME = "Doe";
const SUMMARY = "Doe makes clinics bookable by personal agents: an agent-readable page, an MCP server and an API for each clinic.";
const MCP_PROTOCOL = "2025-06-18";

export function llmsTxt(origin: string) {
  return `# ${NAME}

> ${SUMMARY} The live demo clinic is Dr. Brooks' Migraine Clinic; an agent can connect, hold a slot, fill intake and request a booking.

Agents act for their user. Before connecting, confirm with your user that they agree to Doe's Terms of Service and Privacy Policy, and that by booking through Doe they're voluntarily providing their PHI.

## Docs

- [API docs (JSON)](${origin}${API_BASE}): endpoints, actions, auth and the booking flow
- [OpenAPI 3.1](${origin}/openapi.json): the same REST API as an OpenAPI document
- [MCP server card](${origin}/.well-known/mcp.json): transport, URL and tools for the MCP server

## MCP

- [Doe demo MCP server](${origin}${MCP_PATH}): Streamable HTTP, JSON responses, stateless. Tools: ${MCP_TOOLS.map((t) => t.name).join(", ")}

## Booking flow

${FLOW.map((step, i) => `${i + 1}. ${step}`).join("\n")}

## Optional

- [Demo](${origin}/demo): the same booking flow, as the user sees it
`;
}

export function mcpServerCard(origin: string) {
  return {
    name: "care.doe/demo",
    title: "Doe · Dr. Brooks' Migraine Clinic",
    description: SUMMARY,
    version: "1.0.0",
    protocolVersion: MCP_PROTOCOL,
    websiteUrl: origin,
    documentation: { llms_txt: `${origin}/llms.txt`, openapi: `${origin}/openapi.json`, api: `${origin}${API_BASE}` },
    remotes: [{ type: "streamable-http", url: `${origin}${MCP_PATH}` }],
    authentication: { required: false, note: "doe_connect returns a session_token; pass it to every other tool." },
    capabilities: { tools: { listChanged: false } },
    tools: MCP_TOOLS.map((t) => ({ name: t.name, description: t.description, inputSchema: t.inputSchema })),
  };
}

const str = (description?: string) => ({ type: "string", ...(description ? { description } : {}) });
const error = { description: "Error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } };
const ok = (description: string) => ({ description, content: { "application/json": { schema: { type: "object" } } } });

export function openApi(origin: string) {
  return {
    openapi: "3.1.0",
    info: {
      title: "Doe demo API",
      version: "1.0.0",
      summary: "Book Dr. Brooks' Migraine Clinic for your user.",
      description: [SUMMARY, "", ...FLOW.map((s, i) => `${i + 1}. ${s}`)].join("\n"),
    },
    servers: [{ url: `${origin}${API_BASE}` }],
    externalDocs: { description: "llms.txt", url: `${origin}/llms.txt` },
    components: {
      securitySchemes: { session: { type: "http", scheme: "bearer", description: "The token POST /connect returns." } },
      schemas: {
        Error: { type: "object", properties: { ok: { type: "boolean", const: false }, error: str() }, required: ["ok", "error"] },
        Connect: {
          type: "object",
          required: ["consent"],
          properties: {
            agent_name: str("Your name, shown to the clinic."),
            user_name: str("Your user's full name."),
            request: str("What your user wants, e.g. Botox for chronic migraine."),
            consent: {
              type: "object",
              required: ["terms", "phi"],
              properties: {
                terms: { type: "boolean", const: true, description: "User agreed to Doe's Terms of Service and Privacy Policy." },
                phi: { type: "boolean", const: true, description: "User confirmed they're voluntarily providing PHI by booking through Doe." },
                connected: { type: "boolean", description: "User allows you to stay connected for updates." },
                network: { type: "boolean", description: "User wants to join the Doe network." },
              },
            },
          },
        },
        Action: {
          type: "object",
          required: ["type"],
          description: "One action. Fields depend on type; see each MCP tool's inputSchema at /.well-known/mcp.json.",
          properties: {
            type: {
              type: "string",
              enum: Object.keys(apiDocs(origin).actions),
            },
          },
          additionalProperties: true,
        },
      },
    },
    paths: {
      "/": { get: { operationId: "getDocs", summary: "API docs as JSON", responses: { "200": ok("Docs") } } },
      "/clinic": { get: { operationId: "getClinic", summary: "Services, bundles, offers, insurance, availability, intake and assessments", responses: { "200": ok("Clinic") } } },
      "/connect": {
        post: {
          operationId: "connect",
          summary: "Start a booking session for your user",
          requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/Connect" } } } },
          responses: { "200": ok("Session token and state"), "400": error, "429": error },
        },
      },
      "/session": {
        get: { operationId: "getSession", summary: "Your session: status, pricing, hold, booking, forms, threads and next steps", security: [{ session: [] }], responses: { "200": ok("Session"), "401": error } },
      },
      "/actions": {
        post: {
          operationId: "act",
          summary: "Take an action in your session",
          security: [{ session: [] }],
          requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/Action" } } } },
          responses: { "200": ok("Updated session"), "400": error, "401": error, "409": error },
        },
      },
    },
  };
}

export function robotsTxt(origin: string) {
  return `# ${NAME}: ${SUMMARY}
# Agents: ${origin}/llms.txt · ${origin}/openapi.json · ${origin}/.well-known/mcp.json

User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/admin/
Disallow: /auth/
`;
}
