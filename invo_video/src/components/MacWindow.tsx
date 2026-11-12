import React from "react";

interface MacWindowProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
}

export const MacWindow: React.FC<MacWindowProps> = ({
  title,
  subtitle,
  badge,
  children,
  width = "100%",
  height,
  style,
}) => {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 24,
        backgroundColor: "rgba(15, 23, 42, 0.82)",
        backdropFilter: "blur(24px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 24px 60px rgba(0, 0, 0, 0.55), 0 0 1px 1px rgba(255, 255, 255, 0.05)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
    >
      {/* Top Header Bar */}
      <div
        style={{
          height: 60,
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(255, 255, 255, 0.07)",
          backgroundColor: "rgba(30, 41, 59, 0.4)",
        }}
      >
        {/* macOS Dots */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, width: 100 }}>
          <div style={{ width: 13, height: 13, borderRadius: "50%", backgroundColor: "#ef4444" }} />
          <div style={{ width: 13, height: 13, borderRadius: "50%", backgroundColor: "#f59e0b" }} />
          <div style={{ width: 13, height: 13, borderRadius: "50%", backgroundColor: "#10b981" }} />
        </div>

        {/* Title & Subtitle */}
        <div style={{ textAlign: "center", flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#f8fafc", letterSpacing: "-0.01em" }}>
            {title}
          </div>
          {subtitle && (
            <div style={{ fontSize: 13, fontWeight: 500, color: "#94a3b8", marginTop: 2 }}>
              {subtitle}
            </div>
          )}
        </div>

        {/* Right Slot */}
        <div style={{ display: "flex", justifyContent: "flex-end", width: 120 }}>
          {badge}
        </div>
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, padding: "28px 32px", position: "relative" }}>
        {children}
      </div>
    </div>
  );
};
