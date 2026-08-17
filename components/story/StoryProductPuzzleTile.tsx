"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { StoryFabricCanvas } from "@/components/story/StoryFabricCanvas";
import { StoryFabricLibrary } from "@/components/story/StoryFabricLibrary";
import { StoryFabricSimulator } from "@/components/story/StoryFabricSimulator";
import { StoryFabricTone } from "@/components/story/StoryFabricTone";
import { StoryFloatCodes } from "@/components/story/StoryFloatCodes";
import { StoryFloatDenials } from "@/components/story/StoryFloatDenials";
import { StoryFloatHold } from "@/components/story/StoryFloatHold";
import { StoryFloatRates } from "@/components/story/StoryFloatRates";
import { StoryGenomeAgentCanvas } from "@/components/story/StoryGenomeAgentCanvas";
import { StoryGenomeClinicFleet } from "@/components/story/StoryGenomeClinicFleet";
import { StoryGenomeGoldTitle } from "@/components/story/StoryGenomeGoldTitle";
import { StoryGenomeModelRouter } from "@/components/story/StoryGenomeModelRouter";
import { StoryGenomeWeeklyTrain } from "@/components/story/StoryGenomeWeeklyTrain";
import { StoryPulseFrontDesk } from "@/components/story/StoryPulseFrontDesk";
import { StoryPulseLiveFloor } from "@/components/story/StoryPulseLiveFloor";
import { StoryPulseNights } from "@/components/story/StoryPulseNights";
import { StoryPulseVoiceSettings } from "@/components/story/StoryPulseVoiceSettings";
import { StoryMeetDoeCallLogicDiagram } from "@/components/story/StoryMeetDoeCallLogicDiagram";
import { StoryMeetDoeCornerLabel } from "@/components/story/StoryMeetDoeCornerLabel";
import { StoryMeetDoeFloatDashboard } from "@/components/story/StoryMeetDoeFloatDashboard";
import { StoryMeetDoePhonePills } from "@/components/story/StoryMeetDoePhonePills";
import { StoryMeetDoeUpgradeSplit } from "@/components/story/StoryMeetDoeUpgradeSplit";
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

function PuzzleTileCloseIcon() {
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
      <path d="M5 5l14 14M19 5 5 19" />
    </svg>
  );
}

/** Single puzzle tile — shader fill, plus control, and in-tile detail modal. */
export function StoryProductPuzzleTile({ tile }: { tile: StoryProductPuzzleTile }) {
  const [open, setOpen] = useState(false);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const isMeetDoeTile = tile.placement.startsWith("meet-doe-");
  const isGenomeTile = tile.placement.startsWith("genome-");
  const isPulseTile = tile.placement.startsWith("pulse-");
  const isFabricTile = tile.placement.startsWith("fabric-");
  const isFloatTile = tile.placement.startsWith("float-");
  const usesCloseControl = isMeetDoeTile || isGenomeTile || isPulseTile || isFabricTile || isFloatTile;

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

      {tile.innerSplit === "narrow-wide" ? <StoryMeetDoeUpgradeSplit /> : null}

      {tile.phonePills ? <StoryMeetDoePhonePills /> : null}

      {tile.callLogicDiagram ? <StoryMeetDoeCallLogicDiagram /> : null}

      {tile.floatDashboard ? <StoryMeetDoeFloatDashboard /> : null}

      {tile.genomeVisual === "fleet" ? <StoryGenomeClinicFleet /> : null}
      {tile.genomeVisual === "router" ? <StoryGenomeModelRouter /> : null}
      {tile.genomeVisual === "train" ? <StoryGenomeWeeklyTrain /> : null}
      {tile.genomeVisual === "agents" ? <StoryGenomeAgentCanvas /> : null}

      {tile.pulseVisual === "voices" ? <StoryPulseVoiceSettings /> : null}
      {tile.pulseVisual === "desk" ? <StoryPulseFrontDesk /> : null}
      {tile.pulseVisual === "live" ? <StoryPulseLiveFloor /> : null}
      {tile.pulseVisual === "nights" ? <StoryPulseNights /> : null}

      {tile.fabricVisual === "canvas" ? <StoryFabricCanvas /> : null}
      {tile.fabricVisual === "tone" ? <StoryFabricTone /> : null}
      {tile.fabricVisual === "library" ? <StoryFabricLibrary /> : null}
      {tile.fabricVisual === "sim" ? <StoryFabricSimulator /> : null}

      {tile.floatVisual === "hold" ? <StoryFloatHold /> : null}
      {tile.floatVisual === "rates" ? <StoryFloatRates /> : null}
      {tile.floatVisual === "codes" ? <StoryFloatCodes /> : null}
      {tile.floatVisual === "denials" ? <StoryFloatDenials /> : null}

      {tile.meetDoeCornerLabel ? (
        <StoryMeetDoeCornerLabel
          label={tile.meetDoeCornerLabel.text}
          corner={tile.meetDoeCornerLabel.corner}
          tone={tile.meetDoeCornerLabel.tone}
        />
      ) : null}

      {tile.meetDoeGoldTitle ? (
        <StoryGenomeGoldTitle label={tile.meetDoeGoldTitle} placement={tile.placement} />
      ) : null}

      {tile.genomeGoldTitle ? (
        <StoryGenomeGoldTitle label={tile.genomeGoldTitle} placement={tile.placement} />
      ) : null}
      {tile.pulseGoldTitle ? (
        <StoryGenomeGoldTitle label={tile.pulseGoldTitle} placement={tile.placement} />
      ) : null}
      {tile.fabricGoldTitle ? (
        <StoryGenomeGoldTitle label={tile.fabricGoldTitle} placement={tile.placement} />
      ) : null}
      {tile.floatGoldTitle ? (
        <StoryGenomeGoldTitle label={tile.floatGoldTitle} placement={tile.placement} />
      ) : null}

      <button
        ref={addButtonRef}
        type="button"
        className={`story-puzzle-tile__add${open && usesCloseControl ? " story-puzzle-tile__add--close" : ""}`}
        aria-label={open ? `Close ${tile.label} details` : `Open ${tile.label} details`}
        aria-expanded={open}
        aria-controls={open ? `${tile.id}-modal` : undefined}
        onClick={() => {
          if (open) {
            close();
            return;
          }

          setOpen(true);
        }}
      >
        {open && usesCloseControl ? <PuzzleTileCloseIcon /> : <PuzzleTilePlusIcon />}
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
