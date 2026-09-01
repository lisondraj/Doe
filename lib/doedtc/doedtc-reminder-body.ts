const RELATIVE_TIME_RE = /\b(?:in|for)\s+(\d+)\s+(seconds?|minutes?|hours?)\b/i;
const CLOCK_TIME_RE = /\b(?:at\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/i;
const NAMED_DAY_TIME_RE =
  /\b(today|tomorrow)(?:\s+at\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?)?\b/i;

const CONFIRMATION_BODY_RE =
  /\b(?:absolutely|sure|of course|got it|okay|ok|done)[,.\s!]*(?:i(?:'ll| will)|i can)\s+(?:text|remind|ping)\s+you\b/i;
const WILL_REMIND_RE = /\b(?:i(?:'ll| will)|i can)\s+(?:text|remind|ping)\s+you\b/i;

const POLITE_PREFIX_RE =
  /^(?:hey(?:\s+doe)?|hi(?:\s+doe)?|please|can you|could you|would you|will you)[,.\s]+/i;

const REMIND_WRAPPER_RE =
  /^(?:please\s+)?(?:remind(?:\s+me(?:\s+to)?|\s+to)|text\s+me(?:\s+(?:to|about|with))?|ping\s+me(?:\s+to)?|don'?t forget(?:\s+to)?|remember(?:\s+to)?)\s+/i;

function stripTimePhrases(text: string): string {
  return text
    .replace(RELATIVE_TIME_RE, " ")
    .replace(NAMED_DAY_TIME_RE, " ")
    .replace(CLOCK_TIME_RE, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function looksLikeConfirmationBody(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  if (CONFIRMATION_BODY_RE.test(trimmed)) return true;
  if (WILL_REMIND_RE.test(trimmed) && trimmed.length < 140) {
    return !/\b(take|shot|dose|meds?|pill|ozempic|injection|weigh)\b/i.test(trimmed);
  }
  return false;
}

export function looksLikeRemindCommand(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  return /(?:remind(?:\s+me)?|text\s+me|ping\s+me|don'?t forget|remember to)\b/i.test(trimmed);
}

/** The thing to remember — never the ask, timer, or confirmation. */
export function toReminderPayload(text: string): string {
  let body = text.trim().replace(/^["'“”]+|["'“”]+$/g, "").trim();
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const before = body;
    body = body.replace(POLITE_PREFIX_RE, "").trim();
    body = stripTimePhrases(body);
    body = body.replace(REMIND_WRAPPER_RE, "").trim();
    body = body.replace(/^to\s+/i, "").trim();
    body = body.replace(/\b(?:with\s+a\s+reminder|with\s+a\s+timer|a\s+reminder)\b/gi, "").trim();
    body = body.replace(/^[,.\-–—:\s]+/, "").replace(/[,.\-–—:\s]+$/, "").trim();
    if (body === before) break;
  }
  return body;
}

export function stripRemindWrapper(text: string): string {
  return toReminderPayload(text);
}

function isEmptyReminderLabel(text: string): boolean {
  if (!text) return true;
  if (/^(?:a|an)?\s*reminder$/i.test(text)) return true;
  if (/^(?:me|to|us|please)$/i.test(text)) return true;
  return looksLikeConfirmationBody(text);
}

export function extractReminderBody(text: string): string | null {
  const payload = toReminderPayload(text);
  if (payload && !isEmptyReminderLabel(payload) && !looksLikeRemindCommand(payload)) {
    return payload;
  }

  const textMeMatch = text.match(/\btext\s+me(?:\s+with)?\s+(.+)$/i);
  if (textMeMatch) {
    const candidate = toReminderPayload(textMeMatch[1]!);
    if (candidate && !isEmptyReminderLabel(candidate) && !looksLikeRemindCommand(candidate)) {
      return candidate;
    }
  }

  const remindToMatch = text.match(/\bremind(?:\s+me(?:\s+to)?|\s+to)\s+(.+)$/i);
  if (remindToMatch) {
    const candidate = toReminderPayload(remindToMatch[1]!);
    if (candidate && !isEmptyReminderLabel(candidate) && !looksLikeRemindCommand(candidate)) {
      return candidate;
    }
  }

  if (/\b(?:with\s+a\s+reminder|with\s+a\s+timer|reminder\s+in)\b/i.test(text)) {
    return null;
  }

  return null;
}

function fallbackReminderLabel(intent?: string): string {
  const trimmed = intent?.trim();
  if (trimmed && trimmed.toLowerCase() !== "reminder" && !looksLikeRemindCommand(trimmed)) {
    return trimmed;
  }
  return "Reminder";
}

/** Reminder payload is the thing to remember — never the confirmation sentence or the ask. */
export function sanitizeScheduledTextBody(params: {
  body: string;
  inboundText?: string;
  intent?: string;
}): string {
  const fromInbound = params.inboundText ? extractReminderBody(params.inboundText) : null;
  let body = toReminderPayload(params.body);

  if (isEmptyReminderLabel(body) || looksLikeRemindCommand(body)) {
    body = fromInbound || fallbackReminderLabel(params.intent);
  } else if (fromInbound && looksLikeRemindCommand(params.body) && !looksLikeRemindCommand(fromInbound)) {
    body = fromInbound;
  }

  if (isEmptyReminderLabel(body) || looksLikeRemindCommand(body)) {
    body = fromInbound || fallbackReminderLabel(params.intent);
  }

  body = toReminderPayload(body);
  if (isEmptyReminderLabel(body) || looksLikeRemindCommand(body)) {
    return fallbackReminderLabel(params.intent);
  }
  return body;
}
