"use client";

import { HeroLinkedInIcon } from "@/components/home/icons/HeroSocialIcons";
import { NavMailIcon } from "@/components/nav/NavMailIcon";
import { ProtoGrainGradient } from "@/components/proto/ProtoGrainGradient";
import { suisseIntl } from "@/lib/home/fonts";
import {
  STORY_CONTACT_EMAIL,
  STORY_CONTACT_LINKEDIN_URL,
  STORY_CONTACT_MAILTO,
  STORY_CONTACT_NAME,
} from "@/lib/story/story-contact";
import { STORY_CONTACT_SHADER } from "@/lib/story/story-contact-shader";

/** Story sidebar footer — James contact card in the old user-selector slot. */
export function StoryContactFooter() {
  return (
    <div className="story-contact-footer">
      <div className="story-contact-card">
        <div className="story-contact-card__shader-frame" aria-hidden>
          <div
            className="story-contact-card__shader-panel"
            style={{ backgroundColor: STORY_CONTACT_SHADER.colorBack }}
          >
            <ProtoGrainGradient
              static
              variant={STORY_CONTACT_SHADER.variant}
              colors={STORY_CONTACT_SHADER.colors}
              colorBack={STORY_CONTACT_SHADER.colorBack}
              className="story-contact-card__shader absolute inset-0 h-full w-full"
            />
          </div>
        </div>

        <div className="story-contact-card__content">
          <div className="story-contact-card__identity">
            <span className={`story-contact-card__name ${suisseIntl.className}`}>{STORY_CONTACT_NAME}</span>
            <span className={`story-contact-card__email ${suisseIntl.className}`}>{STORY_CONTACT_EMAIL}</span>
          </div>
          <div className="story-contact-card__actions">
            <a
              href={STORY_CONTACT_MAILTO}
              className="story-contact-card__action story-contact-card__action--mail"
              aria-label={`Email ${STORY_CONTACT_EMAIL}`}
            >
              <NavMailIcon className="story-contact-card__action-icon" />
            </a>
            <a
              href={STORY_CONTACT_LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="story-contact-card__action story-contact-card__action--linkedin"
              aria-label={`${STORY_CONTACT_NAME} on LinkedIn`}
            >
              <HeroLinkedInIcon />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
