import React from "react";

export type BadgeVariant =
  | "blue"
  | "green"
  | "amber"
  | "red"
  | "purple"
  | "neutral"
  | "success"
  | "info"
  | "warning"
  | "danger";

interface BadgeProps {
  label?: string;
  children?: React.ReactNode;
  variant?: BadgeVariant;
  icon?: React.ReactNode;
  fontSize?: number;
}

const variantStyles: Record<string, { bg: string; text: string; border: string }> = {
  blue: {
    bg: "rgba(26, 98, 255, 0.15)",
    text: "#60a5fa",
    border: "rgba(59, 130, 246, 0.4)",
  },
  info: {
    bg: "rgba(26, 98, 255, 0.15)",
    text: "#60a5fa",
    border: "rgba(59, 130, 246, 0.4)",
  },
  green: {
    bg: "rgba(16, 185, 129, 0.15)",
    text: "#34d399",
    border: "rgba(16, 185, 129, 0.4)",
  },
  success: {
    bg: "rgba(16, 185, 129, 0.15)",
    text: "#34d399",
    border: "rgba(16, 185, 129, 0.4)",
  },
  amber: {
    bg: "rgba(245, 158, 11, 0.15)",
    text: "#fbbf24",
    border: "rgba(245, 158, 11, 0.4)",
  },
  warning: {
    bg: "rgba(245, 158, 11, 0.15)",
    text: "#fbbf24",
    border: "rgba(245, 158, 11, 0.4)",
  },
  red: {
    bg: "rgba(239, 68, 68, 0.15)",
    text: "#f87171",
    border: "rgba(239, 68, 68, 0.4)",
  },
  danger: {
    bg: "rgba(239, 68, 68, 0.15)",
    text: "#f87171",
    border: "rgba(239, 68, 68, 0.4)",
  },
  purple: {
    bg: "rgba(168, 85, 247, 0.15)",
    text: "#c084fc",
    border: "rgba(168, 85, 247, 0.4)",
  },
  neutral: {
    bg: "rgba(148, 163, 184, 0.12)",
    text: "#cbd5e1",
    border: "rgba(148, 163, 184, 0.25)",
  },
};

export const Badge: React.FC<BadgeProps> = ({
  label,
  children,
  variant = "blue",
  icon,
  fontSize = 12,
}) => {
  const st = variantStyles[variant] || variantStyles.neutral;

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px",
        borderRadius: 9999,
        backgroundColor: st.bg,
        border: `1px solid ${st.border}`,
        color: st.text,
        fontSize,
        fontWeight: 600,
        letterSpacing: "0.02em",
        whiteSpace: "nowrap",
      }}
    >
      {icon}
      {children ? <span>{children}</span> : label ? <span>{label}</span> : null}
    </div>
  );
};
