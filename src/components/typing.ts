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
  cps = DEFAULT_CPS,
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
