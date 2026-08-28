import React from 'react';
import {
  AbsoluteFill,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from 'remotion';
import { theme } from '../theme';

const items = [
  { emoji: '🔧', text: 'Automated mesh generation' },
  { emoji: '🚀', text: 'Batch simulation launches' },
  { emoji: '📊', text: 'Automated post-processing & reporting' },
  { emoji: '🔄', text: 'Parametric studies via scripted pipelines' },
  { emoji: '🤖', text: 'AI-assisted debugging of .inp files' },
  { emoji: '📦', text: 'End-to-end: mesh → simulate → results' },
  { emoji: '🛠️', text: 'Custom CLI tools for your team' },
  { emoji: '📡', text: 'Real-time log monitoring & alerts' },
  { emoji: '📄', text: 'Auto-generated HTML/PDF reports' },
];

export const Scene6Applications: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, fontFamily: theme.fontMain, padding: '70px 80px', display: 'flex', flexDirection: 'column' }}>
      <Interactive.Div name="Title" style={{ opacity: titleOpacity, fontSize: '76px', color: theme.accent, fontWeight: 'bold', marginBottom: '36px', textAlign: 'center' }}>
        Unlocked Capabilities
      </Interactive.Div>

      <Interactive.Div
        name="Grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px 28px',
          width: '100%',
          maxWidth: '1600px',
          margin: '0 auto',
        }}
      >
        {items.map((item, index) => {
          const startFrame = 20 + index * 35;
          const itemProgress = interpolate(frame, [startFrame, startFrame + 25], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          });
          
          const translateX = interpolate(frame, [startFrame, startFrame + 25], [100, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          });

          return (
            <Interactive.Div
              key={index}
              name={`Item-${index}`}
              style={{
                opacity: itemProgress,
                translate: `${translateX}px 0px`,
                display: 'flex',
                alignItems: 'center',
                backgroundColor: theme.bgLight,
                borderRadius: '14px',
                padding: '14px 20px',
                borderLeft: `6px solid ${theme.accent}`,
                boxShadow: `0 4px 20px rgba(0,0,0,0.3)`,
              }}
            >
              <span style={{ fontSize: '38px', marginRight: '16px' }}>{item.emoji}</span>
              <span style={{ fontSize: '30px', color: theme.text, fontWeight: '500' }}>{item.text}</span>
            </Interactive.Div>
          );
        })}
      </Interactive.Div>
    </AbsoluteFill>
  );
};
