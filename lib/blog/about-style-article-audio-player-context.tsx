"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type RefObject,
  type SetStateAction,
} from "react";

import { ABOUT_STYLE_ARTICLE_AUDIO } from "@/lib/blog/about-style-article-toc";

/** Placeholder duration when no hosted recording exists yet. */
export const ABOUT_STYLE_ARTICLE_AUDIO_FAKE_DURATION_S = 186;

type AboutStyleArticleAudioPlayerContextValue = {
  audioSrc: string | undefined;
  audioRef: RefObject<HTMLAudioElement | null>;
  isPlayerOpen: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  progress: number;
  openPlayer: () => void;
  /** Dismiss the pill UI while playback continues. */
  hidePlayer: () => void;
  closePlayer: () => void;
  togglePlay: () => void;
  seekBy: (deltaSeconds: number) => void;
  seekToProgress: (progress01: number) => void;
  setCurrentTime: Dispatch<SetStateAction<number>>;
  setDuration: Dispatch<SetStateAction<number>>;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
};

const AboutStyleArticleAudioPlayerContext = createContext<AboutStyleArticleAudioPlayerContextValue | null>(null);

type AboutStyleArticleAudioPlayerProviderProps = {
  children: ReactNode;
  audioSrc?: string;
};

export function AboutStyleArticleAudioPlayerProvider({
  children,
  audioSrc = ABOUT_STYLE_ARTICLE_AUDIO.src,
}: AboutStyleArticleAudioPlayerProviderProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(audioSrc ? 0 : ABOUT_STYLE_ARTICLE_AUDIO_FAKE_DURATION_S);

  const progress = duration > 0 ? Math.min(1, Math.max(0, currentTime / duration)) : 0;

  const openPlayer = useCallback(() => {
    setIsPlayerOpen(true);
    const audio = audioRef.current;
    if (audioSrc && audio) {
      setCurrentTime(audio.currentTime);
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
      setIsPlaying(!audio.paused);
      if (!audio.paused) {
        void audio.play().catch(() => {
          /* autoplay policy may block redundant play() */
        });
      }
    }
  }, [audioSrc]);

  const hidePlayer = useCallback(() => {
    setIsPlayerOpen(false);
  }, []);

  const closePlayer = useCallback(() => {
    setIsPlayerOpen(false);
    setIsPlaying(false);
    setCurrentTime(0);
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (audioSrc && audio) {
      if (audio.paused) {
        void audio.play();
        setIsPlaying(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
      return;
    }
    setIsPlaying((playing) => !playing);
  }, [audioSrc]);

  const seekBy = useCallback(
    (deltaSeconds: number) => {
      const audio = audioRef.current;
      const next = Math.min(duration, Math.max(0, currentTime + deltaSeconds));
      setCurrentTime(next);
      if (audioSrc && audio) {
        audio.currentTime = next;
      }
    },
    [audioSrc, currentTime, duration],
  );

  const seekToProgress = useCallback(
    (progress01: number) => {
      const clamped = Math.min(1, Math.max(0, progress01));
      const next = clamped * duration;
      setCurrentTime(next);
      const audio = audioRef.current;
      if (audioSrc && audio) {
        audio.currentTime = next;
      }
    },
    [audioSrc, duration],
  );

  const value = useMemo(
    () => ({
      audioSrc,
      audioRef,
      isPlayerOpen,
      isPlaying,
      currentTime,
      duration,
      progress,
      openPlayer,
      hidePlayer,
      closePlayer,
      togglePlay,
      seekBy,
      seekToProgress,
      setCurrentTime,
      setDuration,
      setIsPlaying,
    }),
    [
      audioSrc,
      isPlayerOpen,
      isPlaying,
      currentTime,
      duration,
      progress,
      openPlayer,
      hidePlayer,
      closePlayer,
      togglePlay,
      seekBy,
      seekToProgress,
    ],
  );

  return (
    <AboutStyleArticleAudioPlayerContext.Provider value={value}>{children}</AboutStyleArticleAudioPlayerContext.Provider>
  );
}

export function useAboutStyleArticleAudioPlayer() {
  const context = useContext(AboutStyleArticleAudioPlayerContext);
  if (!context) {
    throw new Error("useAboutStyleArticleAudioPlayer must be used within AboutStyleArticleAudioPlayerProvider");
  }
  return context;
}

/** Optional hook for panels that may render outside the provider (desktop). */
export function useAboutStyleArticleAudioPlayerOptional() {
  return useContext(AboutStyleArticleAudioPlayerContext);
}

const disabledAudioRef = { current: null } as RefObject<HTMLAudioElement | null>;

/** Inert player — keeps floating chrome hooks stable when article audio is hidden. */
export const ABOUT_STYLE_ARTICLE_AUDIO_PLAYER_DISABLED: AboutStyleArticleAudioPlayerContextValue = {
  audioSrc: undefined,
  audioRef: disabledAudioRef,
  isPlayerOpen: false,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  progress: 0,
  openPlayer: () => {},
  hidePlayer: () => {},
  closePlayer: () => {},
  togglePlay: () => {},
  seekBy: () => {},
  seekToProgress: () => {},
  setCurrentTime: () => {},
  setDuration: () => {},
  setIsPlaying: () => {},
};

export function useAboutStyleArticleAudioPlayerOrDisabled(disabled: boolean) {
  const context = useAboutStyleArticleAudioPlayerOptional();
  if (disabled || !context) {
    return context ?? ABOUT_STYLE_ARTICLE_AUDIO_PLAYER_DISABLED;
  }
  return context;
}
