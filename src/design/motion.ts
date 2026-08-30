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
export const progress = (
  frame: number,
  at: number,
  dur: number = DUR.base,
): number =>
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
export const extend = (
  frame: number,
  at: number,
  to: number,
  dur: number = DUR.base,
): number => progress(frame, at, dur) * to;

/** metriche animate; restituisce sempre un intero */
export const counter = (
  frame: number,
  at: number,
  to: number,
  from = 0,
  dur: number = DUR.slow,
): number => Math.round(from + (to - from) * progress(frame, at, dur));

/**
 * Pulsazione continua 0..1. Sostituisce `frame % n`, che scatta al wrap
 * e non si allinea né ai tagli né alla musica.
 */
export const pulse = (frame: number, periodFrames: number): number =>
  (Math.sin((frame / periodFrames) * Math.PI * 2) + 1) / 2;
