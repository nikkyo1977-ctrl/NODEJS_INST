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
