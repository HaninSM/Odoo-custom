import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

interface TutorialCalloutProps {
  step: string;
  instruction: string;
  detail?: string;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
}

export const TutorialCallout: React.FC<TutorialCalloutProps> = ({
  step,
  instruction,
  detail,
  top,
  left,
  right,
  bottom,
}) => {
  const frame = useCurrentFrame();
  const bounce = interpolate(Math.sin(frame / 8), [-1, 1], [-3, 3]);

  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        right,
        bottom,
        transform: `translateY(${bounce}px)`,
        zIndex: 1000,
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        border: "2px solid #38bdf8",
        borderRadius: 14,
        padding: "10px 18px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(56, 189, 248, 0.35)",
        display: "flex",
        alignItems: "center",
        gap: 12,
        maxWidth: 550,
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          backgroundColor: "#0284c7",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 800,
          fontSize: 16,
          flexShrink: 0,
        }}
      >
        {step}
      </div>
      <div>
        <div style={{ fontSize: 15, fontWeight: 800, color: "#ffffff" }}>
          {instruction}
        </div>
        {detail && (
          <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 2 }}>
            {detail}
          </div>
        )}
      </div>
    </div>
  );
};
