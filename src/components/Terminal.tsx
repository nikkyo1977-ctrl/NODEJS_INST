import React from "react";
import { useCurrentFrame } from "remotion";
import { color, radius, space, type } from "../design/tokens";
import { STAGGER } from "../design/motion";
import { typing, typingFrames } from "./typing";

export type TerminalLine = {
  kind: "command" | "output" | "ok" | "err";
  text: string;
};

type Props = {
  lines: TerminalLine[];
  startAt: number;
  title?: string;
};

const colorFor = (kind: TerminalLine["kind"]): string => {
  if (kind === "command") return color.text;
  if (kind === "ok") return color.ok;
  if (kind === "err") return color.bad;
  return color.textMute;
};

export const Terminal: React.FC<Props> = ({ lines, startAt, title }) => {
  const frame = useCurrentFrame();

  // il comando si digita; l'output compare riga per riga dopo di esso
  let cursor = startAt;
  const schedule = lines.map((line) => {
    const at = cursor;
    cursor += line.kind === "command" ? typingFrames(line.text) : STAGGER.base;
    return at;
  });

  return (
    <div
      style={{
        backgroundColor: color.surface,
        border: "1px solid " + color.lineStrong,
        borderRadius: radius.md,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: space.xs,
          padding: space.sm + "px " + space.md + "px",
          borderBottom: "1px solid " + color.line,
          flex: "none",
          height: 48,
          boxSizing: "border-box",
        }}
      >
        <span
          style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: color.lineStrong,
          }}
        />
        <span
          style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: color.lineStrong,
          }}
        />
        <span
          style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: color.lineStrong,
          }}
        />
        <span
          style={{
            ...type.label,
            fontSize: 18,
            color: color.textFaint,
            marginLeft: space.xs,
          }}
        >
          {title ? title : "workstation"}
        </span>
      </div>

      <div
        style={{
          padding: space.md,
          display: "flex",
          flexDirection: "column",
          gap: space.xs,
        }}
      >
        {lines.map((line, i) => {
          const at = schedule[i];
          const isVisible = frame >= at;

          if (line.kind === "command") {
            const t = typing(frame, line.text, at);
            return (
              <div
                key={i}
                style={{
                  ...type.mono,
                  color: color.text,
                  opacity: isVisible ? 1 : 0,
                  height: 42,
                  lineHeight: "42px",
                  display: "flex",
                  alignItems: "center",
                  boxSizing: "border-box",
                }}
              >
                <span style={{ color: color.accent, flex: "none" }}>
                  {"$ "}
                </span>
                <span style={{ whiteSpace: "pre" }}>{t.visible}</span>
                <span
                  style={{
                    display: "inline-block",
                    width: 14,
                    height: 28,
                    backgroundColor:
                      t.caret && !t.done ? color.accent : "transparent",
                    marginLeft: 2,
                    flex: "none",
                    verticalAlign: "middle",
                  }}
                />
              </div>
            );
          }

          return (
            <div
              key={i}
              style={{
                ...type.mono,
                fontSize: 30,
                color: colorFor(line.kind),
                opacity: isVisible ? 1 : 0,
                height: 38,
                lineHeight: "38px",
                boxSizing: "border-box",
              }}
            >
              {line.kind === "output" ? "› " : ""}
              {line.text}
            </div>
          );
        })}
      </div>
    </div>
  );
};
