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

export const Scene4TimeSaving: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animations
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  
  const titleY = interpolate(frame, [0, 15], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const colsOpacity = interpolate(frame, [10, 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const manualSteps = [
    "Open browser",
    "Copy code",
    "Paste & edit",
    "Run & debug",
    "Repeat",
  ];

  const bulletPoints = [
    "Eliminate copy-paste cycles",
    "Automate repetitive scripting",
    "From idea to simulation in one command",
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, color: theme.text, fontFamily: theme.fontMain, padding: '60px 80px', display: 'flex', flexDirection: 'column' }}>
      <Interactive.Div name="Title" style={{ opacity: titleOpacity, translate: `0 ${titleY}px`, textAlign: 'center', fontSize: '80px', fontWeight: 'bold', marginBottom: '24px' }}>
        Save Time. Automate Everything.
      </Interactive.Div>

      <div style={{ display: 'flex', flexDirection: 'row', flex: 1, opacity: colsOpacity, alignItems: 'center' }}>
        {/* Left Column */}
        <Interactive.Div name="Left Column" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingRight: '40px' }}>
          <div style={{ color: theme.danger, fontSize: '44px', fontWeight: 'bold', marginBottom: '16px' }}>
            Manual Workflow
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '320px' }}>
            {manualSteps.map((step, i) => {
              const delay = 30 + i * 15;
              const stepOpacity = interpolate(frame, [delay, delay + 10], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              });
              const stepY = interpolate(frame, [delay, delay + 10], [10, 0], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              });
              return (
                <Interactive.Div key={i} name={`Manual Step ${i}`} style={{
                  opacity: stepOpacity,
                  translate: `0 ${stepY}px`,
                  border: `2px solid ${theme.danger}`,
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontSize: '28px',
                  textAlign: 'center',
                }}>
                  {step}
                </Interactive.Div>
              );
            })}
          </div>
          <Interactive.Div name="Hourglass" style={{
            marginTop: '12px',
            fontSize: '52px',
            scale: `${interpolate(frame % 60, [0, 30, 60], [1, 1.1, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}`
          }}>
            ⏳
          </Interactive.Div>
        </Interactive.Div>

        {/* Divider */}
        <div style={{ width: '2px', height: '80%', backgroundColor: theme.textMuted, opacity: 0.3, margin: '0 20px' }} />

        {/* Right Column */}
        <Interactive.Div name="Right Column" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingLeft: '40px' }}>
          <div style={{ color: theme.success, fontSize: '44px', fontWeight: 'bold', marginBottom: '16px' }}>
            Automated Workflow
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: '260px' }}>
            <Interactive.Div name="Automated Bar" style={{
              backgroundColor: theme.success,
              borderRadius: '12px',
              padding: '30px 40px',
              width: '100%',
              maxWidth: '340px',
              textAlign: 'center',
              fontSize: '34px',
              fontWeight: 'bold',
              color: theme.bgLight,
              boxShadow: `0 0 30px ${theme.success}50`,
              opacity: interpolate(frame, [110, 125], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1) }),
              translate: `0 ${interpolate(frame, [110, 125], [20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1) })}px`,
            }}>
              One command. Done.
            </Interactive.Div>
          </div>
          <Interactive.Div name="Rocket" style={{
            marginTop: '12px',
            fontSize: '52px',
            scale: `${interpolate(frame, [120, 140], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.spring({ fps, damping: 12, stiffness: 100 }) })}`
          }}>
            🚀
          </Interactive.Div>
        </Interactive.Div>
      </div>

      <Interactive.Div name="Bullets" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px', marginBottom: '10px', alignItems: 'center' }}>
        {bulletPoints.map((point, i) => {
          const delay = 160 + i * 20;
          const pointOpacity = interpolate(frame, [delay, delay + 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1) });
          const pointY = interpolate(frame, [delay, delay + 15], [20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1) });
          return (
            <div key={i} style={{ opacity: pointOpacity, translate: `0 ${pointY}px`, fontSize: '32px', color: theme.textMuted }}>
              • {point}
            </div>
          );
        })}
      </Interactive.Div>
    </AbsoluteFill>
  );
};
