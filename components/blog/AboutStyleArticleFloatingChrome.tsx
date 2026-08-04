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
  useAboutStyleArticleAudioPlayer,
} from "@/lib/blog/about-style-article-audio-player-context";
import type { AboutStyleArticleTocItem } from "@/lib/blog/about-style-article-toc";

const PANEL_REVEAL_MS = 560;
const PANEL_HIDE_MS = 0;
const PANEL_COLLAPSE_MS = 440;
const SCROLL_REVEAL_PX = 280;
const AUDIO_JOIN_MS = 780;
const AUDIO_JOIN_SETTLE_MS = 300;
const AUDIO_LEAVE_MS = 620;
const WIDGET_DISMISS_ARM_MS = 480;

type AboutStyleArticleFloatingChromeProps = {
  tocItems: readonly AboutStyleArticleTocItem[];
  currentSlug?: string;
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
export function AboutStyleArticleFloatingChrome({ tocItems, currentSlug }: AboutStyleArticleFloatingChromeProps) {
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
  } = useAboutStyleArticleAudioPlayer();

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
  const leftCapShowsPlaying = isPlaying && !blogOpen && !blogCollapsing && (!isPlayerOpen || audioClosing);
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
  const fakeTickRef = useRef<number | null>(null);
  const ignoreBackdropDismissUntilRef = useRef(0);
  const wasPlayerOpenRef = useRef(false);
  const audioOpenDelayTimerRef = useRef<number | null>(null);
  const audioDismissPointerRef = useRef<{ id: number; x: number; y: number } | null>(null);
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
    }
    setBlogCollapsing(true);
  }, []);

  const beginTocCollapse = useCallback(() => {
    const cap = tocCapRef.current;
    if (cap) {
      const { width, height } = cap.getBoundingClientRect();
      cap.style.width = `${width}px`;
      cap.style.height = `${height}px`;
    }
    setTocCollapsing(true);
  }, []);

  const beginTocCollapseForAudio = useCallback(() => {
    const cap = tocCapRef.current;
    if (cap) {
      const { width, height } = cap.getBoundingClientRect();
      cap.style.width = `${width}px`;
      cap.style.height = `${height}px`;
    }
    setTocCollapsing(true);
  }, []);

  const beginBlogCollapseForAudio = useCallback(() => {
    const cap = blogCapRef.current;
    if (cap) {
      const { width, height } = cap.getBoundingClientRect();
      cap.style.width = `${width}px`;
      cap.style.height = `${height}px`;
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
    }
    if (blogCollapseTimerRef.current !== null) {
      window.clearTimeout(blogCollapseTimerRef.current);
      blogCollapseTimerRef.current = null;
    }
    setBlogPanelRevealed(false);
    blogHideTimerRef.current = window.setTimeout(() => {
      beginBlogCollapse();
      blogHideTimerRef.current = null;
      blogCollapseTimerRef.current = window.setTimeout(() => {
        setBlogOpen(false);
        setBlogCollapsing(false);
        clearBlogCollapseStyles();
        blogCollapseTimerRef.current = null;
      }, PANEL_COLLAPSE_MS);
    }, PANEL_HIDE_MS);
  }, [beginBlogCollapse, blogCollapsing, blogOpen, clearBlogCollapseStyles]);

  const closeToc = useCallback(() => {
    if (!tocOpen && !tocCollapsing) return;
    if (tocRevealTimerRef.current !== null) {
      window.clearTimeout(tocRevealTimerRef.current);
      tocRevealTimerRef.current = null;
    }
    if (tocHideTimerRef.current !== null) {
      window.clearTimeout(tocHideTimerRef.current);
    }
    if (tocCollapseTimerRef.current !== null) {
      window.clearTimeout(tocCollapseTimerRef.current);
      tocCollapseTimerRef.current = null;
    }
    setTocPanelRevealed(false);
    tocHideTimerRef.current = window.setTimeout(() => {
      beginTocCollapse();
      tocHideTimerRef.current = null;
      tocCollapseTimerRef.current = window.setTimeout(() => {
        setTocOpen(false);
        setTocCollapsing(false);
        clearTocCollapseStyles();
        tocCollapseTimerRef.current = null;
      }, PANEL_COLLAPSE_MS);
    }, PANEL_HIDE_MS);
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

    const needsPanelClose = (tocOpen && !tocCollapsing) || (blogOpen && !blogCollapsing);
    if (blogOpen && !blogCollapsing) fastCloseBlogForAudio();
    if (tocOpen && !tocCollapsing) fastCloseTocForAudio();

    const startPlayback = () => {
      openPlayer();
      audioOpenDelayTimerRef.current = null;
    };

    if (needsPanelClose) {
      audioOpenDelayTimerRef.current = window.setTimeout(startPlayback, PANEL_COLLAPSE_MS + 36);
      return;
    }

    startPlayback();
  }, [blogCollapsing, blogOpen, fastCloseBlogForAudio, fastCloseTocForAudio, markWidgetOpened, openPlayer, tocCollapsing, tocOpen]);

  const beginAudioClose = useCallback(() => {
    if (!isPlayerOpen || audioClosing) return;
    if (audioOpenDelayTimerRef.current !== null) {
      window.clearTimeout(audioOpenDelayTimerRef.current);
      audioOpenDelayTimerRef.current = null;
    }
    audioCloseWhilePlayingRef.current = isPlaying;
    setAudioJoined(false);
    setAudioClosing(true);
    if (audioJoinTimerRef.current !== null) {
      window.clearTimeout(audioJoinTimerRef.current);
    }
    audioJoinTimerRef.current = window.setTimeout(() => {
      if (audioCloseWhilePlayingRef.current) {
        hidePlayer();
      } else {
        closePlayer();
      }
      audioCloseWhilePlayingRef.current = false;
      window.setTimeout(() => {
        setAudioClosing(false);
        audioJoinTimerRef.current = null;
      }, 64);
    }, AUDIO_LEAVE_MS);
  }, [audioClosing, closePlayer, hidePlayer, isPlayerOpen, isPlaying]);

  const openPlayingPill = useCallback(() => {
    if (audioClosing) return;
    markWidgetOpened();
    openPlayer();
  }, [audioClosing, markWidgetOpened, openPlayer]);

  const openBlog = useCallback(() => {
    markWidgetOpened();
    beginAudioClose();
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
    setBlogCollapsing(false);
    clearBlogCollapseStyles();
    setBlogOpen(true);
    setBlogPanelRevealed(false);
    blogRevealTimerRef.current = window.setTimeout(() => {
      setBlogPanelRevealed(true);
      blogRevealTimerRef.current = null;
    }, PANEL_REVEAL_MS);
  }, [beginAudioClose, clearBlogCollapseStyles, closeToc, markWidgetOpened]);

  const openToc = useCallback(() => {
    markWidgetOpened();
    beginAudioClose();
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
    setTocCollapsing(false);
    clearTocCollapseStyles();
    setTocOpen(true);
    setTocPanelRevealed(false);
    tocRevealTimerRef.current = window.setTimeout(() => {
      setTocPanelRevealed(true);
      tocRevealTimerRef.current = null;
    }, PANEL_REVEAL_MS);
  }, [beginAudioClose, clearTocCollapseStyles, closeBlog, markWidgetOpened]);

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
      [blogRevealTimerRef, blogHideTimerRef, blogCollapseTimerRef, tocRevealTimerRef, tocHideTimerRef, tocCollapseTimerRef, audioJoinTimerRef].forEach(
        (ref) => {
          if (ref.current !== null) window.clearTimeout(ref.current);
        },
      );
      if (fakeTickRef.current !== null) window.clearInterval(fakeTickRef.current);
      if (audioOpenDelayTimerRef.current !== null) window.clearTimeout(audioOpenDelayTimerRef.current);
    };
  }, []);

  const panelBackdropActive = blogOpen || tocOpen || blogCollapsing || tocCollapsing;

  const onProgressPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    seekToProgress(ratio);
  };

  if (!mounted) {
    return null;
  }

  const showTocCap = tocItems.length > 0;

  const shellClass = [
    "about-style-article-floating-chrome__shell",
    "proto-nav-frost-shell",
    audioCapActive ? "is-audio-shell" : "",
    blogOpen && !audioCapActive ? "is-blog-open" : "",
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
    audioJoined ? "is-audio-joined" : "",
    audioClosing ? "is-audio-closing" : "",
    audioPlayingMinimized ? "is-audio-minimized" : "",
    audioClosing && isPlaying ? "is-audio-closing-while-playing" : "",
    blogOpen && !audioCapActive ? "is-blog" : "",
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
        }}
      >
        <div
          ref={blogCapRef}
          className={`about-style-article-floating-chrome__cap about-style-article-floating-chrome__cap--left${blogOpen && !audioCapActive ? " is-open" : ""}${blogPanelRevealed ? " is-revealed" : ""}${blogCollapsing ? " is-closing" : ""}`}
        >
          {blogOpen && !audioCapActive ? (
            <div className="about-style-article-floating-chrome__panel" aria-hidden={!blogPanelRevealed}>
              <AboutStyleArticleFloatingBlogPanel currentSlug={currentSlug} onItemClick={closeBlog} />
            </div>
          ) : null}

          {!blogOpen && !blogCollapsing ? (
            leftCapShowsPlaying ? (
              <button
                type="button"
                className="about-style-article-floating-chrome__cap-trigger about-style-article-floating-chrome__cap-trigger--playing"
                aria-label="Open audio playback"
                onClick={(event) => {
                  event.stopPropagation();
                  openPlayingPill();
                }}
                tabIndex={chromeVisible ? 0 : -1}
              >
                <PlayingCapRing progress={progress} />
                <PauseIcon size={22} />
              </button>
            ) : (
              <button
                type="button"
                className="about-style-article-floating-chrome__cap-trigger"
                aria-label="Open blog posts"
                onClick={(event) => {
                  event.stopPropagation();
                  if (audioCapActive) openBlog();
                  else toggleBlog();
                }}
                tabIndex={chromeVisible ? 0 : -1}
              >
                <BlogNavIcon className="about-style-article-floating-chrome__icon" />
              </button>
            )
          ) : null}
        </div>

        <div className="about-style-article-floating-chrome__bridge" aria-hidden={!audioCapActive}>
          <div className="about-style-article-floating-chrome__audio-stack">
            <div className="about-style-article-floating-chrome__audio-controls">
              <div className="about-style-article-floating-chrome__audio-transport">
                <button
                  type="button"
                  className="about-style-article-floating-chrome__transport-btn"
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
                  className="about-style-article-floating-chrome__transport-btn"
                  aria-label="Forward 10 seconds"
                  onClick={() => seekBy(10)}
                >
                  <SkipForward10Icon size={20} />
                </button>
              </div>

              <div
                className="about-style-article-floating-chrome__progress"
                role="slider"
                aria-valuemin={0}
                aria-valuemax={duration}
                aria-valuenow={currentTime}
                aria-label="Playback position"
                onPointerDown={onProgressPointer}
              >
                <div className="about-style-article-floating-chrome__progress-row">
                  <div className="about-style-article-floating-chrome__progress-track">
                    <div
                      className="about-style-article-floating-chrome__progress-fill"
                      style={{ width: `${progress * 100}%` }}
                    />
                    <div
                      className="about-style-article-floating-chrome__progress-thumb"
                      style={{ left: `${progress * 100}%` }}
                    />
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
            className={`about-style-article-floating-chrome__cap about-style-article-floating-chrome__cap--right${tocOpen && !audioCapActive ? " is-open" : ""}${tocPanelRevealed ? " is-revealed" : ""}${tocCollapsing ? " is-closing" : ""}`}
          >
            {tocOpen && !audioCapActive ? (
              <div className="about-style-article-floating-chrome__panel" aria-hidden={!tocPanelRevealed}>
                <AboutStyleArticleTocPanel
                  items={tocItems}
                  variant="nav"
                  onItemClick={closeToc}
                  onListenClick={openAudioFromFloatingToc}
                />
              </div>
            ) : null}

            {!tocOpen && !tocCollapsing ? (
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
