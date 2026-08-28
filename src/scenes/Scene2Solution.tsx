import React from 'react';
import { AbsoluteFill, Interactive, interpolate, useCurrentFrame, useVideoConfig, Easing } from 'remotion';
import { theme } from '../theme';

export const Scene2Solution: React.FC = () => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const titleTranslateY = interpolate(frame, [0, 30], [-50, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1) });

  const nodes = [
    { id: 'center', label: 'Node.js', color: theme.success, appearFrame: 40, top: '50%', left: '50%' },
    { id: 'right', label: 'Agentic CLI Tools\nCodex CLI • Claude Code • Aider', color: theme.primary, appearFrame: 70, top: '50%', left: '82%' },
    { id: 'bottom', label: 'Python Scripts\nAbaqus Automation', color: theme.accent, appearFrame: 100, top: '80%', left: '50%' },
    { id: 'left', label: 'File System\n.inp, .py, .odb', color: theme.warning, appearFrame: 130, top: '50%', left: '18%' },
    { id: 'top', label: 'npm Ecosystem\n2.5M+ packages', color: theme.primary, appearFrame: 160, top: '20%', left: '50%' },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, fontFamily: theme.fontMain, color: theme.text }}>
      <Interactive.Div name="Header" style={{ position: 'absolute', top: 90, width: '100%', textAlign: 'center', opacity: titleOpacity, translate: `0 ${titleTranslateY}px` }}>
        <h1 style={{ fontSize: 84, margin: 0, fontWeight: 'bold', color: theme.accent }}>Node.js + Codex CLI</h1>
        <p style={{ fontSize: 44, color: theme.textMuted, margin: '10px 0 0 0' }}>Agentic Automation for FEM</p>
      </Interactive.Div>

      <Interactive.Div name="Architecture" style={{ position: 'absolute', top: '54%', left: '50%', width: 1200, height: 500, translate: '-50% -50%' }}>
        {/* Connection Lines (zIndex: 1, stopping at target node centers without sticking out) */}
        
        {/* Right Line (to Agentic CLI Tools) */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: interpolate(frame, [70, 90], [0, 384], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1) }),
          height: 3, backgroundColor: theme.primary, translate: '0 -50%', transformOrigin: 'left center',
          zIndex: 1, boxShadow: `0 0 10px ${theme.primary}80`
        }} />

        {/* Bottom Line (to Python Scripts - exactly 150px height so it does NOT extend beyond bottom node) */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          height: interpolate(frame, [100, 120], [0, 150], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1) }),
          width: 3, backgroundColor: theme.accent, translate: '-50% 0', transformOrigin: 'top center',
          zIndex: 1, boxShadow: `0 0 10px ${theme.accent}80`
        }} />

        {/* Left Line (to File System) */}
        <div style={{
          position: 'absolute', top: '50%', right: '50%',
          width: interpolate(frame, [130, 150], [0, 384], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1) }),
          height: 3, backgroundColor: theme.warning, translate: '0 -50%', transformOrigin: 'right center',
          zIndex: 1, boxShadow: `0 0 10px ${theme.warning}80`
        }} />

        {/* Top Line (to npm Ecosystem - exactly 150px height so it does NOT extend beyond top node) */}
        <div style={{
          position: 'absolute', bottom: '50%', left: '50%',
          height: interpolate(frame, [160, 180], [0, 150], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1) }),
          width: 3, backgroundColor: theme.primary, translate: '-50% 0', transformOrigin: 'bottom center',
          zIndex: 1, boxShadow: `0 0 10px ${theme.primary}80`
        }} />

        {/* Nodes (zIndex: 2, solid opaque background so lines never bleed into text) */}
        {nodes.map((node) => {
          const scale = interpolate(frame, [node.appearFrame, node.appearFrame + 25], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.spring({ fps: 30, damping: 12, stiffness: 100, mass: 1 }),
          });

          return (
            <div key={node.id} style={{
              position: 'absolute',
              top: node.top,
              left: node.left,
              translate: '-50% -50%',
              scale: `${scale}`,
              backgroundColor: theme.bgLight,
              padding: '16px 28px',
              borderRadius: 20,
              border: `2px solid ${node.color}`,
              boxShadow: `0 0 25px ${node.color}50`,
              textAlign: 'center',
              minWidth: 200,
              zIndex: 2,
            }}>
              {node.label.split('\n').map((line, i) => (
                <div key={i} style={{
                  fontSize: i === 0 ? 34 : 22,
                  fontWeight: i === 0 ? 'bold' : 'normal',
                  color: i === 0 ? theme.text : theme.textMuted,
                  marginTop: i > 0 ? 8 : 0,
                  whiteSpace: i > 0 ? 'nowrap' : 'normal'
                }}>
                  {line}
                </div>
              ))}
            </div>
          );
        })}
      </Interactive.Div>
    </AbsoluteFill>
  );
};
