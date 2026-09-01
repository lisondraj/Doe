/** “What can you do” is a conversation turn — not a cue to recite the tool catalog. */

export function askedWhatYouCanDo(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  if (/\bwhat can you do (?:about|for|with|if|when)\b/i.test(trimmed)) return false;
  return /\b(?:what (?:all )?can you do|what do you (?:do|help with)|what are you (?:able to do|good at)|what'?s your (?:job|deal)|who are you(?: again)?|your capabilities)\b/i.test(
    trimmed,
  );
}

export function looksLikeCapabilityBrochure(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  if (
    /\bi can (?:help )?(?:you )?(?:manage|with).{0,160}\b(?:health information|reminders?|track(?:ers|ing)?|appointments?|medications?|symptoms?)\b/i.test(
      trimmed,
    )
  ) {
    return true;
  }
  return /\b(?:manage (?:your )?health(?: information)?|set reminders?|log symptoms?|track (?:meds|medications|water|appointments))\b.{0,80}\b(?:and|or|,)\b/i.test(
    trimmed,
  );
}

export function formatCapabilityAskBlock(): string {
  return "They asked what you can do. Do not recite a feature list or 'I can help manage health information, set reminders.' Answer like a friend in one or two sentences. Wording is yours. Name one concrete thing already on their chart, or ask what they want to do next.";
}

export function buildCapabilityRetrySystemMessage(): string {
  return "You recited a product menu. They asked what you can do. Do not list health information, reminders, trackers, or tools. Answer like a friend in one or two sentences. Wording is yours.";
}
