import React from "react";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Audio } from "@remotion/media";
import { staticFile, interpolate, useVideoConfig } from "remotion";
import { Scene1Intro } from "./scenes/Scene1Intro";
import { Scene2Solution } from "./scenes/Scene2Solution";
import { Scene3Comparison } from "./scenes/Scene3Comparison";
import { Scene4TimeSaving } from "./scenes/Scene4TimeSaving";
import { Scene5Security } from "./scenes/Scene5Security";
import { Scene6Applications } from "./scenes/Scene6Applications";
import { Scene7CTA } from "./scenes/Scene7CTA";

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
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }
          )
        }
      />
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={12 * fps} name="Scene1-Problem">
          <Scene1Intro />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence durationInFrames={14 * fps} name="Scene2-Solution">
          <Scene2Solution />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence durationInFrames={18 * fps} name="Scene3-Comparison">
          <Scene3Comparison />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence durationInFrames={12 * fps} name="Scene4-TimeSaving">
          <Scene4TimeSaving />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence durationInFrames={10 * fps} name="Scene5-Security">
          <Scene5Security />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence durationInFrames={14 * fps} name="Scene6-Applications">
          <Scene6Applications />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence durationInFrames={10 * fps} name="Scene7-CTA">
          <Scene7CTA />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </>
  );
};
