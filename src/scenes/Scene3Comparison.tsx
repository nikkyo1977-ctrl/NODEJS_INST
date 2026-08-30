import React from "react";
import { useCurrentFrame } from "remotion";
import { SceneFrame, CONTENT_AT } from "../components/SceneFrame";
import { Metric } from "../components/Metric";
import { Icon } from "../design/icons";
import { DUR, STAGGER, wipe } from "../design/motion";
import { color, radius, space, type } from "../design/tokens";

const ROWS = [
  { label: "Filesystem access", bad: "None", good: "Direct read / write" },
  { label: "Execution", bad: "Copy-paste", good: "Runs commands directly" },
  {
    label: "Simulation files",
    bad: "Manual transfer",
    good: "Reads & writes natively",
  },
  {
    label: "Abaqus integration",
    bad: "Impossible",
    good: "Direct CLI execution",
  },
  { label: "Context", bad: "Limited window", good: "Full codebase awareness" },
  { label: "Data location", bad: "Cloud", good: "Local, via Node.js" },
];

export const Scene3Comparison: React.FC = () => {
  const frame = useCurrentFrame();
  const headerAt = CONTENT_AT;
  const firstRowAt = CONTENT_AT + DUR.fast;
  const metricAt = firstRowAt + ROWS.length * STAGGER.loose + DUR.base;

  return (
    <SceneFrame
      index={3}
      eyebrow="Comparison"
      title="ChatGPT App vs Codex CLI"
      command="$ codex --help"
      commandAt={metricAt + DUR.slow}
    >
      <div
        style={{
          display: "flex",
          ...type.label,
          color: color.textFaint,
          paddingBottom: space.sm,
          height: 32,
          lineHeight: "32px",
          boxSizing: "border-box",
          ...wipe(frame, headerAt),
        }}
      >
        <div style={{ flex: 1.4 }} />
        <div style={{ flex: 1 }}>ChatGPT App</div>
        <div style={{ flex: 1 }}>Codex CLI</div>
      </div>

      {ROWS.map((row, i) => {
        const at = firstRowAt + i * STAGGER.loose;
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              height: 48,
              boxSizing: "border-box",
              borderBottom: "1px solid " + color.line,
              ...wipe(frame, at),
            }}
          >
            <div
              style={{
                flex: 1.4,
                ...type.body,
                color: color.textMute,
                fontWeight: 500,
              }}
            >
              {row.label}
            </div>
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                gap: space.sm,
                ...type.body,
                color: color.textFaint,
              }}
            >
              <Icon
                name="cross"
                size={30}
                color={color.bad}
                frame={frame}
                drawAt={at}
              />
              {row.bad}
            </div>
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                gap: space.sm,
                ...type.body,
                color: color.text,
              }}
            >
              <Icon
                name="check"
                size={30}
                color={color.accent}
                frame={frame}
                drawAt={at + 3}
              />
              {row.good}
            </div>
          </div>
        );
      })}

      <div
        style={{
          marginTop: space.lg,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <div
          style={{
            borderRadius: radius.md,
            padding: space.md,
            border: "1px solid " + color.accentDim,
          }}
        >
          <Metric to={6} label="capabilities unlocked" at={metricAt} />
        </div>
      </div>
    </SceneFrame>
  );
};
