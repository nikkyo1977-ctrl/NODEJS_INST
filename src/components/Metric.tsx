import React from "react";
import { useCurrentFrame } from "remotion";
import { counter, DUR, fadeIn } from "../design/motion";
import { color, space, type } from "../design/tokens";

type Props = {
  to: number;
  from?: number;
  suffix?: string;
  label: string;
  at: number;
};

export const Metric: React.FC<Props> = ({
  to,
  from = 0,
  suffix,
  label,
  at,
}) => {
  const frame = useCurrentFrame();
  const value = counter(frame, at, to, from);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: space.md,
        ...fadeIn(frame, at, DUR.fast),
      }}
    >
      <span style={{ ...type.metric, color: color.accent }}>
        {value}
        {suffix ? <span style={{ fontSize: 72 }}>{suffix}</span> : null}
      </span>
      <span style={{ ...type.bodyLg, color: color.textMute }}>{label}</span>
    </div>
  );
};
