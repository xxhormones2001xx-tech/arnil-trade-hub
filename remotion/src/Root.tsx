import { Composition } from "remotion";
import { Concept1 } from "./scenes/Concept1";
import { Concept2 } from "./scenes/Concept2";
import { Concept3 } from "./scenes/Concept3";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="concept1"
        component={Concept1}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="concept2"
        component={Concept2}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="concept3"
        component={Concept3}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
