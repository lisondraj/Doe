import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

import { inter, suisseIntl } from "@/remotion/fonts";

export function IntroChatMoment({
  userLine,
  aiLine,
  toolLabel,
  delay = 10,
}: {
  userLine: string;
  aiLine: string;
  toolLabel?: string;
  delay?: number;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const user = spring({ frame: frame - delay, fps, config: { damping: 200, stiffness: 105 } });
  const ai = spring({ frame: frame - delay - 12, fps, config: { damping: 200, stiffness: 92 } });
  const tool = spring({ frame: frame - delay - 24, fps, config: { damping: 200, stiffness: 115 } });

  return (
    <div className="motion4-chat-moment">
      <div
        className={`motion4-chat-moment__user ${inter.className}`}
        style={{
          opacity: user,
          transform: `translateY(${(1 - user) * 20}px) scale(${interpolate(user, [0, 1], [0.97, 1])})`,
        }}
      >
        {userLine}
      </div>
      <div
        className="motion4-chat-moment__ai-row"
        style={{
          opacity: ai,
          transform: `translateX(${(1 - ai) * -16}px) translateY(${(1 - ai) * 14}px)`,
        }}
      >
        <div className="motion4-chat-moment__avatar" aria-hidden />
        <p className={`motion4-chat-moment__ai ${inter.className}`}>{aiLine}</p>
      </div>
      {toolLabel ? (
        <div
          className={`motion4-chat-moment__tool ${suisseIntl.className}`}
          style={{
            opacity: tool,
            transform: `translateY(${(1 - tool) * 10}px)`,
          }}
        >
          <span className="motion4-chat-moment__tool-icon" aria-hidden>
            ⚙
          </span>
          {toolLabel}
        </div>
      ) : null}
    </div>
  );
}
