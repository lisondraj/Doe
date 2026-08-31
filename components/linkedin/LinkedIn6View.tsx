"use client";

import { inter, lora } from "@/lib/home/fonts";
import { LINKEDIN6_PILLS, LINKEDIN6_TAGLINE, LINKEDIN6_TITLE } from "@/lib/linkedin/linkedin6-copy";
import "@/lib/linkedin/linkedin6-page.css";

const GLASS_SIZE = 280;

function LinkedIn6Ui() {
  return (
    <div className={`linkedin6-page__ui ${inter.className}`}>
      <h1 className={`linkedin6-page__title ${lora.className}`}>{LINKEDIN6_TITLE}</h1>
      <p className="linkedin6-page__tagline">{LINKEDIN6_TAGLINE}</p>
      <ul className="linkedin6-page__pills" aria-label="Specialties">
        {LINKEDIN6_PILLS.map((pill) => (
          <li key={pill} className="linkedin6-page__pill">
            {pill}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** LinkedIn banner — flat dark brown canvas with liquid-glass square and UI tucked under it. */
export function LinkedIn6View() {
  return (
    <main className="linkedin6-page">
      <div className="linkedin6-page__frame">
        <div className="linkedin6-page__stage">
          <div
            className="linkedin6-page__glass"
            style={{ width: GLASS_SIZE, height: GLASS_SIZE }}
          >
            <div className="linkedin6-page__glass-body">
              <div className="linkedin6-page__glass-pane" aria-hidden />
              <LinkedIn6Ui />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
