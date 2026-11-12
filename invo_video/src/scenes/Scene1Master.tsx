import React from "react";
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { MacWindow } from "../components/MacWindow";
import { Badge } from "../components/Badge";
import { BoxIcon, CheckCircleIcon } from "../components/Icons";

export const Scene1Master: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animations
  const cardSpring = spring({ frame, fps, config: { damping: 15, stiffness: 100 } });

  const v1Spring = spring({ frame: frame - 40, fps, config: { damping: 14 } });
  const v2Spring = spring({ frame: frame - 80, fps, config: { damping: 14 } });
  const v3Spring = spring({ frame: frame - 120, fps, config: { damping: 14 } });

  const pulse = interpolate(Math.sin(frame / 15), [-1, 1], [0.98, 1.02]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "100px 120px 120px 120px",
        boxSizing: "border-box",
      }}
    >
      {/* Top Main Card */}
      <div
        style={{
          width: "100%",
          maxWidth: 1500,
          opacity: cardSpring,
          transform: `scale(${cardSpring})`,
        }}
      >
        <MacWindow
          title="Katalog Master Barang (x_pos_item_master) — Odoo 20.0"
          subtitle="Single Master Setup: Multi-Satuan Grosir & Pecahan Varian Otomatis"
          badge={<Badge label="Master Induk" variant="blue" />}
        >
          {/* Main Item Hero */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "24px 32px",
              backgroundColor: "rgba(30, 41, 59, 0.6)",
              borderRadius: 18,
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: 16,
                  backgroundColor: "rgba(26, 98, 255, 0.2)",
                  border: "1px solid rgba(26, 98, 255, 0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#60a5fa",
                }}
              >
                <BoxIcon size={36} color="#60a5fa" />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 28, fontWeight: 800, color: "#ffffff" }}>
                    Kain Katun Sprei "XXX"
                  </span>
                  <Badge label="Bahan Baku Utama" variant="green" fontSize={14} />
                </div>
                <div style={{ fontSize: 16, color: "#94a3b8", marginTop: 4 }}>
                  Kode: <span style={{ color: "#cbd5e1", fontWeight: 600 }}>KTN-XXX-01</span> • Kategori: Tekstil & Sprei
                </div>
              </div>
            </div>

            {/* Base UoM Metric */}
            <div style={{ display: "flex", gap: 24 }}>
              <div
                style={{
                  padding: "12px 24px",
                  borderRadius: 14,
                  backgroundColor: "rgba(15, 23, 42, 0.8)",
                  border: "1px solid rgba(59, 130, 246, 0.3)",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 13, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Satuan Dasar Gudang
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: "#60a5fa", marginTop: 2 }}>
                  METER (m)
                </div>
              </div>

              <div
                style={{
                  padding: "12px 24px",
                  borderRadius: 14,
                  backgroundColor: "rgba(15, 23, 42, 0.8)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 13, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Konversi Satuan Grosir
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#34d399", marginTop: 4 }}>
                  1 Roll = 100m • 1 Kodi = 60m
                </div>
              </div>
            </div>
          </div>

          {/* Sub Header Divider */}
          <div
            style={{
              margin: "24px 0 16px 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: "#cbd5e1" }}>
                Pecahan Varian Eceran (Single Master $\rightarrow$ Multi Variants)
              </span>
              <span style={{ fontSize: 13, color: "#64748b" }}>
                (Dihitung otomatis saat potong kain & jahit)
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#60a5fa", fontSize: 14, fontWeight: 600 }}>
              <CheckCircleIcon size={18} color="#60a5fa" /> Auto UoM Conversion Active
            </div>
          </div>

          {/* 3 Variant Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
            {/* Variant 1: Sprei M */}
            <div
              style={{
                opacity: Math.max(0, v1Spring),
                transform: `translateY(${(1 - Math.max(0, v1Spring)) * 30}px)`,
                padding: "20px 24px",
                borderRadius: 16,
                backgroundColor: "rgba(30, 41, 59, 0.4)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 20, fontWeight: 800, color: "#ffffff" }}>Sprei M (120×200)</span>
                <Badge label="Manual Fixed" variant="neutral" fontSize={12} />
              </div>
              <div style={{ marginTop: 14, fontSize: 14, color: "#94a3b8" }}>
                Kebutuhan Kain: <strong style={{ color: "#38bdf8" }}>2.0 Meter</strong>
              </div>
              <div style={{ marginTop: 6, fontSize: 14, color: "#94a3b8" }}>
                Estimasi HPP: <strong style={{ color: "#cbd5e1" }}>Rp 40.000</strong>
              </div>
              <div
                style={{
                  marginTop: 14,
                  paddingTop: 14,
                  borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 13, color: "#94a3b8" }}>Harga Jual:</span>
                <span style={{ fontSize: 22, fontWeight: 800, color: "#34d399" }}>Rp 60.000</span>
              </div>
            </div>

            {/* Variant 2: Sprei L */}
            <div
              style={{
                opacity: Math.max(0, v2Spring),
                transform: `translateY(${(1 - Math.max(0, v2Spring)) * 30}px)`,
                padding: "20px 24px",
                borderRadius: 16,
                backgroundColor: "rgba(30, 41, 59, 0.4)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 20, fontWeight: 800, color: "#ffffff" }}>Sprei L (160×200)</span>
                <Badge label="Margin +40%" variant="purple" fontSize={12} />
              </div>
              <div style={{ marginTop: 14, fontSize: 14, color: "#94a3b8" }}>
                Kebutuhan Kain: <strong style={{ color: "#38bdf8" }}>2.5 Meter</strong>
              </div>
              <div style={{ marginTop: 6, fontSize: 14, color: "#94a3b8" }}>
                Estimasi HPP: <strong style={{ color: "#cbd5e1" }}>Rp 50.000</strong>
              </div>
              <div
                style={{
                  marginTop: 14,
                  paddingTop: 14,
                  borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 13, color: "#94a3b8" }}>Harga Jual:</span>
                <span style={{ fontSize: 22, fontWeight: 800, color: "#34d399" }}>Rp 70.000</span>
              </div>
            </div>

            {/* Variant 3: Sprei XL (Highlighted) */}
            <div
              style={{
                opacity: Math.max(0, v3Spring),
                transform: `translateY(${(1 - Math.max(0, v3Spring)) * 30}px) scale(${pulse})`,
                padding: "20px 24px",
                borderRadius: 16,
                backgroundColor: "rgba(26, 98, 255, 0.12)",
                border: "2px solid #3b82f6",
                boxShadow: "0 12px 30px rgba(26, 98, 255, 0.25)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 20, fontWeight: 800, color: "#ffffff" }}>Sprei XL (180×200)</span>
                <Badge label="Margin +50% (Star)" variant="amber" fontSize={12} />
              </div>
              <div style={{ marginTop: 14, fontSize: 14, color: "#94a3b8" }}>
                Kebutuhan Kain: <strong style={{ color: "#60a5fa" }}>3.0 Meter</strong>
              </div>
              <div style={{ marginTop: 6, fontSize: 14, color: "#94a3b8" }}>
                Estimasi HPP Kain: <strong style={{ color: "#cbd5e1" }}>Rp 60.000</strong>
              </div>
              <div
                style={{
                  marginTop: 14,
                  paddingTop: 14,
                  borderTop: "1px solid rgba(255, 255, 255, 0.15)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 13, color: "#94a3b8" }}>Harga Jual Proyeksi:</span>
                <span style={{ fontSize: 22, fontWeight: 800, color: "#fbbf24" }}>Rp 90.000 - 112.500</span>
              </div>
            </div>
          </div>
        </MacWindow>
      </div>
    </div>
  );
};
