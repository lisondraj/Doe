"use client";

import { type KeyboardEvent, useEffect, useId, useRef, useState } from "react";

export type CareersDropdownOption = { value: string; label: string };
export type CareersDropdownSection = { heading?: string; options: readonly CareersDropdownOption[] };

/** A rounded custom menu for the careers filters: a trigger and a listbox, with arrow-key, Escape, and click-outside support. */
export function CareersFilterDropdown({
  label,
  value,
  sections,
  onChange,
  hideSelected = false,
}: {
  /** Names the control for assistive tech, e.g. "Team". */
  label: string;
  value: string;
  sections: readonly CareersDropdownSection[];
  onChange: (value: string) => void;
  /** The trigger still shows the current choice, but the open menu leaves it out. */
  hideSelected?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  const flat = sections.flatMap((section) => section.options);
  const selected = flat.find((option) => option.value === value) ?? flat[0];

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  /** Opening moves focus onto the current choice, so the keyboard can pick straight away. */
  useEffect(() => {
    if (!open) return;
    const items = optionElements();
    // With the selected choice hidden, the first listed option is the one to focus.
    const index = hideSelected ? 0 : flat.findIndex((option) => option.value === value);
    items[Math.max(index, 0)]?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs only when the menu opens
  }, [open]);

  function optionElements() {
    return Array.from(listRef.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? []);
  }

  function close(returnFocus: boolean) {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  }

  function choose(next: string) {
    onChange(next);
    close(true);
  }

  function onTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
    }
  }

  function onListKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    const items = optionElements();
    const index = items.indexOf(document.activeElement as HTMLElement);
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        items[(index + 1) % items.length]?.focus();
        break;
      case "ArrowUp":
        event.preventDefault();
        items[(index - 1 + items.length) % items.length]?.focus();
        break;
      case "Home":
        event.preventDefault();
        items[0]?.focus();
        break;
      case "End":
        event.preventDefault();
        items[items.length - 1]?.focus();
        break;
      case "Escape":
        event.preventDefault();
        close(true);
        break;
      case "Tab":
        close(false);
        break;
    }
  }

  return (
    <div ref={rootRef} className="doehealth-careers__dropdown">
      <button
        ref={triggerRef}
        type="button"
        className="doehealth-careers__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={label}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={onTriggerKeyDown}
      >
        <span className="doehealth-careers__trigger-text">{selected.label}</span>
        <svg
          className="doehealth-careers__chevron"
          data-open={open ? "true" : undefined}
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open ? (
        <ul
          id={listId}
          ref={listRef}
          role="listbox"
          aria-label={label}
          className="doehealth-careers__menu"
          onKeyDown={onListKeyDown}
        >
          {sections
            .map((section) => ({
              ...section,
              options: hideSelected ? section.options.filter((option) => option.value !== value) : section.options,
            }))
            .filter((section) => section.options.length > 0)
            .map((section, sectionIndex) => (
            <li key={section.heading ?? `section-${sectionIndex}`} role="presentation" className="doehealth-careers__menu-section">
              {section.heading ? (
                <span className="doehealth-careers__menu-heading" role="presentation">
                  {section.heading}
                </span>
              ) : null}
              <ul role="presentation" className="doehealth-careers__menu-options">
                {section.options.map((option) => {
                  const isSelected = option.value === value;
                  return (
                    <li
                      key={option.value}
                      role="option"
                      aria-selected={isSelected}
                      tabIndex={-1}
                      className={`doehealth-careers__option${isSelected ? " is-selected" : ""}`}
                      onClick={() => choose(option.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          choose(option.value);
                        }
                      }}
                    >
                      {option.label}
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
