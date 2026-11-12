import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

interface SubtitlesProps {
  stepNumber: number;
  highlightText: string;
  regularText: string;
}

export const Subtitles: React.FC<SubtitlesProps> = ({
  stepNumber,
  highlightText,
  regularText,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 48,
        left: 100,
        right: 100,
        display: "flex",
        justifyContent: "center",
        zIndex: 60,
        opacity: enter,
        transform: `translateY(${(1 - enter) * 20}px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "16px 28px",
          borderRadius: 9999,
          backgroundColor: "rgba(10, 15, 29, 0.9)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(26, 98, 255, 0.4)",
          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.6), 0 0 24px rgba(26, 98, 255, 0.25)",
          maxWidth: 1400,
        }}
      >
        {/* Step Badge */}
        <div
          style={{
            padding: "6px 14px",
            borderRadius: 999,
            backgroundColor: "#1a62ff",
            color: "#ffffff",
            fontSize: 16,
            fontWeight: 800,
            letterSpacing: "0.04em",
            whiteSpace: "nowrap",
          }}
        >
          LANGKAH {stepNumber}
        </div>

        {/* Text */}
        <div style={{ fontSize: 20, color: "#e2e8f0", lineHeight: 1.4 }}>
          <span style={{ color: "#60a5fa", fontWeight: 700 }}>{highlightText}</span>{" "}
          <span>{regularText}</span>
        </div>
      </div>
    </div>
  );
};
