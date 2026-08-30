import React from "react";
import { useCurrentFrame } from "remotion";
import { SceneFrame, CONTENT_AT } from "../components/SceneFrame";
import { Metric } from "../components/Metric";
import { Icon } from "../design/icons";
import { DUR, STAGGER, wipe } from "../design/motion";
import { color, space, type } from "../design/tokens";

const POINTS = [
  "Node.js runs 100% locally",
  "No simulation data leaves the machine",
  "No cloud dependency for execution",
  "IT maintains full control",
  "Open-source & fully auditable",
];

const TRUSTED = ["NASA", "NETFLIX", "PAYPAL"];

export const Scene5Security: React.FC = () => {
  const frame = useCurrentFrame();
  const shieldAt = CONTENT_AT;
  const firstPointAt = CONTENT_AT + DUR.base;
  const metricAt = firstPointAt + POINTS.length * STAGGER.loose + DUR.base;
  const trustedAt = metricAt + DUR.slow;

  return (
    <SceneFrame
      index={5}
      eyebrow="Security"
      title="Everything runs on your machine"
      command="$ netstat -an | findstr ESTABLISHED"
      commandAt={trustedAt + DUR.fast}
    >
      <div
        style={{
          display: "flex",
          gap: space.huge,
          flex: 1,
          alignItems: "center",
        }}
      >
        <div style={{ flex: "none", color: color.accent }}>
          <Icon name="shield" size={280} frame={frame} drawAt={shieldAt} />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: space.md,
            flex: 1,
          }}
        >
          {POINTS.map((point, i) => {
            const at = firstPointAt + i * STAGGER.loose;
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: space.md,
                  ...wipe(frame, at),
                }}
              >
                <Icon
                  name="check"
                  size={34}
                  color={color.accent}
                  frame={frame}
                  drawAt={at}
                />
                <span style={{ ...type.bodyLg, color: color.text }}>
                  {point}
                </span>
              </div>
            );
          })}

          <div style={{ marginTop: space.lg }}>
            <Metric to={100} suffix="%" label="local execution" at={metricAt} />
          </div>

          <div
            style={{
              display: "flex",
              gap: space.lg,
              marginTop: space.md,
              ...wipe(frame, trustedAt),
            }}
          >
            <span style={{ ...type.label, color: color.textFaint }}>
              Trusted by
            </span>
            {TRUSTED.map((name) => (
              <span key={name} style={{ ...type.label, color: color.textMute }}>
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </SceneFrame>
  );
};
