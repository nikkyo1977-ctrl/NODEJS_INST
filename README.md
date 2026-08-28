# Why Node.js on Your FEM Workstation? 🚀

A high-impact animated explainer video built with **[Remotion](https://www.remotion.dev/)** (React 19 + TypeScript) to present to IT departments the benefits of installing Node.js on Abaqus CAE finite element simulation workstations.

---

## 🎯 Video Overview

- **Target Audience**: Enterprise IT & Engineering Infrastructure Teams
- **Format**: 1920×1080 (16:9), 30 fps (~87 seconds)
- **Style**: Corporate-Tech Dark Mode (Cyan/Neon-Green accents, Inter font)
- **Audio**: Procedural ambient synth soundtrack (`generate-music.js`) with automatic fade-in/fade-out

### 📽️ Scene Breakdown

1. **Scene 1: The Problem** — The manual copy-paste ChatGPT loop vs reality of FEM scripting.
2. **Scene 2: Solution Architecture** — Node.js as the orchestrator connecting CLI Agents (Codex CLI, Claude Code, Aider), Python scripts, and the npm ecosystem.
3. **Scene 3: Feature Comparison** — ChatGPT App vs Codex CLI side-by-side capability matrix.
4. **Scene 4: Time Savings** — Manual 5-step workflow vs one-command agentic execution.
5. **Scene 5: Security & Compliance** — 100% local execution, zero data exfiltration, open-source auditability, enterprise adoption.
6. **Scene 6: Unlocked Capabilities** — 9 high-value use cases (automated meshing, batch simulations, custom CLI tooling, real-time logging, PDF reporting).
7. **Scene 7: Call to Action** — *"Install Node.js. Unlock the future of FEM automation."*

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

### Procedural Audio Generation

```bash
node generate-music.js
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
│   ├── Root.tsx              # Remotion Root composition registration
│   ├── NodeJDVideo.tsx       # Main TransitionSeries composition with audio
│   ├── theme.ts              # Design tokens & color palette
│   └── scenes/
│       ├── Scene1Intro.tsx        # Scene 1: The Problem
│       ├── Scene2Solution.tsx     # Scene 2: Solution Architecture
│       ├── Scene3Comparison.tsx   # Scene 3: Feature Matrix
│       ├── Scene4TimeSaving.tsx   # Scene 4: Time Savings
│       ├── Scene5Security.tsx     # Scene 5: Security & IT Compliance
│       ├── Scene6Applications.tsx # Scene 6: Unlocked Capabilities
│       └── Scene7CTA.tsx          # Scene 7: Call to Action
├── generate-music.js         # Pure procedural Web Audio / WAV synthesizer
├── package.json
└── tsconfig.json
```
