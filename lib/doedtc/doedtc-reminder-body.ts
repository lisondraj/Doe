const RELATIVE_TIME_RE = /\b(?:in|for)\s+(\d+)\s+(seconds?|minutes?|hours?)\b/i;
const CLOCK_TIME_RE = /\b(?:at\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/i;
const NAMED_DAY_TIME_RE =
  /\b(today|tomorrow)(?:\s+at\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?)?\b/i;

const CONFIRMATION_BODY_RE =
  /\b(?:absolutely|sure|of course|got it|okay|ok|done)[,.\s!]*(?:i(?:'ll| will)|i can)\s+(?:text|remind|ping)\s+you\b/i;
const WILL_REMIND_RE = /\b(?:i(?:'ll| will)|i can)\s+(?:text|remind|ping)\s+you\b/i;

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

export function stripRemindWrapper(text: string): string {
  let body = text.trim();
  body = body.replace(/^(?:please\s+)?remind(?:\s+me)?(?:\s+to)?\s+/i, "");
  body = body.replace(/^(?:please\s+)?text\s+me(?:\s+(?:to|about|with))?\s+/i, "");
  body = stripTimePhrases(body);
  body = body.replace(/\b(?:with\s+a\s+reminder|with\s+a\s+timer|a\s+reminder)\b/gi, "").trim();
  body = body.replace(/^[,.\-–—:\s]+/, "").replace(/[,.\-–—:\s]+$/, "").trim();
  return body;
}

export function extractReminderBody(text: string): string | null {
  const textMeMatch = text.match(/\btext\s+me(?:\s+with)?\s+(.+)$/i);
  if (textMeMatch) {
    let candidate = stripTimePhrases(textMeMatch[1]!.trim());
    candidate = candidate.replace(/\b(?:a|an)\s+reminder\b/gi, "").trim();
    if (candidate && !/^(?:a|an)?\s*reminder$/i.test(candidate) && !looksLikeConfirmationBody(candidate)) {
      return candidate;
    }
  }

  const remindToMatch = text.match(/\bremind(?:\s+me)?\s+(?:to\s+)?(.+)$/i);
  if (remindToMatch) {
    let body = stripTimePhrases(remindToMatch[1]!.trim());
    body = body.replace(/\b(?:with\s+a\s+reminder|with\s+a\s+timer)\b/gi, "").trim();
    if (body && !/^(?:a|an)?\s*reminder$/i.test(body) && !looksLikeConfirmationBody(body)) {
      return body;
    }
  }

  if (/\b(?:with\s+a\s+reminder|with\s+a\s+timer|reminder\s+in)\b/i.test(text)) {
    return null;
  }

  const stripped = stripRemindWrapper(text);
  if (
    stripped &&
    !/^(?:a|an)?\s*reminder$/i.test(stripped) &&
    !looksLikeConfirmationBody(stripped) &&
    stripped.toLowerCase() !== text.trim().toLowerCase()
  ) {
    return stripped;
  }

  return null;
}

function fallbackReminderLabel(intent?: string): string {
  const trimmed = intent?.trim();
  if (trimmed && trimmed.toLowerCase() !== "reminder") return trimmed;
  return "Reminder";
}

/** Reminder payload is the thing to remember — never the confirmation sentence. */
export function sanitizeScheduledTextBody(params: {
  body: string;
  inboundText?: string;
  intent?: string;
}): string {
  let body = params.body.trim();
  const fromInbound = params.inboundText ? extractReminderBody(params.inboundText) : null;

  if (!body || looksLikeConfirmationBody(body)) {
    body = fromInbound || stripRemindWrapper(params.body) || fallbackReminderLabel(params.intent);
  } else if (/^(?:please\s+)?(?:remind(?:\s+me)?|text\s+me)\b/i.test(body)) {
    body = stripRemindWrapper(body) || fromInbound || fallbackReminderLabel(params.intent);
  }

  if (!body || looksLikeConfirmationBody(body) || /^(?:a|an)?\s*reminder$/i.test(body)) {
    body = fromInbound || fallbackReminderLabel(params.intent);
  }

  return body.trim();
}
