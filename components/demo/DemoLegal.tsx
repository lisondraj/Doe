"use client";

import Link from "next/link";

import { DISPLAY, DemoFrame } from "@/components/demo/DemoFrame";

const DOCS = {
  terms: {
    title: "Terms of Service",
    intro:
      "These terms cover how a person and their personal agent use Doe to find, compare and book care with clinics on the Doe network.",
    sections: [
      ["Who can use Doe", "You must be 18 or older, or have a parent or guardian agree for you. A personal agent may act for you only within the permissions you give it."],
      ["Your personal agent", "When your agent uses Doe, it acts on your behalf. You're responsible for what it agrees to, such as holds, prices and bookings, and you can change or revoke its access at any time."],
      ["Clinics and care", "Clinics set their own services, prices, offers and policies. Doe is not a healthcare provider and does not give medical advice. Care decisions are between you and your clinician."],
      ["Prices and payment", "Prices shown are set by each clinic. Negotiated prices hold for the time the clinic states. Private pay services are billed to you, and receipts are issued by the clinic."],
      ["Cancellations", "Each clinic's cancellation policy applies and is shown before booking."],
      ["Changes to these terms", "We'll tell you, or your agent, before material changes take effect."],
    ],
  },
  privacy: {
    title: "Privacy Policy",
    intro:
      "This policy explains what Doe collects when you or your personal agent use it, why, and the choices you have. Doe follows Canada's PIPEDA and Ontario's PHIPA where they apply.",
    sections: [
      ["What we collect", "Details your agent shares to book care, such as your name, contact details and the answers on clinic forms, plus records of holds, messages and bookings."],
      ["How it's used", "Only to find and book care you ask for, to send updates to you or your agent, and to keep Doe secure. We don't sell personal information."],
      ["What clinics see", "A clinic sees what your agent sends it: your request, the forms you pass back, and your booking. Clinics hold your health record under their own obligations."],
      ["Persistent connection", "If you allow it, your agent stays connected to Doe to receive updates. You can turn this off at any time."],
      ["The Doe network", "Joining the network lets clinics recognize you so booking is faster. It's optional, and you can leave at any time."],
      ["Your rights", "You can ask to see, correct or delete your information by writing to privacy@doe.care."],
    ],
  },
} as const;

export function DemoLegal({ doc }: { doc: keyof typeof DOCS }) {
  const d = DOCS[doc];
  return (
    <DemoFrame
      logoHref="/demo"
      right={
        <Link href={doc === "terms" ? "/demo/PP" : "/demo/TOS"} className="h-[38px] px-[14px] flex items-center rounded-full bg-[#F4EEDF] text-[13px] font-[600]">
          {doc === "terms" ? "Privacy Policy" : "Terms of Service"}
        </Link>
      }
    >
      <main className="max-w-[680px] mx-auto px-[22px] pb-[48px] pt-[8px]">
        <p className="text-[12px] font-[500] text-[#28191080]">Last updated October 30, 2026</p>
        <h1 className={`${DISPLAY} mt-[4px] text-[34px] leading-[38px] md:text-[44px] md:leading-[48px] tracking-[-0.02em]`}>{d.title}</h1>
        <p className="mt-[14px] text-[16px] leading-[24px] text-[#281910CC]">{d.intro}</p>
        <div className="mt-[24px] flex flex-col gap-[6px]">
          {d.sections.map(([h, body]) => (
            <section key={h} className="p-[16px] rounded-[20px] bg-[#F4EEDF]">
              <h2 className="text-[16px] leading-[22px] font-[600]">{h}</h2>
              <p className="mt-[4px] text-[14px] leading-[21px] text-[#281910B3]">{body}</p>
            </section>
          ))}
        </div>
      </main>
    </DemoFrame>
  );
}
