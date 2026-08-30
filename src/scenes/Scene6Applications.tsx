import React from "react";
import { useCurrentFrame } from "remotion";
import { SceneFrame, CONTENT_AT } from "../components/SceneFrame";
import { Icon, IconName } from "../design/icons";
import { DUR, STAGGER, wipe } from "../design/motion";
import { color, radius, space, type } from "../design/tokens";

const ITEMS: { icon: IconName; text: string }[] = [
  { icon: "wrench", text: "Automated mesh generation" },
  { icon: "package", text: "Batch simulation launches" },
  { icon: "chart", text: "Post-processing & reporting" },
  { icon: "refresh", text: "Parametric studies" },
  { icon: "robot", text: "AI-assisted .inp debugging" },
  { icon: "cpu", text: "Mesh → simulate → results" },
  { icon: "terminal", text: "Custom CLI tools for your team" },
  { icon: "bell", text: "Real-time log monitoring" },
  { icon: "document", text: "Auto-generated PDF reports" },
];

const COLS = 3;

export const Scene6Applications: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <SceneFrame
      index={6}
      eyebrow="Capabilities"
      title="What this unlocks"
      command="$ npm run simulate -- --batch"
      commandAt={CONTENT_AT + 200}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: space.md,
          flex: 1,
          alignContent: "center",
        }}
      >
        {ITEMS.map((item, i) => {
          // onda diagonale: la colonna scala di tight, la riga di loose
          const col = i % COLS;
          const row = Math.floor(i / COLS);
          const at = CONTENT_AT + col * STAGGER.tight + row * STAGGER.loose;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: space.md,
                backgroundColor: color.surface,
                border: "1px solid " + color.line,
                borderRadius: radius.md,
                padding: space.md,
                ...wipe(frame, at, DUR.base),
              }}
            >
              <Icon
                name={item.icon}
                size={34}
                color={color.accent}
                frame={frame}
                drawAt={at}
              />
              <span style={{ ...type.body, color: color.text }}>
                {item.text}
              </span>
            </div>
          );
        })}
      </div>
    </SceneFrame>
  );
};
