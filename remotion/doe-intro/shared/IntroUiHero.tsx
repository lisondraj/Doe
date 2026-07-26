import type { CSSProperties, ReactNode } from "react";

import { useIntroPanelEnter, useIntroPanelExit, useIntroSceneBlurExit, useIntroSceneCrossfade } from "../intro-transitions";

export function IntroUiHero({
  children,
  className = "",
  delay = 6,
  heroScale = 1,
  skipEnter = false,
  skipSceneCrossfade = false,
  skipSceneExit = false,
  style,
  origin = "center center",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  heroScale?: number;
  skipEnter?: boolean;
  /** Handoff scenes drive their own enter opacity — avoid stacking fades. */
  skipSceneCrossfade?: boolean;
  /** Final scene — hold through end without panel exit. */
  skipSceneExit?: boolean;
  style?: CSSProperties;
  origin?: string;
}) {
  const sceneCrossfade = useIntroSceneCrossfade();
  const sceneOpacity = skipSceneCrossfade ? 1 : sceneCrossfade;
  const enterSpring = useIntroPanelEnter(delay);
  const enter = skipEnter ? { y: 0, opacity: 1, scale: 1 } : enterSpring;
  const exitSpring = useIntroPanelExit();
  const exit = skipSceneExit ? { y: 0, opacity: 1, scale: 1 } : exitSpring;
  const blurExitSpring = useIntroSceneBlurExit();
  const blurExit = skipSceneExit ? { blur: 0, scale: 1, opacity: 1 } : blurExitSpring;

  const panelOpacity = sceneOpacity * enter.opacity * exit.opacity * blurExit.opacity;
  const panelScale = enter.scale * exit.scale * heroScale * blurExit.scale;

  return (
    <div
      className={`motion4-ui-hero${className ? ` ${className}` : ""}`}
      style={{
        opacity: panelOpacity,
        transform: `translateY(${enter.y + exit.y}px) scale(${panelScale})`,
        filter: blurExit.blur > 0 ? `blur(${blurExit.blur}px)` : undefined,
        transformOrigin: origin,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
