import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { color, SAFE, space, type } from "../design/tokens";
import { DUR, extend, wipe } from "../design/motion";
import { CommandLine } from "./CommandLine";

/** ritmo di apertura identico in tutte e sette le scene */
const HEAD_EYEBROW_AT = 0;
const HEAD_TITLE_AT = 6;
const HEAD_RULE_AT = 12;
/** unica costante che le scene devono conoscere: quando inizia il contenuto */
export const CONTENT_AT = 30;

const GRID_STEP = 64;

type Props = {
  index: number;
  eyebrow: string;
  title: string;
  /** assente in Scena 1: la CLI entra quando entra Node.js */
  command?: string;
  commandAt?: number;
  children: React.ReactNode;
};

const pad = (n: number): string => (n < 10 ? "0" + n : String(n));

export const SceneFrame: React.FC<Props> = ({
  index,
  eyebrow,
  title,
  command,
  commandAt,
  children,
}) => {
  const frame = useCurrentFrame();

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
          backgroundSize: GRID_STEP + "px " + GRID_STEP + "px",
          opacity: 0.55,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, #0e1319 0%, transparent 60%)",
        }}
      />

      <AbsoluteFill
        style={{
          padding: SAFE.y + "px " + SAFE.x + "px",
          display: "flex",
          flexDirection: "column",
          color: color.text,
        }}
      >
        <div
          style={{
            ...type.label,
            color: color.textFaint,
            ...wipe(frame, HEAD_EYEBROW_AT, DUR.fast),
          }}
        >
          {pad(index)} / {eyebrow}
        </div>

        <div
          style={{
            ...type.h1,
            marginTop: space.sm,
            ...wipe(frame, HEAD_TITLE_AT),
          }}
        >
          {title}
        </div>

        <div
          style={{
            height: 3,
            marginTop: space.md,
            backgroundColor: color.accent,
            width: extend(frame, HEAD_RULE_AT, 120),
          }}
        />

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            marginTop: space.xl,
            minHeight: 0,
          }}
        >
          {children}
        </div>

        {command && typeof commandAt === "number" ? (
          <CommandLine text={command} startAt={commandAt} />
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
