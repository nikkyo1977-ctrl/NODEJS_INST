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
