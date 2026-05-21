"use client";

import { useState } from "react";
import { Lora } from "next/font/google";
import { DoeEduIcon } from "./doe-edu-icon";

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const teamOptions = [
  { name: "Individual", detail: "Solo workspace" },
  { name: "Translational Research", detail: "Research team" },
  { name: "Population Health Lab", detail: "Research team" },
] as const;

export function DoeEduSidebar() {
  const [selectedTeam, setSelectedTeam] = useState<(typeof teamOptions)[number]>(teamOptions[0]);
  const [teamMenuOpen, setTeamMenuOpen] = useState(false);

  return (
    <aside className="flex h-full w-[220px] shrink-0 flex-col border-r border-[#EFEFEF] bg-white">
      <div className="flex items-center justify-between gap-2 px-3 pt-3 pb-2">
        <div className="flex min-w-0 items-center gap-2">
          <div className="h-8 w-8 shrink-0 rounded-lg bg-gradient-to-br from-[#E7A944] via-[#D2774C] to-[#1E343A] shadow-sm" />
          <div className="min-w-0">
            <div className="flex min-w-0 flex-wrap items-baseline gap-x-1.5 gap-y-0">
              <span
                className={`truncate text-[1.08rem] font-normal leading-none tracking-tight text-neutral-900 ${lora.className}`}
              >
                Doe
              </span>
              <span
                className={`truncate text-[1.08rem] font-normal leading-none tracking-tight text-neutral-900 ${lora.className}`}
              >
                Education
              </span>
            </div>
          </div>
        </div>
        <button
          type="button"
          className="rounded-md p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
          aria-label="Collapse sidebar"
        >
          <DoeEduIcon className="h-4 w-4">
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M9 3v18" />
          </DoeEduIcon>
        </button>
      </div>

      <div className="px-3 pb-2">
        <div className="flex h-9 items-center gap-2 rounded-lg border border-[#ECECEC] bg-[#FAFAFA] px-2.5">
          <DoeEduIcon className="h-4 w-4 text-neutral-400">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.35-4.35" />
          </DoeEduIcon>
          <span className="flex-1 text-[13px] text-neutral-400">Search</span>
          <span className="rounded border border-[#E5E5E5] bg-white px-1.5 py-0.5 text-[10px] font-medium text-neutral-500">
            ⌘
          </span>
        </div>
      </div>

      <nav className="flex flex-col gap-0.5 px-2 pb-2">
        {[
          { label: "Dashboard", icon: <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /> },
          { label: "Inbox", badge: "20", icon: <path d="M22 12h-6l-2 3h-4l-2-3H2" /> },
          {
            label: "My tasks",
            icon: (
              <>
                <path d="M9 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h4" />
                <path d="M15 7V3a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v4" />
                <rect width="8" height="14" x="13" y="7" rx="2" />
              </>
            ),
            action: "+",
          },
        ].map((item) => (
          <button
            key={item.label}
            type="button"
            className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[13px] text-neutral-700 hover:bg-neutral-50"
          >
            <DoeEduIcon className="h-[18px] w-[18px]">{item.icon}</DoeEduIcon>
            <span className="min-w-0 flex-1 truncate">{item.label}</span>
            {"badge" in item && item.badge ? (
              <span className="rounded-full bg-neutral-100 px-1.5 py-0.5 text-[11px] font-medium text-neutral-600">
                {item.badge}
              </span>
            ) : null}
            {"action" in item && item.action ? (
              <span className="rounded-md border border-neutral-200 px-1.5 text-xs text-neutral-500">
                {item.action}
              </span>
            ) : null}
          </button>
        ))}
      </nav>

      <div className="px-2 pb-1 pt-1">
        <div className="flex items-center justify-between px-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
          <span>TOOLS</span>
          <span className="flex gap-1">
            <span className="cursor-pointer">⋯</span>
            <span className="cursor-pointer">+</span>
          </span>
        </div>
        <div className="mt-1 flex flex-col gap-0.5">
          {(
            [
              {
                label: "Pyrus",
                active: true,
                icon: (
                  <>
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    <path d="M8 7h8" />
                    <path d="M8 11h6" />
                  </>
                ),
              },
              {
                label: "Laddr",
                active: false,
                icon: (
                  <>
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </>
                ),
              },
              {
                label: "Vision",
                active: false,
                icon: (
                  <>
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </>
                ),
              },
            ] as const
          ).map((item) => (
            <button
              key={item.label}
              type="button"
              className={`flex items-center gap-2 rounded-lg px-2 py-2 text-[13px] ${
                item.active
                  ? "bg-neutral-100 font-medium text-neutral-900"
                  : "text-neutral-700 hover:bg-neutral-50"
              }`}
            >
              <DoeEduIcon className="h-[18px] w-[18px]">{item.icon}</DoeEduIcon>
              <span className="flex-1 truncate text-left">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto border-t border-[#EFEFEF] px-2 py-2">
        <div className="px-1">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">TEAM</p>
          <div className="relative">
            {teamMenuOpen ? (
              <div
                role="menu"
                className="absolute bottom-full left-0 right-0 z-20 mb-1.5 overflow-hidden rounded-xl border border-[#E5E5E5] bg-white p-1 shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
              >
                {teamOptions.map((team) => (
                  <button
                    key={team.name}
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setSelectedTeam(team);
                      setTeamMenuOpen(false);
                    }}
                    className={`flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left ${
                      selectedTeam.name === team.name ? "bg-neutral-100" : "hover:bg-neutral-50"
                    }`}
                  >
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gradient-to-br from-[#E7A944] to-[#BF593D]" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12px] font-medium text-neutral-700">
                        {team.name}
                      </span>
                      <span className="block truncate text-[10px] text-neutral-500">{team.detail}</span>
                    </span>
                  </button>
                ))}
              </div>
            ) : null}
            <button
              type="button"
              onClick={() => setTeamMenuOpen((open) => !open)}
              className="flex w-full items-center gap-2 rounded-lg border border-[#E6E6E6] bg-white px-2 py-2 text-left text-[12px] font-medium text-neutral-700 hover:bg-neutral-50"
              aria-haspopup="menu"
              aria-expanded={teamMenuOpen}
              aria-label="Select team"
            >
              <span className="h-2 w-2 rounded-full bg-gradient-to-br from-[#E7A944] to-[#BF593D]" />
              <span className="min-w-0 flex-1">
                <span className="block truncate">{selectedTeam.name}</span>
                <span className="block truncate text-[10px] font-normal text-neutral-500">
                  {selectedTeam.detail}
                </span>
              </span>
              <DoeEduIcon className="h-3.5 w-3.5 text-neutral-400">
                <path d="m6 9 6 6 6-6" />
              </DoeEduIcon>
            </button>
          </div>
          <button
            type="button"
            className="mt-2 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[12px] font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-800"
          >
            <DoeEduIcon className="h-4 w-4 text-neutral-400">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" x2="9" y1="12" y2="12" />
            </DoeEduIcon>
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
