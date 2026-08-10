"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { AboutStyleArticleFloatingBlogPanel } from "@/components/blog/AboutStyleArticleFloatingBlogPanel";
import {
  BlogNavIcon,
  PauseIcon,
  PlayIcon,
  SkipBack10Icon,
  SkipForward10Icon,
  TocIcon,
} from "@/components/blog/AboutStyleArticleFloatingIcons";
import { AboutStyleArticleTocPanel } from "@/components/blog/AboutStyleArticleTocPanel";
import {
  ABOUT_STYLE_ARTICLE_AUDIO_FAKE_DURATION_S,
  useAboutStyleArticleAudioPlayerOrDisabled,
} from "@/lib/blog/about-style-article-audio-player-context";
import type { AboutStyleArticleTocItem } from "@/lib/blog/about-style-article-toc";

const PANEL_REVEAL_MS = 560;
const PANEL_CIRCLE_HOLD_MS = 200;
const PANEL_HIDE_MS = 0;
const PANEL_COLLAPSE_MS = 440;
const SCROLL_REVEAL_PX = 280;
const AUDIO_JOIN_MS = 560;
const AUDIO_JOIN_SETTLE_MS = 72;
const AUDIO_CONTROLS_IN_DELAY_MS = 48;
const AUDIO_LEAVE_MS = 480;
const AUDIO_LEAVE_SPLIT_MS = 130;
const AUDIO_LEAVE_SETTLE_MS = 64;
const WIDGET_DISMISS_ARM_MS = 480;

type AboutStyleArticleFloatingChromeProps = {
  tocItems: readonly AboutStyleArticleTocItem[];
  currentSlug?: string;
  BlogPanel?: typeof AboutStyleArticleFloatingBlogPanel;
  /** Hide the left blog-posts cap and panel (e.g. /premed iPhone). */
  hideBlogNav?: boolean;
  /** Keep listen row visible but disable playback (e.g. /premed iPhone). */
  hideArticleAudio?: boolean;
};

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const whole = Math.floor(seconds);
  const mins = Math.floor(whole / 60);
  const secs = whole % 60;
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

const PLAYING_CAP_RING_VIEW = 100;
const PLAYING_CAP_RING_STROKE = 3.4;
const PLAYING_CAP_RING_R = PLAYING_CAP_RING_VIEW / 2 - PLAYING_CAP_RING_STROKE / 2;

function PlayingCapRing({ progress }: { progress: number }) {
  const circumference = 2 * Math.PI * PLAYING_CAP_RING_R;
  const clamped = Math.min(1, Math.max(0, progress));
  const dashOffset = circumference * (1 - clamped);

  return (
    <svg
      className="about-style-article-floating-chrome__cap-ring"
      viewBox={`0 0 ${PLAYING_CAP_RING_VIEW} ${PLAYING_CAP_RING_VIEW}`}
      aria-hidden
    >
      <circle
        className="about-style-article-floating-chrome__cap-ring-track"
        cx="50"
        cy="50"
        r={PLAYING_CAP_RING_R}
        strokeWidth={PLAYING_CAP_RING_STROKE}
      />
      <circle
        className="about-style-article-floating-chrome__cap-ring-progress"
        cx="50"
        cy="50"
        r={PLAYING_CAP_RING_R}
        strokeWidth={PLAYING_CAP_RING_STROKE}
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        transform="rotate(-90 50 50)"
      />
    </svg>
  );
}

/** Unified bottom chrome — blog + TOC circles merge into an audio pill on voice play. */
export function AboutStyleArticleFloatingChrome({
  tocItems,
  currentSlug,
  BlogPanel = AboutStyleArticleFloatingBlogPanel,
  hideBlogNav = false,
  hideArticleAudio = false,
}: AboutStyleArticleFloatingChromeProps) {
  const {
    audioSrc,
    audioRef,
    isPlayerOpen,
    isPlaying,
    currentTime,
    duration,
    progress,
    closePlayer,
    hidePlayer,
    openPlayer,
    togglePlay,
    seekBy,
    seekToProgress,
    setCurrentTime,
    setDuration,
    setIsPlaying,
  } = useAboutStyleArticleAudioPlayerOrDisabled(hideArticleAudio);

  const [mounted, setMounted] = useState(false);
  const [scrollRevealed, setScrollRevealed] = useState(false);
  const [blogOpen, setBlogOpen] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const [blogPanelRevealed, setBlogPanelRevealed] = useState(false);
  const [tocPanelRevealed, setTocPanelRevealed] = useState(false);
  const [blogCollapsing, setBlogCollapsing] = useState(false);
  const [tocCollapsing, setTocCollapsing] = useState(false);
  const [audioJoined, setAudioJoined] = useState(false);
  const [audioClosing, setAudioClosing] = useState(false);
  const audioPlayingMinimized = isPlaying && !isPlayerOpen && !audioClosing;
  const audioCapActive = isPlayerOpen || audioClosing;
  const anyWidgetOpen = blogOpen || tocOpen || audioCapActive || audioPlayingMinimized;
  const chromeVisible = scrollRevealed || anyWidgetOpen;

  const rootRef = useRef<HTMLDivElement>(null);
  const blogCapRef = useRef<HTMLDivElement>(null);
  const tocCapRef = useRef<HTMLDivElement>(null);
  const blogRevealTimerRef = useRef<number | null>(null);
  const blogHideTimerRef = useRef<number | null>(null);
  const blogCollapseTimerRef = useRef<number | null>(null);
  const tocRevealTimerRef = useRef<number | null>(null);
  const tocHideTimerRef = useRef<number | null>(null);
  const tocCollapseTimerRef = useRef<number | null>(null);
  const audioJoinTimerRef = useRef<number | null>(null);
  const audioUnjoinTimerRef = useRef<number | null>(null);
  const fakeTickRef = useRef<number | null>(null);
  const ignoreBackdropDismissUntilRef = useRef(0);
  const wasPlayerOpenRef = useRef(false);
  const audioOpenDelayTimerRef = useRef<number | null>(null);
  const audioDismissPointerRef = useRef<{ id: number; x: number; y: number } | null>(null);
  const progressTrackRef = useRef<HTMLDivElement>(null);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const audioCloseWhilePlayingRef = useRef(false);

  const clearBlogCollapseStyles = useCallback(() => {
    const cap = blogCapRef.current;
    if (!cap) return;
    cap.style.width = "";
    cap.style.height = "";
  }, []);

  const clearTocCollapseStyles = useCallback(() => {
    const cap = tocCapRef.current;
    if (!cap) return;
    cap.style.width = "";
    cap.style.height = "";
  }, []);

  const beginBlogCollapse = useCallback(() => {
    const cap = blogCapRef.current;
    if (cap) {
      const { width, height } = cap.getBoundingClientRect();
      cap.style.width = `${width}px`;
      cap.style.height = `${height}px`;
      // See beginTocCollapse — forces the pinned pixel height to commit as its own
      // frame before the .is-closing class swap, so height can animate instead of
      // snapping straight from the un-pinned `auto` value.
      void cap.offsetHeight;
    }
    setBlogCollapsing(true);
  }, []);

  const beginTocCollapse = useCallback(() => {
    const cap = tocCapRef.current;
    if (cap) {
      const { width, height } = cap.getBoundingClientRect();
      cap.style.width = `${width}px`;
      cap.style.height = `${height}px`;
      // Force a synchronous style/layout flush so the browser commits this pinned
      // pixel size as the "before" value. Without it, the pin and the .is-closing
      // class swap (triggered by the setState right below) can land in the same
      // paint — the engine then transitions straight from the un-pinned `auto`
      // height, which can't be interpolated, so it snaps instead of animating.
      void cap.offsetHeight;
    }
    setTocCollapsing(true);
  }, []);

  const beginTocCollapseForAudio = useCallback(() => {
    const cap = tocCapRef.current;
    if (cap) {
      const { width, height } = cap.getBoundingClientRect();
      cap.style.width = `${width}px`;
      cap.style.height = `${height}px`;
      void cap.offsetHeight;
    }
    setTocCollapsing(true);
  }, []);

  const beginBlogCollapseForAudio = useCallback(() => {
    const cap = blogCapRef.current;
    if (cap) {
      const { width, height } = cap.getBoundingClientRect();
      cap.style.width = `${width}px`;
      cap.style.height = `${height}px`;
      void cap.offsetHeight;
    }
    setBlogCollapsing(true);
  }, []);

  const markWidgetOpened = useCallback(() => {
    ignoreBackdropDismissUntilRef.current = performance.now() + WIDGET_DISMISS_ARM_MS;
  }, []);

  const closeBlog = useCallback(() => {
    if (!blogOpen && !blogCollapsing) return;
    if (blogRevealTimerRef.current !== null) {
      window.clearTimeout(blogRevealTimerRef.current);
      blogRevealTimerRef.current = null;
    }
    if (blogHideTimerRef.current !== null) {
      window.clearTimeout(blogHideTimerRef.current);
      blogHideTimerRef.current = null;
    }
    if (blogCollapseTimerRef.current !== null) {
      window.clearTimeout(blogCollapseTimerRef.current);
      blogCollapseTimerRef.current = null;
    }
    // Reveal-off and collapse must land in the same render: the panel's height is
    // `auto` while revealed, and browsers can't smoothly interpolate a height change
    // that starts from `auto` — it just snaps. Measuring + pinning the box's current
    // pixel size (inside beginBlogCollapse) before that render commits keeps the
    // start value a definite px, so the whole shrink (width *and* height) animates
    // together instead of the height instantly collapsing out from under it.
    setBlogPanelRevealed(false);
    beginBlogCollapse();
    blogCollapseTimerRef.current = window.setTimeout(() => {
      setBlogOpen(false);
      setBlogCollapsing(false);
      clearBlogCollapseStyles();
      blogCollapseTimerRef.current = null;
    }, PANEL_COLLAPSE_MS);
  }, [beginBlogCollapse, blogCollapsing, blogOpen, clearBlogCollapseStyles]);

  const closeToc = useCallback(() => {
    if (!tocOpen && !tocCollapsing) return;
    if (tocRevealTimerRef.current !== null) {
      window.clearTimeout(tocRevealTimerRef.current);
      tocRevealTimerRef.current = null;
    }
    if (tocHideTimerRef.current !== null) {
      window.clearTimeout(tocHideTimerRef.current);
      tocHideTimerRef.current = null;
    }
    if (tocCollapseTimerRef.current !== null) {
      window.clearTimeout(tocCollapseTimerRef.current);
      tocCollapseTimerRef.current = null;
    }
    // See closeBlog — same "pin before the auto-height render commits" fix.
    setTocPanelRevealed(false);
    beginTocCollapse();
    tocCollapseTimerRef.current = window.setTimeout(() => {
      setTocOpen(false);
      setTocCollapsing(false);
      clearTocCollapseStyles();
      tocCollapseTimerRef.current = null;
    }, PANEL_COLLAPSE_MS);
  }, [beginTocCollapse, clearTocCollapseStyles, tocCollapsing, tocOpen]);

  const fastCloseTocForAudio = useCallback(() => {
    if (!tocOpen && !tocCollapsing) return;
    if (tocRevealTimerRef.current !== null) {
      window.clearTimeout(tocRevealTimerRef.current);
      tocRevealTimerRef.current = null;
    }
    if (tocHideTimerRef.current !== null) {
      window.clearTimeout(tocHideTimerRef.current);
      tocHideTimerRef.current = null;
    }
    if (tocCollapseTimerRef.current !== null) {
      window.clearTimeout(tocCollapseTimerRef.current);
      tocCollapseTimerRef.current = null;
    }
    setTocPanelRevealed(false);
    beginTocCollapseForAudio();
    tocCollapseTimerRef.current = window.setTimeout(() => {
      setTocOpen(false);
      setTocCollapsing(false);
      clearTocCollapseStyles();
      tocCollapseTimerRef.current = null;
    }, PANEL_COLLAPSE_MS);
  }, [beginTocCollapseForAudio, clearTocCollapseStyles, tocCollapsing, tocOpen]);

  const fastCloseBlogForAudio = useCallback(() => {
    if (!blogOpen && !blogCollapsing) return;
    if (blogRevealTimerRef.current !== null) {
      window.clearTimeout(blogRevealTimerRef.current);
      blogRevealTimerRef.current = null;
    }
    if (blogHideTimerRef.current !== null) {
      window.clearTimeout(blogHideTimerRef.current);
      blogHideTimerRef.current = null;
    }
    if (blogCollapseTimerRef.current !== null) {
      window.clearTimeout(blogCollapseTimerRef.current);
      blogCollapseTimerRef.current = null;
    }
    setBlogPanelRevealed(false);
    beginBlogCollapseForAudio();
    blogCollapseTimerRef.current = window.setTimeout(() => {
      setBlogOpen(false);
      setBlogCollapsing(false);
      clearBlogCollapseStyles();
      blogCollapseTimerRef.current = null;
    }, PANEL_COLLAPSE_MS);
  }, [beginBlogCollapseForAudio, blogCollapsing, blogOpen, clearBlogCollapseStyles]);

  const openAudioFromFloatingToc = useCallback(() => {
    markWidgetOpened();
    if (audioOpenDelayTimerRef.current !== null) {
      window.clearTimeout(audioOpenDelayTimerRef.current);
      audioOpenDelayTimerRef.current = null;
    }

    if (blogOpen && !blogCollapsing) fastCloseBlogForAudio();
    if (tocOpen && !tocCollapsing) fastCloseTocForAudio();
    openPlayer();
  }, [blogCollapsing, blogOpen, fastCloseBlogForAudio, fastCloseTocForAudio, markWidgetOpened, openPlayer, tocCollapsing, tocOpen]);

  const beginAudioClose = useCallback(() => {
    if (!isPlayerOpen || audioClosing) return;
    if (audioOpenDelayTimerRef.current !== null) {
      window.clearTimeout(audioOpenDelayTimerRef.current);
      audioOpenDelayTimerRef.current = null;
    }
    audioCloseWhilePlayingRef.current = isPlaying;
    setAudioClosing(true);
    if (audioJoinTimerRef.current !== null) {
      window.clearTimeout(audioJoinTimerRef.current);
      audioJoinTimerRef.current = null;
    }
    if (audioUnjoinTimerRef.current !== null) {
      window.clearTimeout(audioUnjoinTimerRef.current);
      audioUnjoinTimerRef.current = null;
    }
    audioUnjoinTimerRef.current = window.setTimeout(() => {
      setAudioJoined(false);
      audioUnjoinTimerRef.current = null;
    }, AUDIO_LEAVE_SPLIT_MS);
    audioJoinTimerRef.current = window.setTimeout(() => {
      if (audioCloseWhilePlayingRef.current) {
        hidePlayer();
      } else {
        closePlayer();
      }
      audioCloseWhilePlayingRef.current = false;
      audioJoinTimerRef.current = window.setTimeout(() => {
        setAudioClosing(false);
        audioJoinTimerRef.current = null;
      }, AUDIO_LEAVE_SETTLE_MS);
    }, AUDIO_LEAVE_MS);
  }, [audioClosing, closePlayer, hidePlayer, isPlayerOpen, isPlaying]);

  const openPlayingPill = useCallback(() => {
    if (audioClosing) return;
    markWidgetOpened();
    openPlayer();
  }, [audioClosing, markWidgetOpened, openPlayer]);

  const openBlog = useCallback(() => {
    if (hideBlogNav) return;
    markWidgetOpened();
    const handoffFromAudio = isPlayerOpen && !audioClosing;
    if (handoffFromAudio) beginAudioClose();
    closeToc();
    if (blogRevealTimerRef.current !== null) window.clearTimeout(blogRevealTimerRef.current);
    if (blogHideTimerRef.current !== null) {
      window.clearTimeout(blogHideTimerRef.current);
      blogHideTimerRef.current = null;
    }
    if (blogCollapseTimerRef.current !== null) {
      window.clearTimeout(blogCollapseTimerRef.current);
      blogCollapseTimerRef.current = null;
    }

    const beginBlogPanelExpand = () => {
      setBlogCollapsing(false);
      clearBlogCollapseStyles();
      setBlogOpen(true);
      setBlogPanelRevealed(false);
      blogRevealTimerRef.current = window.setTimeout(() => {
        setBlogPanelRevealed(true);
        blogRevealTimerRef.current = null;
      }, handoffFromAudio ? PANEL_CIRCLE_HOLD_MS : PANEL_REVEAL_MS);
    };

    if (handoffFromAudio) {
      blogRevealTimerRef.current = window.setTimeout(() => {
        beginBlogPanelExpand();
      }, AUDIO_LEAVE_SPLIT_MS);
    } else {
      beginBlogPanelExpand();
    }
  }, [audioClosing, beginAudioClose, clearBlogCollapseStyles, closeToc, hideBlogNav, isPlayerOpen, markWidgetOpened]);

  const openToc = useCallback(() => {
    markWidgetOpened();
    const handoffFromAudio = isPlayerOpen && !audioClosing;
    if (handoffFromAudio) beginAudioClose();
    closeBlog();
    if (tocRevealTimerRef.current !== null) window.clearTimeout(tocRevealTimerRef.current);
    if (tocHideTimerRef.current !== null) {
      window.clearTimeout(tocHideTimerRef.current);
      tocHideTimerRef.current = null;
    }
    if (tocCollapseTimerRef.current !== null) {
      window.clearTimeout(tocCollapseTimerRef.current);
      tocCollapseTimerRef.current = null;
    }

    const beginTocPanelExpand = () => {
      setTocCollapsing(false);
      clearTocCollapseStyles();
      setTocOpen(true);
      setTocPanelRevealed(false);
      tocRevealTimerRef.current = window.setTimeout(() => {
        setTocPanelRevealed(true);
        tocRevealTimerRef.current = null;
      }, handoffFromAudio ? PANEL_CIRCLE_HOLD_MS : PANEL_REVEAL_MS);
    };

    if (handoffFromAudio) {
      tocRevealTimerRef.current = window.setTimeout(() => {
        beginTocPanelExpand();
      }, AUDIO_LEAVE_SPLIT_MS);
    } else {
      beginTocPanelExpand();
    }
  }, [audioClosing, beginAudioClose, clearTocCollapseStyles, closeBlog, isPlayerOpen, markWidgetOpened]);

  const toggleBlog = useCallback(() => {
    if (blogOpen) closeBlog();
    else openBlog();
  }, [blogOpen, closeBlog, openBlog]);

  const toggleToc = useCallback(() => {
    if (tocOpen) closeToc();
    else openToc();
  }, [closeToc, openToc, tocOpen]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let raf = 0;

    const sync = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const revealed = window.scrollY > SCROLL_REVEAL_PX;
        setScrollRevealed(revealed);
        const widgetsOpen = blogOpen || tocOpen || audioCapActive || (isPlaying && !isPlayerOpen && !audioClosing);
        if (!revealed && !widgetsOpen) {
          setBlogPanelRevealed(false);
          setTocPanelRevealed(false);
          setBlogOpen(false);
          setTocOpen(false);
          setBlogCollapsing(false);
          setTocCollapsing(false);
          setAudioJoined(false);
          setAudioClosing(false);
          closePlayer();
          clearBlogCollapseStyles();
          clearTocCollapseStyles();
        }
      });
    };

    sync();
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    window.addEventListener("orientationchange", sync);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
      window.removeEventListener("orientationchange", sync);
    };
  }, [audioCapActive, blogOpen, clearBlogCollapseStyles, clearTocCollapseStyles, closePlayer, isPlaying, isPlayerOpen, audioClosing, tocOpen]);

  useEffect(() => {
    if (isPlayerOpen && !wasPlayerOpenRef.current) {
      markWidgetOpened();
    }
    wasPlayerOpenRef.current = isPlayerOpen;
  }, [isPlayerOpen, markWidgetOpened]);

  useEffect(() => {
    if (!isPlayerOpen) {
      if (!audioClosing) {
        setAudioJoined(false);
        setAudioClosing(false);
      }
      return;
    }

    if (audioClosing) return;

    if (blogOpen && !blogCollapsing) closeBlog();
    if (tocOpen && !tocCollapsing) closeToc();

    setAudioJoined(false);
    if (audioJoinTimerRef.current !== null) window.clearTimeout(audioJoinTimerRef.current);
    audioJoinTimerRef.current = window.setTimeout(() => {
      setAudioJoined(true);
      audioJoinTimerRef.current = null;
    }, AUDIO_JOIN_SETTLE_MS);
  }, [audioClosing, blogOpen, closeBlog, closeToc, isPlayerOpen, tocOpen]);

  useEffect(() => {
    if (!isPlaying || audioSrc) return;

    fakeTickRef.current = window.setInterval(() => {
      setCurrentTime((time) => {
        const cap = ABOUT_STYLE_ARTICLE_AUDIO_FAKE_DURATION_S;
        if (time >= cap) {
          setIsPlaying(false);
          return cap;
        }
        return time + 0.25;
      });
    }, 250);

    return () => {
      if (fakeTickRef.current !== null) {
        window.clearInterval(fakeTickRef.current);
        fakeTickRef.current = null;
      }
    };
  }, [audioSrc, isPlaying, setCurrentTime, setIsPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioSrc) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoaded = () => setDuration(audio.duration || 0);
    const onEnded = () => setIsPlaying(false);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("durationchange", onLoaded);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("durationchange", onLoaded);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, [audioRef, audioSrc, setCurrentTime, setDuration, setIsPlaying]);

  useEffect(() => {
    if (!isPlayerOpen || blogOpen || tocOpen || blogCollapsing || tocCollapsing) return;

    const tapSlopPx = 12;

    const onPointerDown = (event: PointerEvent) => {
      if (performance.now() < ignoreBackdropDismissUntilRef.current) return;
      const target = event.target;
      if (!(target instanceof Node) || rootRef.current?.contains(target)) return;
      audioDismissPointerRef.current = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
      };
    };

    const onPointerUp = (event: PointerEvent) => {
      const start = audioDismissPointerRef.current;
      if (!start || event.pointerId !== start.id) return;
      audioDismissPointerRef.current = null;
      if (performance.now() < ignoreBackdropDismissUntilRef.current) return;
      const target = event.target;
      if (!(target instanceof Node) || rootRef.current?.contains(target)) return;
      if (Math.abs(event.clientX - start.x) > tapSlopPx || Math.abs(event.clientY - start.y) > tapSlopPx) return;
      beginAudioClose();
    };

    const onPointerCancel = (event: PointerEvent) => {
      const start = audioDismissPointerRef.current;
      if (start && event.pointerId === start.id) {
        audioDismissPointerRef.current = null;
      }
    };

    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("pointerup", onPointerUp, true);
    document.addEventListener("pointercancel", onPointerCancel, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("pointerup", onPointerUp, true);
      document.removeEventListener("pointercancel", onPointerCancel, true);
      audioDismissPointerRef.current = null;
    };
  }, [beginAudioClose, blogCollapsing, blogOpen, isPlayerOpen, tocCollapsing, tocOpen]);

  useEffect(() => {
    if (!anyWidgetOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (blogOpen) closeBlog();
        if (tocOpen) closeToc();
        if (isPlayerOpen) beginAudioClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [anyWidgetOpen, beginAudioClose, blogOpen, closeBlog, closeToc, isPlayerOpen, tocOpen]);

  const dismissOpenWidgets = useCallback(() => {
    if (performance.now() < ignoreBackdropDismissUntilRef.current) return;
    if (blogOpen) closeBlog();
    if (tocOpen) closeToc();
    if (isPlayerOpen) beginAudioClose();
  }, [beginAudioClose, blogOpen, closeBlog, closeToc, isPlayerOpen, tocOpen]);

  useEffect(() => {
    return () => {
      [blogRevealTimerRef, blogHideTimerRef, blogCollapseTimerRef, tocRevealTimerRef, tocHideTimerRef, tocCollapseTimerRef, audioJoinTimerRef, audioUnjoinTimerRef].forEach(
        (ref) => {
          if (ref.current !== null) window.clearTimeout(ref.current);
        },
      );
      if (fakeTickRef.current !== null) window.clearInterval(fakeTickRef.current);
      if (audioOpenDelayTimerRef.current !== null) window.clearTimeout(audioOpenDelayTimerRef.current);
    };
  }, []);

  const panelBackdropActive = blogOpen || tocOpen || blogCollapsing || tocCollapsing;

  const seekFromClientX = useCallback(
    (clientX: number) => {
      const track = progressTrackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      if (rect.width <= 0) return;
      seekToProgress((clientX - rect.left) / rect.width);
    },
    [seekToProgress],
  );

  const onProgressTrackPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      event.preventDefault();
      event.stopPropagation();
      setIsScrubbing(true);
      event.currentTarget.setPointerCapture(event.pointerId);
      seekFromClientX(event.clientX);
    },
    [seekFromClientX],
  );

  const onProgressTrackPointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
      event.preventDefault();
      event.stopPropagation();
      seekFromClientX(event.clientX);
    },
    [seekFromClientX],
  );

  const onProgressTrackPointerEnd = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    setIsScrubbing(false);
  }, []);

  const progressPct = progress * 100;

  const audioJoining = isPlayerOpen && !audioJoined && !audioClosing;
  const leftCapCrossfade = isPlaying && audioClosing && isPlayerOpen && audioJoined;
  const blogCapExpanded = !hideBlogNav && blogOpen && (!audioCapActive || audioClosing);
  const tocCapExpanded = tocOpen && (!audioCapActive || audioClosing);
  const showLeftCapTriggers = blogCollapsing || !blogPanelRevealed || blogCapExpanded;
  const audioPillAnchored = isPlayerOpen && audioJoined && !audioClosing;
  const showLeftPlayingCap =
    isPlaying &&
    showLeftCapTriggers &&
    (leftCapCrossfade || (!audioPillAnchored && (!isPlayerOpen || audioClosing || audioJoining)));
  const showLeftBlogCap = !hideBlogNav && showLeftCapTriggers && !showLeftPlayingCap && !leftCapCrossfade;
  const showLeftCap = !hideBlogNav || showLeftPlayingCap || leftCapCrossfade;
  const showTocCapTrigger = tocCollapsing || !tocPanelRevealed || tocCapExpanded;
  const panelHandoffBlog = blogOpen && audioClosing;
  const panelHandoffToc = tocOpen && audioClosing;
  const panelCrossfade = (blogOpen && tocCollapsing) || (tocOpen && blogCollapsing);

  if (!mounted) {
    return null;
  }

  const showTocCap = tocItems.length > 0;

  const shellClass = [
    "about-style-article-floating-chrome__shell",
    "proto-nav-frost-shell",
    audioCapActive ? "is-audio-shell" : "",
    hideBlogNav ? "" : blogOpen && !audioCapActive ? "is-blog-open" : "",
    tocOpen && !audioCapActive ? "is-toc-open" : "",
    blogCollapsing ? "is-blog-closing" : "",
    tocCollapsing ? "is-toc-closing" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const rootClass = [
    "about-style-article-floating-chrome",
    chromeVisible ? "is-visible" : "",
    audioCapActive ? "is-audio" : "",
    audioJoining ? "is-audio-joining" : "",
    audioJoined ? "is-audio-joined" : "",
    audioClosing ? "is-audio-closing" : "",
    audioPlayingMinimized ? "is-audio-minimized" : "",
    audioClosing && isPlaying ? "is-audio-closing-while-playing" : "",
    panelHandoffBlog ? "is-handoff-blog" : "",
    panelHandoffToc ? "is-handoff-toc" : "",
    panelCrossfade ? "is-panel-crossfade" : "",
    hideBlogNav ? "" : blogOpen && !audioCapActive ? "is-blog" : "",
    tocOpen && !audioCapActive ? "is-toc" : "",
    blogCollapsing ? "is-blog-closing" : "",
    tocCollapsing ? "is-toc-closing" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return createPortal(
    <>
      {panelBackdropActive ? (
        <button
          type="button"
          className="about-style-article-floating-chrome__backdrop"
          aria-label="Close menu"
          tabIndex={-1}
          onPointerDown={(event) => {
            if (event.pointerType === "mouse" && event.button !== 0) return;
            dismissOpenWidgets();
          }}
        />
      ) : null}

      <div ref={rootRef} className={rootClass} aria-live="polite" aria-hidden={!chromeVisible}>
      <div
        className={shellClass}
        style={{
          ["--proto-nav-frost-progress" as string]: 1,
          ["--about-audio-join-ms" as string]: `${AUDIO_JOIN_MS}ms`,
          ["--about-audio-leave-ms" as string]: `${AUDIO_LEAVE_MS}ms`,
          ["--about-floating-chrome-open-duration" as string]: `${PANEL_REVEAL_MS}ms`,
          ["--about-floating-chrome-close-duration" as string]: `${PANEL_COLLAPSE_MS}ms`,
          ["--about-audio-join-settle-ms" as string]: `${AUDIO_JOIN_SETTLE_MS}ms`,
          ["--about-audio-controls-in-delay" as string]: `${AUDIO_CONTROLS_IN_DELAY_MS}ms`,
          ["--about-audio-leave-split-ms" as string]: `${AUDIO_LEAVE_SPLIT_MS}ms`,
          ["--about-floating-chrome-handoff-duration" as string]: `${AUDIO_LEAVE_SPLIT_MS + PANEL_CIRCLE_HOLD_MS}ms`,
        }}
      >
        {showLeftCap ? (
        <div
          ref={blogCapRef}
          className={`about-style-article-floating-chrome__cap about-style-article-floating-chrome__cap--left${blogCapExpanded ? " is-open" : ""}${blogPanelRevealed ? " is-revealed" : ""}${blogCollapsing ? " is-closing" : ""}${panelHandoffBlog ? " is-handoff" : ""}${panelCrossfade && blogCollapsing ? " is-sliding-out" : ""}${panelCrossfade && blogOpen && !blogCollapsing ? " is-sliding-in" : ""}`}
        >
          {blogCapExpanded ? (
            <div className="about-style-article-floating-chrome__panel" aria-hidden={!blogPanelRevealed}>
              <BlogPanel currentSlug={currentSlug} onItemClick={closeBlog} />
            </div>
          ) : null}

          {showLeftCapTriggers ? (
            <div
              className={`about-style-article-floating-chrome__cap-trigger-stack${leftCapCrossfade ? " is-crossfading" : ""}`}
            >
              {showLeftPlayingCap ? (
                <button
                  type="button"
                  className={`about-style-article-floating-chrome__cap-trigger about-style-article-floating-chrome__cap-trigger--playing${isPlayerOpen && !audioClosing && !audioJoining ? " is-stack-hidden" : ""}${leftCapCrossfade ? " is-emerging" : ""}`}
                  aria-label="Open audio playback"
                  aria-hidden={isPlayerOpen && !audioClosing && !audioJoining ? true : undefined}
                  tabIndex={isPlayerOpen && !audioClosing && !audioJoining ? -1 : chromeVisible ? 0 : -1}
                  onClick={(event) => {
                    event.stopPropagation();
                    openPlayingPill();
                  }}
                >
                  <PlayingCapRing progress={progress} />
                  <PauseIcon size={22} />
                </button>
              ) : null}

              {showLeftBlogCap ? (
                <button
                  type="button"
                  className={`about-style-article-floating-chrome__cap-trigger${leftCapCrossfade ? " is-stack-fading" : ""}`}
                  aria-label="Open blog posts"
                  aria-hidden={leftCapCrossfade ? true : undefined}
                  tabIndex={leftCapCrossfade ? -1 : chromeVisible ? 0 : -1}
                  onClick={(event) => {
                    event.stopPropagation();
                    if (audioCapActive) openBlog();
                    else toggleBlog();
                  }}
                >
                  <BlogNavIcon className="about-style-article-floating-chrome__icon" />
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
        ) : null}

        <div className="about-style-article-floating-chrome__bridge" aria-hidden={!audioCapActive}>
            <div className="about-style-article-floating-chrome__audio-stack">
              <div className="about-style-article-floating-chrome__audio-playback-unit">
                <div className="about-style-article-floating-chrome__audio-transport">
                  <button
                    type="button"
                    className="about-style-article-floating-chrome__transport-btn about-style-article-floating-chrome__transport-btn--skip-back"
                    aria-label="Back 10 seconds"
                    onClick={() => seekBy(-10)}
                  >
                    <SkipBack10Icon size={20} />
                  </button>
                  <button
                    type="button"
                    className="about-style-article-floating-chrome__transport-btn about-style-article-floating-chrome__transport-btn--primary"
                    aria-label={isPlaying ? "Pause" : "Play"}
                    onClick={togglePlay}
                  >
                    {isPlaying ? <PauseIcon size={48} /> : <PlayIcon size={48} />}
                  </button>
                  <button
                    type="button"
                    className="about-style-article-floating-chrome__transport-btn about-style-article-floating-chrome__transport-btn--skip-forward"
                    aria-label="Forward 10 seconds"
                    onClick={() => seekBy(10)}
                  >
                    <SkipForward10Icon size={20} />
                  </button>
                </div>

                <div
                  className={`about-style-article-floating-chrome__progress${isScrubbing ? " is-scrubbing" : ""}`}
                  role="slider"
                  aria-valuemin={0}
                  aria-valuemax={duration}
                  aria-valuenow={currentTime}
                  aria-label="Playback position"
                >
                  <div className="about-style-article-floating-chrome__progress-row">
                    <div
                      ref={progressTrackRef}
                      className="about-style-article-floating-chrome__progress-track"
                      style={{ ["--progress-pct" as string]: progressPct }}
                      onPointerDown={onProgressTrackPointerDown}
                      onPointerMove={onProgressTrackPointerMove}
                      onPointerUp={onProgressTrackPointerEnd}
                      onPointerCancel={onProgressTrackPointerEnd}
                    >
                      <div className="about-style-article-floating-chrome__progress-fill" aria-hidden />
                      <div className="about-style-article-floating-chrome__progress-thumb" aria-hidden />
                    </div>
                    <span className="about-style-article-floating-chrome__progress-duration">{formatTime(duration)}</span>
                  </div>
                  <div className="about-style-article-floating-chrome__progress-times">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              </div>
            </div>
        </div>

        {showTocCap ? (
          <div
            ref={tocCapRef}
            className={`about-style-article-floating-chrome__cap about-style-article-floating-chrome__cap--right${tocCapExpanded ? " is-open" : ""}${tocPanelRevealed ? " is-revealed" : ""}${tocCollapsing ? " is-closing" : ""}${panelHandoffToc ? " is-handoff" : ""}${panelCrossfade && tocCollapsing ? " is-sliding-out" : ""}${panelCrossfade && tocOpen && !tocCollapsing ? " is-sliding-in" : ""}`}
          >
            {tocCapExpanded ? (
              <div className="about-style-article-floating-chrome__panel" aria-hidden={!tocPanelRevealed}>
                <AboutStyleArticleTocPanel
                  items={tocItems}
                  variant="nav"
                  onItemClick={closeToc}
                  onListenClick={hideArticleAudio ? undefined : openAudioFromFloatingToc}
                  hideArticleAudio={hideArticleAudio}
                />
              </div>
            ) : null}

            {showTocCapTrigger ? (
              <button
                type="button"
                className="about-style-article-floating-chrome__cap-trigger"
                aria-label="Open table of contents"
                onClick={(event) => {
                  event.stopPropagation();
                  if (audioCapActive) openToc();
                  else toggleToc();
                }}
                tabIndex={chromeVisible ? 0 : -1}
              >
                <TocIcon className="about-style-article-floating-chrome__icon" />
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      {audioSrc ? (
        <audio ref={audioRef as React.Ref<HTMLAudioElement>} src={audioSrc} preload="metadata" className="hidden" />
      ) : null}
    </div>
    </>,
    document.body,
  );
}
