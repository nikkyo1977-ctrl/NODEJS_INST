import React from 'react';
import { AbsoluteFill, Interactive, interpolate, useCurrentFrame, useVideoConfig, Easing } from 'remotion';
import { theme } from '../theme';

export const Scene1Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  const titleTranslateY = interpolate(frame, [0, 30], [-50, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const subtitleOpacity = interpolate(frame, [240, 270], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const steps = [
    { text: 'Open ChatGPT', emoji: '🧑‍💻' },
    { text: 'Copy-paste code', emoji: '📋' },
    { text: 'Edit script manually', emoji: '📝' },
    { text: 'Run in Abaqus', emoji: '🔄' },
    { text: 'Error? Repeat.', emoji: '❌', isError: true },
  ];

  const gridPattern = `repeating-linear-gradient(to right, ${theme.bgLight} 0, ${theme.bgLight} 1px, transparent 1px, transparent 50px),
                       repeating-linear-gradient(to bottom, ${theme.bgLight} 0, ${theme.bgLight} 1px, transparent 1px, transparent 50px)`;

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, backgroundImage: gridPattern, fontFamily: theme.fontMain, color: theme.text }}>
      <Interactive.Div name="Title" style={{ position: 'absolute', top: 100, width: '100%', textAlign: 'center', opacity: titleOpacity, translate: `0 ${titleTranslateY}px` }}>
        <h1 style={{ fontSize: 84, margin: 0, fontWeight: 'bold' }}>Your FEM Workflow Today</h1>
      </Interactive.Div>

      <Interactive.Div name="Workflow" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, marginTop: 180, marginBottom: 120 }}>
        {steps.map((step, index) => {
          const appearFrame = 30 + index * 40;
          
          const opacity = interpolate(frame, [appearFrame, appearFrame + 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const translateY = interpolate(frame, [appearFrame, appearFrame + 20], [20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1) });
          
          const pulse = step.isError ? (Math.sin(frame / 5) * 0.5 + 0.5) : 0;
          const boxShadow = step.isError ? `0 0 ${10 + pulse * 20}px ${theme.danger}` : 'none';

          return (
            <React.Fragment key={index}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 30px',
                backgroundColor: theme.bgLight,
                borderRadius: 16,
                border: step.isError ? `2px solid ${theme.danger}` : `1px solid ${theme.textMuted}`,
                boxShadow,
                opacity,
                translate: `0 ${translateY}px`,
                margin: '4px 0',
                minWidth: 400,
                justifyContent: 'center',
              }}>
                <span style={{ fontSize: 36, marginRight: 20 }}>{step.emoji}</span>
                <span style={{ fontSize: 36, color: step.isError ? theme.danger : theme.text }}>{step.text}</span>
              </div>
              
              {index < steps.length - 1 && (
                <div style={{
                  opacity: interpolate(frame, [appearFrame + 20, appearFrame + 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
                  fontSize: 28,
                  margin: '2px 0',
                  color: theme.textMuted,
                  translate: `0 ${interpolate(frame, [appearFrame + 20, appearFrame + 40], [10, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}px`,
                }}>
                  ↓
                </div>
              )}
            </React.Fragment>
          );
        })}
      </Interactive.Div>

      <Interactive.Div name="Subtitle" style={{ position: 'absolute', bottom: 60, width: '100%', textAlign: 'center', opacity: subtitleOpacity }}>
        <p style={{ fontSize: 44, color: theme.textMuted, margin: 0 }}>Manual. Repetitive. Error-prone.</p>
      </Interactive.Div>
    </AbsoluteFill>
  );
};
