import { StoryProductPuzzlePanel } from "@/components/story/StoryProductPuzzlePanel";
import { STORY_GENOME_PUZZLE } from "@/lib/story/story-product-puzzles";

/** Genome tab — 2×2 puzzle grid with wide TL/BR tiles and square TR/BL tiles. */
export function StoryGenomePanel() {
  return <StoryProductPuzzlePanel config={STORY_GENOME_PUZZLE} />;
}
