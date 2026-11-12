import React from "react";

interface HeaderProps {
  currentStep: number;
  totalSteps?: number;
  stepTitle: string;
}

const steps = [
  "1. Master Satuan",
  "2. Restock & FIFO",
  "3. Konveksi Jahit",
  "4. Kasir Multi-Pay",
  "5. Laba & Aging",
];

export const Header: React.FC<HeaderProps> = ({ currentStep, stepTitle }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 36,
        left: 80,
        right: 80,
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 28px",
        borderRadius: 20,
        backgroundColor: "rgba(15, 23, 42, 0.75)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.35)",
        zIndex: 50,
      }}
    >
      {/* Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: "linear-gradient(135deg, #1a62ff 0%, #00d2ff 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            color: "#ffffff",
            fontSize: 20,
            boxShadow: "0 0 16px rgba(26, 98, 255, 0.6)",
          }}
        >
          i
        </div>
        <div>
          <span style={{ fontSize: 22, fontWeight: 800, color: "#ffffff", letterSpacing: "-0.02em" }}>
            Invo<span style={{ color: "#1a62ff" }}>.</span>
          </span>
          <span
            style={{
              marginLeft: 8,
              fontSize: 14,
              fontWeight: 600,
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            POS Enterprise
          </span>
        </div>
      </div>

      {/* Step Pills */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {steps.map((st, idx) => {
          const isActive = idx + 1 === currentStep;
          const isPassed = idx + 1 < currentStep;

          return (
            <div
              key={st}
              style={{
                padding: "6px 14px",
                borderRadius: 999,
                fontSize: 14,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "#ffffff" : isPassed ? "#60a5fa" : "#64748b",
                backgroundColor: isActive
                  ? "#1a62ff"
                  : isPassed
                  ? "rgba(26, 98, 255, 0.12)"
                  : "rgba(255, 255, 255, 0.03)",
                border: isActive
                  ? "1px solid #3b82f6"
                  : isPassed
                  ? "1px solid rgba(59, 130, 246, 0.3)"
                  : "1px solid transparent",
                boxShadow: isActive ? "0 0 16px rgba(26, 98, 255, 0.45)" : "none",
                transition: "all 0.3s ease",
              }}
            >
              {st}
            </div>
          );
        })}
      </div>

      {/* Live Badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: "#22c55e",
            boxShadow: "0 0 10px #22c55e",
          }}
        />
        <span style={{ fontSize: 14, fontWeight: 600, color: "#cbd5e1" }}>
          sage.odoo.com
        </span>
      </div>
    </div>
  );
};
