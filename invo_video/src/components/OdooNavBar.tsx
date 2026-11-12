import React from "react";

interface OdooNavBarProps {
  activeMenu: string;
  breadcrumbModel: string;
  breadcrumbRecord?: string;
  onNewState?: boolean;
}

const navMenus = [
  "Master Barang",
  "Pembelian & Restock",
  "✂️ Produksi Jahit",
  "🛒 POS Kasir",
  "📊 Akuntansi",
];

export const OdooNavBar: React.FC<OdooNavBarProps> = ({
  activeMenu,
  breadcrumbModel,
  breadcrumbRecord,
}) => {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#1e1e2d",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
      }}
    >
      {/* Top Purple/Navy Enterprise Bar */}
      <div
        style={{
          height: 48,
          backgroundColor: "#714B67", // Classic authentic Odoo enterprise brand color
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          color: "#ffffff",
        }}
      >
        {/* Left: App Grid & Menus */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 4px)",
              gap: 3,
              cursor: "pointer",
            }}
          >
            {[...Array(9)].map((_, i) => (
              <div key={i} style={{ width: 4, height: 4, backgroundColor: "#ffffff", borderRadius: 1 }} />
            ))}
          </div>

          <div style={{ fontWeight: 800, fontSize: 17, letterSpacing: "-0.01em" }}>
            Invo<span style={{ color: "#38bdf8" }}>.</span> POS
          </div>

          {/* Menus */}
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: 12 }}>
            {navMenus.map((m) => {
              const isActive = m === activeMenu;
              return (
                <div
                  key={m}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? "#ffffff" : "rgba(255, 255, 255, 0.75)",
                    backgroundColor: isActive ? "rgba(255, 255, 255, 0.16)" : "transparent",
                  }}
                >
                  {m}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Cloud Sync & User Profile */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              backgroundColor: "rgba(0,0,0,0.2)",
              padding: "4px 10px",
              borderRadius: 6,
              color: "#4ade80",
            }}
          >
            <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#4ade80" }} />
            <span>sage.odoo.com</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600 }}>
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                backgroundColor: "#3b82f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 800,
              }}
            >
              AD
            </div>
            <span>Administrator</span>
          </div>
        </div>
      </div>

      {/* Secondary Control Bar (Breadcrumbs & Action Buttons) */}
      <div
        style={{
          height: 52,
          backgroundColor: "#161b26",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 28px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      >
        {/* Breadcrumb path */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 15, color: "#94a3b8", fontWeight: 600 }}>{breadcrumbModel}</span>
          <span style={{ color: "#64748b" }}>/</span>
          <span style={{ fontSize: 16, color: "#f8fafc", fontWeight: 800 }}>{breadcrumbRecord || "Baru"}</span>
        </div>

        {/* Action Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              padding: "6px 14px",
              backgroundColor: "#1a62ff",
              color: "#ffffff",
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 6,
              boxShadow: "0 2px 8px rgba(26,98,255,0.4)",
            }}
          >
            <span>+</span> Baru
          </div>
          <div
            style={{
              padding: "6px 14px",
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              color: "#cbd5e1",
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 600,
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            Tindakan ▾
          </div>
        </div>
      </div>
    </div>
  );
};
