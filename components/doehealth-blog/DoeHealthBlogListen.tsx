"use client";

import { useState } from "react";

import { CareersFilterDropdown, type CareersDropdownSection } from "@/components/doehealth-careers/CareersFilterDropdown";

/** Heights (%) of the static audio lines. They only decorate the bar until audio is wired up. */
const AUDIO_LINE_HEIGHTS = [35, 60, 45, 80, 55, 30, 70, 90, 50, 65, 40, 75, 55, 85, 45, 60, 30, 70, 50, 40, 65, 35];

/** Languages offered in the picker. Choosing one only changes the label for now; nothing is translated yet. */
const LANGUAGE_SECTIONS: readonly CareersDropdownSection[] = [
  {
    options: [
      { value: "en", label: "English" },
      { value: "fr", label: "French" },
      { value: "es", label: "Spanish" },
    ],
  },
];

/**
 * The listen bar under the article hero: a play button, audio lines, and a language picker.
 * Built from the same pill bar and pills as the news picker. Visual only for now: nothing is wired up yet.
 */
export function DoeHealthBlogListen() {
  const [language, setLanguage] = useState("en");

  return (
    <section className="doehealth-blog-listen" aria-label="Listen to this article">
      <button type="button" className="doehealth-blog-listen__play" aria-label="Play audio">
        <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden>
          <path d="M5 3.5v9l7-4.5-7-4.5z" />
        </svg>
      </button>

      <span className="doehealth-blog-listen__lines" aria-hidden>
        {AUDIO_LINE_HEIGHTS.map((height, index) => (
          <span key={`line-${index}`} style={{ height: `${height}%` }} />
        ))}
      </span>

      <div className="doehealth-blog-listen__lang">
        <CareersFilterDropdown label="Language" value={language} sections={LANGUAGE_SECTIONS} onChange={setLanguage} />
      </div>
    </section>
  );
}
