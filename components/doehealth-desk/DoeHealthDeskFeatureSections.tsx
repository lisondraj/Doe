import type { CSSProperties, ReactNode } from "react";

import { DoeHealthDeskProductRail } from "@/components/doehealth-desk/DoeHealthDeskProductRail";
import {
  DOEHEALTH_DESK_PRODUCT_CARD,
  DOEHEALTH_DESK_PRODUCT_INK,
  DOEHEALTH_DESK_RADIUS_PX,
  DOEHEALTH_DESK_SURFACE,
} from "@/lib/doehealth/doehealth-desk-colors";
import { DOEPHONE_DESKTOP_PAGE_INSET_X } from "@/lib/doephone/section-styles";
import { dmSans, inter, larkenLight, p22Mackinac } from "@/lib/home/fonts";

const SHELL = DOEHEALTH_DESK_SURFACE;
const INK = DOEHEALTH_DESK_PRODUCT_INK;
const CARD = DOEHEALTH_DESK_PRODUCT_CARD;
const R = DOEHEALTH_DESK_RADIUS_PX;
const SHELL_HEX = SHELL.replace("#", "");
const DM = dmSans.style.fontFamily;
const INTER = inter.style.fontFamily;
const LARKEN = larkenLight.style.fontFamily;

const GLASS =
  "linear-gradient(in oklab 180deg, oklab(100% 0 0 / 72%) 0%, oklab(100% 0 0 / 12%) 42%, oklab(100% 0 0 / 0%) 100%), linear-gradient(in oklab 180deg, oklab(99% -0.001 0.015) 0%, oklab(92.6% 0.001 0.023) 100%)";

const smooth: CSSProperties = {
  boxSizing: "border-box",
  fontSynthesis: "none",
  MozOsxFontSmoothing: "grayscale",
  WebkitFontSmoothing: "antialiased",
};

function Head({
  eyebrow,
  title,
  dek,
  align = "split",
}: {
  eyebrow: string;
  title: readonly string[];
  dek: string;
  align?: "split" | "stack";
}) {
  return (
    <header className={`desk-feat__head${align === "stack" ? " is-stack" : ""}`}>
      <div>
        <p className={`desk-feat__eyebrow ${dmSans.className}`}>{eyebrow}</p>
        <h2 className={p22Mackinac.className}>
          {title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>
      </div>
      <p className={`desk-feat__dek ${inter.className}`}>{dek}</p>
    </header>
  );
}

/** Full product: hero shell, exact rail, cream dotted stage. */
function ProductFrame({ children }: { children: ReactNode }) {
  return (
    <div className="desk-product" aria-hidden>
      <DoeHealthDeskProductRail />
      <div className="desk-product__pad">
        <div className="desk-product__stage">{children}</div>
      </div>
    </div>
  );
}

function IconWell({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        width: 47,
        height: 47,
        borderRadius: R,
        background: "#FFFCF1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {children}
    </div>
  );
}

function SalmonTag({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        alignSelf: "flex-start",
        height: 22,
        paddingInline: 10,
        borderRadius: R,
        background: "#FED9C4",
        color: INK,
        fontFamily: INTER,
        fontSize: 12,
        fontWeight: 500,
        letterSpacing: "0.08em",
        lineHeight: "22px",
        textTransform: "uppercase",
      }}
    >
      {children}
    </span>
  );
}

function StrokeIcon({ children }: { children: ReactNode }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {children}
    </svg>
  );
}

function PhoneGlyph() {
  return (
    <StrokeIcon>
      <path d="M7 3h4l1.2 3.2-2 1.2a12 12 0 0 0 6.4 6.4l1.2-2L21 13v4a2 2 0 0 1-2.2 2A17 17 0 0 1 5 8.2 2 2 0 0 1 7 3z" />
    </StrokeIcon>
  );
}

function FileGlyph() {
  return (
    <StrokeIcon>
      <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </StrokeIcon>
  );
}

function CardGlyph() {
  return (
    <StrokeIcon>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10h18M7 15h4" />
    </StrokeIcon>
  );
}

function ShieldGlyph() {
  return (
    <StrokeIcon>
      <path d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6z" />
    </StrokeIcon>
  );
}

function CalendarGlyph() {
  return (
    <StrokeIcon>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 10h18" />
    </StrokeIcon>
  );
}

function MessageGlyph() {
  return (
    <StrokeIcon>
      <path d="M5 4h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-4 4V6a2 2 0 0 1 2-2z" />
    </StrokeIcon>
  );
}

/** A piece of the front desk inspector — not the whole app. */
function VoiceSection() {
  return (
    <section className={`desk-feat desk-feat--voice ${DOEPHONE_DESKTOP_PAGE_INSET_X}`} aria-label="Voice Agents">
      <div className="desk-feat__stage">
        <div>
          <Head
            eyebrow="Front desk"
            title={["Voice Agents."]}
            dek="Your model answers the clinic line, books the visit, and writes it to the chart."
          />
          <p className={`desk-feat__quote ${p22Mackinac.className}`}>I can move you to Thursday at 9:40.</p>
        </div>
        <aside className="desk-fragment" aria-hidden>
          <div style={{ ...smooth, color: "#FFFCF1", fontFamily: DM, fontSize: 32, letterSpacing: "-0.03em", lineHeight: 1 }}>Front Desk</div>
          <div style={{ ...smooth, flex: 1, minHeight: 0, display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ ...smooth, background: "#F8F4EB", color: INK, borderRadius: R, padding: "22px 20px 18px" }}>
              <div style={{ fontFamily: DM, fontSize: 64, letterSpacing: "-0.045em", lineHeight: 0.86 }}>9:40</div>
              <div style={{ marginTop: 14, fontFamily: DM, fontSize: 22, letterSpacing: "-0.03em" }}>Maya Chen</div>
              <div style={{ marginTop: 4, fontFamily: INTER, fontSize: 15, color: "rgb(40 25 16 / 58%)" }}>Moved from 8:14 · Dr. Shah</div>
              <div style={{ marginTop: 14 }}>
                <SalmonTag>Voice</SalmonTag>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 12px 1fr" }}>
              <Fact icon={<PhoneGlyph />} title="(416) 555-0190" />
              <span />
              <Fact icon={<FileGlyph />} title="In Athena" />
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Fact({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <div
      style={{
        ...smooth,
        minWidth: 0,
        borderRadius: R,
        background: "#FFFCF10F",
        boxShadow: "#00000026 0px 1px 2px inset",
        padding: "14px 12px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 10,
        minHeight: 108,
      }}
    >
      <div style={{ width: 32, height: 32, borderRadius: 8, background: "#F0CDB8", display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
      <div style={{ color: "#FFFCF1", fontFamily: DM, fontSize: 16, letterSpacing: "-0.03em", lineHeight: 1.15 }}>{title}</div>
    </div>
  );
}

const CLAIMS = [
  { who: "Maya Chen", what: "99214 · Office visit", amount: "$25 due", tag: "You owe" },
  { who: "J. Alvarez", what: "72148 · MRI, lumbar", amount: "$1,240", tag: "Sent" },
  { who: "L. Nguyen", what: "99213 · Office visit", amount: "$96", tag: "Paid" },
  { who: "A. Brooks", what: "36415 · Blood draw", amount: "$12", tag: "Paid" },
] as const;

/** Full product, opened on billing. */
function PaymentsSection() {
  return (
    <section className={`desk-feat desk-feat--pay ${DOEPHONE_DESKTOP_PAGE_INSET_X}`} aria-label="Healthcare payments, reimagined">
      <Head
        align="stack"
        eyebrow="Billing"
        title={["Healthcare payments,", "reimagined."]}
        dek="Your model posts the copay, sends the claim, and follows it until it is paid."
      />
      <ProductFrame>
        <div className="desk-product__split">
          <div className="desk-brown-panel" style={{ ...smooth }}>
            <div style={{ fontFamily: LARKEN, fontSize: 32, fontWeight: 400, letterSpacing: "-0.02em", lineHeight: "40px", color: "#FFFCF1" }}>Billing</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {CLAIMS.map((claim) => (
                <div
                  key={claim.who}
                  className="desk-claim-row"
                  style={{
                    ...smooth,
                    minHeight: 64,
                    borderRadius: R,
                    background: "#FFFCF10F",
                    boxShadow: "#00000026 0px 1px 2px inset",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "8px 14px 8px 8px",
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: R,
                      border: "1px solid #FFFCF1EB",
                      backgroundImage: GLASS,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <CardGlyph />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: "#FFFCF1", fontFamily: DM, fontSize: 18, letterSpacing: "-0.03em" }}>{claim.who}</div>
                    <div style={{ color: "#FFFCF1B3", fontFamily: INTER, fontSize: 13 }}>{claim.what}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: "#FFFCF1", fontFamily: DM, fontSize: 16, letterSpacing: "-0.03em" }}>{claim.amount}</div>
                    <div style={{ marginTop: 4, color: "#FED9C4", fontFamily: INTER, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" }}>{claim.tag}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="desk-product__canvas">
            <div style={{ ...smooth, width: "min(100%, 320px)", background: "#F8F4EB", backgroundImage: "linear-gradient(in oklab 180deg, oklab(95.1% 0.002 0.017) 0%, oklab(96.8% .0007 0.013) 68%)", borderRadius: R, padding: 22, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <IconWell>
                  <CardGlyph />
                </IconWell>
                <div style={{ flex: 1, color: INK, fontFamily: DM, fontSize: 25, letterSpacing: "-0.03em" }}>Westfield</div>
              </div>
              <div style={{ height: 1, background: `#${SHELL_HEX}1F` }} />
              <div style={{ color: `#${SHELL_HEX}B8`, fontFamily: INTER, fontSize: 16, lineHeight: "22px" }}>Maya Chen · Thu, Mar 12. Office visit 99214, Aetna paid $23.</div>
              <SalmonTag>Statement</SalmonTag>
              <div style={{ marginTop: 8, height: 40, borderRadius: R, background: "#FCCFB8", display: "flex", alignItems: "center", justifyContent: "center", color: INK, fontFamily: DM, fontSize: 15, fontWeight: 500 }}>Pay $25.00</div>
            </div>
          </div>
        </div>
      </ProductFrame>
    </section>
  );
}

const NOTE_ACTIONS = [
  { icon: <ShieldGlyph />, name: "Prior auth", detail: "MRI, lumbar · Aetna", state: "Filed" },
  { icon: <FileGlyph />, name: "Referral", detail: "Cardiology · latest note", state: "Faxed" },
  { icon: <CalendarGlyph />, name: "Follow-up", detail: "Thursday, 9:40 · Dr. Shah", state: "Booked" },
  { icon: <MessageGlyph />, name: "Patient", detail: "Visit summary, plain language", state: "Texted" },
] as const;

/** A note card and the work it started — a piece of the product, not the shell. */
function ScribeSection() {
  return (
    <section className={`desk-feat desk-feat--scribe ${DOEPHONE_DESKTOP_PAGE_INSET_X}`} aria-label="More than Just a Scribe">
      <Head
        align="stack"
        eyebrow="Charting"
        title={["More than", "Just a Scribe"]}
        dek="Your model writes the note, then does the work the note asks for."
      />
      <div className="desk-feat__stage">
        <article className="desk-note-card" aria-hidden>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <IconWell>
              <FileGlyph />
            </IconWell>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: INK, fontFamily: DM, fontSize: 25, letterSpacing: "-0.03em", lineHeight: "30px" }}>Diabetes follow-up</div>
              <div style={{ color: `#${SHELL_HEX}B8`, fontFamily: INTER, fontSize: 14 }}>Maya Chen · Thu 9:40</div>
            </div>
          </div>
          <div style={{ height: 1, background: `#${SHELL_HEX}1F` }} />
          <p style={{ margin: 0, color: `#${SHELL_HEX}B8`, fontFamily: INTER, fontSize: 17, lineHeight: "24px" }}>
            Feeling better on metformin. A1C 8.4, down from 9.1. Continue 90 days, MRI of the lumbar spine, refer to cardiology, return Thursday at 9:40.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <SalmonTag>Athena</SalmonTag>
            <SalmonTag>Signed</SalmonTag>
          </div>
        </article>
        <div className="desk-brown-panel desk-brown-panel--list" aria-hidden style={{ ...smooth }}>
          <div style={{ fontFamily: LARKEN, fontSize: 28, letterSpacing: "-0.02em", color: "#FFFCF1", lineHeight: "36px" }}>From this note</div>
          {NOTE_ACTIONS.map((action) => (
            <div
              key={action.name}
              style={{
                ...smooth,
                minHeight: 64,
                borderRadius: R,
                background: "#FFFCF10F",
                boxShadow: "#00000026 0px 1px 2px inset",
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "8px 14px 8px 8px",
              }}
            >
              <div style={{ width: 48, height: 48, borderRadius: R, border: "1px solid #FFFCF1EB", backgroundImage: GLASS, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {action.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: "#FFFCF1", fontFamily: DM, fontSize: 18, letterSpacing: "-0.03em" }}>{action.name}</div>
                <div style={{ color: "#FFFCF1B3", fontFamily: INTER, fontSize: 13 }}>{action.detail}</div>
              </div>
              <span style={{ color: "#FED9C4", fontFamily: INTER, fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase" }}>{action.state}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Full product, opened on the workflow canvas. */
function BuilderSection() {
  return (
    <section className={`desk-feat desk-feat--build ${DOEPHONE_DESKTOP_PAGE_INSET_X}`} aria-label="Drag and drop your intelligence">
      <Head
        align="stack"
        eyebrow="Builder"
        title={["Drag and drop", "your intelligence."]}
        dek="Place a step where the clinic needs it. Your model runs it the same way every time."
      />
      <ProductFrame>
        <div className="desk-product__canvas" style={{ position: "relative", minHeight: 420 }}>
          <div className="desk-publish" style={{ position: "absolute", top: 4, right: 4, height: 40, borderRadius: R, background: "#FCCFB8", display: "flex", alignItems: "center", overflow: "hidden" }}>
            <div style={{ padding: "0 14px 0 16px", color: INK, fontFamily: DM, fontSize: 15, fontWeight: 500 }}>Publish</div>
            <div style={{ width: 1, height: 16, background: `#${SHELL_HEX}33` }} />
            <div style={{ width: 34, height: 40, display: "flex", alignItems: "center", justifyContent: "center", color: INK }}>
              <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
                <path d="M2.2 4.2 6 8l3.8-3.8" fill="none" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, paddingTop: 28 }}>
            <FlowCard icon={<PhoneGlyph />} title="Call comes in" body="(416) 555-0190" tag="Voice" />
            <div style={{ width: 2, height: 28, background: "#C5C0B6" }} />
            <div className="desk-flow-row">
              <FlowCard icon={<CalendarGlyph />} title="Book the visit" body="Next open slot" tag="Schedule" />
              <FlowCard icon={<ShieldGlyph />} title="Prior auth" body="Aetna · MRI" tag="Voice Agent" />
            </div>
          </div>
        </div>
      </ProductFrame>
    </section>
  );
}

function FlowCard({ icon, title, body, tag }: { icon: ReactNode; title: string; body: string; tag: string }) {
  return (
    <div style={{ ...smooth, width: "min(100%, 280px)", background: "#F8F4EB", borderRadius: R, padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <IconWell>{icon}</IconWell>
        <div style={{ color: INK, fontFamily: DM, fontSize: 22, letterSpacing: "-0.03em", lineHeight: "26px" }}>{title}</div>
      </div>
      <div style={{ height: 1, background: `#${SHELL_HEX}1F` }} />
      <div style={{ color: `#${SHELL_HEX}B8`, fontFamily: INTER, fontSize: 15, lineHeight: "20px" }}>{body}</div>
      <SalmonTag>{tag}</SalmonTag>
    </div>
  );
}

const VERSIONS = [
  { name: "1.0", detail: "Mar 2 · First Genome" },
  { name: "1.1", detail: "Mar 9 · Running now" },
  { name: "1.2", detail: "Sunday · Writing" },
] as const;

const CHANGES = [
  { label: "Greeting", after: "Westfield, this is the front desk." },
  { label: "Prior auth", after: "Member ID, then the MRI order." },
  { label: "No-show", after: "Reopen the slot, then text." },
] as const;

/** The workflows strip, retitled as the genome — a part, not the app. */
function LearningSection() {
  return (
    <section className={`desk-feat desk-feat--learn ${DOEPHONE_DESKTOP_PAGE_INSET_X}`} aria-label="Continuous Learning">
      <Head
        eyebrow="Genome"
        title={["Continuous", "Learning"]}
        dek="Every Sunday, the week’s finished work is written into the next Genome."
      />
      <div className="desk-genome-bar" aria-hidden>
        <div style={{ fontFamily: LARKEN, fontSize: 28, letterSpacing: "-0.02em", color: "#FFFCF1", lineHeight: "36px" }}>Genome</div>
        <div className="desk-genome-bar__versions">
          {VERSIONS.map((version) => (
            <div key={version.name} style={{ ...smooth, borderRadius: R, background: CARD, padding: "16px 16px 14px", minHeight: 112 }}>
              <div style={{ color: "#FFFCF1", fontFamily: DM, fontSize: 28, letterSpacing: "-0.04em" }}>{version.name}</div>
              <div style={{ marginTop: 6, color: "#FFFCF1B3", fontFamily: INTER, fontSize: 13 }}>{version.detail}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {CHANGES.map((change) => (
            <div
              key={change.label}
              className="desk-change-row"
              style={{
                ...smooth,
                minHeight: 56,
                borderRadius: R,
                background: "#FFFCF10F",
                boxShadow: "#00000026 0px 1px 2px inset",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                padding: "10px 16px",
              }}
            >
              <span style={{ color: "#FED9C4", fontFamily: INTER, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" }}>{change.label}</span>
              <span style={{ color: "#FFFCF1", fontFamily: DM, fontSize: 16, letterSpacing: "-0.03em", textAlign: "right" }}>{change.after}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Voice through learning. Full product frames reuse the hero rail; the others are a piece of the product. */
export function DoeHealthDeskFeatureSections() {
  return (
    <>
      <VoiceSection />
      <PaymentsSection />
      <ScribeSection />
      <BuilderSection />
      <LearningSection />
    </>
  );
}
