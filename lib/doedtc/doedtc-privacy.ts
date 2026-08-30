const URL_PATTERN = /https?:\/\/\S+/gi;
const SECRET_PATTERNS = [
  /\b(?:password|passwd|otp|pin|ssn|cvv)\b[\s:=]+[^\s]+/gi,
  /\b\d{3}-\d{2}-\d{4}\b/g,
];

export function redactDoeDtcLogText(text: string, maxLength = 160): string {
  let redacted = text.replace(URL_PATTERN, "[url]");
  for (const pattern of SECRET_PATTERNS) {
    redacted = redacted.replace(pattern, "[redacted]");
  }
  if (redacted.length > maxLength) {
    redacted = `${redacted.slice(0, maxLength)}…`;
  }
  return redacted;
}

export function sanitizeMem0Text(text: string): string {
  let sanitized = text.replace(URL_PATTERN, "");
  for (const pattern of SECRET_PATTERNS) {
    sanitized = sanitized.replace(pattern, "");
  }
  return sanitized.replace(/\s{2,}/g, " ").trim().slice(0, 1200);
}

export function shouldSkipMem0Memory(text: string): boolean {
  if (/https?:\/\//i.test(text)) return true;

  for (const pattern of SECRET_PATTERNS) {
    if (pattern.test(text)) return true;
  }

  const lower = text.toLowerCase();
  return (
    /\bpassword\b/.test(lower) ||
    /\botp\b/.test(lower) ||
    /\bpin\b/.test(lower) ||
    /\bssn\b/.test(lower) ||
    /\bcredit card\b/.test(lower) ||
    /\bcvv\b/.test(lower)
  );
}
