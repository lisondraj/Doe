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

const PANEL_REVEAL_MS = 780;
const PANEL_HIDE_MS = 180;
const PANEL_COLLAPSE_MS = 520;
const SCROLL_REVEAL_PX = 280;
const AUDIO_JOIN_MS = 920;
const AUDIO_JOIN_SETTLE_MS = 320;
const AUDIO_LEAVE_MS = 880;

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
  const audioCapActive = isPlayerOpen || audioClosing;

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
  const [backdropArmed, setBackdropArmed] = useState(false);

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
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setBlogCollapsing(true));
    });
  }, []);

  const beginTocCollapse = useCallback(() => {
    const cap = tocCapRef.current;
    if (cap) {
      const { width, height } = cap.getBoundingClientRect();
      cap.style.width = `${width}px`;
      cap.style.height = `${height}px`;
    }
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setTocCollapsing(true));
    });
  }, []);

  const markWidgetOpened = useCallback(() => {
    ignoreBackdropDismissUntilRef.current = performance.now() + 420;
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

  const beginAudioClose = useCallback(() => {
    if (!isPlayerOpen || audioClosing) return;
    setAudioJoined(false);
    setAudioClosing(true);
    if (audioJoinTimerRef.current !== null) {
      window.clearTimeout(audioJoinTimerRef.current);
    }
    audioJoinTimerRef.current = window.setTimeout(() => {
      closePlayer();
      window.setTimeout(() => {
        setAudioClosing(false);
        audioJoinTimerRef.current = null;
      }, 64);
    }, AUDIO_LEAVE_MS);
  }, [audioClosing, closePlayer, isPlayerOpen]);

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
        const anyWidgetOpen = blogOpen || tocOpen || audioCapActive;
        if (!revealed && !anyWidgetOpen) {
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
  }, [audioCapActive, blogOpen, clearBlogCollapseStyles, clearTocCollapseStyles, closePlayer, tocOpen]);

  useEffect(() => {
    if (!isPlayerOpen) {
      if (!audioClosing) {
        setAudioJoined(false);
        setAudioClosing(false);
      }
      return;
    }

    if (audioClosing) return;

    if (blogOpen) closeBlog();
    if (tocOpen) closeToc();

    setAudioJoined(false);
    if (audioJoinTimerRef.current !== null) window.clearTimeout(audioJoinTimerRef.current);
    audioJoinTimerRef.current = window.setTimeout(() => {
      setAudioJoined(true);
      audioJoinTimerRef.current = null;
    }, AUDIO_JOIN_SETTLE_MS);
  }, [audioClosing, blogOpen, closeBlog, closeToc, isPlayerOpen, tocOpen]);

  useEffect(() => {
    if (!isPlayerOpen || !isPlaying || audioSrc) return;

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
  }, [audioSrc, isPlayerOpen, isPlaying, setCurrentTime, setIsPlaying]);

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

  const anyWidgetOpen = blogOpen || tocOpen || audioCapActive;

  useEffect(() => {
    if (!anyWidgetOpen) {
      setBackdropArmed(false);
      return;
    }

    setBackdropArmed(false);
    const armTimer = window.setTimeout(() => {
      setBackdropArmed(true);
    }, 420);

    return () => {
      window.clearTimeout(armTimer);
    };
  }, [anyWidgetOpen, blogOpen, audioCapActive, tocOpen]);

  useEffect(() => {
    if (!anyWidgetOpen) return;

    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, [anyWidgetOpen]);

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
    };
  }, []);

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
    scrollRevealed ? "is-visible" : "",
    audioCapActive ? "is-audio" : "",
    audioJoined ? "is-audio-joined" : "",
    audioClosing ? "is-audio-closing" : "",
    blogOpen && !audioCapActive ? "is-blog" : "",
    tocOpen && !audioCapActive ? "is-toc" : "",
    blogCollapsing ? "is-blog-closing" : "",
    tocCollapsing ? "is-toc-closing" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return createPortal(
    <>
      {anyWidgetOpen ? (
        <button
          type="button"
          className={`about-style-article-floating-chrome__backdrop${backdropArmed ? " is-armed" : ""}`}
          aria-label="Close menu"
          tabIndex={-1}
          onClick={dismissOpenWidgets}
        />
      ) : null}

      <div ref={rootRef} className={rootClass} aria-live="polite" aria-hidden={!scrollRevealed}>
      <div
        className={shellClass}
        style={{
          ["--proto-nav-frost-progress" as string]: 1,
          ["--about-audio-join-ms" as string]: `${AUDIO_JOIN_MS}ms`,
          ["--about-audio-leave-ms" as string]: `${AUDIO_LEAVE_MS}ms`,
        }}
      >
        <div
          ref={blogCapRef}
          className={`about-style-article-floating-chrome__cap about-style-article-floating-chrome__cap--left${blogOpen && !audioCapActive ? " is-open" : ""}${blogCollapsing ? " is-closing" : ""}`}
        >
          {blogOpen && !audioCapActive ? (
            <div className="about-style-article-floating-chrome__panel" aria-hidden={!blogPanelRevealed}>
              <AboutStyleArticleFloatingBlogPanel currentSlug={currentSlug} onItemClick={closeBlog} />
            </div>
          ) : null}

          {!blogOpen && !blogCollapsing ? (
            <button
              type="button"
              className="about-style-article-floating-chrome__cap-trigger"
              aria-label="Open blog posts"
              onClick={(event) => {
                event.stopPropagation();
                if (audioCapActive) openBlog();
                else toggleBlog();
              }}
              tabIndex={scrollRevealed ? 0 : -1}
            >
              <BlogNavIcon className="about-style-article-floating-chrome__icon" />
            </button>
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
                  {isPlaying ? <PauseIcon size={40} /> : <PlayIcon size={40} />}
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
            className={`about-style-article-floating-chrome__cap about-style-article-floating-chrome__cap--right${tocOpen && !audioCapActive ? " is-open" : ""}${tocCollapsing ? " is-closing" : ""}`}
          >
            {tocOpen && !audioCapActive ? (
              <div className="about-style-article-floating-chrome__panel" aria-hidden={!tocPanelRevealed}>
                <AboutStyleArticleTocPanel items={tocItems} variant="nav" onItemClick={closeToc} />
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
                tabIndex={scrollRevealed ? 0 : -1}
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
