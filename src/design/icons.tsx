import React from "react";
import { draw } from "./motion";
import { STROKE } from "./tokens";

export const ICON_NAMES = [
  "check",
  "cross",
  "terminal",
  "file",
  "folder",
  "cloud",
  "cloudOff",
  "lock",
  "shield",
  "cpu",
  "package",
  "chart",
  "refresh",
  "bell",
  "wrench",
  "robot",
  "document",
] as const;

export type IconName = (typeof ICON_NAMES)[number];

/** tracciati su viewBox 24, disegnati con un solo stroke */
const PATHS: Record<IconName, string[]> = {
  check: ["M4 12.5l5 5L20 6.5"],
  cross: ["M6 6l12 12", "M18 6L6 18"],
  terminal: ["M4 5h16v14H4z", "M7.5 9.5l2.5 2.5-2.5 2.5", "M13 15h4"],
  file: ["M6 3h8l4 4v14H6z", "M14 3v4h4"],
  folder: ["M3 6h6l2 3h10v11H3z"],
  cloud: ["M7 18h10a4 4 0 000-8 6 6 0 00-11.7 1.6A3.5 3.5 0 007 18z"],
  cloudOff: ["M7 18h10a4 4 0 00.9-7.9A6 6 0 006 8.5", "M3 3l18 18"],
  lock: ["M6 11h12v9H6z", "M9 11V8a3 3 0 016 0v3"],
  shield: ["M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"],
  cpu: [
    "M7 7h10v10H7z",
    "M4 10h3",
    "M4 14h3",
    "M17 10h3",
    "M17 14h3",
    "M10 4v3",
    "M14 4v3",
    "M10 17v3",
    "M14 17v3",
  ],
  package: ["M12 3l8 4.5v9L12 21l-8-4.5v-9z", "M4 7.5l8 4.5 8-4.5", "M12 12v9"],
  chart: ["M4 20h16", "M7 20v-6", "M12 20V8", "M17 20v-9"],
  refresh: ["M20 12a8 8 0 11-2.6-5.9", "M20 4v5h-5"],
  bell: ["M6 16V11a6 6 0 1112 0v5l2 3H4z", "M10 22h4"],
  wrench: ["M15 7a4 4 0 01-5.2 5.2L4 18l2 2 5.8-5.8A4 4 0 0117 5.5z"],
  robot: ["M6 9h12v10H6z", "M12 5v4", "M9.5 13h.01", "M14.5 13h.01"],
  document: ["M6 3h8l4 4v14H6z", "M9 12h6", "M9 16h6"],
};

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  /** con frame + drawAt il tracciato si disegna invece di comparire */
  frame?: number;
  drawAt?: number;
};

export const Icon: React.FC<Props> = ({
  name,
  size = 36,
  color = "currentColor",
  frame,
  drawAt,
}) => {
  const animated = typeof frame === "number" && typeof drawAt === "number";
  const dash = animated ? draw(frame, drawAt) : null;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={STROKE}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flex: "none" }}
    >
      {PATHS[name].map((d, i) => (
        <path key={i} d={d} pathLength="1" style={dash ? dash : undefined} />
      ))}
    </svg>
  );
};
