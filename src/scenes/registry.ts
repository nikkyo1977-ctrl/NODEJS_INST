import React from "react";
import { SceneId } from "../design/timing";
import { Scene1Intro } from "./Scene1Intro";
import { Scene2Solution } from "./Scene2Solution";
import { Scene3Comparison } from "./Scene3Comparison";
import { Scene4TimeSaving } from "./Scene4TimeSaving";
import { Scene5Security } from "./Scene5Security";
import { Scene6Applications } from "./Scene6Applications";
import { Scene7CTA } from "./Scene7CTA";

export const SCENE_COMPONENTS: Record<SceneId, React.FC> = {
  problem: Scene1Intro,
  solution: Scene2Solution,
  comparison: Scene3Comparison,
  timeSaving: Scene4TimeSaving,
  security: Scene5Security,
  applications: Scene6Applications,
  cta: Scene7CTA,
};
