"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { StoryShaderPosterFill } from "@/components/story/StoryShaderPosterFill";
import type { StoryProductPuzzleTile } from "@/lib/story/story-product-puzzles";

function PuzzleTilePlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
      className="story-puzzle-tile__add-icon"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

/** Single puzzle tile — shader fill, plus control, and in-tile detail modal. */
export function StoryProductPuzzleTile({ tile }: { tile: StoryProductPuzzleTile }) {
  const [open, setOpen] = useState(false);
  const addButtonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    addButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close, open]);

  if (tile.spacer) {
    return (
      <li
        className={`story-puzzle-tile story-puzzle-tile--spacer story-puzzle-tile--${tile.placement}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <li
      className={`story-puzzle-tile story-puzzle-tile--${tile.placement}${tile.posterSrc ? " story-puzzle-tile--poster" : ""}${open ? " story-puzzle-tile--modal-open" : ""}`}
    >
      {tile.posterSrc ? (
        <StoryShaderPosterFill src={tile.posterSrc} className="story-puzzle-tile__poster" />
      ) : null}

      <button
        ref={addButtonRef}
        type="button"
        className="story-puzzle-tile__add"
        aria-label={`Open ${tile.label} details`}
        aria-expanded={open}
        aria-controls={open ? `${tile.id}-modal` : undefined}
        onClick={() => setOpen(true)}
      >
        <PuzzleTilePlusIcon />
      </button>

      {open ? (
        <button
          id={`${tile.id}-modal`}
          type="button"
          aria-label={`Close ${tile.label} details`}
          className="story-puzzle-tile__modal"
          onClick={close}
        >
          <p className="story-puzzle-tile__modal-body m-0">{tile.description}</p>
        </button>
      ) : null}
    </li>
  );
}
