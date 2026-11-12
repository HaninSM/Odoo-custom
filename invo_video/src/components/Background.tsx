import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

export const Background: React.FC = () => {
  const frame = useCurrentFrame();

  const orb1X = interpolate(Math.sin(frame / 60), [-1, 1], [15, 25]);
  const orb1Y = interpolate(Math.cos(frame / 70), [-1, 1], [15, 30]);

  const orb2X = interpolate(Math.sin(frame / 50 + 2), [-1, 1], [70, 85]);
  const orb2Y = interpolate(Math.cos(frame / 60 + 1), [-1, 1], [65, 80]);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#070b14",
        overflow: "hidden",
        zIndex: 0,
      }}
    >
      {/* Subtle grid pattern */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            "linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          opacity: 0.8,
        }}
      />

      {/* Floating Cyan/Blue Orb 1 */}
      <div
        style={{
          position: "absolute",
          left: `${orb1X}%`,
          top: `${orb1Y}%`,
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(26, 98, 255, 0.22) 0%, rgba(26, 98, 255, 0) 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      {/* Floating Purple/Indigo Orb 2 */}
      <div
        style={{
          position: "absolute",
          left: `${orb2X}%`,
          top: `${orb2Y}%`,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.18) 0%, rgba(139, 92, 246, 0) 70%)",
          filter: "blur(70px)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
