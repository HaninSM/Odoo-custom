import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { WalkthroughScene1Master } from "./scenes/WalkthroughScene1Master";
import { WalkthroughScene2Purchase } from "./scenes/WalkthroughScene2Purchase";
import { WalkthroughScene3Production } from "./scenes/WalkthroughScene3Production";
import { WalkthroughScene4Cashier } from "./scenes/WalkthroughScene4Cashier";
import { WalkthroughScene5Finance } from "./scenes/WalkthroughScene5Finance";
import { TutorialProps } from "./types";

export const SCENE_DURATIONS = {
  scene1: 450, // 0 - 450 (15s)
  scene2: 480, // 450 - 930 (16s)
  scene3: 510, // 930 - 1440 (17s)
  scene4: 480, // 1440 - 1920 (16s)
  scene5: 330, // 1920 - 2250 (11s)
};

export const TOTAL_DURATION =
  SCENE_DURATIONS.scene1 +
  SCENE_DURATIONS.scene2 +
  SCENE_DURATIONS.scene3 +
  SCENE_DURATIONS.scene4 +
  SCENE_DURATIONS.scene5; // 2250 frames (75s)

export const MainTutorial: React.FC<TutorialProps> = () => {
  return (
    <AbsoluteFill style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Scene 1: Master Setup Walkthrough */}
      <Sequence from={0} durationInFrames={SCENE_DURATIONS.scene1} name="Tutorial 1: Master Barang">
        <WalkthroughScene1Master />
      </Sequence>

      {/* Scene 2: Restock & FIFO & Net 30 Walkthrough */}
      <Sequence from={450} durationInFrames={SCENE_DURATIONS.scene2} name="Tutorial 2: PO FIFO & Net 30">
        <WalkthroughScene2Purchase />
      </Sequence>

      {/* Scene 3: Konveksi Jahit Make-to-Stock Walkthrough */}
      <Sequence from={930} durationInFrames={SCENE_DURATIONS.scene3} name="Tutorial 3: Konveksi Jahit">
        <WalkthroughScene3Production />
      </Sequence>

      {/* Scene 4: Kasir Multi-Payment Walkthrough */}
      <Sequence from={1440} durationInFrames={SCENE_DURATIONS.scene4} name="Tutorial 4: Kasir POS Multi-Pay">
        <WalkthroughScene4Cashier />
      </Sequence>

      {/* Scene 5: Laporan Finansial & Aging Walkthrough */}
      <Sequence from={1920} durationInFrames={SCENE_DURATIONS.scene5} name="Tutorial 5: Finansial & Aging">
        <WalkthroughScene5Finance />
      </Sequence>
    </AbsoluteFill>
  );
};
