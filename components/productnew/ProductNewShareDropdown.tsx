"use client";

import { PRODUCTNEW_SHARE_USERS } from "@/lib/productnew/productnew-copy";

export type ShareAccessMode = "full" | "view";

function IconLink() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M6.2 9.8a2.6 2.6 0 0 0 3.7 0l1.5-1.5a2.6 2.6 0 0 0-3.7-3.7L6.8 5.3"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M9.8 6.2a2.6 2.6 0 0 0-3.7 0L4.6 7.7a2.6 2.6 0 0 0 3.7 3.7l1.5-1.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconTeam() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="5.5" cy="5.5" r="2" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="10.8" cy="6.2" r="1.7" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M1.8 13c0-2 1.7-3.5 3.7-3.5s3.7 1.5 3.7 3.5M9.2 13c.1-1.6 1.3-2.8 2.8-2.8 1.2 0 2.2.7 2.7 1.8"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconEdit() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M8.8 2.8 11.2 5.2 4.8 11.6 2.4 11.6 2.4 9.2 8.8 2.8z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconArrowUp() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M7 10V4M4.5 6.5 7 4 9.5 6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ProductNewShareDropdown({
  accessMode,
  onAccessModeChange,
}: {
  accessMode: ShareAccessMode;
  onAccessModeChange: (mode: ShareAccessMode) => void;
}) {
  return (
    <div className="productnew-share__dropdown" role="dialog" aria-label="Share access">
      <div className="productnew-share__segmented">
        <button
          type="button"
          className={`productnew-share__segment${accessMode === "full" ? " productnew-share__segment--active" : ""}`}
          onClick={() => onAccessModeChange("full")}
        >
          Full Access
        </button>
        <button
          type="button"
          className={`productnew-share__segment${accessMode === "view" ? " productnew-share__segment--active" : ""}`}
          onClick={() => onAccessModeChange("view")}
        >
          View Only
        </button>
      </div>

      <div className="productnew-share__email-row">
        <input
          className="productnew-share__email"
          type="email"
          placeholder="name@gmail.com"
          aria-label="Invite email"
        />
        <button type="button" className="productnew-share__email-send" aria-label="Send invite">
          <IconArrowUp />
        </button>
      </div>

      <div className="productnew-share__row">
        <div className="productnew-share__row-icon">
          <IconLink />
        </div>
        <div className="productnew-share__row-copy">
          <p className="productnew-share__row-title">Project Link</p>
          <p className="productnew-share__row-sub">Anyone can view</p>
        </div>
        <button type="button" className="productnew-share__copy">
          Copy
        </button>
      </div>

      <div className="productnew-share__row productnew-share__row--plain">
        <div className="productnew-share__row-icon">
          <IconTeam />
        </div>
        <div className="productnew-share__row-copy">
          <p className="productnew-share__row-title">Team</p>
          <p className="productnew-share__row-sub">Anyone can view</p>
        </div>
      </div>

      <ul className="productnew-share__users">
        {PRODUCTNEW_SHARE_USERS.map((user) => (
          <li key={user.name} className="productnew-share__user">
            <span className="productnew-share__user-avatar" style={{ background: user.avatar }} aria-hidden />
            <span className="productnew-share__user-name">{user.name}</span>
            <button type="button" className="productnew-share__user-edit" aria-label={`Edit ${user.name}`}>
              <IconEdit />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
