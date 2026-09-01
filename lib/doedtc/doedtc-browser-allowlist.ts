const SITE_ALIASES: Record<string, string> = {
  mayo: "mayoclinic.org",
  "mayo clinic": "mayoclinic.org",
  mayoclinic: "mayoclinic.org",
  cdc: "cdc.gov",
  nih: "nih.gov",
  who: "who.int",
  wikipedia: "wikipedia.org",
  wiki: "wikipedia.org",
  google: "google.com",
  medlineplus: "medlineplus.gov",
  medline: "medlineplus.gov",
  healthline: "healthline.com",
  webmd: "webmd.com",
};

export function normalizeBrowserHost(input: string): string {
  try {
    const url = input.includes("://") ? new URL(input) : new URL(`https://${input}`);
    return url.hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return input.trim().toLowerCase().replace(/^www\./, "");
  }
}

export function hostMatchesSuffix(host: string, suffix: string): boolean {
  return host === suffix || host.endsWith(`.${suffix}`);
}

export function isDeniedBrowserHost(_host: string): boolean {
  return false;
}

export function resolveSiteAlias(input: string): string | null {
  const normalized = input.trim().toLowerCase().replace(/\s+/g, " ");
  if (!normalized) return null;
  return SITE_ALIASES[normalized] ?? null;
}

export function assertBrowserHostAllowed(_params: {
  host: string;
  mode: "research" | "login" | "write";
  declaredHost?: string | null;
}): void {
  return;
}

export function browserUrlForHost(host: string): string {
  const normalized = normalizeBrowserHost(host);
  return `https://${normalized}`;
}

export function normalizeBrowserUrl(input: string): { host: string; targetUrl: string } {
  const raw = input.trim();
  if (!raw) {
    throw new Error("A URL is required.");
  }

  if (raw.includes("://")) {
    return { host: normalizeBrowserHost(raw), targetUrl: raw };
  }

  const alias = resolveSiteAlias(raw);
  if (alias && !raw.includes("/") && !raw.includes("?")) {
    return { host: alias, targetUrl: browserUrlForHost(alias) };
  }

  if (raw.includes("/") || raw.includes("?")) {
    const url = new URL(`https://${raw}`);
    return {
      host: url.hostname.toLowerCase().replace(/^www\./, ""),
      targetUrl: url.href,
    };
  }

  const host = alias ?? normalizeBrowserHost(raw);
  return { host, targetUrl: browserUrlForHost(host) };
}

/** DuckDuckGo HTML results — default for research (bot-tolerant). */
export function duckduckgoSearchUrl(query: string): string {
  const trimmed = query.trim();
  if (!trimmed) return "https://html.duckduckgo.com/html/";
  return `https://html.duckduckgo.com/html/?q=${encodeURIComponent(trimmed)}`;
}

/** Explicit Google search (used only when the user asks for Google). */
export function googleSearchUrl(query: string): string {
  const trimmed = query.trim();
  if (!trimmed) return browserUrlForHost("google.com");
  return `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`;
}

/** Default research search URL (DuckDuckGo HTML). */
export function researchSearchUrl(query: string): string {
  return duckduckgoSearchUrl(query);
}

export function isDuckDuckGoBrowseHost(host: string): boolean {
  const normalized = normalizeBrowserHost(host);
  return normalized === "duckduckgo.com" || normalized.endsWith(".duckduckgo.com");
}

export function extractSearchQueryFromUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("google.")) {
      return parsed.searchParams.get("q")?.trim() || null;
    }
    if (parsed.hostname.includes("duckduckgo.")) {
      return parsed.searchParams.get("q")?.trim() || null;
    }
    for (const key of ["q", "query", "search"]) {
      const value = parsed.searchParams.get(key)?.trim();
      if (value) return value;
    }
  } catch {
    return null;
  }
  return null;
}

export function isBlockedBrowsePage(params: {
  url?: string;
  title?: string;
  excerpt?: string;
}): boolean {
  const url = params.url ?? "";
  const title = (params.title ?? "").toLowerCase();
  const excerpt = (params.excerpt ?? "").toLowerCase();
  const combined = `${title} ${excerpt}`;

  if (/\/sorry|google\.com\/sorry/i.test(url)) return true;
  if (combined.includes("unusual traffic")) return true;
  if (combined.includes("detected unusual traffic")) return true;
  if (combined.includes("are you a robot")) return true;
  if (combined.includes("verify you are human")) return true;
  if (combined.includes("before you continue to google")) return true;
  if (title.includes("sorry") && combined.includes("automated")) return true;

  return false;
}

function stripScreenshotTail(text: string): string {
  return text
    .replace(
      /\s+(?:and\s+)?(?:then\s+)?(?:ss|s\/s|screenshot|snap(?:shot)?|send(?:ing)?\s+(?:a\s+)?(?:ss|screenshot)|ss\s+(?:the\s+)?result).*$/i,
      "",
    )
    .trim();
}

export function looksLikeBrowseAsk(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  if (
    /\b(?:screenshot|browse|google(?:\.com)?|duckduckgo|go(?:\s+)?to|goto|look(?:ing)?\s*up|search\s+up|visit\s+(?:https?:\/\/|www\.)|open\s+(?:https?:\/\/|www\.|the\s+)?(?:page|site|browser)|first\s+(?:link|result)|web search)\b/i.test(
      trimmed,
    )
  ) {
    return true;
  }
  return (
    /\bsearch (?:for|the)\b/i.test(trimmed) &&
    !/\b(?:chart|profile|tracker|labs?|results?)\b/i.test(trimmed)
  );
}

export function extractSearchQuery(text: string): string {
  let q = text.trim();
  q = q.replace(/^(?:(?:can you|can u|could you|would you|please)\s+)+/i, "").trim();
  q = stripScreenshotTail(q);
  q = q.replace(/\s+and\s+(?:what|which)\s+(?:link|result|url|site).*$/i, "").trim();
  q = q.replace(/\s+and\s+(?:tell me|show me|send(?:\s+it)?|text(?:\s+it)?).*$/i, "").trim();
  q = q.replace(/^(?:please\s+)?(?:open(?:\s+(?:the\s+)?)?(?:browser\s+)?)?/i, "").trim();
  q = q.replace(/^(?:go\s*to|goto|visit|open)\s+/i, "").trim();

  const googleThenType = q.match(
    /^(?:google(?:\.com)?)(?:\s+and)?\s+(?:type|search(?:\s+(?:for|up))?|look\s*up)\s+(.+)$/i,
  );
  if (googleThenType?.[1]) return googleThenType[1].trim();

  const googleMid = q.match(
    /\bgoogle(?:\.com)?\b(?:\s+and)?\s+(?:type|search(?:\s+(?:for|up))?|look\s*up)\s+(.+)$/i,
  );
  if (googleMid?.[1]) return googleMid[1].trim();

  q = q.replace(/^(?:search(?:\s+(?:for|up))?|type|look\s*up|lookup)\s+/i, "").trim();
  q = q.replace(/^(?:google(?:\.com)?)\s+/i, "").trim();
  return q;
}

export function isGoogleBrowseHost(host: string): boolean {
  const normalized = normalizeBrowserHost(host);
  return normalized === "google.com" || normalized.endsWith(".google.com");
}

export function siteSearchUrl(host: string, query: string): string {
  const normalizedHost = normalizeBrowserHost(host);
  const q = encodeURIComponent(query.trim());

  switch (normalizedHost) {
    case "mayoclinic.org":
      return `https://www.mayoclinic.org/search/search-results?q=${q}`;
    case "cdc.gov":
      return `https://www.cdc.gov/search/?query=${q}`;
    case "nih.gov":
      return `https://search.nih.gov/search?query=${q}`;
    case "wikipedia.org":
      return `https://en.wikipedia.org/w/index.php?search=${q}`;
    case "medlineplus.gov":
      return `https://medlineplus.gov/search/?query=${q}`;
    case "google.com":
      return googleSearchUrl(query);
    default:
      return duckduckgoSearchUrl(`site:${normalizedHost} ${query}`);
  }
}

export function resolveResearchBrowseTarget(params: {
  url: string;
  intent: string;
}): { host: string; targetUrl: string } | { ok: false; error: string } {
  const raw = params.url.trim();
  const intent = params.intent.trim();
  const combined = [raw, intent].filter(Boolean).join(" ");

  let host: string;
  let targetUrl: string;

  const alias = resolveSiteAlias(raw);
  const searchQuery = extractSearchQuery(intent) || extractSearchQuery(combined);
  const wantsGoogle =
    isGoogleBrowseHost(alias ?? "") ||
    /\bgoogle(?:\.com)?\b/i.test(combined);

  try {
    if (raw && (raw.includes("://") || raw.includes(".") || raw.includes("/") || raw.includes("?"))) {
      const normalized = normalizeBrowserUrl(raw);
      host = normalized.host;
      const hostOnly = !/\/.+/.test(raw.replace(/^https?:\/\//, "").split("?")[0] ?? "");
      const typedQuery = /(?:^|\b)(?:type|search(?:\s+for)?|look\s*up)\b/i.test(intent);
      targetUrl =
        searchQuery && isGoogleBrowseHost(host)
          ? googleSearchUrl(searchQuery)
          : searchQuery && typedQuery && hostOnly
            ? siteSearchUrl(host, searchQuery)
            : normalized.targetUrl;
    } else if (alias && searchQuery) {
      host = alias;
      targetUrl = siteSearchUrl(host, searchQuery);
    } else if (alias) {
      host = alias;
      targetUrl = browserUrlForHost(host);
    } else if (searchQuery) {
      if (wantsGoogle) {
        host = "google.com";
        targetUrl = googleSearchUrl(searchQuery);
      } else {
        host = "duckduckgo.com";
        targetUrl = researchSearchUrl(searchQuery);
      }
    } else if (raw) {
      if (wantsGoogle) {
        host = "google.com";
        targetUrl = googleSearchUrl(raw);
      } else {
        host = "duckduckgo.com";
        targetUrl = researchSearchUrl(raw);
      }
    } else {
      return { ok: false, error: "A URL or search topic is required." };
    }
  } catch {
    return { ok: false, error: "Could not parse that URL." };
  }

  return { host, targetUrl };
}
