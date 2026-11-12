import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { WalkthroughScene5Finance } from "../scenes/WalkthroughScene5Finance";
import { TutorialProps } from "../types";

export const Episode4Keuangan: React.FC<TutorialProps> = () => {
  return (
    <AbsoluteFill style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Alur Laporan Finansial & Kontrol Aging Hutang (0 - 600f / 20s) */}
      <Sequence from={0} durationInFrames={600} name="Finansial Laba Rugi & Aging AP">
        <WalkthroughScene5Finance />
      </Sequence>

      {/* Episode Watermark / Division Header */}
      <div
        style={{
          position: "absolute",
          top: 18,
          right: 36,
          backgroundColor: "rgba(15, 23, 42, 0.85)",
          border: "1px solid rgba(139, 92, 246, 0.5)",
          borderRadius: 8,
          padding: "4px 12px",
          color: "#c084fc",
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: "0.06em",
          zIndex: 100,
        }}
      >
        MODUL 4 • DIVISI KEUANGAN & AKUNTANSI
      </div>
    </AbsoluteFill>
  );
};
