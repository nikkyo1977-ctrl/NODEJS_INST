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
