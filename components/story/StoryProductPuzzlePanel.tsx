import { StoryProductPuzzleTile } from "@/components/story/StoryProductPuzzleTile";
import { suisseIntl } from "@/lib/home/fonts";
import type { StoryProductPuzzleConfig } from "@/lib/story/story-product-puzzles";

/** Product tab — interlocking rounded puzzle tiles. */
export function StoryProductPuzzlePanel({ config }: { config: StoryProductPuzzleConfig }) {
  return (
    <div className={`story-puzzle-panel ${suisseIntl.className}`} aria-label={config.ariaLabel}>
      <ul className={`story-puzzle-grid story-puzzle-grid--${config.layout} m-0 list-none p-0`}>
        {config.tiles.map((tile) => (
          <StoryProductPuzzleTile key={tile.id} tile={tile} />
        ))}
      </ul>
    </div>
  );
}
