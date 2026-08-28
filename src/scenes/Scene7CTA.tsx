import React from 'react';
import {
  AbsoluteFill,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from 'remotion';
import { theme } from '../theme';

export const Scene7CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Glow pulse (sine wave-like)
  const pulseOpacity = interpolate(
    Math.sin((frame / fps) * Math.PI), 
    [-1, 1], 
    [0.1, 0.4], 
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const titleScale = spring({
    frame: frame - 30,
    fps,
    config: { damping: 200 }, // Provided damping 200
  });

  const subtitleOpacity = interpolate(frame, [60, 90], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const badgesScale = spring({
    frame: frame - 90,
    fps,
    config: { damping: 14 },
  });

  const taglineOpacity = interpolate(frame, [120, 150], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, fontFamily: theme.fontMain, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {/* Radial glow background */}
      <div style={{
        position: 'absolute',
        width: '1000px',
        height: '1000px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${theme.primary} 0%, transparent 60%)`,
        opacity: 0.1,
      }} />

      {/* Pulsing glow behind title */}
      <Interactive.Div name="Glow" style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        translate: '-50% -50%',
        width: '600px',
        height: '200px',
        background: theme.primary,
        filter: 'blur(100px)',
        opacity: pulseOpacity,
      }} />

      <Interactive.Div name="MainTitle" style={{ scale: String(titleScale), fontSize: '96px', color: '#ffffff', fontWeight: 'bold', marginBottom: '24px', zIndex: 1 }}>
        Install Node.js.
      </Interactive.Div>

      <Interactive.Div name="Subtitle" style={{ opacity: subtitleOpacity, fontSize: '52px', color: theme.accent, marginBottom: '80px', zIndex: 1 }}>
        Unlock the future of FEM automation.
      </Interactive.Div>

      <Interactive.Div name="Badges" style={{ scale: String(badgesScale), display: 'flex', gap: '32px', marginBottom: '100px', zIndex: 1 }}>
        <div style={{
          backgroundColor: theme.success,
          color: '#ffffff',
          fontSize: '48px',
          fontWeight: 'bold',
          padding: '16px 48px',
          borderRadius: '100px',
        }}>
          Node.js
        </div>
        <div style={{
          backgroundColor: theme.primary,
          color: '#ffffff',
          fontSize: '48px',
          fontWeight: 'bold',
          padding: '16px 48px',
          borderRadius: '100px',
        }}>
          Codex CLI
        </div>
      </Interactive.Div>

      <Interactive.Div name="Tagline" style={{ opacity: taglineOpacity, fontSize: '44px', color: theme.textMuted, zIndex: 1, position: 'absolute', bottom: '100px' }}>
        One install. Infinite possibilities.
      </Interactive.Div>
    </AbsoluteFill>
  );
};
