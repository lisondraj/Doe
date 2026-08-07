import type { AboutStyleFeatureShaderVariant } from "@/lib/blog/about-style-feature-card";

export type AboutStyleArticleGlossaryEntry = {
  term: string;
  definition: string;
};

export type AboutStyleArticleContentBlock =
  /** Wrap a phrase in `**text**` to bold it inline. */
  | { type: "paragraph"; text: string }
  | { type: "subheading"; text: string }
  | {
      /** Broader Doe Vision–style gold pull quote. Wrap a phrase in `**text**` to bold it. */
      type: "quote";
      id: string;
      lead: string;
      continuation: string;
    }
  | {
      /** Full-paragraph gold gradient text, matching the "grateful" paragraph on /about. */
      type: "goldParagraph";
      text: string;
    }
  | {
      /** Indented term/definition legend — one term per line. */
      type: "glossary";
      id: string;
      entries: readonly AboutStyleArticleGlossaryEntry[];
    }
  | {
      /** Bulleted list — wrap a phrase in `**text**` to bold it inline. */
      type: "bullets";
      id: string;
      items: readonly string[];
    }
  | {
      type: "shader";
      id: string;
      shaderVariant: AboutStyleFeatureShaderVariant;
      caption: string;
    }
  | {
      /** Editorial photograph rendered with an accessible caption. */
      type: "photo";
      id: string;
      src: string;
      alt: string;
      caption: string;
    };
