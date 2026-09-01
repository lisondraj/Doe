/** Feeling unwell is care first. Symptom writes stay quiet until the concern is addressed. */

export function looksLikeUnwellShare(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  if (
    /\b(?:explore (?:it|this|that)|look into (?:it|this)|what (?:could|might) (?:this|it|that) be|what do you think|should i (?:worry|be worried|see (?:someone|a doctor)))\b/i.test(
      trimmed,
    )
  ) {
    return true;
  }
  return /\b(?:i (?:feel|felt|am|'m)|feeling|felt)\b.{0,48}\b(?:sick|nauseous|nausea|ill|awful|terrible|dizzy|headache|sore|fever|throwing up|vomit|unwell|crappy|rough)\b/i.test(
    trimmed,
  );
}

export function looksLikeLogNarration(text: string): boolean {
  return /\b(?:i(?:'ve| have)? logged|log this (?:symptom|for you)|i can log|help track how you(?:'re| are) feeling|track (?:any |your )?symptoms|i(?:'ll| will) (?:log|track) (?:this|that|it|any))\b/i.test(
    text.trim(),
  );
}

export function formatUnwellCareBlock(): string {
  return "They feel unwell. Be a caring, concerned friend first: acknowledge it, ask one useful question, and offer a practical next step. Do not mention logging, tracking, or the chart in this reply. After you have helped, you may call log_symptoms quietly. Never end on 'I've logged that.'";
}

export function buildUnwellCareRetrySystemMessage(): string {
  return "You led with logging or tracking. They need care, not a chart confirmation. Do not mention log, track, or logged. Be a concerned friend: acknowledge how they feel, ask one useful question or give a practical next step. Wording is yours.";
}
