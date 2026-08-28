import React from 'react';
import { AbsoluteFill, Interactive, interpolate, useCurrentFrame, useVideoConfig, Easing } from 'remotion';
import { theme } from '../theme';

export const Scene3Comparison: React.FC = () => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const titleTranslateY = interpolate(frame, [0, 30], [-50, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1) });

  const rows = [
    { label: 'Filesystem Access', bad: '❌ None', good: '✅ Direct read/write' },
    { label: 'Execution', bad: '❌ Copy-paste', good: '✅ Runs commands directly' },
    { label: '.inp/.py Files', bad: '❌ Manual transfer', good: '✅ Reads & writes natively' },
    { label: 'Abaqus Integration', bad: '❌ Impossible', good: '✅ Direct CLI execution' },
    { label: 'Context', bad: '❌ Limited window', good: '✅ Full codebase awareness' },
    { label: 'Data Location', bad: '☁️ Cloud', good: '🏠 Local (via Node.js)' },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, fontFamily: theme.fontMain, color: theme.text, padding: '80px 80px' }}>
      <Interactive.Div name="Header" style={{ textAlign: 'center', opacity: titleOpacity, translate: `0 ${titleTranslateY}px`, marginBottom: 30 }}>
        <h1 style={{ fontSize: 84, margin: 0, fontWeight: 'bold' }}>ChatGPT App vs Codex CLI</h1>
      </Interactive.Div>

      <Interactive.Div name="Table" style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'flex', borderBottom: `2px solid ${theme.textMuted}`, paddingBottom: 20, marginBottom: 20 }}>
          <div style={{ flex: 1 }}></div>
          <div style={{ flex: 1, fontSize: 40, fontWeight: 'bold', color: theme.danger, textAlign: 'center' }}>ChatGPT App</div>
          <div style={{ flex: 1, fontSize: 40, fontWeight: 'bold', color: theme.success, textAlign: 'center' }}>Codex CLI</div>
        </div>

        {rows.map((row, index) => {
          const appearFrame = 40 + index * 45;
          const opacity = interpolate(frame, [appearFrame, appearFrame + 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const translateY = interpolate(frame, [appearFrame, appearFrame + 20], [30, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1) });
          
          const pulseFrame = appearFrame + 20;
          const pulseScale = interpolate(frame, [pulseFrame, pulseFrame + 10, pulseFrame + 20], [1, 1.2, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const pulseOpacity = interpolate(frame, [pulseFrame, pulseFrame + 10, pulseFrame + 20], [0, 0.8, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

          return (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: theme.bgLight,
              padding: '16px 24px',
              borderRadius: 16,
              opacity,
              translate: `0 ${translateY}px`,
            }}>
              <div style={{ flex: 1, fontSize: 34, color: theme.textMuted, fontWeight: '500' }}>{row.label}</div>
              <div style={{ flex: 1, fontSize: 34, color: theme.danger, textAlign: 'center' }}>{row.bad}</div>
              <div style={{ flex: 1, fontSize: 34, color: theme.success, textAlign: 'center', position: 'relative' }}>
                <span style={{ position: 'relative', zIndex: 2 }}>{row.good}</span>
                {row.good.startsWith('✅') && (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    translate: '-50% -50%',
                    width: '100%',
                    height: '100%',
                    backgroundColor: theme.success,
                    borderRadius: 8,
                    opacity: pulseOpacity,
                    scale: `${pulseScale}`,
                    zIndex: 1,
                    filter: 'blur(10px)',
                  }} />
                )}
              </div>
            </div>
          );
        })}
      </Interactive.Div>
    </AbsoluteFill>
  );
};
