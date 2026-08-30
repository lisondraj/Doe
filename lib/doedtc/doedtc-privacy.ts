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
  const lower = text.toLowerCase();
  return (
    lower.includes("password") ||
    lower.includes("otp") ||
    lower.includes("vault") ||
    lower.includes("locker") ||
    lower.includes("ssn") ||
    lower.includes("credit card") ||
    /https?:\/\//i.test(text)
  );
}
