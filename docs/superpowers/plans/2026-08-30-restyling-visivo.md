# Restyling visivo — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sostituire il linguaggio visivo emerso ad-hoc delle 7 scene Remotion con un design system "Engineering Console" — accento singolo, icone SVG al posto delle emoji, terminale come filo conduttore, movimento costruttivo — e chiudere i due difetti strutturali (durate duplicate, tempi morti non misurati).

**Architecture:** Tre strati con dipendenze a senso unico. `src/design/` contiene moduli puri (token, timing, helper di movimento, icone) e non importa nulla dal resto del progetto. `src/components/` costruisce sopra `design/` i pezzi riusabili (telaio di scena, terminale, metriche, rivelazioni) e non conosce le scene. `src/scenes/` diventa puro assemblaggio dichiarativo: dice *cosa* si rivela e *quando*, mai *come*. La logica temporale è pura e testata con Vitest; il risultato visivo si verifica con still Remotion.

**Tech Stack:** Remotion 4.0.518, React 19, TypeScript 5.9 (strict, `lib: es2015`), `@remotion/transitions`, `@remotion/google-fonts` (da installare), Vitest (da installare).

## Global Constraints

Valori copiati dallo spec `docs/superpowers/specs/2026-08-30-restyling-visivo-design.md`. Valgono per ogni task.

- **Colori:** `bg #08090b` · `surface #0c0f14` · `line #191d24` · `lineStrong #232936` · `text #eef1f5` · `textMute #8b95a3` · `textFaint #4d5765` · `accent #22d3ee` · `accentDim #1d3d47` · `ok #3fb27f` · `warn #d99a3e` · `bad #b4555f`. **`accent` è l'unico accento**: `ok`/`warn`/`bad` solo come stato, mai decorativi.
- **Tipografia:** `display 104/700/-0.04em` · `h1 72/700/-0.03em` · `h2 44/600/-0.02em` · `bodyLg 36/400` · `body 30/400` · `small 24/400` · `label 20/600/+0.22em maiuscolo mono` · `metric 128/700/-0.04em`. Il titolo di scena è `h1` in tutte e sette.
- **Spaziatura:** scala `8 16 24 32 48 64 80 96 128`. Safe area di scena **96 orizzontali, 80 verticali**.
- **Movimento:** durate `micro 6 · fast 9 · base 15 · slow 24`; stagger `xtight 4 · tight 6 · base 8 · loose 12`; easing di ingresso unica `cubic-bezier(0.22, 1, 0.36, 1)`.
- **Durate scene (secondi):** problem 11 · solution 13 · comparison 14 · timeSaving 14 · security 12 · applications 13 · cta 10. Transizioni 15 frame. Totale atteso **2520 frame**.
- **Zero emoji in `src/`** al termine del lavoro.
- **Zero `frame % n`**: le pulsazioni continue usano `Math.sin`.
- Ogni `<path>` delle icone porta `pathLength="1"`.
- Ogni numero animato usa `fontVariantNumeric: 'tabular-nums'`.
- `CommandLine` entro **64 caratteri**.
- **Vincoli dell'ambiente:** `tsconfig` ha `lib: ["es2015"]` → vietati `String.padStart`, `Object.entries`, `Object.fromEntries`, `Array.flat`. Ha `noUnusedLocals: true` → nessun import o binding inutilizzato, o `tsc` fallisce.
- La riga di comando **non compare in Scena 1**.
- Fuori perimetro: testi, ordine delle scene, `generate-music.js`, audio, formati verticali, voiceover.

## Comandi di verifica

```bash
npm run lint          # eslint src && tsc — deve restare pulito a ogni task
npm test              # vitest run — dopo il Task 1
npx remotion still <CompositionId> <out.png> --frame=<N>
```

Gli still vanno in `C:\Users\nikky\AppData\Local\Temp\claude\C--Users-nikky-Desktop-NODEJD-nodejd-video\e2dffe8c-7745-4e9d-b0da-42236af054aa\scratchpad\`, mai in `out/`.

## Struttura dei file

| File | Responsabilità |
|---|---|
| `src/design/timing.ts` | Durate delle scene — **fonte di verità unica**. Puro. |
| `src/design/tokens.ts` | Colori, tipografia, spaziatura, tratti, raggi. Puro. |
| `src/design/fonts.ts` | Caricamento Inter + JetBrains Mono con `delayRender`. |
| `src/design/motion.ts` | Durate, easing, stagger, helper `wipe/rise/draw/extend/counter/pulse`. Puro. |
| `src/design/icons.tsx` | Set di icone SVG a tratto, con `draw`. |
| `src/components/typing.ts` | Funzione pura di typing. |
| `src/components/CommandLine.tsx` | Riga di comando ancorata al fondo. |
| `src/components/Terminal.tsx` | Finestra terminale con output progressivo. |
| `src/components/Metric.tsx` | Numero con contatore. |
| `src/components/SceneFrame.tsx` | Telaio comune di scena. |
| `src/scenes/*.tsx` | Assemblaggio dichiarativo delle 7 scene. |
| `src/NodeJDVideo.tsx` · `src/Root.tsx` | Composizione, durate importate da `timing.ts`. |
| `tests/*.test.ts` | Test dei moduli puri. |

`design/` non importa da `components/` né da `scenes/`. `components/` non importa da `scenes/`.

---

## Task 1: Infrastruttura di test e fonte di verità delle durate

Chiude il difetto "durate duplicate tra `Root.tsx` e `NodeJDVideo.tsx`" e installa il ciclo di test che serve a tutti i task successivi.

**Files:**
- Modify: `package.json` (devDependency `vitest`, script `test`)
- Create: `src/design/timing.ts`
- Create: `tests/timing.test.ts`

**Interfaces:**
- Consumes: niente.
- Produces:
  - `FPS: 30`, `TRANSITION_FRAMES: 15`
  - `type SceneId = 'problem' | 'solution' | 'comparison' | 'timeSaving' | 'security' | 'applications' | 'cta'`
  - `type SceneSpec = { id: SceneId; compositionId: string; seconds: number; lastRevealAt: number }`
  - `SCENES: SceneSpec[]` (in ordine di riproduzione)
  - `sceneFrames(id: SceneId): number`
  - `totalFrames(): number`
  - `sceneStartFrame(id: SceneId): number`
  - `timingWarnings(): string[]`

- [ ] **Step 1: Installare Vitest e aggiungere lo script**

```bash
npm install --save-dev vitest@3.2.4
```

Poi in `package.json`, dentro `"scripts"`, aggiungere la riga `"test"` accanto alle esistenti:

```json
"scripts": {
  "dev": "remotion studio",
  "build": "remotion bundle",
  "upgrade": "remotion upgrade",
  "test": "vitest run",
  "lint": "eslint src && tsc"
}
```

- [ ] **Step 2: Scrivere il test che fallisce**

Creare `tests/timing.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import {
  FPS,
  TRANSITION_FRAMES,
  SCENES,
  sceneFrames,
  totalFrames,
  sceneStartFrame,
  timingWarnings,
} from "../src/design/timing";

describe("timing", () => {
  it("descrive sette scene nell'ordine di riproduzione", () => {
    expect(SCENES.map((s) => s.id)).toEqual([
      "problem",
      "solution",
      "comparison",
      "timeSaving",
      "security",
      "applications",
      "cta",
    ]);
  });

  it("converte i secondi di scena in frame", () => {
    expect(sceneFrames("problem")).toBe(11 * FPS);
    expect(sceneFrames("comparison")).toBe(14 * FPS);
  });

  it("sottrae la sovrapposizione delle transizioni dal totale", () => {
    // 87s di scene = 2610 frame, meno 6 transizioni da 15 frame
    expect(totalFrames()).toBe(2610 - 6 * TRANSITION_FRAMES);
    expect(totalFrames()).toBe(2520);
  });

  it("colloca ogni scena tenendo conto delle transizioni precedenti", () => {
    expect(sceneStartFrame("problem")).toBe(0);
    expect(sceneStartFrame("solution")).toBe(11 * FPS - TRANSITION_FRAMES);
    expect(sceneStartFrame("cta")).toBe(totalFrames() - sceneFrames("cta"));
  });

  it("non segnala tempi morti sulle durate correnti", () => {
    expect(timingWarnings()).toEqual([]);
  });

  it("segnala una scena la cui ultima rivelazione cade troppo presto", () => {
    const sano = SCENES.find((s) => s.id === "security");
    if (!sano) throw new Error("scena security assente");
    const originale = sano.lastRevealAt;
    sano.lastRevealAt = 10; // 10 frame su 360: 2,8% della scena
    const avvisi = timingWarnings();
    sano.lastRevealAt = originale;
    expect(avvisi.length).toBe(1);
    expect(avvisi[0]).toContain("security");
  });
});
```

- [ ] **Step 3: Eseguire il test e verificare che fallisca**

```bash
npm test
```

Atteso: FAIL — `Failed to resolve import "../src/design/timing"`.

- [ ] **Step 4: Implementare `src/design/timing.ts`**

```ts
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
  { id: "problem", compositionId: "Scene1-Problem", seconds: 11, lastRevealAt: 290 },
  { id: "solution", compositionId: "Scene2-Solution", seconds: 13, lastRevealAt: 340 },
  { id: "comparison", compositionId: "Scene3-Comparison", seconds: 14, lastRevealAt: 370 },
  { id: "timeSaving", compositionId: "Scene4-TimeSaving", seconds: 14, lastRevealAt: 375 },
  { id: "security", compositionId: "Scene5-Security", seconds: 12, lastRevealAt: 315 },
  { id: "applications", compositionId: "Scene6-Applications", seconds: 13, lastRevealAt: 345 },
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
export const timingWarnings = (): string[] => {
  const warnings: string[] = [];
  for (let i = 0; i < SCENES.length; i++) {
    const s = SCENES[i];
    const duration = s.seconds * FPS;
    const ratio = s.lastRevealAt / duration;
    if (ratio < 0.8) {
      warnings.push(
        "Scena " + s.id + ": ultima rivelazione al " + Math.round(ratio * 100) +
          "% della durata (" + s.lastRevealAt + "/" + duration + "). Tempo morto in coda."
      );
    }
    if (ratio > 1) {
      warnings.push(
        "Scena " + s.id + ": ultima rivelazione oltre la fine (" +
          s.lastRevealAt + "/" + duration + "). Contenuto troncato."
      );
    }
  }
  return warnings;
};
```

- [ ] **Step 5: Eseguire i test e verificare che passino**

```bash
npm test
```

Atteso: PASS, 6 test.

- [ ] **Step 6: Verificare i tipi**

```bash
npm run lint
```

Atteso: nessun output di errore.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json src/design/timing.ts tests/timing.test.ts
git commit -m "feat(timing): fonte di verita unica per le durate delle scene"
```

---

## Task 2: Token di design e caricamento dei font

**Files:**
- Create: `src/design/tokens.ts`
- Create: `src/design/fonts.ts`
- Modify: `package.json` (dipendenza `@remotion/google-fonts`)

**Interfaces:**
- Consumes: niente.
- Produces:
  - `FONT_SANS: string`, `FONT_MONO: string` da `fonts.ts`
  - `color: { bg, surface, line, lineStrong, text, textMute, textFaint, accent, accentDim, ok, warn, bad }`
  - `type: { display, h1, h2, bodyLg, body, small, label, metric }`, ciascuno `{ fontSize, fontWeight, letterSpacing?, fontFamily, textTransform?, fontVariantNumeric? }` — spalmabile direttamente in `style`
  - `space: { xs 8, sm 16, md 24, lg 32, xl 48, xxl 64, xxxl 80, page 96, huge 128 }`
  - `SAFE: { x: 96, y: 80 }`
  - `radius: { sm 8, md 14, lg 20 }`, `STROKE: 2.2`

- [ ] **Step 1: Installare il pacchetto dei font**

`@remotion/google-fonts` non è nelle dipendenze: senza, `fontFamily: "Inter"` resta un fallback di sistema e il render non è riproducibile.

```bash
npm install @remotion/google-fonts@4.0.518
```

- [ ] **Step 2: Creare `src/design/fonts.ts`**

```ts
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import { continueRender, delayRender } from "remotion";

const inter = loadInter("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const mono = loadJetBrains("normal", {
  weights: ["400", "500", "700"],
  subsets: ["latin"],
});

// Il render non parte finché i font non sono pronti: senza questo il primo
// frame userebbe il fallback di sistema, con metriche diverse su ogni macchina.
const handle = delayRender("Caricamento font");
Promise.all([inter.waitUntilDone(), mono.waitUntilDone()])
  .then(() => continueRender(handle))
  .catch(() => continueRender(handle));

export const FONT_SANS = inter.fontFamily;
export const FONT_MONO = mono.fontFamily;
```

- [ ] **Step 3: Creare `src/design/tokens.ts`**

```ts
import { FONT_MONO, FONT_SANS } from "./fonts";

export const color = {
  bg: "#08090b",
  surface: "#0c0f14",
  line: "#191d24",
  lineStrong: "#232936",
  text: "#eef1f5",
  textMute: "#8b95a3",
  textFaint: "#4d5765",
  /** unico accento del sistema */
  accent: "#22d3ee",
  accentDim: "#1d3d47",
  /** solo stato, mai decorativi */
  ok: "#3fb27f",
  warn: "#d99a3e",
  bad: "#b4555f",
} as const;

export const space = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
  xxl: 64,
  xxxl: 80,
  page: 96,
  huge: 128,
} as const;

export const SAFE = { x: 96, y: 80 } as const;

export const radius = { sm: 8, md: 14, lg: 20 } as const;

export const STROKE = 2.2;

export const type = {
  display: {
    fontFamily: FONT_SANS,
    fontSize: 104,
    fontWeight: 700,
    letterSpacing: "-0.04em",
  },
  h1: {
    fontFamily: FONT_SANS,
    fontSize: 72,
    fontWeight: 700,
    letterSpacing: "-0.03em",
  },
  h2: {
    fontFamily: FONT_SANS,
    fontSize: 44,
    fontWeight: 600,
    letterSpacing: "-0.02em",
  },
  bodyLg: { fontFamily: FONT_SANS, fontSize: 36, fontWeight: 400 },
  body: { fontFamily: FONT_SANS, fontSize: 30, fontWeight: 400 },
  small: { fontFamily: FONT_SANS, fontSize: 24, fontWeight: 400 },
  label: {
    fontFamily: FONT_MONO,
    fontSize: 20,
    fontWeight: 600,
    letterSpacing: "0.22em",
    textTransform: "uppercase" as const,
  },
  metric: {
    fontFamily: FONT_SANS,
    fontSize: 128,
    fontWeight: 700,
    letterSpacing: "-0.04em",
    // senza questo le cifre cambiano larghezza durante il conteggio
    fontVariantNumeric: "tabular-nums" as const,
  },
  mono: { fontFamily: FONT_MONO, fontSize: 36, fontWeight: 400 },
} as const;
```

- [ ] **Step 4: Verificare i tipi**

```bash
npm run lint
```

Atteso: nessun errore. Se `tsc` segnala che `@remotion/google-fonts/JetBrainsMono` non esiste, verificare il nome esatto del sottopercorso con:

```bash
ls node_modules/@remotion/google-fonts/dist/esm/ | grep -i jetbrains
```

e usare quello.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json src/design/tokens.ts src/design/fonts.ts
git commit -m "feat(design): token di colore, tipografia e spaziatura con font caricati"
```

---

## Task 3: Helper di movimento

Il cuore del "movimento costruttivo": le scene dichiarano cosa si rivela e quando, mai come.

**Files:**
- Create: `src/design/motion.ts`
- Create: `tests/motion.test.ts`

**Interfaces:**
- Consumes: niente.
- Produces:
  - `DUR: { micro 6, fast 9, base 15, slow 24 }`
  - `STAGGER: { xtight 4, tight 6, base 8, loose 12 }`
  - `progress(frame: number, at: number, dur?: number): number` — 0..1 con easing
  - `wipe(frame, at, dur?): { clipPath: string; opacity: number }`
  - `rise(frame, at, dur?): { opacity: number; translate: string }`
  - `fadeIn(frame, at, dur?): { opacity: number }`
  - `draw(frame, at, dur?): { strokeDasharray: number; strokeDashoffset: number }`
  - `extend(frame, at, to: number, dur?): number`
  - `counter(frame, at, to: number, from?: number, dur?: number): number`
  - `pulse(frame: number, periodFrames: number): number` — 0..1 continuo

- [ ] **Step 1: Scrivere il test che fallisce**

Creare `tests/motion.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import {
  DUR,
  STAGGER,
  progress,
  wipe,
  rise,
  draw,
  extend,
  counter,
  pulse,
} from "../src/design/motion";

describe("progress", () => {
  it("vale 0 prima dell'inizio e 1 alla fine", () => {
    expect(progress(0, 30)).toBe(0);
    expect(progress(29, 30)).toBe(0);
    expect(progress(30 + DUR.base, 30)).toBe(1);
    expect(progress(999, 30)).toBe(1);
  });

  it("resta dentro 0..1 a meta corsa", () => {
    const p = progress(30 + DUR.base / 2, 30);
    expect(p).toBeGreaterThan(0);
    expect(p).toBeLessThan(1);
  });
});

describe("wipe", () => {
  it("parte completamente nascosto e finisce scoperto", () => {
    expect(wipe(0, 30).clipPath).toBe("inset(0 100% 0 0)");
    expect(wipe(60, 30).clipPath).toBe("inset(0 0% 0 0)");
    expect(wipe(60, 30).opacity).toBe(1);
  });
});

describe("rise", () => {
  it("scala lo spostamento verticale fino a zero", () => {
    expect(rise(0, 30).translate).toBe("0 12px");
    expect(rise(60, 30).translate).toBe("0 0px");
  });
});

describe("draw", () => {
  it("usa pathLength normalizzato e scopre il tracciato", () => {
    expect(draw(0, 30).strokeDasharray).toBe(1);
    expect(draw(0, 30).strokeDashoffset).toBe(1);
    expect(draw(60, 30).strokeDashoffset).toBe(0);
  });
});

describe("extend", () => {
  it("cresce da zero alla lunghezza richiesta", () => {
    expect(extend(0, 30, 400)).toBe(0);
    expect(extend(60, 30, 400)).toBe(400);
  });
});

describe("counter", () => {
  it("conta in numeri interi da from a to", () => {
    expect(counter(0, 30, 100)).toBe(0);
    expect(counter(999, 30, 100)).toBe(100);
    expect(Number.isInteger(counter(38, 30, 100))).toBe(true);
  });

  it("sa contare all'indietro", () => {
    expect(counter(999, 30, 1, 5)).toBe(1);
  });
});

describe("pulse", () => {
  it("resta nell'intervallo 0..1 ed e continuo al wrap", () => {
    const atWrap = pulse(90, 90);
    const justBefore = pulse(89.999, 90);
    expect(atWrap).toBeGreaterThanOrEqual(0);
    expect(atWrap).toBeLessThanOrEqual(1);
    // niente scatto: il valore al wrap coincide con quello immediatamente prima
    expect(Math.abs(atWrap - justBefore)).toBeLessThan(0.001);
  });
});

describe("scale", () => {
  it("espone i gradi di stagger previsti dallo spec", () => {
    expect(STAGGER).toEqual({ xtight: 4, tight: 6, base: 8, loose: 12 });
  });
});
```

- [ ] **Step 2: Eseguire il test e verificare che fallisca**

```bash
npm test
```

Atteso: FAIL — `Failed to resolve import "../src/design/motion"`.

- [ ] **Step 3: Implementare `src/design/motion.ts`**

```ts
import { Easing, interpolate } from "remotion";

/** durate in frame a 30 fps */
export const DUR = { micro: 6, fast: 9, base: 15, slow: 24 } as const;

/** gradi di stagger: le scene scelgono un grado, mai un numero arbitrario */
export const STAGGER = { xtight: 4, tight: 6, base: 8, loose: 12 } as const;

const EASE = Easing.bezier(0.22, 1, 0.36, 1);

const clampOpts = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

/** 0..1 con l'easing di ingresso unica del sistema */
export const progress = (frame: number, at: number, dur: number = DUR.base): number =>
  interpolate(frame, [at, at + dur], [0, 1], { ...clampOpts, easing: EASE });

/** rivelazione principale: il testo si scopre da sinistra */
export const wipe = (frame: number, at: number, dur: number = DUR.base) => {
  const p = progress(frame, at, dur);
  return {
    clipPath: "inset(0 " + (100 - p * 100) + "% 0 0)",
    opacity: interpolate(p, [0, 0.15], [0, 1], clampOpts),
  };
};

/** rivelazione secondaria: dissolvenza con scarto verticale minimo */
export const rise = (frame: number, at: number, dur: number = DUR.base) => {
  const p = progress(frame, at, dur);
  return { opacity: p, translate: "0 " + (12 - p * 12) + "px" };
};

export const fadeIn = (frame: number, at: number, dur: number = DUR.base) => ({
  opacity: progress(frame, at, dur),
});

/**
 * Tracciato che si disegna. Richiede pathLength="1" sul path, così la stessa
 * formula vale per qualunque forma senza misurarne la lunghezza.
 */
export const draw = (frame: number, at: number, dur: number = DUR.slow) => {
  const p = progress(frame, at, dur);
  return { strokeDasharray: 1, strokeDashoffset: 1 - p };
};

/** linee e regoli che crescono in lunghezza */
export const extend = (frame: number, at: number, to: number, dur: number = DUR.base): number =>
  progress(frame, at, dur) * to;

/** metriche animate; restituisce sempre un intero */
export const counter = (
  frame: number,
  at: number,
  to: number,
  from = 0,
  dur: number = DUR.slow
): number => Math.round(from + (to - from) * progress(frame, at, dur));

/**
 * Pulsazione continua 0..1. Sostituisce `frame % n`, che scatta al wrap
 * e non si allinea né ai tagli né alla musica.
 */
export const pulse = (frame: number, periodFrames: number): number =>
  (Math.sin((frame / periodFrames) * Math.PI * 2) + 1) / 2;
```

- [ ] **Step 4: Eseguire i test e verificare che passino**

```bash
npm test
```

Atteso: PASS su tutti i file (timing + motion).

- [ ] **Step 5: Verificare i tipi**

```bash
npm run lint
```

Atteso: nessun errore.

- [ ] **Step 6: Commit**

```bash
git add src/design/motion.ts tests/motion.test.ts
git commit -m "feat(motion): helper di rivelazione costruttiva con scale di durata e stagger"
```

---

## Task 4: Set di icone SVG

Sostituisce integralmente le emoji. Oltre alla coerenza visiva risolve la riproducibilità: `🛡️` oggi è disegnata da Segoe UI Emoji su Windows e da Noto altrove.

**Files:**
- Create: `src/design/icons.tsx`
- Create: `tests/icons.test.tsx`

**Interfaces:**
- Consumes: `draw` da `motion.ts`, `STROKE` da `tokens.ts`
- Produces:
  - `type IconName = 'check' | 'cross' | 'terminal' | 'file' | 'folder' | 'cloud' | 'cloudOff' | 'lock' | 'shield' | 'cpu' | 'package' | 'chart' | 'refresh' | 'bell' | 'wrench' | 'robot' | 'document'`
  - `<Icon name={IconName} size?: number color?: string frame?: number drawAt?: number />` — con `frame` e `drawAt` il tracciato si disegna, altrimenti l'icona è statica

- [ ] **Step 1: Scrivere il test che fallisce**

Creare `tests/icons.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Icon, ICON_NAMES } from "../src/design/icons";

describe("Icon", () => {
  it("espone tutte le icone richieste dalle scene", () => {
    expect(ICON_NAMES.length).toBe(17);
    expect(ICON_NAMES).toContain("shield");
    expect(ICON_NAMES).toContain("terminal");
    expect(ICON_NAMES).toContain("cloudOff");
  });

  it("normalizza ogni tracciato con pathLength=1", () => {
    for (let i = 0; i < ICON_NAMES.length; i++) {
      const markup = renderToStaticMarkup(<Icon name={ICON_NAMES[i]} />);
      const paths = markup.split("<path").length - 1;
      const normalized = markup.split('pathLength="1"').length - 1;
      expect(paths).toBeGreaterThan(0);
      expect(normalized).toBe(paths);
    }
  });

  it("disegna il tracciato quando riceve frame e drawAt", () => {
    const inizio = renderToStaticMarkup(<Icon name="check" frame={0} drawAt={30} />);
    const fine = renderToStaticMarkup(<Icon name="check" frame={120} drawAt={30} />);
    expect(inizio).toContain("stroke-dashoffset:1");
    expect(fine).toContain("stroke-dashoffset:0");
  });

  it("resta statica senza frame", () => {
    const markup = renderToStaticMarkup(<Icon name="check" />);
    expect(markup).not.toContain("stroke-dashoffset");
  });
});
```

- [ ] **Step 2: Eseguire il test e verificare che fallisca**

```bash
npm test
```

Atteso: FAIL — `Failed to resolve import "../src/design/icons"`.

- [ ] **Step 3: Implementare `src/design/icons.tsx`**

```tsx
import React from "react";
import { draw } from "./motion";
import { STROKE } from "./tokens";

export const ICON_NAMES = [
  "check",
  "cross",
  "terminal",
  "file",
  "folder",
  "cloud",
  "cloudOff",
  "lock",
  "shield",
  "cpu",
  "package",
  "chart",
  "refresh",
  "bell",
  "wrench",
  "robot",
  "document",
] as const;

export type IconName = (typeof ICON_NAMES)[number];

/** tracciati su viewBox 24, disegnati con un solo stroke */
const PATHS: Record<IconName, string[]> = {
  check: ["M4 12.5l5 5L20 6.5"],
  cross: ["M6 6l12 12", "M18 6L6 18"],
  terminal: ["M4 5h16v14H4z", "M7.5 9.5l2.5 2.5-2.5 2.5", "M13 15h4"],
  file: ["M6 3h8l4 4v14H6z", "M14 3v4h4"],
  folder: ["M3 6h6l2 3h10v11H3z"],
  cloud: ["M7 18h10a4 4 0 000-8 6 6 0 00-11.7 1.6A3.5 3.5 0 007 18z"],
  cloudOff: ["M7 18h10a4 4 0 00.9-7.9A6 6 0 006 8.5", "M3 3l18 18"],
  lock: ["M6 11h12v9H6z", "M9 11V8a3 3 0 016 0v3"],
  shield: ["M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"],
  cpu: ["M7 7h10v10H7z", "M4 10h3", "M4 14h3", "M17 10h3", "M17 14h3", "M10 4v3", "M14 4v3", "M10 17v3", "M14 17v3"],
  package: ["M12 3l8 4.5v9L12 21l-8-4.5v-9z", "M4 7.5l8 4.5 8-4.5", "M12 12v9"],
  chart: ["M4 20h16", "M7 20v-6", "M12 20V8", "M17 20v-9"],
  refresh: ["M20 12a8 8 0 11-2.6-5.9", "M20 4v5h-5"],
  bell: ["M6 16V11a6 6 0 1112 0v5l2 3H4z", "M10 22h4"],
  wrench: ["M15 7a4 4 0 01-5.2 5.2L4 18l2 2 5.8-5.8A4 4 0 0117 5.5z"],
  robot: ["M6 9h12v10H6z", "M12 5v4", "M9.5 13h.01", "M14.5 13h.01"],
  document: ["M6 3h8l4 4v14H6z", "M9 12h6", "M9 16h6"],
};

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  /** con frame + drawAt il tracciato si disegna invece di comparire */
  frame?: number;
  drawAt?: number;
};

export const Icon: React.FC<Props> = ({
  name,
  size = 36,
  color = "currentColor",
  frame,
  drawAt,
}) => {
  const animated = typeof frame === "number" && typeof drawAt === "number";
  const dash = animated ? draw(frame, drawAt) : null;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={STROKE}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flex: "none" }}
    >
      {PATHS[name].map((d, i) => (
        <path key={i} d={d} pathLength="1" style={dash ? dash : undefined} />
      ))}
    </svg>
  );
};
```

- [ ] **Step 4: Eseguire i test e verificare che passino**

```bash
npm test
```

Atteso: PASS. Se il test sul tracciato disegnato fallisce perché il markup riporta `stroke-dashoffset:1;` con il punto e virgola, è comunque un `toContain` soddisfatto — se invece riporta la forma camelCase, correggere l'asserzione in `strokeDashoffset`.

- [ ] **Step 5: Verificare i tipi**

```bash
npm run lint
```

- [ ] **Step 6: Commit**

```bash
git add src/design/icons.tsx tests/icons.test.tsx
git commit -m "feat(icons): set SVG a tratto che sostituisce le emoji"
```

---

## Task 5: Typing, riga di comando e finestra terminale

Il filo conduttore del video. `Terminal` e `CommandLine` sono due densità della stessa idea e condividono la funzione pura `typing`.

**Files:**
- Create: `src/components/typing.ts`
- Create: `src/components/CommandLine.tsx`
- Create: `src/components/Terminal.tsx`
- Create: `tests/typing.test.ts`

**Interfaces:**
- Consumes: `color`, `type`, `radius`, `space` da `tokens.ts`; `STAGGER` da `motion.ts`
- Produces:
  - `typing(frame: number, text: string, startAt: number, cps?: number): { visible: string; done: boolean; caret: boolean }`
  - `typingFrames(text: string, cps?: number): number` — quanti frame dura la digitazione
  - `type TerminalLine = { kind: 'command' | 'output' | 'ok' | 'err'; text: string }`
  - `<CommandLine text: string startAt: number />`
  - `<Terminal lines: TerminalLine[] startAt: number title?: string />`

- [ ] **Step 1: Scrivere il test che fallisce**

Creare `tests/typing.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { typing, typingFrames } from "../src/components/typing";

const TESTO = "$ node --version";

describe("typing", () => {
  it("non mostra nulla prima dell'inizio", () => {
    const t = typing(0, TESTO, 30);
    expect(t.visible).toBe("");
    expect(t.done).toBe(false);
  });

  it("mostra il testo completo a digitazione finita", () => {
    const t = typing(30 + typingFrames(TESTO), TESTO, 30);
    expect(t.visible).toBe(TESTO);
    expect(t.done).toBe(true);
  });

  it("scopre i caratteri progressivamente", () => {
    const a = typing(35, TESTO, 30);
    const b = typing(40, TESTO, 30);
    expect(a.visible.length).toBeGreaterThan(0);
    expect(b.visible.length).toBeGreaterThan(a.visible.length);
    expect(TESTO.indexOf(a.visible)).toBe(0);
  });

  it("non supera mai la lunghezza del testo", () => {
    expect(typing(99999, TESTO, 30).visible.length).toBe(TESTO.length);
  });

  it("fa lampeggiare il cursore su un ciclo di 30 frame", () => {
    expect(typing(0, TESTO, 30).caret).toBe(true);
    expect(typing(15, TESTO, 30).caret).toBe(false);
    expect(typing(30, TESTO, 30).caret).toBe(true);
  });
});

describe("typingFrames", () => {
  it("cresce con la lunghezza del testo", () => {
    expect(typingFrames("abc")).toBeLessThan(typingFrames("abcdefghij"));
  });

  it("rispetta il limite di 64 caratteri dello spec", () => {
    const massimo = "$ codex \"mesh bracket.inp, run simulation, plot results\"";
    expect(massimo.length).toBeLessThanOrEqual(64);
  });
});
```

- [ ] **Step 2: Eseguire il test e verificare che fallisca**

```bash
npm test
```

Atteso: FAIL — `Failed to resolve import "../src/components/typing"`.

- [ ] **Step 3: Implementare `src/components/typing.ts`**

```ts
const DEFAULT_CPS = 22;
const FPS = 30;
const CARET_PERIOD = 30;

export type Typed = { visible: string; done: boolean; caret: boolean };

export const typingFrames = (text: string, cps = DEFAULT_CPS): number =>
  Math.ceil((text.length / cps) * FPS);

export const typing = (
  frame: number,
  text: string,
  startAt: number,
  cps = DEFAULT_CPS
): Typed => {
  const elapsed = frame - startAt;
  const chars =
    elapsed <= 0 ? 0 : Math.min(text.length, Math.floor((elapsed * cps) / FPS));
  return {
    visible: text.slice(0, chars),
    done: chars >= text.length,
    caret: Math.floor(frame / (CARET_PERIOD / 2)) % 2 === 0,
  };
};
```

- [ ] **Step 4: Eseguire i test e verificare che passino**

```bash
npm test
```

Atteso: PASS.

- [ ] **Step 5: Implementare `src/components/CommandLine.tsx`**

```tsx
import React from "react";
import { useCurrentFrame } from "remotion";
import { color, space, type } from "../design/tokens";
import { typing } from "./typing";

type Props = {
  /** massimo 64 caratteri: oltre, la riga eccede la larghezza utile */
  text: string;
  startAt: number;
};

export const CommandLine: React.FC<Props> = ({ text, startAt }) => {
  const frame = useCurrentFrame();
  const t = typing(frame, text, startAt);
  const started = frame >= startAt;

  return (
    <div
      style={{
        borderTop: "1px solid " + color.line,
        paddingTop: space.md,
        display: "flex",
        alignItems: "center",
        gap: space.xs,
        opacity: started ? 1 : 0,
        ...type.mono,
        color: color.text,
      }}
    >
      <span style={{ color: color.accent }}>{t.visible.slice(0, 1)}</span>
      <span>{t.visible.slice(1)}</span>
      {t.caret ? (
        <span
          style={{
            display: "inline-block",
            width: 14,
            height: 34,
            backgroundColor: color.accent,
            marginLeft: 2,
          }}
        />
      ) : null}
    </div>
  );
};
```

- [ ] **Step 6: Implementare `src/components/Terminal.tsx`**

```tsx
import React from "react";
import { useCurrentFrame } from "remotion";
import { color, radius, space, type } from "../design/tokens";
import { STAGGER } from "../design/motion";
import { typing, typingFrames } from "./typing";

export type TerminalLine = {
  kind: "command" | "output" | "ok" | "err";
  text: string;
};

type Props = {
  lines: TerminalLine[];
  startAt: number;
  title?: string;
};

const colorFor = (kind: TerminalLine["kind"]): string => {
  if (kind === "command") return color.text;
  if (kind === "ok") return color.ok;
  if (kind === "err") return color.bad;
  return color.textMute;
};

export const Terminal: React.FC<Props> = ({ lines, startAt, title }) => {
  const frame = useCurrentFrame();

  // il comando si digita; l'output compare riga per riga dopo di esso
  let cursor = startAt;
  const schedule = lines.map((line) => {
    const at = cursor;
    cursor += line.kind === "command" ? typingFrames(line.text) : STAGGER.base;
    return at;
  });

  return (
    <div
      style={{
        backgroundColor: color.surface,
        border: "1px solid " + color.lineStrong,
        borderRadius: radius.md,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: space.xs,
          padding: space.sm + "px " + space.md + "px",
          borderBottom: "1px solid " + color.line,
        }}
      >
        <span style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: color.lineStrong }} />
        <span style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: color.lineStrong }} />
        <span style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: color.lineStrong }} />
        <span style={{ ...type.label, fontSize: 18, color: color.textFaint, marginLeft: space.xs }}>
          {title ? title : "workstation"}
        </span>
      </div>

      <div style={{ padding: space.md, display: "flex", flexDirection: "column", gap: space.xs }}>
        {lines.map((line, i) => {
          const at = schedule[i];
          if (frame < at) return null;

          if (line.kind === "command") {
            const t = typing(frame, line.text, at);
            return (
              <div key={i} style={{ ...type.mono, color: color.text }}>
                <span style={{ color: color.accent }}>{"$ "}</span>
                {t.visible}
                {t.caret && !t.done ? (
                  <span
                    style={{
                      display: "inline-block",
                      width: 14,
                      height: 30,
                      backgroundColor: color.accent,
                      verticalAlign: "-4px",
                    }}
                  />
                ) : null}
              </div>
            );
          }

          return (
            <div key={i} style={{ ...type.mono, fontSize: 30, color: colorFor(line.kind) }}>
              {line.kind === "output" ? "› " : ""}
              {line.text}
            </div>
          );
        })}
      </div>
    </div>
  );
};
```

- [ ] **Step 7: Verificare i tipi**

```bash
npm run lint
```

Atteso: nessun errore.

- [ ] **Step 8: Commit**

```bash
git add src/components/typing.ts src/components/CommandLine.tsx src/components/Terminal.tsx tests/typing.test.ts
git commit -m "feat(terminal): typing puro con riga di comando e finestra terminale"
```

---

## Task 6: Metric e SceneFrame

Il telaio che dà a sette capitoli lo stesso ritmo di apertura — oggi assente.

**Files:**
- Create: `src/components/Metric.tsx`
- Create: `src/components/SceneFrame.tsx`

**Interfaces:**
- Consumes: `color`, `type`, `space`, `SAFE` da `tokens.ts`; `wipe`, `fadeIn`, `extend`, `counter`, `DUR` da `motion.ts`; `CommandLine` dal Task 5
- Produces:
  - `<Metric to: number from?: number suffix?: string label: string at: number />`
  - `<SceneFrame index: number eyebrow: string title: string command?: string commandAt?: number children>`
  - `CONTENT_AT = 30` — unica costante di apertura esportata; il resto del ritmo di testata resta interno a `SceneFrame`

**Divergenza deliberata dallo spec:** lo spec §4 elenca anche un componente `Reveal`. Non lo costruiamo. Le scene applicano `...wipe(frame, at)` direttamente nello `style` dell'elemento che si rivela: è più conciso e, soprattutto, un wrapper `<div>` inserirebbe un livello di layout in mezzo ai contenitori flex e grid delle scene, cambiandone il comportamento. `wipe`/`rise`/`fadeIn` da `motion.ts` coprono già il bisogno. YAGNI.

- [ ] **Step 1: Implementare `src/components/Metric.tsx`**

```tsx
import React from "react";
import { useCurrentFrame } from "remotion";
import { counter, DUR, fadeIn } from "../design/motion";
import { color, space, type } from "../design/tokens";

type Props = {
  to: number;
  from?: number;
  suffix?: string;
  label: string;
  at: number;
};

export const Metric: React.FC<Props> = ({ to, from = 0, suffix, label, at }) => {
  const frame = useCurrentFrame();
  const value = counter(frame, at, to, from);

  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: space.md, ...fadeIn(frame, at, DUR.fast) }}>
      <span style={{ ...type.metric, color: color.accent }}>
        {value}
        {suffix ? <span style={{ fontSize: 72 }}>{suffix}</span> : null}
      </span>
      <span style={{ ...type.bodyLg, color: color.textMute }}>{label}</span>
    </div>
  );
};
```

- [ ] **Step 2: Implementare `src/components/SceneFrame.tsx`**

```tsx
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { color, SAFE, space, type } from "../design/tokens";
import { DUR, extend, wipe } from "../design/motion";
import { CommandLine } from "./CommandLine";

/** ritmo di apertura identico in tutte e sette le scene */
const HEAD_EYEBROW_AT = 0;
const HEAD_TITLE_AT = 6;
const HEAD_RULE_AT = 12;
/** unica costante che le scene devono conoscere: quando inizia il contenuto */
export const CONTENT_AT = 30;

const GRID_STEP = 64;

type Props = {
  index: number;
  eyebrow: string;
  title: string;
  /** assente in Scena 1: la CLI entra quando entra Node.js */
  command?: string;
  commandAt?: number;
  children: React.ReactNode;
};

const pad = (n: number): string => (n < 10 ? "0" + n : String(n));

export const SceneFrame: React.FC<Props> = ({
  index,
  eyebrow,
  title,
  command,
  commandAt,
  children,
}) => {
  const frame = useCurrentFrame();

  const gridImage =
    "linear-gradient(to right, " + color.line + " 1px, transparent 1px), " +
    "linear-gradient(to bottom, " + color.line + " 1px, transparent 1px)";

  return (
    <AbsoluteFill style={{ backgroundColor: color.bg }}>
      <AbsoluteFill
        style={{
          backgroundImage: gridImage,
          backgroundSize: GRID_STEP + "px " + GRID_STEP + "px",
          opacity: 0.55,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, #0e1319 0%, transparent 60%)",
        }}
      />

      <AbsoluteFill
        style={{
          padding: SAFE.y + "px " + SAFE.x + "px",
          display: "flex",
          flexDirection: "column",
          color: color.text,
        }}
      >
        <div style={{ ...type.label, color: color.textFaint, ...wipe(frame, HEAD_EYEBROW_AT, DUR.fast) }}>
          {pad(index)} / {eyebrow}
        </div>

        <div style={{ ...type.h1, marginTop: space.sm, ...wipe(frame, HEAD_TITLE_AT) }}>
          {title}
        </div>

        <div
          style={{
            height: 3,
            marginTop: space.md,
            backgroundColor: color.accent,
            width: extend(frame, HEAD_RULE_AT, 120),
          }}
        />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", marginTop: space.xl, minHeight: 0 }}>
          {children}
        </div>

        {command && typeof commandAt === "number" ? (
          <CommandLine text={command} startAt={commandAt} />
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
```

Nota: `pad` è scritto a mano perché `String.padStart` non è disponibile con `lib: ["es2015"]`.

- [ ] **Step 3: Verificare i tipi**

```bash
npm run lint
```

Atteso: nessun errore.

- [ ] **Step 4: Commit**

```bash
git add src/components/Metric.tsx src/components/SceneFrame.tsx
git commit -m "feat(components): telaio di scena e metriche animate"
```

---

## Task 7: Scena 5 pilota — CHECKPOINT

La scena più semplice fa da banco di prova del sistema. **Non proseguire ai task successivi senza revisione degli still.**

**Files:**
- Modify: `src/scenes/Scene5Security.tsx` (riscrittura completa)
- Modify: `src/Root.tsx` (durata di questa sola composizione: 12s)

**Interfaces:**
- Consumes: `SceneFrame`, `CONTENT_AT`, `Metric`, `Icon`, `wipe`, `STAGGER`, `DUR`, token
- Produces: `Scene5Security` come componente senza props.

- [ ] **Step 1: Riscrivere `src/scenes/Scene5Security.tsx`**

```tsx
import React from "react";
import { useCurrentFrame } from "remotion";
import { SceneFrame, CONTENT_AT } from "../components/SceneFrame";
import { Metric } from "../components/Metric";
import { Icon } from "../design/icons";
import { DUR, STAGGER, wipe } from "../design/motion";
import { color, space, type } from "../design/tokens";

const POINTS = [
  "Node.js runs 100% locally",
  "No simulation data leaves the machine",
  "No cloud dependency for execution",
  "IT maintains full control",
  "Open-source & fully auditable",
];

const TRUSTED = ["NASA", "NETFLIX", "PAYPAL"];

export const Scene5Security: React.FC = () => {
  const frame = useCurrentFrame();
  const shieldAt = CONTENT_AT;
  const firstPointAt = CONTENT_AT + DUR.base;
  const metricAt = firstPointAt + POINTS.length * STAGGER.loose + DUR.base;
  const trustedAt = metricAt + DUR.slow;

  return (
    <SceneFrame
      index={5}
      eyebrow="Security"
      title="Everything runs on your machine"
      command="$ netstat -an | findstr ESTABLISHED"
      commandAt={trustedAt + DUR.fast}
    >
      <div style={{ display: "flex", gap: space.huge, flex: 1, alignItems: "center" }}>
        <div style={{ flex: "none", color: color.accent }}>
          <Icon name="shield" size={280} frame={frame} drawAt={shieldAt} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: space.md, flex: 1 }}>
          {POINTS.map((point, i) => {
            const at = firstPointAt + i * STAGGER.loose;
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: space.md,
                  ...wipe(frame, at),
                }}
              >
                <Icon name="check" size={34} color={color.accent} frame={frame} drawAt={at} />
                <span style={{ ...type.bodyLg, color: color.text }}>{point}</span>
              </div>
            );
          })}

          <div style={{ marginTop: space.lg }}>
            <Metric to={100} suffix="%" label="local execution" at={metricAt} />
          </div>

          <div
            style={{
              display: "flex",
              gap: space.lg,
              marginTop: space.md,
              ...wipe(frame, trustedAt),
            }}
          >
            <span style={{ ...type.label, color: color.textFaint }}>Trusted by</span>
            {TRUSTED.map((name) => (
              <span key={name} style={{ ...type.label, color: color.textMute }}>
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </SceneFrame>
  );
};
```

- [ ] **Step 2: Aggiornare la durata della composizione in `src/Root.tsx`**

Nel blocco `<Composition id="Scene5-Security" …>`, sostituire `durationInFrames={10 * fps}` con `durationInFrames={12 * fps}`. Il resto di `Root.tsx` viene rifatto nel Task 14.

- [ ] **Step 3: Verificare i tipi**

```bash
npm run lint
```

Atteso: nessun errore.

- [ ] **Step 4: Produrre gli still di controllo**

```bash
npx remotion still Scene5-Security "C:\Users\nikky\AppData\Local\Temp\claude\C--Users-nikky-Desktop-NODEJD-nodejd-video\e2dffe8c-7745-4e9d-b0da-42236af054aa\scratchpad\s5-a.png" --frame=40
```

```bash
npx remotion still Scene5-Security "C:\Users\nikky\AppData\Local\Temp\claude\C--Users-nikky-Desktop-NODEJD-nodejd-video\e2dffe8c-7745-4e9d-b0da-42236af054aa\scratchpad\s5-b.png" --frame=180
```

```bash
npx remotion still Scene5-Security "C:\Users\nikky\AppData\Local\Temp\claude\C--Users-nikky-Desktop-NODEJD-nodejd-video\e2dffe8c-7745-4e9d-b0da-42236af054aa\scratchpad\s5-c.png" --frame=340
```

- [ ] **Step 5: Ispezionare gli still contro i vincoli**

Leggere le tre immagini e verificare: Inter e JetBrains Mono effettivamente renderizzati (non il fallback di sistema); nessun testo fuori dalla safe area 96 × 80; scudo disegnato a tratto e non riempito; nessuna emoji; contatore in cifre a larghezza fissa; riga di comando entro la larghezza.

- [ ] **Step 6: CHECKPOINT — presentare gli still all'utente**

Mostrare le tre immagini e attendere approvazione **prima** di migrare le altre sei scene. Se il sistema è sbagliato, va corretto qui, dove costa una scena e non sette.

- [ ] **Step 7: Commit**

```bash
git add src/scenes/Scene5Security.tsx src/Root.tsx
git commit -m "feat(scene5): migrazione pilota al design system Console"
```

---

## Task 8: Scena 1 — The Problem

Il ciclo chiuso: i cinque passi tornano al primo, che è il punto del messaggio. Nessuna riga di comando.

**Files:**
- Modify: `src/scenes/Scene1Intro.tsx` (riscrittura completa)

**Interfaces:**
- Consumes: `SceneFrame`, `CONTENT_AT`, `Icon`, `wipe`, `pulse`, `STAGGER`, `DUR`, token
- Produces: `Scene1Intro`.

- [ ] **Step 1: Riscrivere `src/scenes/Scene1Intro.tsx`**

```tsx
import React from "react";
import { useCurrentFrame } from "remotion";
import { SceneFrame, CONTENT_AT } from "../components/SceneFrame";
import { Icon, IconName } from "../design/icons";
import { DUR, pulse, STAGGER, wipe } from "../design/motion";
import { color, radius, space, type } from "../design/tokens";

const STEPS: { text: string; icon: IconName; isError?: boolean }[] = [
  { text: "Open ChatGPT", icon: "cloud" },
  { text: "Copy-paste code", icon: "document" },
  { text: "Edit script manually", icon: "file" },
  { text: "Run in Abaqus", icon: "cpu" },
  { text: "Error? Repeat.", icon: "refresh", isError: true },
];

export const Scene1Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const firstStepAt = CONTENT_AT;
  const loopAt = firstStepAt + STEPS.length * STAGGER.loose + DUR.base;
  const subtitleAt = loopAt + DUR.slow;

  // secondo giro accelerato: il ciclo si rilegge, ed è questo il messaggio
  const highlighted = frame < loopAt ? -1 : Math.floor((frame - loopAt) / 8) % STEPS.length;

  return (
    <SceneFrame index={1} eyebrow="The Problem" title="Your FEM workflow today">
      <div style={{ display: "flex", flex: 1, alignItems: "center", gap: space.xxl }}>
        <div style={{ display: "flex", flexDirection: "column", gap: space.sm, flex: 1 }}>
          {STEPS.map((step, i) => {
            const at = firstStepAt + i * STAGGER.loose;
            const active = highlighted === i;
            const glow = step.isError ? pulse(frame, 60) : 0;
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: space.md,
                  padding: space.sm + "px " + space.lg + "px",
                  backgroundColor: color.surface,
                  border:
                    "1px solid " +
                    (step.isError ? color.bad : active ? color.accentDim : color.line),
                  borderRadius: radius.md,
                  boxShadow: step.isError ? "0 0 " + (12 + glow * 24) + "px " + color.bad + "40" : "none",
                  ...wipe(frame, at),
                }}
              >
                <Icon
                  name={step.icon}
                  size={38}
                  color={step.isError ? color.bad : color.textMute}
                  frame={frame}
                  drawAt={at}
                />
                <span style={{ ...type.bodyLg, color: step.isError ? color.bad : color.text }}>
                  {step.text}
                </span>
              </div>
            );
          })}
        </div>

        {/* l'anello che chiude il ciclo: dall'ultimo passo torna al primo */}
        <div style={{ flex: "none", width: 160, height: 420, position: "relative", ...wipe(frame, loopAt) }}>
          <svg width={160} height={420} viewBox="0 0 160 420" fill="none">
            <path
              d="M0 390 H120 A40 40 0 0 0 120 30 H0"
              pathLength="1"
              stroke={color.bad}
              strokeWidth={3}
              strokeDasharray={1}
              strokeDashoffset={Math.max(0, 1 - (frame - loopAt) / DUR.slow)}
              fill="none"
            />
            <path d="M0 30 l18 -10 M0 30 l18 10" stroke={color.bad} strokeWidth={3} pathLength="1" />
          </svg>
        </div>
      </div>

      <div style={{ ...type.h2, color: color.textMute, ...wipe(frame, subtitleAt) }}>
        Manual. Repetitive. Error-prone.
      </div>
    </SceneFrame>
  );
};
```

- [ ] **Step 2: Verificare i tipi**

```bash
npm run lint
```

- [ ] **Step 3: Still di controllo**

```bash
npx remotion still Scene1-Problem "C:\Users\nikky\AppData\Local\Temp\claude\C--Users-nikky-Desktop-NODEJD-nodejd-video\e2dffe8c-7745-4e9d-b0da-42236af054aa\scratchpad\s1-a.png" --frame=60
```

```bash
npx remotion still Scene1-Problem "C:\Users\nikky\AppData\Local\Temp\claude\C--Users-nikky-Desktop-NODEJD-nodejd-video\e2dffe8c-7745-4e9d-b0da-42236af054aa\scratchpad\s1-b.png" --frame=200
```

```bash
npx remotion still Scene1-Problem "C:\Users\nikky\AppData\Local\Temp\claude\C--Users-nikky-Desktop-NODEJD-nodejd-video\e2dffe8c-7745-4e9d-b0da-42236af054aa\scratchpad\s1-c.png" --frame=300
```

Verificare: nessuna emoji, nessuna riga di comando in questa scena, anello visibile al frame 300, sottotitolo presente entro frame 290.

- [ ] **Step 4: Commit**

```bash
git add src/scenes/Scene1Intro.tsx
git commit -m "feat(scene1): ciclo chiuso al posto della lista verticale"
```

---

## Task 9: Scena 2 — Solution Architecture

Chiude la fragilità geometrica che ha prodotto il bug del commit `d386398`: le lunghezze delle linee non sono più numeri da tenere allineati a mano.

**Files:**
- Modify: `src/scenes/Scene2Solution.tsx` (riscrittura completa)

**Interfaces:**
- Consumes: `SceneFrame`, `CONTENT_AT`, `Icon`, `extend`, `wipe`, `DUR`, `STAGGER`, token
- Produces: `Scene2Solution`.

- [ ] **Step 1: Riscrivere `src/scenes/Scene2Solution.tsx`**

```tsx
import React from "react";
import { useCurrentFrame } from "remotion";
import { SceneFrame, CONTENT_AT } from "../components/SceneFrame";
import { Icon, IconName } from "../design/icons";
import { DUR, extend, wipe } from "../design/motion";
import { color, radius, space, type } from "../design/tokens";

/**
 * Unica costante geometrica della scena: le linee arrivano esattamente al
 * bordo dei nodi perché la loro lunghezza deriva da qui, non da valori
 * scritti a mano (era la causa del bug corretto in d386398).
 */
const RADIUS_X = 420;
const RADIUS_Y = 240;
const NODE_HALF_W = 150;
const NODE_HALF_H = 60;

type Node = {
  id: string;
  label: string;
  detail: string;
  icon: IconName;
  dx: number;
  dy: number;
  at: number;
};

const SATELLITES: Node[] = [
  { id: "cli", label: "Agentic CLI", detail: "Codex CLI · Claude Code · Aider", icon: "terminal", dx: 1, dy: 0, at: CONTENT_AT + 20 },
  { id: "py", label: "Python Scripts", detail: "Abaqus automation", icon: "file", dx: 0, dy: 1, at: CONTENT_AT + 40 },
  { id: "fs", label: "File System", detail: ".inp · .py · .odb", icon: "folder", dx: -1, dy: 0, at: CONTENT_AT + 60 },
  { id: "npm", label: "npm Ecosystem", detail: "2.5M+ packages", icon: "package", dx: 0, dy: -1, at: CONTENT_AT + 80 },
];

export const Scene2Solution: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <SceneFrame
      index={2}
      eyebrow="Solution"
      title="Node.js as the orchestrator"
      command="$ node --version"
      commandAt={CONTENT_AT + 120}
    >
      <div style={{ flex: 1, position: "relative" }}>
        {SATELLITES.map((node) => {
          const horizontal = node.dx !== 0;
          const full = horizontal ? RADIUS_X - NODE_HALF_W : RADIUS_Y - NODE_HALF_H;
          const grown = extend(frame, node.at, full, DUR.base);
          return (
            <div
              key={node.id + "-line"}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: horizontal ? grown : 3,
                height: horizontal ? 3 : grown,
                backgroundColor: color.accentDim,
                transformOrigin: "top left",
                translate:
                  (horizontal ? (node.dx > 0 ? "0" : "-100%") : "-50%") +
                  " " +
                  (horizontal ? "-50%" : node.dy > 0 ? "0" : "-100%"),
              }}
            />
          );
        })}

        {/* nodo centrale: la gerarchia la fa il centro, non cinque colori */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            translate: "-50% -50%",
            backgroundColor: color.surface,
            border: "2px solid " + color.accent,
            borderRadius: radius.lg,
            padding: space.md + "px " + space.xl + "px",
            display: "flex",
            alignItems: "center",
            gap: space.md,
            boxShadow: "0 0 60px " + color.accentDim,
            ...wipe(frame, CONTENT_AT),
          }}
        >
          <Icon name="cpu" size={44} color={color.accent} frame={frame} drawAt={CONTENT_AT} />
          <span style={{ ...type.h2, color: color.text }}>Node.js</span>
        </div>

        {SATELLITES.map((node) => (
          <div
            key={node.id}
            style={{
              position: "absolute",
              top: "calc(50% + " + node.dy * RADIUS_Y + "px)",
              left: "calc(50% + " + node.dx * RADIUS_X + "px)",
              translate: "-50% -50%",
              width: NODE_HALF_W * 2,
              boxSizing: "border-box",
              backgroundColor: color.surface,
              border: "1px solid " + color.line,
              borderRadius: radius.md,
              padding: space.md,
              textAlign: "center",
              ...wipe(frame, node.at + DUR.fast),
            }}
          >
            <Icon name={node.icon} size={32} color={color.accent} frame={frame} drawAt={node.at + DUR.fast} />
            <div style={{ ...type.body, color: color.text, marginTop: space.xs }}>{node.label}</div>
            <div style={{ ...type.small, color: color.textFaint, marginTop: 4 }}>{node.detail}</div>
          </div>
        ))}
      </div>
    </SceneFrame>
  );
};
```

- [ ] **Step 2: Verificare i tipi**

```bash
npm run lint
```

- [ ] **Step 3: Still di controllo**

```bash
npx remotion still Scene2-Solution "C:\Users\nikky\AppData\Local\Temp\claude\C--Users-nikky-Desktop-NODEJD-nodejd-video\e2dffe8c-7745-4e9d-b0da-42236af054aa\scratchpad\s2-a.png" --frame=60
```

```bash
npx remotion still Scene2-Solution "C:\Users\nikky\AppData\Local\Temp\claude\C--Users-nikky-Desktop-NODEJD-nodejd-video\e2dffe8c-7745-4e9d-b0da-42236af054aa\scratchpad\s2-b.png" --frame=200
```

```bash
npx remotion still Scene2-Solution "C:\Users\nikky\AppData\Local\Temp\claude\C--Users-nikky-Desktop-NODEJD-nodejd-video\e2dffe8c-7745-4e9d-b0da-42236af054aa\scratchpad\s2-c.png" --frame=370
```

Verificare in particolare che **nessuna linea sporga oltre il bordo dei nodi** — il difetto che questa riscrittura deve rendere impossibile — e che i quattro satelliti non escano dalla safe area.

- [ ] **Step 4: Commit**

```bash
git add src/scenes/Scene2Solution.tsx
git commit -m "feat(scene2): geometria derivata da RADIUS al posto dei valori hardcoded"
```

---

## Task 10: Scena 3 — Comparison

Elimina 8,5 secondi di fermo immagine e sostituisce `✅/❌` con le icone.

**Files:**
- Modify: `src/scenes/Scene3Comparison.tsx` (riscrittura completa)

**Interfaces:**
- Consumes: `SceneFrame`, `CONTENT_AT`, `Icon`, `Metric`, `wipe`, `STAGGER`, `DUR`, token
- Produces: `Scene3Comparison`.

- [ ] **Step 1: Riscrivere `src/scenes/Scene3Comparison.tsx`**

```tsx
import React from "react";
import { useCurrentFrame } from "remotion";
import { SceneFrame, CONTENT_AT } from "../components/SceneFrame";
import { Metric } from "../components/Metric";
import { Icon } from "../design/icons";
import { DUR, STAGGER, wipe } from "../design/motion";
import { color, radius, space, type } from "../design/tokens";

const ROWS = [
  { label: "Filesystem access", bad: "None", good: "Direct read / write" },
  { label: "Execution", bad: "Copy-paste", good: "Runs commands directly" },
  { label: "Simulation files", bad: "Manual transfer", good: "Reads & writes natively" },
  { label: "Abaqus integration", bad: "Impossible", good: "Direct CLI execution" },
  { label: "Context", bad: "Limited window", good: "Full codebase awareness" },
  { label: "Data location", bad: "Cloud", good: "Local, via Node.js" },
];

export const Scene3Comparison: React.FC = () => {
  const frame = useCurrentFrame();
  const headerAt = CONTENT_AT;
  const firstRowAt = CONTENT_AT + DUR.fast;
  const metricAt = firstRowAt + ROWS.length * STAGGER.loose + DUR.base;

  return (
    <SceneFrame
      index={3}
      eyebrow="Comparison"
      title="ChatGPT App vs Codex CLI"
      command="$ codex --help"
      commandAt={metricAt + DUR.slow}
    >
      <div style={{ display: "flex", ...type.label, color: color.textFaint, paddingBottom: space.sm, ...wipe(frame, headerAt) }}>
        <div style={{ flex: 1.4 }} />
        <div style={{ flex: 1 }}>ChatGPT App</div>
        <div style={{ flex: 1 }}>Codex CLI</div>
      </div>

      {ROWS.map((row, i) => {
        const at = firstRowAt + i * STAGGER.loose;
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              padding: space.sm + "px 0",
              borderBottom: "1px solid " + color.line,
              ...wipe(frame, at),
            }}
          >
            <div style={{ flex: 1.4, ...type.body, color: color.textMute, fontWeight: 500 }}>
              {row.label}
            </div>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: space.sm, ...type.body, color: color.textFaint }}>
              <Icon name="cross" size={30} color={color.bad} frame={frame} drawAt={at} />
              {row.bad}
            </div>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: space.sm, ...type.body, color: color.text }}>
              <Icon name="check" size={30} color={color.accent} frame={frame} drawAt={at + 3} />
              {row.good}
            </div>
          </div>
        );
      })}

      <div style={{ marginTop: space.lg, display: "flex", justifyContent: "flex-end" }}>
        <div style={{ borderRadius: radius.md, padding: space.md, border: "1px solid " + color.accentDim }}>
          <Metric to={6} label="capabilities unlocked" at={metricAt} />
        </div>
      </div>
    </SceneFrame>
  );
};
```

- [ ] **Step 2: Verificare i tipi**

```bash
npm run lint
```

- [ ] **Step 3: Still di controllo**

```bash
npx remotion still Scene3-Comparison "C:\Users\nikky\AppData\Local\Temp\claude\C--Users-nikky-Desktop-NODEJD-nodejd-video\e2dffe8c-7745-4e9d-b0da-42236af054aa\scratchpad\s3-a.png" --frame=60
```

```bash
npx remotion still Scene3-Comparison "C:\Users\nikky\AppData\Local\Temp\claude\C--Users-nikky-Desktop-NODEJD-nodejd-video\e2dffe8c-7745-4e9d-b0da-42236af054aa\scratchpad\s3-b.png" --frame=200
```

```bash
npx remotion still Scene3-Comparison "C:\Users\nikky\AppData\Local\Temp\claude\C--Users-nikky-Desktop-NODEJD-nodejd-video\e2dffe8c-7745-4e9d-b0da-42236af054aa\scratchpad\s3-c.png" --frame=400
```

Verificare che al frame 400 la scena sia visivamente completa (metrica inclusa) e che le sei righe stiano dentro l'altezza utile senza traboccare.

- [ ] **Step 4: Commit**

```bash
git add src/scenes/Scene3Comparison.tsx
git commit -m "feat(scene3): tabella con icone e metrica finale, tempi morti eliminati"
```

---

## Task 11: Scena 4 — Time Saving

La scena che ospita la finestra terminale piena.

**Files:**
- Modify: `src/scenes/Scene4TimeSaving.tsx` (riscrittura completa)

**Interfaces:**
- Consumes: `SceneFrame`, `CONTENT_AT`, `Terminal`, `TerminalLine`, `Metric`, `Icon`, `wipe`, `STAGGER`, `DUR`, token
- Produces: `Scene4TimeSaving`.

- [ ] **Step 1: Riscrivere `src/scenes/Scene4TimeSaving.tsx`**

```tsx
import React from "react";
import { useCurrentFrame } from "remotion";
import { SceneFrame, CONTENT_AT } from "../components/SceneFrame";
import { Terminal, TerminalLine } from "../components/Terminal";
import { Metric } from "../components/Metric";
import { Icon } from "../design/icons";
import { DUR, STAGGER, wipe } from "../design/motion";
import { color, radius, space, type } from "../design/tokens";

const MANUAL = ["Open browser", "Copy code", "Paste & edit", "Run & debug", "Repeat"];

const SESSION: TerminalLine[] = [
  { kind: "command", text: 'codex "mesh bracket.inp, run, plot"' },
  { kind: "output", text: "reading bracket.inp" },
  { kind: "output", text: "generating mesh_param.py" },
  { kind: "output", text: "abaqus cae noGUI=mesh_param.py" },
  { kind: "ok", text: "job completed — results.odb" },
];

export const Scene4TimeSaving: React.FC = () => {
  const frame = useCurrentFrame();
  const firstManualAt = CONTENT_AT;
  const terminalAt = CONTENT_AT + DUR.base;
  const metricAt = 300;

  return (
    <SceneFrame index={4} eyebrow="Time Saving" title="Five steps, or one command">
      <div style={{ display: "flex", gap: space.xxl, flex: 1, minHeight: 0 }}>
        <div style={{ flex: 0.8, display: "flex", flexDirection: "column", gap: space.xs }}>
          <div style={{ ...type.label, color: color.bad, marginBottom: space.xs }}>Manual</div>
          {MANUAL.map((step, i) => {
            const at = firstManualAt + i * STAGGER.tight;
            return (
              <div
                key={i}
                style={{
                  border: "1px solid " + color.line,
                  borderRadius: radius.sm,
                  padding: space.xs + "px " + space.md + "px",
                  ...type.body,
                  color: color.textMute,
                  ...wipe(frame, at),
                }}
              >
                {step}
              </div>
            );
          })}
          <div style={{ marginTop: space.md, display: "flex", alignItems: "center", gap: space.sm, ...wipe(frame, firstManualAt + 5 * STAGGER.tight) }}>
            <Icon name="refresh" size={32} color={color.bad} frame={frame} drawAt={firstManualAt + 5 * STAGGER.tight} />
            <span style={{ ...type.small, color: color.bad }}>and back to the start</span>
          </div>
        </div>

        <div style={{ flex: 1.4, display: "flex", flexDirection: "column", gap: space.md }}>
          <div style={{ ...type.label, color: color.accent }}>Agentic</div>
          <Terminal lines={SESSION} startAt={terminalAt} title="workstation — codex" />
          <div style={{ marginTop: space.md }}>
            <Metric to={1} from={5} label="steps to a running simulation" at={metricAt} />
          </div>
        </div>
      </div>
    </SceneFrame>
  );
};
```

Nota: la Scena 4 non riceve `command`, perché il terminale pieno assolve già a quel ruolo — due comandi nello stesso frame competerebbero.

- [ ] **Step 2: Verificare i tipi**

```bash
npm run lint
```

- [ ] **Step 3: Still di controllo**

```bash
npx remotion still Scene4-TimeSaving "C:\Users\nikky\AppData\Local\Temp\claude\C--Users-nikky-Desktop-NODEJD-nodejd-video\e2dffe8c-7745-4e9d-b0da-42236af054aa\scratchpad\s4-a.png" --frame=70
```

```bash
npx remotion still Scene4-TimeSaving "C:\Users\nikky\AppData\Local\Temp\claude\C--Users-nikky-Desktop-NODEJD-nodejd-video\e2dffe8c-7745-4e9d-b0da-42236af054aa\scratchpad\s4-b.png" --frame=220
```

```bash
npx remotion still Scene4-TimeSaving "C:\Users\nikky\AppData\Local\Temp\claude\C--Users-nikky-Desktop-NODEJD-nodejd-video\e2dffe8c-7745-4e9d-b0da-42236af054aa\scratchpad\s4-c.png" --frame=400
```

**Verifica critica di questo task:** al frame 400 l'ultima riga di output (`job completed`) deve essere già comparsa. Se non lo è, la digitazione è troppo lenta per i 14 secondi previsti: aumentare `cps` nella chiamata a `typing` dentro `Terminal`, oppure portare `timeSaving` a 15 secondi in `timing.ts` e aggiornare `lastRevealAt`. Riportare la decisione presa nel messaggio di commit.

- [ ] **Step 4: Commit**

```bash
git add src/scenes/Scene4TimeSaving.tsx
git commit -m "feat(scene4): finestra terminale con output progressivo e metrica 5 to 1"
```

---

## Task 12: Scena 6 — Applications

Griglia 3×3, niente riga orfana, ingresso a onda diagonale.

**Files:**
- Modify: `src/scenes/Scene6Applications.tsx` (riscrittura completa)

**Interfaces:**
- Consumes: `SceneFrame`, `CONTENT_AT`, `Icon`, `IconName`, `wipe`, `STAGGER`, `DUR`, token
- Produces: `Scene6Applications`.

- [ ] **Step 1: Riscrivere `src/scenes/Scene6Applications.tsx`**

```tsx
import React from "react";
import { useCurrentFrame } from "remotion";
import { SceneFrame, CONTENT_AT } from "../components/SceneFrame";
import { Icon, IconName } from "../design/icons";
import { DUR, STAGGER, wipe } from "../design/motion";
import { color, radius, space, type } from "../design/tokens";

const ITEMS: { icon: IconName; text: string }[] = [
  { icon: "wrench", text: "Automated mesh generation" },
  { icon: "package", text: "Batch simulation launches" },
  { icon: "chart", text: "Post-processing & reporting" },
  { icon: "refresh", text: "Parametric studies" },
  { icon: "robot", text: "AI-assisted .inp debugging" },
  { icon: "cpu", text: "Mesh → simulate → results" },
  { icon: "terminal", text: "Custom CLI tools for your team" },
  { icon: "bell", text: "Real-time log monitoring" },
  { icon: "document", text: "Auto-generated PDF reports" },
];

const COLS = 3;

export const Scene6Applications: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <SceneFrame
      index={6}
      eyebrow="Capabilities"
      title="What this unlocks"
      command="$ npm run simulate -- --batch"
      commandAt={CONTENT_AT + 200}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: space.md,
          flex: 1,
          alignContent: "center",
        }}
      >
        {ITEMS.map((item, i) => {
          // onda diagonale: la colonna scala di tight, la riga di loose
          const col = i % COLS;
          const row = Math.floor(i / COLS);
          const at = CONTENT_AT + col * STAGGER.tight + row * STAGGER.loose;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: space.md,
                backgroundColor: color.surface,
                border: "1px solid " + color.line,
                borderRadius: radius.md,
                padding: space.md,
                ...wipe(frame, at, DUR.base),
              }}
            >
              <Icon name={item.icon} size={34} color={color.accent} frame={frame} drawAt={at} />
              <span style={{ ...type.body, color: color.text }}>{item.text}</span>
            </div>
          );
        })}
      </div>
    </SceneFrame>
  );
};
```

- [ ] **Step 2: Verificare i tipi**

```bash
npm run lint
```

- [ ] **Step 3: Still di controllo**

```bash
npx remotion still Scene6-Applications "C:\Users\nikky\AppData\Local\Temp\claude\C--Users-nikky-Desktop-NODEJD-nodejd-video\e2dffe8c-7745-4e9d-b0da-42236af054aa\scratchpad\s6-a.png" --frame=60
```

```bash
npx remotion still Scene6-Applications "C:\Users\nikky\AppData\Local\Temp\claude\C--Users-nikky-Desktop-NODEJD-nodejd-video\e2dffe8c-7745-4e9d-b0da-42236af054aa\scratchpad\s6-b.png" --frame=180
```

```bash
npx remotion still Scene6-Applications "C:\Users\nikky\AppData\Local\Temp\claude\C--Users-nikky-Desktop-NODEJD-nodejd-video\e2dffe8c-7745-4e9d-b0da-42236af054aa\scratchpad\s6-c.png" --frame=350
```

Verificare che nessun testo vada a capo dentro le celle. Se accade, accorciare la voce interessata restando fedele al significato originale.

- [ ] **Step 4: Commit**

```bash
git add src/scenes/Scene6Applications.tsx
git commit -m "feat(scene6): griglia 3x3 con ingresso a onda diagonale"
```

---

## Task 13: Scena 7 — CTA

Il pay-off del filo conduttore: l'ultimo comando è quello da eseguire davvero.

**Files:**
- Modify: `src/scenes/Scene7CTA.tsx` (riscrittura completa)

**Interfaces:**
- Consumes: `Terminal`, `TerminalLine`, `wipe`, `fadeIn`, `pulse`, `DUR`, token; `AbsoluteFill` da remotion
- Produces: `Scene7CTA`.

Questa scena non usa `SceneFrame`: è la chiusura, e il telaio con eyebrow numerata la indebolirebbe.

- [ ] **Step 1: Riscrivere `src/scenes/Scene7CTA.tsx`**

```tsx
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Terminal, TerminalLine } from "../components/Terminal";
import { DUR, fadeIn, pulse, wipe } from "../design/motion";
import { color, space, type } from "../design/tokens";

const INSTALL: TerminalLine[] = [
  { kind: "command", text: "winget install OpenJS.NodeJS.LTS" },
  { kind: "ok", text: "Node.js v22 LTS installed" },
];

export const Scene7CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const titleAt = 10;
  const subtitleAt = 40;
  const terminalAt = 90;
  const taglineAt = 220;

  // la griglia si spegne mentre resta la chiusura
  const gridFade = 1 - fadeIn(frame, 240, DUR.slow).opacity;
  const gridImage =
    "linear-gradient(to right, " + color.line + " 1px, transparent 1px), " +
    "linear-gradient(to bottom, " + color.line + " 1px, transparent 1px)";

  return (
    <AbsoluteFill style={{ backgroundColor: color.bg }}>
      <AbsoluteFill
        style={{ backgroundImage: gridImage, backgroundSize: "64px 64px", opacity: 0.55 * gridFade }}
      />
      <AbsoluteFill
        style={{
          background: "radial-gradient(circle at 50% 45%, " + color.accentDim + " 0%, transparent 55%)",
          opacity: 0.35 + pulse(frame, 90) * 0.25,
        }}
      />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: space.lg,
          padding: 80,
        }}
      >
        <div style={{ ...type.display, color: color.text, ...wipe(frame, titleAt, DUR.slow) }}>
          Install Node.js.
        </div>

        <div style={{ ...type.h2, color: color.accent, ...wipe(frame, subtitleAt) }}>
          Unlock the future of FEM automation.
        </div>

        <div style={{ width: 900, marginTop: space.lg, ...fadeIn(frame, terminalAt, DUR.base) }}>
          <Terminal lines={INSTALL} startAt={terminalAt} title="workstation" />
        </div>

        <div style={{ ...type.bodyLg, color: color.textMute, marginTop: space.lg, ...wipe(frame, taglineAt) }}>
          One install. Infinite possibilities.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Verificare i tipi**

```bash
npm run lint
```

- [ ] **Step 3: Still di controllo**

```bash
npx remotion still Scene7-CTA "C:\Users\nikky\AppData\Local\Temp\claude\C--Users-nikky-Desktop-NODEJD-nodejd-video\e2dffe8c-7745-4e9d-b0da-42236af054aa\scratchpad\s7-a.png" --frame=60
```

```bash
npx remotion still Scene7-CTA "C:\Users\nikky\AppData\Local\Temp\claude\C--Users-nikky-Desktop-NODEJD-nodejd-video\e2dffe8c-7745-4e9d-b0da-42236af054aa\scratchpad\s7-b.png" --frame=180
```

```bash
npx remotion still Scene7-CTA "C:\Users\nikky\AppData\Local\Temp\claude\C--Users-nikky-Desktop-NODEJD-nodejd-video\e2dffe8c-7745-4e9d-b0da-42236af054aa\scratchpad\s7-c.png" --frame=290
```

- [ ] **Step 4: Commit**

```bash
git add src/scenes/Scene7CTA.tsx
git commit -m "feat(scene7): chiusura con il comando di installazione come pay-off"
```

---

## Task 14: Composizione, durate e transizioni differenziate

Elimina la duplicazione delle durate e sostituisce le sei `fade()` identiche.

**Files:**
- Modify: `src/Root.tsx` (riscrittura completa)
- Modify: `src/NodeJDVideo.tsx` (riscrittura completa)

**Interfaces:**
- Consumes: `SCENES`, `FPS`, `TRANSITION_FRAMES`, `totalFrames`, `sceneFrames`, `timingWarnings` da `timing.ts`; le 7 scene
- Produces: composizioni registrate con le durate corrette.

- [ ] **Step 1: Riscrivere `src/Root.tsx`**

```tsx
import "./index.css";
import React from "react";
import { Composition, Folder } from "remotion";
import { NodeJDVideo } from "./NodeJDVideo";
import { FPS, SCENES, sceneFrames, timingWarnings, totalFrames } from "./design/timing";
import { Scene1Intro } from "./scenes/Scene1Intro";
import { Scene2Solution } from "./scenes/Scene2Solution";
import { Scene3Comparison } from "./scenes/Scene3Comparison";
import { Scene4TimeSaving } from "./scenes/Scene4TimeSaving";
import { Scene5Security } from "./scenes/Scene5Security";
import { Scene6Applications } from "./scenes/Scene6Applications";
import { Scene7CTA } from "./scenes/Scene7CTA";

const COMPONENTS = {
  problem: Scene1Intro,
  solution: Scene2Solution,
  comparison: Scene3Comparison,
  timeSaving: Scene4TimeSaving,
  security: Scene5Security,
  applications: Scene6Applications,
  cta: Scene7CTA,
};

export const RemotionRoot: React.FC = () => {
  // avvisa in studio se una scena lascia tempo morto in coda
  const warnings = timingWarnings();
  for (let i = 0; i < warnings.length; i++) {
    // eslint-disable-next-line no-console
    console.warn("[timing] " + warnings[i]);
  }

  return (
    <>
      <Composition
        id="NodeJDVideo"
        component={NodeJDVideo}
        durationInFrames={totalFrames()}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Folder name="Scenes">
        {SCENES.map((scene) => (
          <Composition
            key={scene.id}
            id={scene.compositionId}
            component={COMPONENTS[scene.id]}
            durationInFrames={sceneFrames(scene.id)}
            fps={FPS}
            width={1920}
            height={1080}
          />
        ))}
      </Folder>
    </>
  );
};
```

- [ ] **Step 2: Riscrivere `src/NodeJDVideo.tsx`**

```tsx
import React from "react";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
// alias: `wipe` è anche il nome dell'helper di rivelazione in design/motion.ts
import { wipe as wipePresentation } from "@remotion/transitions/wipe";
import { Audio } from "@remotion/media";
import { staticFile, interpolate, useVideoConfig } from "remotion";
import { SCENES, TRANSITION_FRAMES, sceneFrames } from "./design/timing";
import { Scene1Intro } from "./scenes/Scene1Intro";
import { Scene2Solution } from "./scenes/Scene2Solution";
import { Scene3Comparison } from "./scenes/Scene3Comparison";
import { Scene4TimeSaving } from "./scenes/Scene4TimeSaving";
import { Scene5Security } from "./scenes/Scene5Security";
import { Scene6Applications } from "./scenes/Scene6Applications";
import { Scene7CTA } from "./scenes/Scene7CTA";

const COMPONENTS = {
  problem: Scene1Intro,
  solution: Scene2Solution,
  comparison: Scene3Comparison,
  timeSaving: Scene4TimeSaving,
  security: Scene5Security,
  applications: Scene6Applications,
  cta: Scene7CTA,
};

/**
 * fade sugli stacchi di capitolo, wipe fra scene che proseguono lo stesso
 * discorso. L'indice è quello della scena che precede la transizione.
 */
const WIPE_AFTER = ["solution", "comparison", "security"];

export const NodeJDVideo: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <>
      <Audio
        src={staticFile("ambient-bg.wav")}
        volume={(f) =>
          interpolate(
            f,
            [0, 2 * fps, durationInFrames - 3 * fps, durationInFrames],
            [0, 0.35, 0.35, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          )
        }
      />
      <TransitionSeries>
        {SCENES.map((scene, i) => {
          const Component = COMPONENTS[scene.id];
          const isLast = i === SCENES.length - 1;
          const useWipe = WIPE_AFTER.indexOf(scene.id) !== -1;
          return (
            <React.Fragment key={scene.id}>
              <TransitionSeries.Sequence
                durationInFrames={sceneFrames(scene.id)}
                name={scene.compositionId}
              >
                <Component />
              </TransitionSeries.Sequence>
              {isLast ? null : (
                <TransitionSeries.Transition
                  presentation={useWipe ? wipePresentation({ direction: "from-left" }) : fade()}
                  timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
                />
              )}
            </React.Fragment>
          );
        })}
      </TransitionSeries>
    </>
  );
};
```

- [ ] **Step 3: Verificare i tipi e i test**

```bash
npm run lint
```

```bash
npm test
```

Atteso: entrambi puliti. Se `tsc` segnala che `@remotion/transitions/wipe` non esiste, verificare i preset disponibili con:

```bash
ls node_modules/@remotion/transitions/dist/esm/presentations/
```

e usare il nome corretto (in alternativa `slide`).

- [ ] **Step 4: Verificare la durata totale in studio**

```bash
npm run dev
```

Aprire `http://localhost:3000`, selezionare `NodeJDVideo` e verificare che la timeline riporti **2520 frame**. Chiudere lo studio.

- [ ] **Step 5: Commit**

```bash
git add src/Root.tsx src/NodeJDVideo.tsx
git commit -m "feat(composition): durate da timing.ts e transizioni differenziate"
```

---

## Task 15: Pulizia, README e render finale

**Files:**
- Delete: `src/theme.ts`
- Modify: `README.md`

**Interfaces:**
- Consumes: tutto quanto precede.
- Produces: nessuna nuova interfaccia.

- [ ] **Step 1: Verificare che nessuno importi più il vecchio tema**

```bash
grep -rn "from '../theme'\|from \"./theme\"\|theme\." src/ || echo "nessun riferimento residuo"
```

Atteso: `nessun riferimento residuo`. Se qualcosa compare, migrarlo ai token prima di procedere.

- [ ] **Step 2: Verificare che non siano rimaste emoji**

```bash
grep -rnP "[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}]" src/ || echo "nessuna emoji in src"
```

Atteso: `nessuna emoji in src`.

- [ ] **Step 3: Verificare che non siano rimasti `frame %`**

```bash
grep -rn "frame %" src/ || echo "nessun modulo su frame"
```

Atteso: `nessun modulo su frame`.

- [ ] **Step 4: Eliminare il vecchio tema**

```bash
git rm src/theme.ts
```

- [ ] **Step 5: Aggiornare il README**

In `README.md` sostituire la riga dello stile e quella del formato:

```markdown
- **Format**: 1920×1080 (16:9), 30 fps (~84 seconds)
- **Style**: Engineering Console — near-black surfaces, single cyan accent, stroke SVG icons, JetBrains Mono for the technical register, constructive motion (wipe / draw / counters)
```

Nella sezione *Project Structure* sostituire la riga `theme.ts` con:

```markdown
│   ├── design/               # Design system: tokens, timing, motion, icons
│   ├── components/           # SceneFrame, Terminal, CommandLine, Metric
```

- [ ] **Step 6: Eseguire l'intera verifica**

```bash
npm test
```

```bash
npm run lint
```

Atteso: entrambi puliti.

- [ ] **Step 7: Render completo**

```bash
npx remotion render NodeJDVideo "C:\Users\nikky\AppData\Local\Temp\claude\C--Users-nikky-Desktop-NODEJD-nodejd-video\e2dffe8c-7745-4e9d-b0da-42236af054aa\scratchpad\nodejd-restyled.mp4"
```

Guardare il risultato e verificare: transizioni corrette (fade su 1→2, 4→5, 6→7; wipe su 2→3, 3→4, 5→6), nessun salto di font, nessuna scena che resta ferma in coda, audio ancora sincronizzato con dissolvenza iniziale e finale.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: rimuove il vecchio theme.ts e aggiorna il README al nuovo sistema"
```

---

## Note per chi esegue

- **Il Task 7 è un cancello**, non un suggerimento: se il sistema visivo non convince sulla scena pilota, correggerlo lì costa una scena invece di sette.
- Le durate in `timing.ts` sono stime di quanto contenuto occupa ciascuna scena, non misure. Il Task 11 (Scena 4) è quello con più probabilità di richiederne una revisione: se il terminale non finisce l'output entro il frame 400, va allungata la scena o accelerata la digitazione.
- Ogni volta che si cambia una durata, si cambia **solo** `timing.ts`, e si aggiorna `lastRevealAt` di conseguenza — è il senso di averlo reso fonte unica.
- Se `npm test` fallisce dopo una modifica alle scene, non è un falso positivo: i test coprono solo logica pura, quindi un fallimento indica una regressione reale in `timing`, `motion`, `typing` o `icons`.
