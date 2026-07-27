export type ProductMobileTab = "today" | "calls" | "schedule" | "inbox";

export type ProductMobileNavItem = {
  id: ProductMobileTab;
  label: string;
};

export const PRODUCT_MOBILE_NAV_ITEMS: readonly ProductMobileNavItem[] = [
  { id: "today", label: "Today" },
  { id: "calls", label: "Calls" },
  { id: "schedule", label: "Schedule" },
  { id: "inbox", label: "Inbox" },
] as const;

export const PRODUCT_MOBILE_INBOX_THREADS = [
  {
    id: "t1",
    from: "Jamie Chen",
    subject: "Lab results follow-up",
    preview: "Patient asking about A1C trend and next steps.",
    time: "9:14 AM",
    unread: true,
  },
  {
    id: "t2",
    from: "Riverside Cardiology",
    subject: "Referral packet",
    preview: "Echo + med list attached for consult scheduling.",
    time: "8:02 AM",
    unread: true,
  },
  {
    id: "t3",
    from: "Front desk",
    subject: "Tomorrow openings",
    preview: "Two slots freed after cancellations — want outreach?",
    time: "Yesterday",
    unread: false,
  },
  {
    id: "t4",
    from: "GI clinic",
    subject: "Biopsy scheduled",
    preview: "Lesion shave booked Apr 4. Path to follow.",
    time: "Yesterday",
    unread: false,
  },
] as const;
