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
    const massimo = '$ codex "mesh bracket.inp, run simulation, plot results"';
    expect(massimo.length).toBeLessThanOrEqual(64);
  });
});
