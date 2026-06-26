import { suisseIntl } from "@/lib/home/fonts";

/** Mini visual preview of the intake form that the AI built */
function IntakeFormPreview() {
  const fields = [
    { label: "Full name", w: "60%" },
    { label: "Date of birth", w: "44%" },
    { label: "Reason for visit", w: "100%", tall: true },
    { label: "Current medications", w: "100%" },
  ] as const;

  return (
    <div
      style={{
        background: "#F7F6F3",
        borderRadius: "0.65rem",
        padding: "0.7rem 0.75rem",
        marginBottom: "0.65rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.45rem",
      }}
    >
      <p
        style={{
          fontSize: "0.6rem",
          fontWeight: 600,
          color: "#1E343A",
          letterSpacing: "-0.01em",
          marginBottom: "0.15rem",
        }}
      >
        Pre-Visit Intake Form
      </p>
      {fields.map((f) => (
        <div key={f.label}>
          <div
            style={{
              fontSize: "0.5rem",
              color: "#9A9590",
              marginBottom: "0.2rem",
            }}
          >
            {f.label}
          </div>
          <div
            style={{
              width: f.w,
              height: "tall" in f && f.tall ? "1.6rem" : "0.9rem",
              background: "#FFFFFF",
              borderRadius: "0.3rem",
              border: "1px solid #EEEAE3",
            }}
          />
        </div>
      ))}
      <div
        style={{
          display: "flex",
          gap: "0.4rem",
          marginTop: "0.1rem",
          flexWrap: "wrap",
        }}
      >
        {["Epic EHR", "Insurance API", "Scheduler"].map((t) => (
          <span
            key={t}
            style={{
              fontSize: "0.5rem",
              fontWeight: 500,
              background: "#EEEAE3",
              color: "#78716C",
              borderRadius: "0.3rem",
              padding: "0.15rem 0.45rem",
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

const MESSAGES = [
  {
    id: "doc1",
    role: "user" as const,
    text: "Build me a pre-visit intake form. Pull the patient's chart from Epic, verify insurance, and send reminders through my scheduler.",
  },
  {
    id: "ai1",
    role: "ai" as const,
    formPreview: false,
    lines: [
      "Connected Epic EHR, your insurance API, and scheduler.",
      "Patients receive the form 48 h before their appointment.",
    ],
    integrations: ["Epic EHR", "Insurance API", "Scheduler"],
  },
  {
    id: "doc2",
    role: "user" as const,
    text: "Add a post-op pain questionnaire that flags anything above a 7.",
  },
  {
    id: "ai2",
    role: "ai" as const,
    formPreview: true,
    lines: [
      "Done. Scores above 7 trigger an inbox alert and add a follow-up task to your schedule.",
    ],
    integrations: [] as const,
  },
] as const;

const FS = "clamp(0.74rem, 1vw, 0.88rem)";
const FS_SM = "clamp(0.6rem, 0.8vw, 0.7rem)";

export function JoinHeroAiChatPreview({ variant }: { variant: "mobile" | "desktop" }) {
  if (variant === "mobile") return null;

  return (
    <div
      className={`pointer-events-none absolute z-[2] flex flex-col ${suisseIntl.className}`}
      aria-hidden
      style={{
        top: "50%",
        transform: "translateY(-50%)",
        right: "clamp(3rem, 8vw, 7rem)",
        width: "min(27rem, 40%)",
        gap: "0.9rem",
      }}
    >
      {/* Messages */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.85rem",
        }}
      >
        {MESSAGES.map((msg) =>
          msg.role === "user" ? (
            <div key={msg.id} style={{ display: "flex", justifyContent: "flex-end" }}>
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: "1rem 1rem 0.3rem 1rem",
                  padding: "0.75rem 0.9rem",
                  maxWidth: "80%",
                }}
              >
                <p style={{ fontSize: FS, color: "#1E343A", lineHeight: 1.5 }}>{msg.text}</p>
              </div>
            </div>
          ) : (
            <div key={msg.id} style={{ display: "flex", justifyContent: "flex-start" }}>
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: "1rem 1rem 1rem 0.3rem",
                  padding: "0.8rem 0.9rem",
                  maxWidth: "88%",
                }}
              >
                {"formPreview" in msg && msg.formPreview && <IntakeFormPreview />}
                {msg.lines.map((line, i) => (
                  <p
                    key={line}
                    style={{
                      fontSize: FS,
                      color: "#1E343A",
                      lineHeight: 1.5,
                      marginTop: i > 0 ? "0.45rem" : 0,
                    }}
                  >
                    {line}
                  </p>
                ))}
                {msg.integrations.length > 0 ? (
                  <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginTop: "0.55rem" }}>
                    {msg.integrations.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: FS_SM,
                          fontWeight: 500,
                          background: "#F0EDE8",
                          color: "#78716C",
                          borderRadius: "0.3rem",
                          padding: "0.18rem 0.45rem",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          ),
        )}
      </div>

      {/* Input box — chatbox style with model selector and toolbar */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "0.85rem",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {/* Model selector row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.45rem",
            padding: "0.5rem 0.7rem 0",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
              background: "#F7F6F3",
              borderRadius: "0.4rem",
              padding: "0.2rem 0.45rem",
            }}
          >
            <div
              style={{
                width: "0.55rem",
                height: "0.55rem",
                borderRadius: "50%",
                background: "linear-gradient(135deg,#E7A944,#D2774C)",
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: FS_SM, fontWeight: 500, color: "#1E343A" }}>Doe AI</span>
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden>
              <path d="M2 3l2 2 2-2" stroke="#9A9590" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Text area */}
        <div style={{ padding: "0.55rem 0.7rem" }}>
          <p style={{ fontSize: FS, color: "#A8A29E", lineHeight: 1.45 }}>
            Describe a tool or change to your workflow…
          </p>
        </div>

        {/* Toolbar row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 0.7rem 0.55rem",
            gap: "0.5rem",
          }}
        >
          {/* Left tools */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
            {/* Attach */}
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M13.5 8.5l-6 6a4 4 0 0 1-5.66-5.66l6-6a2.5 2.5 0 0 1 3.54 3.54l-5.3 5.3a1 1 0 0 1-1.42-1.42l5-5" stroke="#9A9590" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {/* Globe / integrations */}
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
              <circle cx="8" cy="8" r="6.5" stroke="#9A9590" strokeWidth="1.3" />
              <path d="M8 1.5C8 1.5 5 5 5 8s3 6.5 3 6.5M8 1.5C8 1.5 11 5 11 8s-3 6.5-3 6.5M1.5 8h13" stroke="#9A9590" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            {/* Workflow / tool */}
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
              <rect x="1.5" y="1.5" width="5" height="5" rx="1" stroke="#9A9590" strokeWidth="1.3" />
              <rect x="9.5" y="1.5" width="5" height="5" rx="1" stroke="#9A9590" strokeWidth="1.3" />
              <rect x="5.5" y="9.5" width="5" height="5" rx="1" stroke="#9A9590" strokeWidth="1.3" />
              <path d="M4 9.5V8a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1.5" stroke="#9A9590" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          </div>

          {/* Send */}
          <div
            style={{
              width: "1.75rem",
              height: "1.75rem",
              borderRadius: "0.45rem",
              background: "#D2774C",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="11" height="11" viewBox="0 0 10 10" fill="none" aria-hidden>
              <path d="M1 5h8M5 1l4 4-4 4" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
