"use client";

import type { ProductEmrNavId } from "@/lib/productemr/types";

export function IconHome({ active }: { active?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M4 10.4L12 3.6L20 10.4V20.2H14.6V13.8H9.4V20.2H4V10.4Z"
        fill="none"
        stroke={active ? "#FFFFFF" : "#FFFFFF99"}
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconPatients({ active }: { active?: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
      <circle cx="9" cy="8" r="2.8" fill="none" stroke={active ? "#FFFFFF" : "#FFFFFF99"} strokeWidth="1.8" />
      <path
        d="M4.2 18.4C4.4 15.6 6.5 14 9 14s4.6 1.6 4.8 4.4"
        fill="none"
        stroke={active ? "#FFFFFF" : "#FFFFFF99"}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="16.4" cy="8.3" r="2.3" fill="none" stroke={active ? "#FFFFFF" : "#FFFFFF99"} strokeWidth="1.8" />
      <path
        d="M14.6 14.1C16.2 13.7 18.8 14.7 19.2 17.6"
        fill="none"
        stroke={active ? "#FFFFFF" : "#FFFFFF99"}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconSchedule() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <rect x="3.6" y="5.2" width="16.8" height="15.2" rx="2.2" fill="none" stroke="#FFFFFF99" strokeWidth="1.7" />
      <path d="M3.6 9.6H20.4M8 3.6V6.8M16 3.6V6.8" fill="none" stroke="#FFFFFF99" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function IconMessages() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M4.2 6.4C4.2 5.3 5.1 4.4 6.2 4.4H17.8C18.9 4.4 19.8 5.3 19.8 6.4V14.6C19.8 15.7 18.9 16.6 17.8 16.6H9.1L4.2 20.2V6.4Z"
        fill="none"
        stroke="#FFFFFF99"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconApps() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
      <circle cx="5" cy="5" r="1.35" fill="#FFFFFF" />
      <circle cx="11" cy="5" r="1.35" fill="#FFFFFF" />
      <circle cx="5" cy="11" r="1.35" fill="#FFFFFF" />
      <circle cx="11" cy="11" r="1.35" fill="#FFFFFF" />
    </svg>
  );
}

export function IconSun() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
      <circle cx="8" cy="8" r="2.1" fill="none" stroke="#FFFFFF" strokeWidth="1.35" />
      <path
        d="M8 1.8V3.4M8 12.6V14.2M1.8 8H3.4M12.6 8H14.2M3.3 3.3L4.4 4.4M11.6 11.6L12.7 12.7M12.7 3.3L11.6 4.4M4.4 11.6L3.3 12.7"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
    </svg>
  );
}

export const PRODUCT_EMR_NAV: { id: ProductEmrNavId; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "patients", label: "Patients" },
  { id: "schedule", label: "Schedule" },
  { id: "messages", label: "Messages" },
];
