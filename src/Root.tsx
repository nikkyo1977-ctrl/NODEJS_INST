import "./index.css";
import React from "react";
import { Composition, Folder } from "remotion";
import { NodeJDVideo } from "./NodeJDVideo";
import {
  FPS,
  SCENES,
  sceneFrames,
  timingWarnings,
  totalFrames,
} from "./design/timing";
import { SCENE_COMPONENTS } from "./scenes/registry";

export const RemotionRoot: React.FC = () => {
  // avvisa in studio se una scena lascia tempo morto in coda;
  // in un effetto, così non gira a ogni render
  React.useEffect(() => {
    const warnings = timingWarnings();
    for (let i = 0; i < warnings.length; i++) {
      console.warn("[timing] " + warnings[i]);
    }
  }, []);

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
            component={SCENE_COMPONENTS[scene.id]}
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
