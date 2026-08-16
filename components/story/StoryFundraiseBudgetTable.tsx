"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { dmSans, suisseIntl } from "@/lib/home/fonts";
import {
  STORY_FUNDRAISE_BUDGET_GROUPS,
  STORY_FUNDRAISE_BUDGET_TOTAL,
} from "@/lib/story/story-fundraise-budget";
import {
  STORY_FUNDRAISE_RUNWAY_DURATION,
  STORY_FUNDRAISE_RUNWAY_LABEL,
} from "@/lib/story/story-copy";

const STORY_BUDGET_HEADING = "Budget";
const STORY_BUDGET_VALUE_CLASS = "story-fundraise-budget__value";
const STORY_BUDGET_MIN_LOCK_HEIGHT = 48;
const STORY_BUDGET_CLOSE_MS = 480;

function BudgetChevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={`story-fundraise-budget__chevron shrink-0${open ? " story-fundraise-budget__chevron--open" : ""}`}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

/** Pre-seed use-of-funds table — standalone or embedded in Our Ask grid. */
export function StoryFundraiseBudgetTable({ embedded = false }: { embedded?: boolean }) {
  const [focusId, setFocusId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [lockedHeight, setLockedHeight] = useState<number | null>(null);
  const [focusSubHeight, setFocusSubHeight] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const collapsedHeightRef = useRef<number | null>(null);
  const isFocusMode = focusId != null;
  const isHeightLocked = lockedHeight != null;

  function measureWrapContentHeight() {
    const wrap = wrapRef.current;
    if (!wrap) return null;

    const intro = wrap.querySelector<HTMLElement>(".story-fundraise-budget-intro");
    const heading = wrap.querySelector<HTMLElement>(".story-fundraise-budget-heading");
    const shell = wrap.querySelector<HTMLElement>(".story-fundraise-budget-table-shell");
    if (!shell) return null;

    const introBlock = intro ?? heading;
    const introHeight = introBlock?.offsetHeight ?? 0;
    const introMargin =
      introBlock != null
        ? Number.parseFloat(getComputedStyle(introBlock).marginBottom) || 0
        : 0;

    return introHeight + introMargin + shell.scrollHeight;
  }

  function rememberCollapsedHeight() {
    const height = measureWrapContentHeight();
    if (height != null && height >= STORY_BUDGET_MIN_LOCK_HEIGHT) {
      collapsedHeightRef.current = height;
    }
  }

  const orderedGroups = useMemo(() => {
    if (!focusId) return STORY_FUNDRAISE_BUDGET_GROUPS;

    const activeIndex = STORY_FUNDRAISE_BUDGET_GROUPS.findIndex((group) => group.id === focusId);
    if (activeIndex < 0) return STORY_FUNDRAISE_BUDGET_GROUPS;

    const groups = [...STORY_FUNDRAISE_BUDGET_GROUPS];
    const [active] = groups.splice(activeIndex, 1);
    return [active, ...groups];
  }, [focusId]);

  useEffect(
    () => () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    },
    [],
  );

  useLayoutEffect(() => {
    if (embedded) {
      if (isFocusMode || isHeightLocked) return;

      rememberCollapsedHeight();

      const wrap = wrapRef.current;
      if (!wrap) return;

      const observer = new ResizeObserver(() => {
        rememberCollapsedHeight();
      });
      observer.observe(wrap);

      return () => observer.disconnect();
    }

    const wrap = wrapRef.current;
    if (!wrap || isFocusMode) return;

    const measure = () => {
      const height = measureWrapContentHeight();
      if (height != null && height >= STORY_BUDGET_MIN_LOCK_HEIGHT) {
        setLockedHeight(height);
      }
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(wrap);

    return () => observer.disconnect();
  }, [embedded, isFocusMode, isHeightLocked]);

  useLayoutEffect(() => {
    const scroll = scrollRef.current;
    if (!scroll || !isFocusMode) {
      setFocusSubHeight(0);
      return;
    }

    const measure = () => {
      const thead = scroll.querySelector("thead");
      const groupRow = scroll.querySelector(
        ".story-fundraise-budget__group-body--active .story-fundraise-budget__row--group",
      );
      const nextHeight =
        scroll.clientHeight -
        (thead?.getBoundingClientRect().height ?? 0) -
        (groupRow?.getBoundingClientRect().height ?? 0);

      setFocusSubHeight(Math.max(0, nextHeight));
    };

    setFocusSubHeight(0);
    scroll.scrollTo({ top: 0, behavior: "auto" });

    const raf = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(measure);
    });

    const observer = new ResizeObserver(measure);
    observer.observe(scroll);
    if (wrapRef.current) observer.observe(wrapRef.current);

    return () => {
      window.cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [focusId, isFocusMode]);

  function lockWrapHeight() {
    rememberCollapsedHeight();

    const height = collapsedHeightRef.current ?? measureWrapContentHeight();
    if (height != null && height >= STORY_BUDGET_MIN_LOCK_HEIGHT) {
      setLockedHeight(height);
    }
  }

  function toggleGroup(id: string) {
    if (focusId === id) {
      setOpenId(null);
      closeTimerRef.current = setTimeout(() => {
        setFocusId(null);
      }, STORY_BUDGET_CLOSE_MS);
      return;
    }

    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);

    lockWrapHeight();
    setFocusId(id);
    setOpenId(id);
  }

  const pinTotalRow = embedded || isFocusMode;

  return (
    <div
      ref={wrapRef}
      className={`story-fundraise-budget-wrap${embedded ? " story-fundraise-budget-wrap--embedded" : ""}${isHeightLocked ? " story-fundraise-budget-wrap--locked" : ""}${isFocusMode ? " story-fundraise-budget-wrap--focus" : ""}`}
      style={isHeightLocked && lockedHeight != null ? { height: lockedHeight, maxHeight: lockedHeight } : undefined}
    >
      {embedded ? (
        <div className="story-fundraise-budget-intro">
          <div className={`story-fundraise-runway story-fundraise-runway--above-heading ${dmSans.className}`}>
            <p className="story-fundraise-runway-duration m-0">{STORY_FUNDRAISE_RUNWAY_DURATION}</p>
            <p className="story-fundraise-runway-label m-0">{STORY_FUNDRAISE_RUNWAY_LABEL}</p>
          </div>
          <h2 className={`story-fundraise-budget-heading m-0 ${suisseIntl.className}`}>{STORY_BUDGET_HEADING}</h2>
        </div>
      ) : (
        <h2 className={`story-fundraise-budget-heading m-0 ${suisseIntl.className}`}>{STORY_BUDGET_HEADING}</h2>
      )}
      <div className={`story-fundraise-budget-table-shell ${dmSans.className}`}>
        <div
          ref={scrollRef}
          className={`story-fundraise-budget-scroll${isFocusMode ? " story-fundraise-budget-scroll--focus" : ""}`}
        >
          <table className="story-fundraise-budget">
            <thead>
              <tr>
                <th scope="col">Category</th>
                <th scope="col">%</th>
                <th scope="col">$$$</th>
              </tr>
            </thead>

            {orderedGroups.map((group) => {
              const open = group.id === openId;
              const collapsible = group.id !== "reserve";
              const hidden = isFocusMode && group.id !== focusId;

              return (
                <tbody
                  key={group.id}
                  className={`story-fundraise-budget__group-body${group.id === focusId && isFocusMode ? " story-fundraise-budget__group-body--active" : ""}${hidden ? " story-fundraise-budget__group-body--hidden" : ""}`}
                >
                  <GroupRows
                    group={group}
                    open={open}
                    collapsible={collapsible}
                    focusFillHeight={open && isFocusMode ? focusSubHeight : undefined}
                    onToggle={() => toggleGroup(group.id)}
                  />
                </tbody>
              );
            })}

            {!pinTotalRow ? (
              <tbody className="story-fundraise-budget__total-body">
                <TotalRow />
              </tbody>
            ) : null}
          </table>
        </div>

        {pinTotalRow ? (
          <div className="story-fundraise-budget-total-wrap">
            <table className="story-fundraise-budget">
              <tbody>
                <TotalRow />
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function TotalRow() {
  return (
    <tr className="story-fundraise-budget__row--total">
      <th scope="row">{STORY_FUNDRAISE_BUDGET_TOTAL.category}</th>
      <td className={STORY_BUDGET_VALUE_CLASS}>{STORY_FUNDRAISE_BUDGET_TOTAL.percent}</td>
      <td className={STORY_BUDGET_VALUE_CLASS}>{STORY_FUNDRAISE_BUDGET_TOTAL.amount}</td>
    </tr>
  );
}

function GroupRows({
  group,
  open,
  collapsible,
  focusFillHeight,
  onToggle,
}: {
  group: (typeof STORY_FUNDRAISE_BUDGET_GROUPS)[number];
  open: boolean;
  collapsible: boolean;
  focusFillHeight?: number;
  onToggle: () => void;
}) {
  return (
    <>
      <tr className="story-fundraise-budget__row--group">
        <th scope="row">
          {collapsible ? (
            <button
              type="button"
              className="story-fundraise-budget__group-toggle"
              aria-expanded={open}
              aria-controls={`story-budget-sub-${group.id}`}
              onClick={onToggle}
            >
              <span className="story-fundraise-budget__group-label">{group.category}</span>
              <BudgetChevron open={open} />
            </button>
          ) : (
            <span className="story-fundraise-budget__group-label">{group.category}</span>
          )}
        </th>
        <td className={STORY_BUDGET_VALUE_CLASS}>{group.percent}</td>
        <td className={STORY_BUDGET_VALUE_CLASS}>{group.amount}</td>
      </tr>

      {collapsible ? (
        <tr
          className={`story-fundraise-budget__sub-panel${open ? " story-fundraise-budget__sub-panel--open" : ""}${focusFillHeight != null ? " story-fundraise-budget__sub-panel--fill" : ""}`}
          aria-hidden={!open}
        >
          <td colSpan={3} className="story-fundraise-budget__sub-panel-cell">
            <div
              className="story-fundraise-budget__sub-panel-shell"
              id={`story-budget-sub-${group.id}`}
              style={
                focusFillHeight != null && focusFillHeight > 0
                  ? { height: focusFillHeight, minHeight: focusFillHeight }
                  : undefined
              }
            >
              <div className="story-fundraise-budget__sub-panel-content">
                {group.subcategories.map((subcategory) => (
                  <div
                    key={`${group.id}-${subcategory.label}`}
                    className="story-fundraise-budget__sub-row"
                  >
                    <span className="story-fundraise-budget__sub-label">{subcategory.label}</span>
                    <span className={`story-fundraise-budget__sub-percent ${STORY_BUDGET_VALUE_CLASS}`}>
                      {subcategory.percent}
                    </span>
                    <span className={`story-fundraise-budget__sub-amount ${STORY_BUDGET_VALUE_CLASS}`}>
                      {subcategory.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </td>
        </tr>
      ) : null}
    </>
  );
}
