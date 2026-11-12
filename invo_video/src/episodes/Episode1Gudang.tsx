import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { WalkthroughScene1Master } from "../scenes/WalkthroughScene1Master";
import { WalkthroughScene2Purchase } from "../scenes/WalkthroughScene2Purchase";
import { TutorialProps } from "../types";

export const EPISODE1_DURATION = 420 + 480; // 900 frames (30 detik @ 30 FPS)

export const Episode1Gudang: React.FC<TutorialProps> = () => {
  return (
    <AbsoluteFill style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Bagian 1: Master Satuan Barang & Pecahan Varian (0 - 420f / 14s) */}
      <Sequence from={0} durationInFrames={420} name="Setup Master Satuan Meter">
        <WalkthroughScene1Master />
      </Sequence>

      {/* Bagian 2: Restock PO 1 Kodi, FIFO Batch & Net 30 (420 - 900f / 16s) */}
      <Sequence from={420} durationInFrames={480} name="Restock PO Kodi & Batch FIFO">
        <WalkthroughScene2Purchase />
      </Sequence>

      {/* Episode Watermark / Division Header */}
      <div
        style={{
          position: "absolute",
          top: 18,
          right: 36,
          backgroundColor: "rgba(15, 23, 42, 0.85)",
          border: "1px solid rgba(59, 130, 246, 0.5)",
          borderRadius: 8,
          padding: "4px 12px",
          color: "#38bdf8",
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: "0.06em",
          zIndex: 100,
        }}
      >
        MODUL 1 • DIVISI GUDANG & PENGADAAN
      </div>
    </AbsoluteFill>
  );
};
