import { suisseIntl } from "@/lib/home/fonts";

const MESSAGES = [
  {
    id: "doc1",
    role: "user" as const,
    text: "Build me a pre-visit intake form. It needs to pull the patient's chart from Epic, verify insurance automatically, and send them a reminder through my scheduling system.",
  },
  {
    id: "ai1",
    role: "ai" as const,
    lines: [
      "Connecting your integrations now.",
      "Pulling patient demographics and history from Epic · Verifying coverage via your insurance API · Linking your scheduler for automated reminders.",
      "Your intake form is ready. Patients will see it 48 hours before their appointment.",
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
    lines: [
      "Done. Scores above 7 will trigger an alert to your inbox and add a follow-up task to your schedule.",
    ],
    integrations: [],
  },
] as const;

const SCALE = 1.68;

export function JoinHeroAiChatPreview({ variant }: { variant: "mobile" | "desktop" }) {
  if (variant === "mobile") return null;

  return (
    <div
      className="pointer-events-none absolute z-[2]"
      aria-hidden
      style={{
        top: "6%",
        right: "calc(min(52rem, 94%) / -2)",
        bottom: "-2rem",
        width: "min(52rem, 94%)",
      }}
    >
      <div
        className={suisseIntl.className}
        style={{
          transform: `scale(${SCALE})`,
          transformOrigin: "top right",
          WebkitFontSmoothing: "antialiased",
        }}
      >
        <div
          style={{
            width: "100%",
          }}
        >
          {/* Messages — floating directly on the hero, no outer container */}
          <div
            style={{
              padding: "0.85rem 0.95rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            {MESSAGES.map((msg) =>
              msg.role === "user" ? (
                <div key={msg.id} style={{ display: "flex", justifyContent: "flex-end" }}>
                  <div
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #EEEAE3",
                      borderRadius: "0.75rem 0.75rem 0.2rem 0.75rem",
                      padding: "0.55rem 0.75rem",
                      maxWidth: "76%",
                    }}
                  >
                    <p style={{ fontSize: "0.6rem", color: "#1E343A", lineHeight: 1.5 }}>{msg.text}</p>
                  </div>
                </div>
              ) : (
                <div key={msg.id} style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                  <div
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #EEEAE3",
                      borderRadius: "0.75rem 0.75rem 0.75rem 0.2rem",
                      padding: "0.6rem 0.75rem",
                      maxWidth: "88%",
                    }}
                  >
                    {msg.lines.map((line, i) => (
                      <p
                        key={i}
                        style={{
                          fontSize: "0.6rem",
                          color: "#1E343A",
                          lineHeight: 1.5,
                          marginTop: i > 0 ? "0.4rem" : 0,
                        }}
                      >
                        {line}
                      </p>
                    ))}
                    {"integrations" in msg && msg.integrations.length > 0 && (
                      <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
                        {msg.integrations.map((tag) => (
                          <span
                            key={tag}
                            style={{
                              fontSize: "0.5rem",
                              fontWeight: 500,
                              background: "#F0EDE8",
                              color: "#78716C",
                              borderRadius: "0.3rem",
                              padding: "0.15rem 0.45rem",
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            )}
          </div>

          {/* Input — no outer background, floats on hero */}
          <div
            style={{
              padding: "0 0.95rem 0.65rem",
              display: "flex",
              alignItems: "center",
              gap: "0.55rem",
            }}
          >
            <div
              style={{
                flex: 1,
                background: "#F7F6F3",
                border: "1px solid #EEEAE3",
                borderRadius: "0.5rem",
                padding: "0.45rem 0.65rem",
              }}
            >
              <p style={{ fontSize: "0.56rem", color: "#A8A29E" }}>
                Describe a tool or change to your workflow…
              </p>
            </div>
            <div
              style={{
                width: "1.65rem",
                height: "1.65rem",
                borderRadius: "0.45rem",
                background: "#D2774C",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1 5h8M5 1l4 4-4 4" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
