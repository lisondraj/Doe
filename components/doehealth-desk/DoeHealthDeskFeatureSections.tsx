import type { ReactNode } from "react";

import { DOEPHONE_DESKTOP_PAGE_INSET_X } from "@/lib/doephone/section-styles";
import { dmSans, inter, p22Mackinac } from "@/lib/home/fonts";

type IconName = "phone" | "calendar" | "file" | "check" | "send" | "shield" | "card" | "cross" | "message" | "person";

const ICON_PATHS: Record<IconName, ReactNode> = {
  phone: <path d="M7 3h4l1.2 3.2-2 1.2a12 12 0 0 0 6.4 6.4l1.2-2L21 13v4a2 2 0 0 1-2.2 2A17 17 0 0 1 5 8.2 2 2 0 0 1 7 3z" />,
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 10h18" />
    </>
  ),
  file: (
    <>
      <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </>
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  send: <path d="M4 12 20 4l-6 16-2.5-6.5z" />,
  shield: <path d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6z" />,
  card: (
    <>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10h18M7 15h4" />
    </>
  ),
  cross: <path d="M10 4h4v6h6v4h-6v6h-4v-6H4v-4h6z" />,
  message: <path d="M5 4h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-4 4V6a2 2 0 0 1 2-2z" />,
  person: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
    </>
  ),
};

function Icon({ name, size = 16 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {ICON_PATHS[name]}
    </svg>
  );
}

function Tile({ name }: { name: IconName }) {
  return (
    <span className="desk-tile">
      <Icon name={name} />
    </span>
  );
}

function Head({ eyebrow, title, dek }: { eyebrow: string; title: readonly string[]; dek: string }) {
  return (
    <header className="desk-feat__head">
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

function Window({
  title,
  meta,
  action,
  bodyClassName,
  children,
}: {
  title: string;
  meta: string;
  action?: string;
  bodyClassName: string;
  children: ReactNode;
}) {
  return (
    <div className="desk-win" aria-hidden>
      <div className={`desk-win__bar ${dmSans.className}`}>
        <strong>{title}</strong>
        <span>{meta}</span>
        {action ? <em>{action}</em> : null}
      </div>
      <div className={`desk-win__body ${bodyClassName} ${inter.className}`}>{children}</div>
    </div>
  );
}

function Stat({ value, label, salmon }: { value: string; label: string; salmon?: boolean }) {
  return (
    <div className={`desk-stat${salmon ? " is-salmon" : ""}`}>
      <b className={dmSans.className}>{value}</b>
      <span>{label}</span>
    </div>
  );
}

const CALLS = [
  { time: "8:02", who: "New patient", out: "Booked Friday, 10:20", icon: "calendar" },
  { time: "8:14", who: "Maya Chen", out: "Moved to Thursday, 9:40", icon: "calendar", on: true },
  { time: "8:21", who: "CVS Pharmacy", out: "Transferred to the nurse", icon: "phone" },
  { time: "8:40", who: "R. Okonkwo", out: "Refill sent", icon: "send" },
  { time: "9:05", who: "Aetna", out: "Auth status given", icon: "shield" },
  { time: "9:12", who: "L. Nguyen", out: "Intake forms texted", icon: "message" },
] as const;

const MAYA_STEPS = [
  "Confirmed her date of birth",
  "Found Thursday, 9:40 with Dr. Shah",
  "Rebooked the visit in Athena",
  "Texted the confirmation",
] as const;

function VoiceSection() {
  return (
    <section className={`desk-feat ${DOEPHONE_DESKTOP_PAGE_INSET_X}`} aria-label="Voice Agents">
      <Head
        eyebrow="Front desk"
        title={["Voice Agents"]}
        dek="Your model answers the clinic line, books the visit, and writes it to the chart."
      />
      <Window title="Clinic line" meta="(416) 555-0190" bodyClassName="desk-voice">
        <div className="desk-card desk-voice__calls">
          <div className="desk-card__head">
            <strong className={dmSans.className}>Today</strong>
            <span>6 calls</span>
          </div>
          <ol>
            {CALLS.map((call) => (
              <li key={call.time} className={"on" in call && call.on ? "is-on" : undefined}>
                <time className={dmSans.className}>{call.time}</time>
                <div>
                  <strong className={dmSans.className}>{call.who}</strong>
                  <small>{call.out}</small>
                </div>
                <Tile name={call.icon} />
              </li>
            ))}
          </ol>
        </div>

        <div className="desk-card desk-voice__detail">
          <div className="desk-person">
            <span className={`desk-avatar ${dmSans.className}`}>MC</span>
            <div>
              <strong className={dmSans.className}>Maya Chen</strong>
              <small>8:14 AM · 2 min</small>
            </div>
          </div>
          <span className="desk-label desk-voice__label">What the line did</span>
          <ol className="desk-steps">
            {MAYA_STEPS.map((step) => (
              <li key={step}>
                <span className="desk-tile desk-tile--sm">
                  <Icon name="check" size={14} />
                </span>
                {step}
              </li>
            ))}
          </ol>
          <div className="desk-appt">
            <div>
              <span>Thursday</span>
              <b className={dmSans.className}>9:40</b>
            </div>
            <em>Dr. Shah · Westfield</em>
          </div>
        </div>

        <div className="desk-voice__stats">
          <Stat value="142" label="Calls answered this week" salmon />
          <Stat value="38" label="Visits booked" />
          <Stat value="0:04" label="Average hold" />
        </div>
      </Window>
    </section>
  );
}

const CLAIM_COLUMNS = [
  {
    name: "Submitted",
    claims: [
      { payer: "Aetna", code: "72148", who: "J. Alvarez", what: "MRI, lumbar", amount: "$1,240" },
      { payer: "BCBS", code: "99213", who: "S. Patel", what: "Office visit", amount: "$96" },
    ],
  },
  {
    name: "In review",
    claims: [
      { payer: "Aetna", code: "99214", who: "Maya Chen", what: "Office visit", amount: "$182", on: true },
      { payer: "Cigna", code: "93000", who: "R. Okonkwo", what: "ECG", amount: "$64" },
    ],
  },
  {
    name: "Paid",
    claims: [
      { payer: "UHC", code: "99213", who: "L. Nguyen", what: "Office visit", amount: "$96" },
      { payer: "Aetna", code: "36415", who: "A. Brooks", what: "Blood draw", amount: "$12" },
    ],
  },
] as const;

function PaymentsSection() {
  return (
    <section
      className={`desk-feat desk-feat--brown doehealth-desk-nav-wash-surface ${DOEPHONE_DESKTOP_PAGE_INSET_X}`}
      aria-label="Healthcare payments, reimagined"
    >
      <Head
        eyebrow="Billing"
        title={["Healthcare payments,", "reimagined."]}
        dek="Your model posts the copay, sends the claim, and follows it until it is paid."
      />
      <Window title="Billing" meta="Week of March 9" bodyClassName="desk-pay">
        <div className="desk-card desk-bill">
          <header>
            <strong className={dmSans.className}>Westfield Clinic</strong>
            <span>Statement · Mar 12</span>
          </header>
          <div className="desk-bill__who">
            <div>
              <span className="desk-label">Patient</span>
              <span>Maya Chen</span>
            </div>
            <div>
              <span className="desk-label">Visit</span>
              <span>Thu, Mar 12</span>
            </div>
          </div>
          <dl>
            <dt>Office visit · 99214</dt>
            <dd>$182.00</dd>
            <dt>Aetna adjustment</dt>
            <dd>−$134.00</dd>
            <dt>Aetna paid</dt>
            <dd>−$23.00</dd>
          </dl>
          <div className="desk-bill__total">
            <span>You owe</span>
            <b className={dmSans.className}>$25.00</b>
          </div>
          <div className={`desk-bill__pay ${dmSans.className}`}>
            <Icon name="card" />
            Pay $25.00
          </div>
          <small>Visa ending 4242 · Autopay on</small>
        </div>

        <div className="desk-claims">
          <div className="desk-claims__sum">
            <Stat value="$18,420" label="Collected this week" salmon />
            <Stat value="27" label="Claims out" />
            <Stat value="9 days" label="Average to paid" />
          </div>
          <div className="desk-claims__cols">
            {CLAIM_COLUMNS.map((column) => (
              <div key={column.name} className="desk-claims__col">
                <header className={dmSans.className}>
                  {column.name}
                  <span>{column.claims.length}</span>
                </header>
                {column.claims.map((claim) => (
                  <div key={claim.who} className={`desk-card desk-claim${"on" in claim && claim.on ? " is-on" : ""}`}>
                    <div>
                      <span>{claim.payer}</span>
                      <span>{claim.code}</span>
                    </div>
                    <strong className={dmSans.className}>{claim.who}</strong>
                    <small>{claim.what}</small>
                    <b className={dmSans.className}>{claim.amount}</b>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Window>
    </section>
  );
}

const NOTE_ACTIONS = [
  { icon: "shield", name: "Prior auth", detail: "MRI, lumbar · sent to Aetna", state: "Filed" },
  { icon: "cross", name: "Referral", detail: "Cardiology · with the latest note", state: "Faxed" },
  { icon: "calendar", name: "Follow-up", detail: "Thursday, 9:40 · Dr. Shah", state: "Booked" },
  { icon: "message", name: "Patient", detail: "Visit summary · plain language", state: "Texted" },
] as const;

function ScribeSection() {
  return (
    <section className={`desk-feat ${DOEPHONE_DESKTOP_PAGE_INSET_X}`} aria-label="More than Just a Scribe">
      <Head
        eyebrow="Charting"
        title={["More than", "Just a Scribe"]}
        dek="Your model writes the note, then does the work the note asks for."
      />
      <Window title="Visit note" meta="Maya Chen · Dr. Shah" bodyClassName="desk-scribe">
        <article className="desk-card desk-note">
          <header>
            <div>
              <strong className={dmSans.className}>Diabetes follow-up</strong>
              <small>Thu, Mar 12 · 9:40 · 18 min</small>
            </div>
            <span className="desk-avatar desk-avatar--sm">MC</span>
          </header>
          <section>
            <span className="desk-label">Subjective</span>
            <p>Feeling better on metformin. Low back pain for three weeks, worse when lifting.</p>
          </section>
          <section>
            <span className="desk-label">Assessment</span>
            <p>Type 2 diabetes, improving. A1C 8.4, down from 9.1. Lumbar pain, not better with rest.</p>
          </section>
          <section>
            <span className="desk-label">Plan</span>
            <ul>
              <li>Continue metformin for 90 days.</li>
              <li>
                <mark>MRI of the lumbar spine</mark>, needs prior auth.
              </li>
              <li>
                <mark>Refer to cardiology</mark> for the ECG finding.
              </li>
              <li>
                <mark>Return Thursday at 9:40.</mark>
              </li>
            </ul>
          </section>
          <footer>
            <span>Signed · Dr. Shah</span>
            <span>
              <Icon name="check" size={14} />
              Written to Athena
            </span>
          </footer>
        </article>

        <div className="desk-actions">
          <span className="desk-label">From this note</span>
          <ol>
            {NOTE_ACTIONS.map((action) => (
              <li key={action.name}>
                <div className="desk-card desk-action">
                  <Tile name={action.icon} />
                  <div>
                    <strong className={dmSans.className}>{action.name}</strong>
                    <small>{action.detail}</small>
                  </div>
                  <em>
                    <Icon name="check" size={14} />
                    {action.state}
                  </em>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Window>
    </section>
  );
}

const BLOCKS = [
  { group: "Connected", items: [
    { icon: "phone", name: "Clinic line" },
    { icon: "file", name: "Athena" },
    { icon: "shield", name: "Aetna" },
    { icon: "send", name: "Fax" },
  ] },
  { group: "Steps", items: [
    { icon: "shield", name: "Prior auth", lifted: true },
    { icon: "cross", name: "Referral" },
    { icon: "message", name: "Reminder" },
  ] },
] as const;

function Node({ icon, name, detail, className }: { icon: IconName; name: string; detail: string; className?: string }) {
  return (
    <div className={`desk-card desk-node${className ? ` ${className}` : ""}`}>
      <Tile name={icon} />
      <div>
        <strong className={dmSans.className}>{name}</strong>
        <small>{detail}</small>
      </div>
    </div>
  );
}

function BuilderSection() {
  return (
    <section
      className={`desk-feat desk-feat--brown doehealth-desk-nav-wash-surface ${DOEPHONE_DESKTOP_PAGE_INSET_X}`}
      aria-label="Drag and drop your intelligence"
    >
      <Head
        eyebrow="Builder"
        title={["Drag and drop", "your intelligence."]}
        dek="Place a step where the clinic needs it. Your model runs it the same way every time."
      />
      <Window title="Workflows" meta="Front Desk · Draft" action="Publish" bodyClassName="desk-build">
        <aside className="desk-build__side">
          {BLOCKS.map((block) => (
            <div key={block.group}>
              <span className="desk-label">{block.group}</span>
              <ul>
                {block.items.map((item) => (
                  <li key={item.name} className={"lifted" in item && item.lifted ? "is-lifted" : undefined}>
                    <Tile name={item.icon} />
                    {item.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </aside>

        <div className="desk-build__canvas">
          <Node icon="phone" name="Call comes in" detail="(416) 555-0190" />
          <i className="desk-wire" />
          <Node icon="file" name="Find the patient" detail="Athena" />
          <div className="desk-branch">
            <i />
            <i />
            <i />
            <i />
          </div>
          <div className="desk-build__row">
            <Node icon="calendar" name="Book the visit" detail="Next open slot" />
            <div className="desk-slot">
              Drop a step
              <Node icon="shield" name="Prior auth" detail="Aetna · MRI" className="desk-drag" />
              <svg className="desk-cursor" viewBox="0 0 24 24" aria-hidden>
                <path d="M5 3l14 8.2-6.1 1.4 3.6 6.6-2.6 1.4-3.6-6.6L5 18.2z" fill="#140C04" stroke="#FFFCF1" strokeWidth="1.4" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </Window>
    </section>
  );
}

const VERSIONS = [
  { name: "1.0", detail: "Mar 2 · First Genome", state: "past" },
  { name: "1.1", detail: "Mar 9 · Running now", state: "now" },
  { name: "1.2", detail: "Sunday · Writing", state: "next" },
] as const;

const CHANGES = [
  { label: "Greeting", before: "Thank you for calling.", after: "Westfield, this is the front desk." },
  { label: "Prior auth", before: "Ask for the order first.", after: "Member ID, then the MRI order." },
  { label: "No-show", before: "Mark the visit missed.", after: "Reopen the slot, then text." },
  { label: "Refills", before: "Send to the nurse.", after: "Metformin goes out for 90 days." },
] as const;

function LearningSection() {
  return (
    <section className={`desk-feat ${DOEPHONE_DESKTOP_PAGE_INSET_X}`} aria-label="Continuous Learning">
      <Head
        eyebrow="Genome"
        title={["Continuous", "Learning"]}
        dek="Every Sunday, the week’s finished work is written into the next Genome."
      />
      <Window title="Genome" meta="Westfield" bodyClassName="desk-learn">
        <div className="desk-card desk-versions">
          {VERSIONS.map((version) => (
            <div key={version.name} className={`desk-version is-${version.state}`}>
              <i />
              <div>
                <b className={dmSans.className}>{version.name}</b>
                <small>{version.detail}</small>
              </div>
            </div>
          ))}
        </div>

        <div className="desk-learn__grid">
          <div className="desk-card desk-diff">
            <div className="desk-card__head">
              <strong className={dmSans.className}>What changed in 1.1</strong>
              <span>4 edits</span>
            </div>
            <div className="desk-diff__cols">
              <span />
              <span className="desk-label">Before</span>
              <span className="desk-label">Now</span>
            </div>
            <ul>
              {CHANGES.map((change) => (
                <li key={change.label}>
                  <strong className={dmSans.className}>{change.label}</strong>
                  <s>{change.before}</s>
                  <span>{change.after}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="desk-learn__stats">
            <Stat value="412" label="Calls it learned from" salmon />
            <Stat value="86" label="Notes signed" />
            <Stat value="31" label="Claims paid" />
          </div>
        </div>
      </Window>
    </section>
  );
}

/** Sections from Voice Agents to Continuous Learning, each a view of the product. */
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
