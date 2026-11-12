import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { OdooNavBar } from "../../components/OdooNavBar";
import { Cursor } from "../../components/Cursor";
import { TutorialCallout } from "../../components/TutorialCallout";
import { Badge } from "../../components/Badge";
import { TutorialProps } from "../../types";

export const ACC_EP7_DURATION = 600; // 20 Detik @ 30 FPS

export const AccEp7ProfitLoss: React.FC<TutorialProps> = () => {
  const frame = useCurrentFrame();

  let cursorX = 960;
  let cursorY = 540;
  let cursorLabel = "";

  if (frame < 180) {
    cursorX = interpolate(frame, [0, 80], [960, 480], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [0, 80], [540, 270], { extrapolateRight: "clamp" });
    cursorLabel = "Pendapatan POS Sprei XL: Rp 112.500 & HPP Rp 75.000";
  } else if (frame < 380) {
    cursorX = interpolate(frame, [180, 260], [480, 820], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [180, 260], [270, 390], { extrapolateRight: "clamp" });
    cursorLabel = "Laba Kotor (Gross Profit): Rp 37.500";
  } else {
    cursorX = interpolate(frame, [380, 460], [820, 820], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [380, 460], [390, 560], { extrapolateRight: "clamp" });
    cursorLabel = "Laba Bersih Akhir (Net Profit): Rp 22.500";
  }

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0d1117",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflow: "hidden",
      }}
    >
      <OdooNavBar
        activeMenu="📊 Akuntansi"
        breadcrumbModel="Reporting > Management"
        breadcrumbRecord="Laporan Laba Rugi (Profit & Loss)"
      />

      <div
        style={{
          position: "absolute",
          top: 18,
          right: 36,
          backgroundColor: "rgba(15, 23, 42, 0.85)",
          border: "1px solid rgba(139, 92, 246, 0.5)",
          borderRadius: 8,
          padding: "4px 12px",
          color: "#c084fc",
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: "0.06em",
          zIndex: 100,
        }}
      >
        EPISODE 7/10: PROFIT & LOSS REPORT
      </div>

      <div
        style={{
          flex: 1,
          padding: "20px 60px 80px 60px",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 1400,
            backgroundColor: "#161b22",
            borderRadius: 12,
            border: "1px solid #30363d",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6)",
            overflow: "hidden",
          }}
        >
          {/* Header Bar */}
          <div
            style={{
              padding: "16px 24px",
              borderBottom: "1px solid #21262d",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#161b22",
            }}
          >
            <div>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#f0f6fc" }}>
                Laporan Laba Rugi (Profit and Loss)
              </h2>
              <span style={{ fontSize: 12, color: "#8b949e" }}>
                Toko Sprei Jendral • Periode: November 2026 • Real-Time POS Sync
              </span>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Badge variant="success">Otomatis Terkalkulasi</Badge>
              <button
                style={{
                  backgroundColor: "#21262d",
                  color: "#c9d1d9",
                  border: "1px solid #30363d",
                  borderRadius: 6,
                  padding: "6px 14px",
                  fontSize: 12,
                }}
              >
                Export PDF / XLSX
              </button>
            </div>
          </div>

          {/* Report Financial Rows */}
          <div style={{ padding: "20px 32px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <tbody>
                {/* 1. Operating Income */}
                <tr style={{ backgroundColor: "#21262d", fontWeight: 700, color: "#58a6ff" }}>
                  <td style={{ padding: "10px 14px" }}>PENDAPATAN OPERASIONAL (OPERATING INCOME)</td>
                  <td style={{ padding: "10px 14px", textAlign: "right" }}>Rp 112.500,00</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #21262d", color: "#c9d1d9" }}>
                  <td style={{ padding: "8px 24px" }}>41110000 Penjualan Sprei XL (180x200) Kasir</td>
                  <td style={{ padding: "8px 14px", textAlign: "right" }}>Rp 112.500,00</td>
                </tr>

                {/* 2. COGS */}
                <tr style={{ backgroundColor: "#21262d", fontWeight: 700, color: "#bc8cff" }}>
                  <td style={{ padding: "10px 14px" }}>HARGA POKOK PENJUALAN (COST OF GOODS SOLD)</td>
                  <td style={{ padding: "10px 14px", textAlign: "right" }}>- Rp 75.000,00</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #21262d", color: "#c9d1d9" }}>
                  <td style={{ padding: "8px 24px" }}>51110000 HPP Sprei XL (3m Kain Katun + Ongkos Jahit + Aksesoris)</td>
                  <td style={{ padding: "8px 14px", textAlign: "right" }}>- Rp 75.000,00</td>
                </tr>

                {/* 3. GROSS PROFIT */}
                <tr style={{ backgroundColor: "#0d1117", borderTop: "2px solid #30363d", fontWeight: 800 }}>
                  <td style={{ padding: "12px 14px", color: "#3fb950", fontSize: 14 }}>
                    LABA KOTOR PENJUALAN (GROSS PROFIT)
                  </td>
                  <td style={{ padding: "12px 14px", textAlign: "right", color: "#3fb950", fontSize: 15 }}>
                    Rp 37.500,00
                  </td>
                </tr>

                {/* 4. Operating Expenses */}
                <tr style={{ backgroundColor: "#21262d", fontWeight: 700, color: "#d29922" }}>
                  <td style={{ padding: "10px 14px" }}>BEBAN OPERASIONAL (OPERATING EXPENSES)</td>
                  <td style={{ padding: "10px 14px", textAlign: "right" }}>- Rp 15.000,00</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #21262d", color: "#c9d1d9" }}>
                  <td style={{ padding: "8px 24px" }}>61110000 Beban Listrik, Air & Utilitas Toko</td>
                  <td style={{ padding: "8px 14px", textAlign: "right" }}>- Rp 15.000,00</td>
                </tr>

                {/* 5. NET PROFIT */}
                <tr
                  style={{
                    backgroundColor: "rgba(56, 139, 253, 0.12)",
                    borderTop: "2px solid #58a6ff",
                    fontWeight: 800,
                  }}
                >
                  <td style={{ padding: "14px", color: "#58a6ff", fontSize: 16 }}>
                    LABA BERSIH TOKO (NET PROFIT)
                  </td>
                  <td style={{ padding: "14px", textAlign: "right", color: "#58a6ff", fontSize: 18 }}>
                    Rp 22.500,00
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <TutorialCallout
        step={7}
        title="Laporan Laba Rugi Real-Time (Profit and Loss)"
        description={
          frame < 180
            ? "Setiap kasir menekan tombol bayar di POS, omzet Rp 112.500 dan HPP komposit Rp 75.000 langsung tercatat di laporan P&L."
            : frame < 380
            ? "Laba kotor Rp 37.500 (margin 50% dari modal bahan & jahit) tersaji tanpa jeda rekonsiliasi manual akhir bulan."
            : "Setelah dikurangi beban listrik Rp 15.000, Laba Bersih riil Rp 22.500 siap dipantau owner toko kapan saja."
        }
        visible={true}
      />

      <Cursor x={cursorX} y={cursorY} label={cursorLabel} />
    </AbsoluteFill>
  );
};
