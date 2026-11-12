import React from "react";
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { MacWindow } from "../components/MacWindow";
import { Badge } from "../components/Badge";
import { ChartIcon, CheckCircleIcon } from "../components/Icons";

export const Scene5Finance: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 15 } });
  const kpiSpring = spring({ frame: frame - 30, fps, config: { damping: 14 } });
  const ctaSpring = spring({ frame: frame - 70, fps, config: { damping: 14 } });

  const glowPulse = interpolate(Math.sin(frame / 12), [-1, 1], [0.85, 1.15]);

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
      <div
        style={{
          width: "100%",
          maxWidth: 1500,
          opacity: enter,
          transform: `scale(${enter})`,
        }}
      >
        <MacWindow
          title="📊 Laporan Finansial Instan & Kontrol Jatuh Tempo — Odoo 20.0"
          subtitle="HPP Otomatis Terhubung ke Penjualan, Margin Presisi, dan Likuiditas Terkendali"
          badge={<Badge label="Real-time Analytics" variant="green" />}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 28 }}>
            {/* Left: Financial Statement Metrics */}
            <div
              style={{
                backgroundColor: "rgba(30, 41, 59, 0.45)",
                borderRadius: 20,
                padding: "24px 28px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    backgroundColor: "rgba(16, 185, 129, 0.15)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#34d399",
                  }}
                >
                  <ChartIcon size={28} color="#34d399" />
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#ffffff" }}>
                    Ikhtisar Laba Rugi Transaksi
                  </div>
                  <div style={{ fontSize: 14, color: "#94a3b8", marginTop: 2 }}>
                    Perhitungan Otomatis Sesuai Standar Akuntansi Odoo
                  </div>
                </div>
              </div>

              {/* KPI Metric Grid */}
              <div
                style={{
                  marginTop: 22,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                  opacity: Math.max(0, kpiSpring),
                }}
              >
                <div style={{ backgroundColor: "rgba(15, 23, 42, 0.7)", padding: "14px 18px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize: 13, color: "#94a3b8" }}>Total Omzet Penjualan</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#ffffff", marginTop: 4 }}>
                    Rp 112.500
                  </div>
                </div>

                <div style={{ backgroundColor: "rgba(15, 23, 42, 0.7)", padding: "14px 18px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize: 13, color: "#94a3b8" }}>HPP Komposit Terkunci</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#f87171", marginTop: 4 }}>
                    (Rp 75.000)
                  </div>
                </div>
              </div>

              {/* Net Profit Banner */}
              <div
                style={{
                  marginTop: 18,
                  padding: "18px 24px",
                  borderRadius: 16,
                  background: "linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(26, 98, 255, 0.15) 100%)",
                  border: "2px solid #10b981",
                  boxShadow: `0 0 24px rgba(16, 185, 129, ${0.35 * glowPulse})`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#34d399", textTransform: "uppercase" }}>
                    Laba Kotor Usaha (Gross Profit):
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: "#ffffff", marginTop: 2 }}>
                    Rp 37.500
                  </div>
                </div>
                <Badge label="+50% Margin Bersih" variant="green" fontSize={14} />
              </div>
            </div>

            {/* Right: Aging AP & Final CTA */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* AP Reminder Card */}
              <div
                style={{
                  backgroundColor: "rgba(30, 41, 59, 0.45)",
                  borderRadius: 18,
                  padding: "20px 24px",
                  border: "1px solid rgba(245, 158, 11, 0.35)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: "#fbbf24" }}>
                    📅 Pengingat Jatuh Tempo Hutang
                  </span>
                  <Badge label="Tempo 30 Hari" variant="amber" fontSize={11} />
                </div>
                <div style={{ marginTop: 12, fontSize: 14, color: "#cbd5e1" }}>
                  PT. Tekstil Maju Jaya: <strong style={{ color: "#ffffff" }}>Rp 1.200.000</strong>
                </div>
                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>
                  Jatuh tempo: <strong>01 Desember 2026</strong> (Tidak ada denda / missed payment)
                </div>
              </div>

              {/* Final Success Call to Action */}
              <div
                style={{
                  opacity: Math.max(0, ctaSpring),
                  transform: `translateY(${(1 - Math.max(0, ctaSpring)) * 20}px)`,
                  backgroundColor: "rgba(26, 98, 255, 0.2)",
                  borderRadius: 18,
                  padding: "22px 24px",
                  border: "2px solid #3b82f6",
                  textAlign: "center",
                }}
              >
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
                  <CheckCircleIcon size={36} color="#60a5fa" />
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#ffffff" }}>
                  Sistem Siap Digunakan!
                </div>
                <div style={{ fontSize: 14, color: "#93c5fd", marginTop: 4, lineHeight: 1.4 }}>
                  Teruji & Terintegrasi di Odoo Enterprise Cloud
                  <br />
                  <strong style={{ color: "#ffffff" }}>https://sage.odoo.com</strong>
                </div>
              </div>
            </div>
          </div>
        </MacWindow>
      </div>
    </div>
  );
};
