import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { WalkthroughScene4Cashier } from "../scenes/WalkthroughScene4Cashier";
import { TutorialProps } from "../types";

export const Episode3Kasir: React.FC<TutorialProps> = () => {
  return (
    <AbsoluteFill style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Alur Kasir POS & QRIS Multi-Payment (0 - 660f / 22s) */}
      <Sequence from={0} durationInFrames={660} name="Kasir POS & Multi-Payment">
        <WalkthroughScene4Cashier />
      </Sequence>

      {/* Episode Watermark / Division Header */}
      <div
        style={{
          position: "absolute",
          top: 18,
          right: 36,
          backgroundColor: "rgba(15, 23, 42, 0.85)",
          border: "1px solid rgba(16, 185, 129, 0.5)",
          borderRadius: 8,
          padding: "4px 12px",
          color: "#34d399",
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: "0.06em",
          zIndex: 100,
        }}
      >
        MODUL 3 • DIVISI KASIR & PENJUALAN
      </div>
    </AbsoluteFill>
  );
};
