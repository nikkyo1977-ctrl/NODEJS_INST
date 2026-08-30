# Why Node.js on Your FEM Workstation? 🚀

A high-impact animated explainer video built with **[Remotion](https://www.remotion.dev/)** (React 19 + TypeScript) to present to IT departments the benefits of installing Node.js on Abaqus CAE finite element simulation workstations.

---

## 🎯 Video Overview

- **Target Audience**: Enterprise IT & Engineering Infrastructure Teams
- **Format**: 1920×1080 (16:9), 30 fps (~84 seconds, 2520 frames)
- **Style**: Engineering Console — near-black surfaces, single cyan accent, stroke SVG icons, JetBrains Mono for technical register, constructive motion (wipe / draw / counters)
- **Audio**: Procedural ambient synth soundtrack (`generate-music.js`) with automatic fade-in/fade-out

### 📽️ Scene Breakdown

1. **Scene 1: The Problem** (11s) — The manual copy-paste ChatGPT closed loop vs reality of FEM scripting.
2. **Scene 2: Solution Architecture** (13s) — Node.js as the orchestrator connecting CLI Agents (Codex CLI, Claude Code, Aider), Python scripts, and the npm ecosystem.
3. **Scene 3: Feature Comparison** (14s) — ChatGPT App vs Codex CLI capability matrix with SVG indicators and unlocked metric.
4. **Scene 4: Time Savings** (14s) — Manual 5-step workflow vs one-command agentic execution inside terminal session.
5. **Scene 5: Security & Compliance** (12s) — 100% local execution, zero data exfiltration, open-source auditability, enterprise adoption.
6. **Scene 6: Unlocked Capabilities** (13s) — 3×3 grid with diagonal wave entrance for 9 high-value use cases.
7. **Scene 7: Call to Action** (10s) — Clean installation pay-off: `winget install OpenJS.NodeJS.LTS`.

---

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ (Node 20+ / 22+ recommended)
- npm or pnpm

### Installation

```bash
git clone https://github.com/nikkyo1977-ctrl/NODEJS_INST.git
cd NODEJS_INST
npm install
```

### Run Automated Tests

```bash
npm test
```

### Start Remotion Studio (Interactive Preview)

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Render Final MP4 Video

```bash
npx remotion render NodeJDVideo
```

---

## 📁 Project Structure

```
├── public/
│   └── ambient-bg.wav        # Procedural ambient soundtrack
├── src/
│   ├── design/               # Design system: tokens, timing, motion, fonts, icons
│   │   ├── fonts.ts          # Inter + JetBrains Mono loaded via delayRender
│   │   ├── icons.tsx         # SVG stroke icons with normalized pathLength
│   │   ├── motion.ts         # Constructive motion helpers (wipe, draw, rise, counter, pulse)
│   │   ├── timing.ts         # Single source of truth for scene durations and frames
│   │   └── tokens.ts         # Colors, typography, spacing, radius
│   ├── components/           # Reusable UI components
│   │   ├── CommandLine.tsx   # Pinned shell command with realistic typing
│   │   ├── Metric.tsx        # Animated metric with tabular numerals
│   │   ├── SceneFrame.tsx    # Common scene frame with index, eyebrow, title, command
│   │   ├── Terminal.tsx      # Terminal window with multi-stage command/output lines
│   │   └── typing.ts         # Pure typing animation logic
│   ├── scenes/               # Declarative scene assemblies
│   │   ├── registry.ts       # SceneId to component registry
│   │   ├── Scene1Intro.tsx
│   │   ├── Scene2Solution.tsx
│   │   ├── Scene3Comparison.tsx
│   │   ├── Scene4TimeSaving.tsx
│   │   ├── Scene5Security.tsx
│   │   ├── Scene6Applications.tsx
│   │   └── Scene7CTA.tsx
│   ├── Root.tsx              # Remotion Root composition registration
│   └── NodeJDVideo.tsx       # Main TransitionSeries composition with audio
├── tests/                    # Vitest unit test suite (timing, motion, typing, icons)
├── generate-music.js         # Pure procedural Web Audio / WAV synthesizer
├── package.json
└── tsconfig.json
```
