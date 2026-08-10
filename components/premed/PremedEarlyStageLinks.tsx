import {
  BROADER_DOE_VISION_EARLY_STAGE_ENTRIES,
  BROADER_DOE_VISION_EARLY_STAGE_INTRO,
  type BroaderDoeVisionEarlyStageEntry,
} from "@/lib/blog/broader-doe-vision-early-stage-links";

type EarlyStageLinkEntry = Extract<BroaderDoeVisionEarlyStageEntry, { kind: "link" }>;
type EarlyStageNoteEntry = Extract<BroaderDoeVisionEarlyStageEntry, { kind: "note" }>;

type EarlyStageSegment =
  | { kind: "links"; entries: EarlyStageLinkEntry[] }
  | { kind: "note"; entry: EarlyStageNoteEntry };

function groupEarlyStageEntries(entries: readonly BroaderDoeVisionEarlyStageEntry[]): EarlyStageSegment[] {
  const segments: EarlyStageSegment[] = [];
  let linkBatch: EarlyStageLinkEntry[] = [];

  for (const entry of entries) {
    if (entry.kind === "note") {
      if (linkBatch.length > 0) {
        segments.push({ kind: "links", entries: linkBatch });
        linkBatch = [];
      }
      segments.push({ kind: "note", entry });
      continue;
    }

    linkBatch.push(entry);
  }

  if (linkBatch.length > 0) {
    segments.push({ kind: "links", entries: linkBatch });
  }

  return segments;
}

function PremedEarlyStageLinkItem({ entry }: { entry: EarlyStageLinkEntry }) {
  const { link } = entry;

  return (
    <li
      key={entry.id}
      className={`broader-doe-early-stage-links__item${link.nested ? " broader-doe-early-stage-links__item--nested" : ""}`}
    >
      <p className="broader-doe-early-stage-links__entry">
        <a href={link.href} className="broader-doe-early-stage-links__label">
          {link.label}
        </a>
        <span className="broader-doe-early-stage-links__separator" aria-hidden>
          :
        </span>{" "}
        <span className="broader-doe-early-stage-links__description">{link.description}</span>
      </p>
    </li>
  );
}

/** /premed — linked index with navigation handled by PremedLinkGuard. */
export function PremedEarlyStageLinks() {
  const segments = groupEarlyStageEntries(BROADER_DOE_VISION_EARLY_STAGE_ENTRIES);

  return (
    <div className="broader-doe-early-stage-links mt-8 iphone-page:mt-9">
      <p className="broader-doe-early-stage-links__intro">{BROADER_DOE_VISION_EARLY_STAGE_INTRO}</p>

      {segments.map((segment) => {
        if (segment.kind === "note") {
          return (
            <p key={segment.entry.id} className="broader-doe-early-stage-links__note">
              {segment.entry.text}
            </p>
          );
        }

        return (
          <ul
            key={`links-${segment.entries.map((entry) => entry.id).join("-")}`}
            className="broader-doe-early-stage-links__list m-0 list-none p-0"
          >
            {segment.entries.map((entry) => (
              <PremedEarlyStageLinkItem key={entry.id} entry={entry} />
            ))}
          </ul>
        );
      })}
    </div>
  );
}
