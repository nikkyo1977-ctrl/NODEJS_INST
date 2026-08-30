import React from "react";
import { useCurrentFrame } from "remotion";
import { SceneFrame, CONTENT_AT } from "../components/SceneFrame";
import { Icon, IconName } from "../design/icons";
import { DUR, pulse, STAGGER, wipe } from "../design/motion";
import { color, radius, space, type } from "../design/tokens";

const STEPS: { text: string; icon: IconName; isError?: boolean }[] = [
  { text: "Open ChatGPT", icon: "cloud" },
  { text: "Copy-paste code", icon: "document" },
  { text: "Edit script manually", icon: "file" },
  { text: "Run in Abaqus", icon: "cpu" },
  { text: "Error? Repeat.", icon: "refresh", isError: true },
];

export const Scene1Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const firstStepAt = CONTENT_AT;
  const loopAt = firstStepAt + STEPS.length * STAGGER.loose + DUR.base;
  const subtitleAt = loopAt + DUR.slow;

  // secondo giro accelerato: il ciclo si rilegge, ed è questo il messaggio
  const highlighted =
    frame < loopAt ? -1 : Math.floor((frame - loopAt) / 8) % STEPS.length;

  return (
    <SceneFrame index={1} eyebrow="The Problem" title="Your FEM workflow today">
      <div
        style={{
          display: "flex",
          flex: 1,
          alignItems: "center",
          gap: space.xxl,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: space.sm,
            flex: 1,
          }}
        >
          {STEPS.map((step, i) => {
            const at = firstStepAt + i * STAGGER.loose;
            const active = highlighted === i;
            const glow = step.isError ? pulse(frame, 60) : 0;
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: space.md,
                  padding: space.sm + "px " + space.lg + "px",
                  backgroundColor: color.surface,
                  border:
                    "1px solid " +
                    (step.isError
                      ? color.bad
                      : active
                      ? color.accentDim
                      : color.line),
                  borderRadius: radius.md,
                  boxShadow: step.isError
                    ? "0 0 " + (12 + glow * 24) + "px " + color.bad + "40"
                    : "none",
                  ...wipe(frame, at),
                }}
              >
                <Icon
                  name={step.icon}
                  size={38}
                  color={step.isError ? color.bad : color.textMute}
                  frame={frame}
                  drawAt={at}
                />
                <span
                  style={{
                    ...type.bodyLg,
                    color: step.isError ? color.bad : color.text,
                  }}
                >
                  {step.text}
                </span>
              </div>
            );
          })}
        </div>

        {/* l'anello che chiude il ciclo: dall'ultimo passo torna al primo */}
        <div
          style={{
            flex: "none",
            width: 160,
            height: 420,
            position: "relative",
            ...wipe(frame, loopAt),
          }}
        >
          <svg width={160} height={420} viewBox="0 0 160 420" fill="none">
            <path
              d="M0 390 H120 A40 40 0 0 0 120 30 H0"
              pathLength="1"
              stroke={color.bad}
              strokeWidth={3}
              strokeDasharray={1}
              strokeDashoffset={Math.max(0, 1 - (frame - loopAt) / DUR.slow)}
              fill="none"
            />
            <path
              d="M0 30 l18 -10 M0 30 l18 10"
              stroke={color.bad}
              strokeWidth={3}
              pathLength="1"
            />
          </svg>
        </div>
      </div>

      <div
        style={{
          ...type.h2,
          color: color.textMute,
          ...wipe(frame, subtitleAt),
        }}
      >
        Manual. Repetitive. Error-prone.
      </div>
    </SceneFrame>
  );
};
