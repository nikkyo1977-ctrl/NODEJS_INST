import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Terminal, TerminalLine } from "../components/Terminal";
import { DUR, fadeIn, pulse, wipe } from "../design/motion";
import { color, space, type } from "../design/tokens";

const INSTALL: TerminalLine[] = [
  { kind: "command", text: "winget install OpenJS.NodeJS.LTS" },
  { kind: "ok", text: "Node.js v22 LTS installed" },
];

export const Scene7CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const titleAt = 10;
  const subtitleAt = 40;
  const terminalAt = 90;
  const taglineAt = 220;

  // la griglia si spegne mentre resta la chiusura
  const gridFade = 1 - fadeIn(frame, 240, DUR.slow).opacity;
  const gridImage =
    "linear-gradient(to right, " +
    color.line +
    " 1px, transparent 1px), " +
    "linear-gradient(to bottom, " +
    color.line +
    " 1px, transparent 1px)";

  return (
    <AbsoluteFill style={{ backgroundColor: color.bg }}>
      <AbsoluteFill
        style={{
          backgroundImage: gridImage,
          backgroundSize: "64px 64px",
          opacity: 0.55 * gridFade,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 45%, " +
            color.accentDim +
            " 0%, transparent 55%)",
          opacity: 0.35 + pulse(frame, 90) * 0.25,
        }}
      />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: space.lg,
          padding: 80,
        }}
      >
        <div
          style={{
            ...type.display,
            color: color.text,
            ...wipe(frame, titleAt, DUR.slow),
          }}
        >
          Install Node.js.
        </div>

        <div
          style={{
            ...type.h2,
            color: color.accent,
            ...wipe(frame, subtitleAt),
          }}
        >
          Unlock the future of FEM automation.
        </div>

        <div
          style={{
            width: 900,
            marginTop: space.lg,
            ...fadeIn(frame, terminalAt, DUR.base),
          }}
        >
          <Terminal lines={INSTALL} startAt={terminalAt} title="workstation" />
        </div>

        <div
          style={{
            ...type.bodyLg,
            color: color.textMute,
            marginTop: space.lg,
            ...wipe(frame, taglineAt),
          }}
        >
          One install. Infinite possibilities.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
