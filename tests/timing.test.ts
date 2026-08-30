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
    // dati propri: il test non tocca mai SCENES, così un fallimento non
    // lascia il modulo in uno stato corrotto per i test successivi
    const avvisi = timingWarnings([
      { id: "security", compositionId: "X", seconds: 12, lastRevealAt: 10 },
    ]);
    expect(avvisi.length).toBe(1);
    expect(avvisi[0]).toContain("security");
    expect(avvisi[0]).toContain("Tempo morto");
  });

  it("segnala una scena la cui ultima rivelazione cade oltre la fine", () => {
    const avvisi = timingWarnings([
      { id: "cta", compositionId: "X", seconds: 10, lastRevealAt: 400 },
    ]);
    expect(avvisi.length).toBe(1);
    expect(avvisi[0]).toContain("troncato");
  });
});
