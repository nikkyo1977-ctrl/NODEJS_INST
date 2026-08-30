import React from "react";
import { useCurrentFrame } from "remotion";
import { SceneFrame, CONTENT_AT } from "../components/SceneFrame";
import { Icon, IconName } from "../design/icons";
import { DUR, extend, wipe } from "../design/motion";
import { color, radius, space, type } from "../design/tokens";

/**
 * Unica costante geometrica della scena: le linee arrivano esattamente al
 * bordo dei nodi perché la loro lunghezza deriva da qui, non da valori
 * scritti a mano (era la causa del bug corretto in d386398).
 */
const RADIUS_X = 420;
const RADIUS_Y = 240;
const NODE_HALF_W = 150;
const NODE_HALF_H = 60;

type Node = {
  id: string;
  label: string;
  detail: string;
  icon: IconName;
  dx: number;
  dy: number;
  at: number;
};

const SATELLITES: Node[] = [
  {
    id: "cli",
    label: "Agentic CLI",
    detail: "Codex CLI · Claude Code · Aider",
    icon: "terminal",
    dx: 1,
    dy: 0,
    at: CONTENT_AT + 20,
  },
  {
    id: "py",
    label: "Python Scripts",
    detail: "Abaqus automation",
    icon: "file",
    dx: 0,
    dy: 1,
    at: CONTENT_AT + 40,
  },
  {
    id: "fs",
    label: "File System",
    detail: ".inp · .py · .odb",
    icon: "folder",
    dx: -1,
    dy: 0,
    at: CONTENT_AT + 60,
  },
  {
    id: "npm",
    label: "npm Ecosystem",
    detail: "2.5M+ packages",
    icon: "package",
    dx: 0,
    dy: -1,
    at: CONTENT_AT + 80,
  },
];

export const Scene2Solution: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <SceneFrame
      index={2}
      eyebrow="Solution"
      title="Node.js as the orchestrator"
      command="$ node --version"
      commandAt={CONTENT_AT + 120}
    >
      <div style={{ flex: 1, position: "relative" }}>
        {SATELLITES.map((node) => {
          const horizontal = node.dx !== 0;
          const full = horizontal
            ? RADIUS_X - NODE_HALF_W
            : RADIUS_Y - NODE_HALF_H;
          const grown = extend(frame, node.at, full, DUR.base);
          return (
            <div
              key={node.id + "-line"}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: horizontal ? grown : 3,
                height: horizontal ? 3 : grown,
                backgroundColor: color.accentDim,
                transformOrigin: "top left",
                translate:
                  (horizontal ? (node.dx > 0 ? "0" : "-100%") : "-50%") +
                  " " +
                  (horizontal ? "-50%" : node.dy > 0 ? "0" : "-100%"),
              }}
            />
          );
        })}

        {/* nodo centrale: la gerarchia la fa il centro, non cinque colori */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            translate: "-50% -50%",
            backgroundColor: color.surface,
            border: "2px solid " + color.accent,
            borderRadius: radius.lg,
            padding: space.md + "px " + space.xl + "px",
            display: "flex",
            alignItems: "center",
            gap: space.md,
            boxShadow: "0 0 60px " + color.accentDim,
            ...wipe(frame, CONTENT_AT),
          }}
        >
          <Icon
            name="cpu"
            size={44}
            color={color.accent}
            frame={frame}
            drawAt={CONTENT_AT}
          />
          <span style={{ ...type.h2, color: color.text }}>Node.js</span>
        </div>

        {SATELLITES.map((node) => (
          <div
            key={node.id}
            style={{
              position: "absolute",
              top: "calc(50% + " + node.dy * RADIUS_Y + "px)",
              left: "calc(50% + " + node.dx * RADIUS_X + "px)",
              translate: "-50% -50%",
              width: NODE_HALF_W * 2,
              boxSizing: "border-box",
              backgroundColor: color.surface,
              border: "1px solid " + color.line,
              borderRadius: radius.md,
              padding: space.md,
              textAlign: "center",
              ...wipe(frame, node.at + DUR.fast),
            }}
          >
            <Icon
              name={node.icon}
              size={32}
              color={color.accent}
              frame={frame}
              drawAt={node.at + DUR.fast}
            />
            <div
              style={{ ...type.body, color: color.text, marginTop: space.xs }}
            >
              {node.label}
            </div>
            <div
              style={{
                ...type.small,
                color: color.textFaint,
                marginTop: 4,
              }}
            >
              {node.detail}
            </div>
          </div>
        ))}
      </div>
    </SceneFrame>
  );
};
