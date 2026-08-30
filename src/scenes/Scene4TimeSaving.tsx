import React from "react";
import { useCurrentFrame } from "remotion";
import { SceneFrame, CONTENT_AT } from "../components/SceneFrame";
import { Terminal, TerminalLine } from "../components/Terminal";
import { Metric } from "../components/Metric";
import { Icon } from "../design/icons";
import { DUR, STAGGER, wipe } from "../design/motion";
import { color, radius, space, type } from "../design/tokens";

const MANUAL = [
  "Open browser",
  "Copy code",
  "Paste & edit",
  "Run & debug",
  "Repeat",
];

const SESSION: TerminalLine[] = [
  { kind: "command", text: 'codex "mesh bracket.inp, run, plot"' },
  { kind: "output", text: "reading bracket.inp" },
  { kind: "output", text: "generating mesh_param.py" },
  { kind: "output", text: "abaqus cae noGUI=mesh_param.py" },
  { kind: "ok", text: "job completed — results.odb" },
];

export const Scene4TimeSaving: React.FC = () => {
  const frame = useCurrentFrame();
  const firstManualAt = CONTENT_AT;
  const terminalAt = CONTENT_AT + DUR.base;
  const metricAt = 300;

  return (
    <SceneFrame
      index={4}
      eyebrow="Time Saving"
      title="Five steps, or one command"
    >
      <div style={{ display: "flex", gap: space.xxl, flex: 1, minHeight: 0 }}>
        <div
          style={{
            flex: 0.8,
            display: "flex",
            flexDirection: "column",
            gap: space.xs,
          }}
        >
          <div
            style={{
              ...type.label,
              color: color.bad,
              marginBottom: space.xs,
            }}
          >
            Manual
          </div>
          {MANUAL.map((step, i) => {
            const at = firstManualAt + i * STAGGER.tight;
            return (
              <div
                key={i}
                style={{
                  border: "1px solid " + color.line,
                  borderRadius: radius.sm,
                  padding: space.xs + "px " + space.md + "px",
                  ...type.body,
                  color: color.textMute,
                  ...wipe(frame, at),
                }}
              >
                {step}
              </div>
            );
          })}
          <div
            style={{
              marginTop: space.md,
              display: "flex",
              alignItems: "center",
              gap: space.sm,
              ...wipe(frame, firstManualAt + 5 * STAGGER.tight),
            }}
          >
            <Icon
              name="refresh"
              size={32}
              color={color.bad}
              frame={frame}
              drawAt={firstManualAt + 5 * STAGGER.tight}
            />
            <span style={{ ...type.small, color: color.bad }}>
              and back to the start
            </span>
          </div>
        </div>

        <div
          style={{
            flex: 1.4,
            display: "flex",
            flexDirection: "column",
            gap: space.md,
          }}
        >
          <div style={{ ...type.label, color: color.accent }}>Agentic</div>
          <Terminal
            lines={SESSION}
            startAt={terminalAt}
            title="workstation — codex"
          />
          <div style={{ marginTop: space.md }}>
            <Metric
              to={1}
              from={5}
              label="steps to a running simulation"
              at={metricAt}
            />
          </div>
        </div>
      </div>
    </SceneFrame>
  );
};
