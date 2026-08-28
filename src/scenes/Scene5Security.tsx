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

export const Scene5Security: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

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

  const shieldGlow = interpolate(frame % 90, [0, 45, 90], [1, 1.2, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const points = [
    { icon: "🔒", text: "Node.js runs 100% locally" },
    { icon: "🛡️", text: "No simulation data leaves the machine" },
    { icon: "✅", text: "No cloud dependency for execution" },
    { icon: "🏢", text: "IT maintains full control" },
    { icon: "🔍", text: "Open-source & fully auditable" },
    { icon: "🌐", text: "Trusted by NASA, Netflix, PayPal" },
  ];

  return (
    <AbsoluteFill style={{
      background: `radial-gradient(circle at center, ${theme.bgLight} 0%, ${theme.bg} 70%)`,
      color: theme.text,
      fontFamily: theme.fontMain,
      padding: '100px 80px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <Interactive.Div name="Title" style={{
        opacity: titleOpacity,
        translate: `0 ${titleY}px`,
        fontSize: '84px',
        fontWeight: 'bold',
        marginBottom: '60px'
      }}>
        Security & Compliance
      </Interactive.Div>

      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '100px',
        flex: 1,
        width: '100%'
      }}>
        <Interactive.Div name="Shield" style={{
          fontSize: '200px',
          scale: `${shieldGlow}`,
          filter: `drop-shadow(0 0 40px ${theme.success}80)`
        }}>
          🛡️
        </Interactive.Div>

        <Interactive.Div name="Points" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '40px'
        }}>
          {points.map((point, i) => {
            const delay = 25 + (i * (fps * 1.2)); // ~1.2s apart
            const pointOpacity = interpolate(frame, [delay, delay + 20], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            });
            const pointX = interpolate(frame, [delay, delay + 20], [-50, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            });
            return (
              <div key={i} style={{
                opacity: pointOpacity,
                translate: `${pointX}px 0`,
                fontSize: '42px',
                color: theme.success,
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                fontWeight: 500,
              }}>
                <span>{point.icon}</span>
                <span>{point.text}</span>
              </div>
            );
          })}
        </Interactive.Div>
      </div>

      <Interactive.Div name="Tagline" style={{
        opacity: interpolate(frame, [250, 270], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        fontSize: '44px',
        color: theme.textMuted,
        marginTop: 'auto',
        marginBottom: '20px'
      }}>
        Your data stays where it belongs.
      </Interactive.Div>

    </AbsoluteFill>
  );
};
