import React from "react";
import { interpolate } from "remotion";

interface CursorProps {
  x: number;
  y: number;
  isClicking?: boolean;
  clickFrame?: number;
  currentFrame?: number;
  actionLabel?: string;
}

export const Cursor: React.FC<CursorProps> = ({
  x,
  y,
  isClicking = false,
  clickFrame,
  currentFrame = 0,
  actionLabel,
}) => {
  // Ripple animation when clicking
  let rippleSize = 0;
  let rippleOpacity = 0;

  if (clickFrame !== undefined && currentFrame >= clickFrame && currentFrame <= clickFrame + 20) {
    const progress = (currentFrame - clickFrame) / 20;
    rippleSize = interpolate(progress, [0, 1], [0, 48]);
    rippleOpacity = interpolate(progress, [0, 1], [0.8, 0]);
  }

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        pointerEvents: "none",
        zIndex: 9999,
        transform: `translate(-2px, -2px) scale(${isClicking ? 0.88 : 1})`,
        transition: "transform 0.08s ease",
      }}
    >
      {/* Click ripple circle */}
      {rippleOpacity > 0 && (
        <div
          style={{
            position: "absolute",
            left: 2,
            top: 2,
            width: rippleSize,
            height: rippleSize,
            borderRadius: "50%",
            backgroundColor: "rgba(26, 98, 255, 0.4)",
            border: "2px solid #3b82f6",
            transform: "translate(-50%, -50%)",
            opacity: rippleOpacity,
          }}
        />
      )}

      {/* Realistic Mouse Cursor SVG */}
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        style={{
          filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.45))",
        }}
      >
        <path
          d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L5.85 2.85a.5.5 0 0 0-.35.36z"
          fill="#1e293b"
          stroke="#ffffff"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>

      {/* Floating Action Tooltip */}
      {actionLabel && (
        <div
          style={{
            position: "absolute",
            left: 28,
            top: 14,
            backgroundColor: "rgba(15, 23, 42, 0.95)",
            color: "#ffffff",
            padding: "5px 12px",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 700,
            whiteSpace: "nowrap",
            border: "1px solid rgba(59, 130, 246, 0.6)",
            boxShadow: "0 6px 16px rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span style={{ color: "#38bdf8" }}>▶</span> {actionLabel}
        </div>
      )}
    </div>
  );
};
