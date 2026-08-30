/** Public Soar Flight Booking MCP client (search tier — no booking without OAuth). */

export const SOAR_MCP_URL = "https://mcp.soar.flights";
export const SOAR_APP_URL = "https://soar.flights";

type JsonRpcSuccess = {
  jsonrpc: "2.0";
  id: number;
  result?: unknown;
};

type JsonRpcError = {
  jsonrpc: "2.0";
  id: number;
  error?: { message?: string; code?: number };
};

export type SoarFlightSearchParams = {
  origin: string;
  destination: string;
  date: string;
  returnDate?: string;
  passengers?: number;
  cabin?: "economy" | "premium_economy" | "business" | "first";
  limit?: number;
};

export type SoarCompactOffer = {
  id?: string;
  price?: string;
  summary?: string;
  stops?: string;
  duration?: string;
};

export type SoarFlightSearchResult = {
  ok: boolean;
  error?: string;
  offers: SoarCompactOffer[];
  recommended?: SoarCompactOffer | null;
  book_url: string;
};

function soarHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json, text/event-stream",
  };
  const apiKey = process.env.SOAR_API_KEY?.trim();
  if (apiKey) headers["X-Soar-API-Key"] = apiKey;
  return headers;
}

async function soarRpc(method: string, params: Record<string, unknown>, id = 1): Promise<unknown> {
  const response = await fetch(SOAR_MCP_URL, {
    method: "POST",
    headers: soarHeaders(),
    body: JSON.stringify({ jsonrpc: "2.0", id, method, params }),
  });
  if (!response.ok) {
    throw new Error(`Soar MCP ${response.status}`);
  }
  const payload = (await response.json()) as JsonRpcSuccess & JsonRpcError;
  if (payload.error?.message) throw new Error(payload.error.message);
  return payload.result;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function pickString(record: Record<string, unknown> | null, keys: string[]): string | undefined {
  if (!record) return undefined;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
  }
  return undefined;
}

export function compactSoarOffer(raw: unknown): SoarCompactOffer {
  const record = asRecord(raw);
  const nested = asRecord(record?.offer) ?? record;
  return {
    id: pickString(nested, ["id", "offer_id", "offerId"]),
    price: pickString(nested, ["total_amount", "price", "total", "amount", "total_price"]),
    summary: pickString(nested, ["summary", "label", "itinerary", "title", "route"]),
    stops: pickString(nested, ["stops", "stop_count", "connections"]),
    duration: pickString(nested, ["duration", "total_duration", "duration_text"]),
  };
}

export function formatSoarOffersForAgent(result: SoarFlightSearchResult): string {
  if (!result.ok) return result.error ?? "Flight search failed.";
  if (result.offers.length === 0) return "No matching flights.";
  const lines = result.offers.slice(0, 5).map((offer, index) => {
    const bits = [offer.summary, offer.price, offer.duration, offer.stops ? `${offer.stops} stops` : null]
      .filter(Boolean)
      .join(" · ");
    return `${index + 1}. ${bits || offer.id || "offer"}`;
  });
  return lines.join("\n");
}

export async function searchSoarFlights(
  params: SoarFlightSearchParams,
): Promise<SoarFlightSearchResult> {
  const bookUrl = SOAR_APP_URL;
  try {
    const result = await soarRpc("tools/call", {
      name: "soar_search_flights",
      arguments: {
        origin: params.origin.trim(),
        destination: params.destination.trim(),
        date: params.date.trim(),
        ...(params.returnDate ? { return_date: params.returnDate.trim() } : {}),
        ...(typeof params.passengers === "number" ? { passengers: params.passengers } : {}),
        cabin: params.cabin ?? "economy",
        limit: params.limit ?? 5,
        sort: "best",
      },
    });
    const payload = asRecord(result);
    const structured = asRecord(payload?.structuredContent) ?? asRecord(payload?.content) ?? payload;
    const contentBlock = Array.isArray(payload?.content)
      ? asRecord((payload.content as unknown[])[0])
      : null;
    const parsedText =
      contentBlock && typeof contentBlock.text === "string"
        ? (JSON.parse(contentBlock.text) as unknown)
        : structured;
    const body = asRecord(parsedText) ?? structured;
    if (body && typeof body.error === "string" && body.error.trim()) {
      return { ok: false, error: body.error, offers: [], book_url: bookUrl };
    }
    const rawOffers = Array.isArray(body?.offers) ? body.offers : [];
    const offers = rawOffers.map(compactSoarOffer).filter((offer) => offer.id || offer.summary || offer.price);
    const recommended = body?.recommended ? compactSoarOffer(body.recommended) : offers[0] ?? null;
    return { ok: true, offers, recommended, book_url: bookUrl };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Flight search failed.",
      offers: [],
      book_url: bookUrl,
    };
  }
}

export async function getSoarLiveFlightStatus(flightNumber: string): Promise<{
  ok: boolean;
  error?: string;
  status?: unknown;
}> {
  try {
    const result = await soarRpc("tools/call", {
      name: "soar_get_live_flight_status",
      arguments: { flight_number: flightNumber.trim() },
    });
    return { ok: true, status: result };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Could not look up that flight.",
    };
  }
}
