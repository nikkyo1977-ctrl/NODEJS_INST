import React from "react";
import { useCurrentFrame } from "remotion";
import { color, space, type } from "../design/tokens";
import { typing } from "./typing";

type Props = {
  /** massimo 64 caratteri: oltre, la riga eccede la larghezza utile */
  text: string;
  startAt: number;
};

export const CommandLine: React.FC<Props> = ({ text, startAt }) => {
  const frame = useCurrentFrame();
  const t = typing(frame, text, startAt);
  const started = frame >= startAt;

  return (
    <div
      style={{
        borderTop: "1px solid " + color.line,
        paddingTop: space.md,
        display: "flex",
        alignItems: "center",
        gap: space.xs,
        opacity: started ? 1 : 0,
        ...type.mono,
        color: color.text,
      }}
    >
      <span style={{ color: color.accent }}>{t.visible.slice(0, 1)}</span>
      <span>{t.visible.slice(1)}</span>
      {t.caret ? (
        <span
          style={{
            display: "inline-block",
            width: 14,
            height: 34,
            backgroundColor: color.accent,
            marginLeft: 2,
          }}
        />
      ) : null}
    </div>
  );
};
