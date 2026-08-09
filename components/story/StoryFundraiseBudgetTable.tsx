"use client";

import { useState } from "react";

import { suisseIntl } from "@/lib/home/fonts";
import {
  STORY_FUNDRAISE_BUDGET_GROUPS,
  STORY_FUNDRAISE_BUDGET_TOTAL,
} from "@/lib/story/story-fundraise-budget";
import { STORY_FUNDRAISE_TABS } from "@/lib/story/story-nav";

const STORY_BUDGET_HEADING =
  STORY_FUNDRAISE_TABS.find((tab) => tab.id === "budget")?.label ?? "Budget";

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

/** Pre-seed use-of-funds table for /story Fundraise tab. */
export function StoryFundraiseBudgetTable() {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  function toggleGroup(id: string) {
    setExpandedGroups((current) => ({ ...current, [id]: !current[id] }));
  }

  return (
    <div className={`story-fundraise-budget-wrap ${suisseIntl.className}`}>
      <h2 className="story-fundraise-budget-heading m-0">{STORY_BUDGET_HEADING}</h2>
      <table className="story-fundraise-budget">
        <thead>
          <tr>
            <th scope="col">Category</th>
            <th scope="col">%</th>
            <th scope="col">$$$</th>
          </tr>
        </thead>

        {STORY_FUNDRAISE_BUDGET_GROUPS.map((group) => {
          const open = Boolean(expandedGroups[group.id]);
          const collapsible = group.id !== "reserve";

          return (
            <tbody key={group.id} className="story-fundraise-budget__group-body">
              <GroupRows
                group={group}
                open={open}
                collapsible={collapsible}
                onToggle={() => toggleGroup(group.id)}
              />
            </tbody>
          );
        })}

        <tbody>
          <tr className="story-fundraise-budget__row--total">
            <th scope="row">{STORY_FUNDRAISE_BUDGET_TOTAL.category}</th>
            <td>{STORY_FUNDRAISE_BUDGET_TOTAL.percent}</td>
            <td>{STORY_FUNDRAISE_BUDGET_TOTAL.amount}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function GroupRows({
  group,
  open,
  collapsible,
  onToggle,
}: {
  group: (typeof STORY_FUNDRAISE_BUDGET_GROUPS)[number];
  open: boolean;
  collapsible: boolean;
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
          className={`story-fundraise-budget__sub-panel${open ? " story-fundraise-budget__sub-panel--open" : ""}`}
          aria-hidden={!open}
        >
          <td colSpan={3} className="story-fundraise-budget__sub-panel-cell">
            <div className="story-fundraise-budget__sub-panel-shell" id={`story-budget-sub-${group.id}`}>
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
