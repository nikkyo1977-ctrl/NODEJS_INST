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

  // Mostra sempre il prompt '$' e il testo digitato
  const promptChar = text.startsWith("$") ? "$" : ">";
  const typedBody = t.visible.startsWith("$ ")
    ? t.visible.slice(2)
    : t.visible.startsWith("$")
    ? t.visible.slice(1)
    : t.visible;

  return (
    <div
      style={{
        height: 56,
        minHeight: 56,
        maxHeight: 56,
        flex: "none",
        borderTop: "1px solid " + color.line,
        paddingTop: space.sm,
        display: "flex",
        alignItems: "center",
        gap: space.xs,
        opacity: started ? 1 : 0,
        ...type.mono,
        color: color.text,
        boxSizing: "border-box",
        lineHeight: "36px",
      }}
    >
      <span style={{ color: color.accent, flex: "none" }}>{promptChar} </span>
      <span style={{ whiteSpace: "pre" }}>{typedBody}</span>
      <span
        style={{
          display: "inline-block",
          width: 14,
          height: 30,
          backgroundColor: t.caret ? color.accent : "transparent",
          marginLeft: 2,
          flex: "none",
          verticalAlign: "middle",
        }}
      />
    </div>
  );
};
