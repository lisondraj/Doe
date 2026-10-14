"use client";

import { Player, type PlayerRef } from "@remotion/player";
import { useCallback, useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";

import { dmSans, p22Mackinac } from "@/lib/home/fonts";
import { VIDEO1_FPS, VIDEO1_HEIGHT, VIDEO1_LIST, VIDEO1_WIDTH } from "@/remotion/video1";

const BEIGE = "#F4EEDF";
const PAPER = "#FFFCF1";
const INK = "#140C04";
const HAIRLINE = "rgba(40,25,16,0.1)";

const timecode = (frame: number) => {
  const s = Math.floor(frame / VIDEO1_FPS);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

export function Video1Stage() {
  const playerRef = useRef<PlayerRef>(null);
  const [index, setIndex] = useState(0);
  const [uiHidden, setUiHidden] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [frame, setFrame] = useState(0);

  const count = VIDEO1_LIST.length;
  const video = VIDEO1_LIST[index];

  const select = useCallback(
    (i: number) => {
      setIndex((i + count) % count);
      setFrame(0);
      setPlaying(true);
    },
    [count],
  );

  const restart = useCallback(() => {
    playerRef.current?.seekTo(0);
    playerRef.current?.play();
  }, []);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    const onFrame = (e: { detail: { frame: number } }) => setFrame(e.detail.frame);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    player.addEventListener("frameupdate", onFrame);
    player.addEventListener("play", onPlay);
    player.addEventListener("pause", onPause);
    return () => {
      player.removeEventListener("frameupdate", onFrame);
      player.removeEventListener("play", onPlay);
      player.removeEventListener("pause", onPause);
    };
  }, [index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const n = Number(e.key);
      if (e.key === "ArrowRight") select(index + 1);
      else if (e.key === "ArrowLeft") select(index - 1);
      else if (e.key === " ") {
        e.preventDefault();
        playerRef.current?.toggle();
      } else if (e.key.toLowerCase() === "r") restart();
      else if (e.key.toLowerCase() === "h") setUiHidden((v) => !v);
      else if (Number.isInteger(n) && n >= 1 && n <= count) select(n - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [count, index, restart, select]);

  const seek = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    playerRef.current?.seekTo(Math.round(ratio * (video.durationInFrames - 1)));
  };

  return (
    <div className={`${p22Mackinac.variable} ${dmSans.variable} ${dmSans.className} fixed inset-0 overflow-hidden`} style={{ background: BEIGE }}>
      <Player
        key={video.id}
        ref={playerRef}
        component={video.component}
        durationInFrames={video.durationInFrames}
        compositionWidth={VIDEO1_WIDTH}
        compositionHeight={VIDEO1_HEIGHT}
        fps={VIDEO1_FPS}
        style={{ width: "100%", height: "100%" }}
        initiallyMuted
        numberOfSharedAudioTags={0}
        autoPlay
        loop
        controls={false}
        clickToPlay={false}
        spaceKeyToPlayOrPause={false}
        acknowledgeRemotionLicense
      />

      {uiHidden ? (
        <button
          type="button"
          onClick={() => setUiHidden(false)}
          className="fixed left-6 top-6 z-10 h-8 rounded-[10px] px-3 text-[13px] font-medium opacity-0 transition-opacity hover:opacity-100 focus-visible:opacity-100"
          style={{ background: PAPER, color: INK, border: `1px solid ${HAIRLINE}` }}
        >
          Show UI
        </button>
      ) : (
        <div className="fixed left-6 top-6 z-10 flex flex-col gap-1 rounded-[14px] p-1.5" style={{ background: PAPER, border: `1px solid ${HAIRLINE}`, color: INK }}>
          <div className="flex items-center gap-1">
            <PanelButton label="Previous video" onClick={() => select(index - 1)}>
              ‹
            </PanelButton>
            {VIDEO1_LIST.map((item, i) => {
              const active = i === index;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => select(i)}
                  aria-current={active ? "true" : undefined}
                  className="flex h-8 items-center gap-1.5 rounded-[10px] px-2.5 text-[13px] font-medium"
                  style={{ background: active ? INK : "transparent", color: active ? PAPER : INK }}
                >
                  <span className="tabular-nums">{i + 1}</span>
                  <span style={{ opacity: active ? 0.75 : 0.55 }}>{item.title}</span>
                </button>
              );
            })}
            <PanelButton label="Next video" onClick={() => select(index + 1)}>
              ›
            </PanelButton>
            <span className="mx-1 h-5 w-px" style={{ background: HAIRLINE }} />
            <PanelButton label={playing ? "Pause" : "Play"} onClick={() => playerRef.current?.toggle()}>
              {playing ? (
                <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
                  <rect x="2" y="1.5" width="2.6" height="9" rx="0.8" fill={INK} />
                  <rect x="7.4" y="1.5" width="2.6" height="9" rx="0.8" fill={INK} />
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
                  <path d="M3 1.6v8.8l7.2-4.4z" fill={INK} />
                </svg>
              )}
            </PanelButton>
            <PanelButton label="Restart" onClick={restart}>
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                <path d="M2.5 7a4.5 4.5 0 1 0 1.4-3.3M2.5 1.8v2.4h2.4" fill="none" stroke={INK} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </PanelButton>
            <span className="mx-1 h-5 w-px" style={{ background: HAIRLINE }} />
            <button type="button" onClick={() => setUiHidden(true)} className="h-8 rounded-[10px] px-3 text-[13px] font-medium">
              Hide UI
            </button>
          </div>
          <div className="flex items-center gap-2.5 px-2 pb-0.5">
            <div onClick={seek} className="flex h-3 flex-1 cursor-pointer items-center" role="presentation">
              <div className="h-[3px] w-full overflow-hidden rounded-full" style={{ background: HAIRLINE }}>
                <div className="h-full rounded-full" style={{ width: `${(frame / Math.max(1, video.durationInFrames - 1)) * 100}%`, background: INK }} />
              </div>
            </div>
            <span className="text-[11px] font-medium tabular-nums" style={{ opacity: 0.55 }}>
              {timecode(frame)} / {timecode(video.durationInFrames)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function PanelButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} className="flex h-8 w-8 items-center justify-center rounded-[10px] text-[15px]">
      {children}
    </button>
  );
}
