export const FPS = 30;
export const TRANSITION_FRAMES = 15;

export type SceneId =
  | "problem"
  | "solution"
  | "comparison"
  | "timeSaving"
  | "security"
  | "applications"
  | "cta";

export type SceneSpec = {
  id: SceneId;
  /** id della Composition registrata in Root.tsx */
  compositionId: string;
  seconds: number;
  /** frame, relativo all'inizio della scena, in cui termina l'ultima rivelazione */
  lastRevealAt: number;
};

/**
 * Fonte di verità unica delle durate. Root.tsx e NodeJDVideo.tsx leggono
 * entrambi da qui: nessun valore di durata va mai riscritto altrove.
 */
export const SCENES: SceneSpec[] = [
  {
    id: "problem",
    compositionId: "Scene1-Problem",
    seconds: 11,
    lastRevealAt: 290,
  },
  {
    id: "solution",
    compositionId: "Scene2-Solution",
    seconds: 13,
    lastRevealAt: 340,
  },
  {
    id: "comparison",
    compositionId: "Scene3-Comparison",
    seconds: 14,
    lastRevealAt: 370,
  },
  {
    id: "timeSaving",
    compositionId: "Scene4-TimeSaving",
    seconds: 14,
    lastRevealAt: 375,
  },
  {
    id: "security",
    compositionId: "Scene5-Security",
    seconds: 12,
    lastRevealAt: 315,
  },
  {
    id: "applications",
    compositionId: "Scene6-Applications",
    seconds: 13,
    lastRevealAt: 345,
  },
  { id: "cta", compositionId: "Scene7-CTA", seconds: 10, lastRevealAt: 260 },
];

const specOf = (id: SceneId): SceneSpec => {
  for (let i = 0; i < SCENES.length; i++) {
    if (SCENES[i].id === id) return SCENES[i];
  }
  throw new Error("Scena sconosciuta: " + id);
};

export const sceneFrames = (id: SceneId): number => specOf(id).seconds * FPS;

export const totalFrames = (): number => {
  let sum = 0;
  for (let i = 0; i < SCENES.length; i++) sum += SCENES[i].seconds * FPS;
  return sum - (SCENES.length - 1) * TRANSITION_FRAMES;
};

export const sceneStartFrame = (id: SceneId): number => {
  let sum = 0;
  for (let i = 0; i < SCENES.length; i++) {
    if (SCENES[i].id === id) return sum - i * TRANSITION_FRAMES;
    sum += SCENES[i].seconds * FPS;
  }
  throw new Error("Scena sconosciuta: " + id);
};

/**
 * Il difetto trovato in analisi: animazioni che finiscono molto prima della
 * scena (Scena 3 completava a frame 285 su 540). Questo controllo lo rende
 * strutturalmente non ripetibile invece che corretto una volta sola.
 */
export const timingWarnings = (scenes: SceneSpec[] = SCENES): string[] => {
  const warnings: string[] = [];
  for (let i = 0; i < scenes.length; i++) {
    const s = scenes[i];
    const duration = s.seconds * FPS;
    const ratio = s.lastRevealAt / duration;
    if (ratio < 0.8) {
      warnings.push(
        "Scena " +
          s.id +
          ": ultima rivelazione al " +
          Math.round(ratio * 100) +
          "% della durata (" +
          s.lastRevealAt +
          "/" +
          duration +
          "). Tempo morto in coda.",
      );
    }
    if (ratio > 1) {
      warnings.push(
        "Scena " +
          s.id +
          ": ultima rivelazione oltre la fine (" +
          s.lastRevealAt +
          "/" +
          duration +
          "). Contenuto troncato.",
      );
    }
  }
  return warnings;
};
