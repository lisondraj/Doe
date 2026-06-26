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
    integrations: [] as const,
  },
] as const;

export function JoinHeroAiChatPreview({ variant }: { variant: "mobile" | "desktop" }) {
  if (variant === "mobile") return null;

  return (
    <div
      className={`pointer-events-none absolute z-[2] flex flex-col ${suisseIntl.className}`}
      aria-hidden
      style={{
        top: "clamp(1.5rem, 4vh, 2.75rem)",
        right: "clamp(1.25rem, 2.8vw, 2.5rem)",
        bottom: "clamp(1.5rem, 4vh, 2.75rem)",
        width: "min(28rem, 46%)",
        justifyContent: "space-between",
        gap: "1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.1rem",
          flex: 1,
          minHeight: 0,
          justifyContent: "center",
        }}
      >
        {MESSAGES.map((msg) =>
          msg.role === "user" ? (
            <div key={msg.id} style={{ display: "flex", justifyContent: "flex-end" }}>
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: "1rem 1rem 0.35rem 1rem",
                  padding: "0.85rem 1rem",
                  maxWidth: "78%",
                }}
              >
                <p
                  style={{
                    fontSize: "clamp(0.78rem, 1.05vw, 0.92rem)",
                    color: "#1E343A",
                    lineHeight: 1.55,
                  }}
                >
                  {msg.text}
                </p>
              </div>
            </div>
          ) : (
            <div key={msg.id} style={{ display: "flex", justifyContent: "flex-start" }}>
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: "1rem 1rem 1rem 0.35rem",
                  padding: "0.9rem 1rem",
                  maxWidth: "84%",
                }}
              >
                {msg.lines.map((line, i) => (
                  <p
                    key={line}
                    style={{
                      fontSize: "clamp(0.78rem, 1.05vw, 0.92rem)",
                      color: "#1E343A",
                      lineHeight: 1.55,
                      marginTop: i > 0 ? "0.55rem" : 0,
                    }}
                  >
                    {line}
                  </p>
                ))}
                {msg.integrations.length > 0 ? (
                  <div
                    style={{
                      display: "flex",
                      gap: "0.4rem",
                      flexWrap: "wrap",
                      marginTop: "0.65rem",
                    }}
                  >
                    {msg.integrations.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: "clamp(0.62rem, 0.85vw, 0.72rem)",
                          fontWeight: 500,
                          background: "#F0EDE8",
                          color: "#78716C",
                          borderRadius: "0.35rem",
                          padding: "0.2rem 0.5rem",
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

      <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", flexShrink: 0 }}>
        <div
          style={{
            flex: 1,
            background: "#FFFFFF",
            borderRadius: "0.65rem",
            padding: "0.75rem 0.9rem",
            minHeight: "2.75rem",
            display: "flex",
            alignItems: "center",
          }}
        >
          <p
            style={{
              fontSize: "clamp(0.72rem, 0.95vw, 0.84rem)",
              color: "#A8A29E",
            }}
          >
            Describe a tool or change to your workflow…
          </p>
        </div>
        <div
          style={{
            width: "2.1rem",
            height: "2.1rem",
            borderRadius: "0.55rem",
            background: "#D2774C",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 10 10" fill="none" aria-hidden>
            <path
              d="M1 5h8M5 1l4 4-4 4"
              stroke="#fff"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
