"use client";

import type { ReactNode } from "react";

import { DoeBuildIcon } from "@/components/admin/doe-build-icon";
import { ADMIN_AUTH_ENABLED } from "@/lib/admin/admin-auth";
import { signOutAdmin } from "@/lib/admin/sign-out-admin";
import { lora, suisseIntl } from "@/lib/home/fonts";

export type AdminTab = "signups" | "analytics";

const NAV_ITEMS: {
  id: AdminTab;
  label: string;
  icon: ReactNode;
}[] = [
  {
    id: "signups",
    label: "Applications",
    icon: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: (
      <>
        <path d="M3 3v18h18" />
        <path d="M7 16l4-4 4 4 5-6" />
      </>
    ),
  },
];

export function AdminSideNav({
  activeTab,
  onSelect,
  totalApplications,
}: {
  activeTab: AdminTab;
  onSelect: (tab: AdminTab) => void;
  totalApplications: number;
}) {
  return (
    <aside className={`product-brown-sidebar flex h-full shrink-0 flex-col ${suisseIntl.className}`}>
      <div className="flex items-center justify-between gap-2 px-3 pt-3 pb-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <div
            className="h-9 w-9 shrink-0 rounded-lg bg-gradient-to-br from-[#D4A574] via-[#A67B5B] to-[#3d2e1f] shadow-sm"
            aria-hidden
          />
          <div className="min-w-0">
            <p
              className={`m-0 truncate font-normal text-[1.65rem] leading-[2.25rem] tracking-tight text-[#f5e6d0] ${lora.className}`}
            >
              Doe
            </p>
          </div>
        </div>
      </div>

      <div className="px-2 pb-1 pt-1">
        <div className="flex items-center justify-between px-1 text-[10px] font-semibold uppercase tracking-wider text-[rgba(242,232,218,0.48)]">
          <span>Admin</span>
        </div>
      </div>

      <nav className="flex flex-col gap-0.5 px-2 pb-2" aria-label="Admin navigation">
        {NAV_ITEMS.map((item) => {
          const isActive = item.id === activeTab;
          const badge = item.id === "signups" ? totalApplications : undefined;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              aria-current={isActive ? "page" : undefined}
              className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[13px] outline-none transition-colors duration-150 ${
                isActive
                  ? "font-medium text-[#f5e6d0]"
                  : "text-[rgba(245,230,208,0.78)] hover:bg-[rgba(245,230,208,0.08)]"
              }`}
            >
              <DoeBuildIcon className="h-[18px] w-[18px] shrink-0 text-[rgba(245,230,208,0.42)]">
                {item.icon}
              </DoeBuildIcon>
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              {badge !== undefined ? (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums ${
                    isActive
                      ? "bg-[rgba(245,230,208,0.16)] text-[#f5e6d0]"
                      : "bg-[rgba(245,230,208,0.08)] text-[rgba(245,230,208,0.72)]"
                  }`}
                >
                  {badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-[rgba(245,230,208,0.1)] px-[0.85rem] py-[0.95rem]">
        <p className="m-0 text-[0.62rem] font-medium uppercase leading-none tracking-[0.14em] text-[rgba(245,230,208,0.42)]">
          Workspace
        </p>
        <p className="m-0 mt-[0.4rem] truncate text-[0.88rem] font-normal leading-[1.2] tracking-[-0.01em] text-[rgba(245,230,208,0.78)]">
          Doe Admin
        </p>
        {ADMIN_AUTH_ENABLED ? (
          <button
            type="button"
            onClick={() => void signOutAdmin()}
            className="admin-nav-signout mt-3"
          >
            Sign out
          </button>
        ) : null}
      </div>
    </aside>
  );
}
