"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";

import { suisseIntl } from "@/lib/home/fonts";
import {
  STORY_FUNDRAISE_BUDGET_GROUPS,
  STORY_FUNDRAISE_BUDGET_TOTAL,
} from "@/lib/story/story-fundraise-budget";

const STORY_BUDGET_HEADING = "Budget";
const STORY_BUDGET_MIN_LOCK_HEIGHT = 48;

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
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [lockedHeight, setLockedHeight] = useState<number | null>(null);
  const [focusSubHeight, setFocusSubHeight] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isFocusMode = expandedId != null;
  const isHeightLocked = lockedHeight != null && (!embedded || isFocusMode);

  const orderedGroups = useMemo(() => {
    if (!expandedId) return STORY_FUNDRAISE_BUDGET_GROUPS;

    const activeIndex = STORY_FUNDRAISE_BUDGET_GROUPS.findIndex((group) => group.id === expandedId);
    if (activeIndex < 0) return STORY_FUNDRAISE_BUDGET_GROUPS;

    const groups = [...STORY_FUNDRAISE_BUDGET_GROUPS];
    const [active] = groups.splice(activeIndex, 1);
    return [active, ...groups];
  }, [expandedId]);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || isFocusMode || embedded) return;

    const measure = () => {
      const height = wrap.getBoundingClientRect().height;
      if (height >= STORY_BUDGET_MIN_LOCK_HEIGHT) {
        setLockedHeight(height);
      }
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(wrap);

    return () => observer.disconnect();
  }, [embedded, isFocusMode]);

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
    scroll.scrollTo({ top: 0, behavior: "smooth" });

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
  }, [embedded, expandedId, isFocusMode]);

  function toggleGroup(id: string) {
    setExpandedId((current) => {
      const next = current === id ? null : id;

      if (next != null && wrapRef.current) {
        const height = wrapRef.current.getBoundingClientRect().height;
        if (height >= STORY_BUDGET_MIN_LOCK_HEIGHT) {
          setLockedHeight(height);
        }
      } else if (!embedded) {
        setLockedHeight(null);
      }

      return next;
    });
  }

  const pinTotalRow = !embedded || isFocusMode;

  return (
    <div
      ref={wrapRef}
      className={`story-fundraise-budget-wrap ${suisseIntl.className}${embedded ? " story-fundraise-budget-wrap--embedded" : ""}${isHeightLocked ? " story-fundraise-budget-wrap--locked" : ""}${isFocusMode ? " story-fundraise-budget-wrap--focus" : ""}`}
      style={isHeightLocked && lockedHeight != null ? { height: lockedHeight, maxHeight: lockedHeight } : undefined}
    >
      {!embedded ? <h2 className="story-fundraise-budget-heading m-0">{STORY_BUDGET_HEADING}</h2> : null}
      <div className="story-fundraise-budget-table-shell">
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
              const open = group.id === expandedId;
              const collapsible = group.id !== "reserve";
              const hidden = isFocusMode && !open;

              return (
                <tbody
                  key={group.id}
                  className={`story-fundraise-budget__group-body${open && isFocusMode ? " story-fundraise-budget__group-body--active" : ""}${hidden ? " story-fundraise-budget__group-body--hidden" : ""}`}
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
      <td>{STORY_FUNDRAISE_BUDGET_TOTAL.percent}</td>
      <td>{STORY_FUNDRAISE_BUDGET_TOTAL.amount}</td>
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
        <td>{group.percent}</td>
        <td>{group.amount}</td>
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
                    <span className="story-fundraise-budget__sub-percent">{subcategory.percent}</span>
                    <span className="story-fundraise-budget__sub-amount">{subcategory.amount}</span>
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
