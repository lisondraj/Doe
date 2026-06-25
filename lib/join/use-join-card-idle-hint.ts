"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Wait this long without clicking a field after reaching the card section. */
const IDLE_MS = 10000;

export function useJoinCardIdleHint({
  enabled,
  resetEpoch,
  sectionInView,
}: {
  enabled: boolean;
  resetEpoch: number;
  sectionInView: boolean;
}) {
  const [hasContacted, setHasContacted] = useState(false);
  const [hintReady, setHintReady] = useState(false);
  const hasContactedRef = useRef(false);
  const idleTimerRef = useRef<number | null>(null);

  useEffect(() => {
    hasContactedRef.current = false;
    setHasContacted(false);
    setHintReady(false);
  }, [resetEpoch]);

  useEffect(() => {
    if (idleTimerRef.current !== null) {
      window.clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
    setHintReady(false);

    if (!sectionInView || hasContactedRef.current) return;

    idleTimerRef.current = window.setTimeout(() => {
      if (!hasContactedRef.current) {
        setHintReady(true);
      }
      idleTimerRef.current = null;
    }, IDLE_MS);

    return () => {
      if (idleTimerRef.current !== null) {
        window.clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
      }
    };
  }, [resetEpoch, sectionInView]);

  const registerContact = useCallback(() => {
    if (hasContactedRef.current) return;
    hasContactedRef.current = true;
    setHasContacted(true);
    setHintReady(false);
  }, []);

  const showIdleHint = enabled && sectionInView && !hasContacted && hintReady;

  return { showIdleHint, registerContact };
}
