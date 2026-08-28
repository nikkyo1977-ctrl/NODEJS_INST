import "./index.css";
import { Composition, Folder } from "remotion";
import { NodeJDVideo } from "./NodeJDVideo";
import { Scene1Intro } from "./scenes/Scene1Intro";
import { Scene2Solution } from "./scenes/Scene2Solution";
import { Scene3Comparison } from "./scenes/Scene3Comparison";
import { Scene4TimeSaving } from "./scenes/Scene4TimeSaving";
import { Scene5Security } from "./scenes/Scene5Security";
import { Scene6Applications } from "./scenes/Scene6Applications";
import { Scene7CTA } from "./scenes/Scene7CTA";

const fps = 30;

// Total: 90s of scenes - 6 transitions × 15 frames = 2610 frames
const totalDuration = 12 * fps + 14 * fps + 18 * fps + 12 * fps + 10 * fps + 14 * fps + 10 * fps - 6 * 15;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="NodeJDVideo"
        component={NodeJDVideo}
        durationInFrames={totalDuration}
        fps={30}
        width={1920}
        height={1080}
      />
      <Folder name="Scenes">
        <Composition
          id="Scene1-Problem"
          component={Scene1Intro}
          durationInFrames={12 * fps}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Scene2-Solution"
          component={Scene2Solution}
          durationInFrames={14 * fps}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Scene3-Comparison"
          component={Scene3Comparison}
          durationInFrames={18 * fps}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Scene4-TimeSaving"
          component={Scene4TimeSaving}
          durationInFrames={12 * fps}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Scene5-Security"
          component={Scene5Security}
          durationInFrames={10 * fps}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Scene6-Applications"
          component={Scene6Applications}
          durationInFrames={14 * fps}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Scene7-CTA"
          component={Scene7CTA}
          durationInFrames={10 * fps}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>
    </>
  );
};
