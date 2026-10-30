/**
 * The agent files /indexconvert builds for a clinic: llms.txt, robots.txt, openapi.json and the MCP server card at
 * /.well-known/mcp.json. They point at the clinic's agent page on Doe's API and MCP, and say it isn't activated yet.
 */
import { CLINIC, FIELD_COUNT, LOCATIONS, PRICE_COUNT, PROVIDERS, SERVICE_COUNT } from "@/lib/indexconvert/ford-plastic-surgery";

export const SLUG = "ford-plastic-surgery";
export const API_ORIGIN = "https://api.doe.care";
export const BASE = `/v1/clinics/${SLUG}`;
export const MCP_URL = `https://mcp.doe.care/clinics/${SLUG}`;
const SITE = `https://${CLINIC.url}`;

export const RESOURCES = ["locations", "providers", "services", "prices", "offers", "booking", "warnings"] as const;

export const CLINIC_TOOLS = [
  { name: "search_services", description: "Find a service by name or concern.", input: { query: "string" } },
  { name: "get_prices", description: "Starting price in CAD before HST for a service.", input: { service: "string" } },
  { name: "list_providers", description: "Surgeons, injectors and aestheticians, with what each does.", input: {} },
  { name: "get_hours", description: "Opening hours and phone for a location.", input: { location: "string?" } },
  { name: "request_consultation", description: "Ask for a consult with a service, provider and your user's contact.", input: { service: "string", provider: "string?", contact: "object" } },
];

export const LLMS_TXT = `# ${CLINIC.name}

> ${CLINIC.kind} in ${CLINIC.area} since ${CLINIC.since}. ${PROVIDERS.length} providers, ${LOCATIONS.length} locations, ${SERVICE_COUNT} services, ${PRICE_COUNT} starting prices (CAD, before HST). Built by Doe from ${CLINIC.domain}.

Status: not_activated. Agents can read this page; MCP, API and booking turn on when the clinic claims it.

## Agent page

${RESOURCES.map((r) => `- [${r}](${API_ORIGIN}${BASE}/${r})`).join("\n")}

## For agents

- [OpenAPI](${SITE}/openapi.json): the agent page as REST
- [MCP server card](${SITE}/.well-known/mcp.json): ${CLINIC_TOOLS.length} tools on Doe's MCP
- Personal Agent Protocol (PAP): act for one user, with their consent, and say you're an agent

## Contact

- Phone: ${CLINIC.phone} · weekdays 8:30 to 4:30
- Consultation: ${CLINIC.consult}, ${CLINIC.consultNote.toLowerCase()}
`;

export const ROBOTS_TXT = `# ${CLINIC.name} · agent-readable page by Doe
# Agents: ${SITE}/llms.txt · ${SITE}/openapi.json · ${SITE}/.well-known/mcp.json

User-agent: *
Allow: /

User-agent: GPTBot
User-agent: ClaudeBot
User-agent: PerplexityBot
Allow: /
`;

export const MCP_CARD = {
  name: `care.doe/${SLUG}`,
  title: `${CLINIC.name} · Doe`,
  description: `Services, prices, providers, hours and consult requests for ${CLINIC.name}, ${CLINIC.area}.`,
  version: "1.0.0",
  protocolVersion: "2025-06-18",
  websiteUrl: SITE,
  remotes: [{ type: "streamable-http", url: MCP_URL }],
  status: "not_activated",
  pap: { applied: true, consent: "per_user", disclose_agent: true },
  documentation: { llms_txt: `${SITE}/llms.txt`, openapi: `${SITE}/openapi.json` },
  tools: CLINIC_TOOLS.map((t) => t.name),
};

export const OPENAPI = {
  openapi: "3.1.0",
  info: { title: `${CLINIC.name} · agent page`, version: "1.0.0", summary: `${FIELD_COUNT} fields read by Doe from ${CLINIC.domain}.` },
  servers: [{ url: `${API_ORIGIN}${BASE}` }],
  paths: {
    "/": { get: { operationId: "getClinic", summary: "Status and summary" } },
    ...Object.fromEntries(RESOURCES.map((r) => [`/${r}`, { get: { operationId: `get_${r}` } }])),
    "/consultations": { post: { operationId: "requestConsultation", summary: "Off until claimed", responses: { "403": { description: "not_activated" } } } },
  },
};

/** The four files, in the order the loader builds them. */
export const AGENT_FILES = [
  { path: "/llms.txt", kind: "text", what: "What the clinic is and where agents read more", body: LLMS_TXT },
  { path: "/robots.txt", kind: "text", what: "Lets agents in and points them at the files below", body: ROBOTS_TXT },
  { path: "/openapi.json", kind: "json", what: `The agent page as REST: ${RESOURCES.length + 2} endpoints`, body: OPENAPI },
  { path: "/.well-known/mcp.json", kind: "json", what: `MCP server card: ${CLINIC_TOOLS.length} tools on Doe's MCP`, body: MCP_CARD },
] as const;
