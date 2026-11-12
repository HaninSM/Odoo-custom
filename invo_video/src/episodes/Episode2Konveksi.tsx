import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { WalkthroughScene3Production } from "../scenes/WalkthroughScene3Production";
import { TutorialProps } from "../types";

export const Episode2Konveksi: React.FC<TutorialProps> = () => {
  return (
    <AbsoluteFill style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Alur Konveksi Make-to-Stock & HPP Komposit (0 - 660f / 22s) */}
      <Sequence from={0} durationInFrames={660} name="Konveksi Make-to-Stock & HPP">
        <WalkthroughScene3Production />
      </Sequence>

      {/* Episode Watermark / Division Header */}
      <div
        style={{
          position: "absolute",
          top: 18,
          right: 36,
          backgroundColor: "rgba(15, 23, 42, 0.85)",
          border: "1px solid rgba(245, 158, 11, 0.5)",
          borderRadius: 8,
          padding: "4px 12px",
          color: "#fbbf24",
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: "0.06em",
          zIndex: 100,
        }}
      >
        MODUL 2 • DIVISI KONVEKSI & JAHIT
      </div>
    </AbsoluteFill>
  );
};
