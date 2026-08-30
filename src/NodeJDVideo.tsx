import React from "react";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
// alias: `wipe` è anche il nome dell'helper di rivelazione in design/motion.ts
import { wipe as wipePresentation } from "@remotion/transitions/wipe";
import { Audio } from "@remotion/media";
import { staticFile, interpolate, useVideoConfig } from "remotion";
import { SCENES, TRANSITION_FRAMES, sceneFrames } from "./design/timing";
import { SCENE_COMPONENTS } from "./scenes/registry";

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
          const Component = SCENE_COMPONENTS[scene.id];
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
              {isLast ? null : useWipe ? (
                <TransitionSeries.Transition
                  presentation={wipePresentation({ direction: "from-left" })}
                  timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
                />
              ) : (
                <TransitionSeries.Transition
                  presentation={fade()}
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
