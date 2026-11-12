import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { OdooNavBar } from "../../components/OdooNavBar";
import { Cursor } from "../../components/Cursor";
import { TutorialCallout } from "../../components/TutorialCallout";
import { Badge } from "../../components/Badge";
import { TutorialProps } from "../../types";

export const ACC_EP8_DURATION = 600; // 20 Detik @ 30 FPS

export const AccEp8BalanceSheet: React.FC<TutorialProps> = () => {
  const frame = useCurrentFrame();

  let cursorX = 960;
  let cursorY = 540;
  let cursorLabel = "";

  if (frame < 180) {
    cursorX = interpolate(frame, [0, 80], [960, 480], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [0, 80], [540, 260], { extrapolateRight: "clamp" });
    cursorLabel = "Kas & Bank: Dana Kasir [CSH1] & Mandiri [BNK1]";
  } else if (frame < 380) {
    cursorX = interpolate(frame, [180, 260], [480, 820], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [180, 260], [260, 360], { extrapolateRight: "clamp" });
    cursorLabel = "Valuasi Stok: 30m Kain (600k) + 9 Sprei XL (675k)";
  } else {
    cursorX = interpolate(frame, [380, 460], [820, 820], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [380, 460], [360, 520], { extrapolateRight: "clamp" });
    cursorLabel = "Neraca Seimbang: Total Aset = Kewajiban + Ekuitas";
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
        breadcrumbRecord="Neraca Keuangan (Balance Sheet)"
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
        EPISODE 8/10: BALANCE SHEET & INVENTORY VALUATION
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
                Neraca Keuangan & Valuasi Aset Toko
              </h2>
              <span style={{ fontSize: 12, color: "#8b949e" }}>
                Posisi Keuangan Per 12 November 2026 • Perpetual Inventory Valuation
              </span>
            </div>
            <Badge variant="success">Balanced: Rp 16.672.500</Badge>
          </div>

          {/* Balance Sheet Sections */}
          <div style={{ padding: "20px 32px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <tbody>
                {/* 1. Current Assets */}
                <tr style={{ backgroundColor: "#21262d", fontWeight: 700, color: "#58a6ff" }}>
                  <td style={{ padding: "10px 14px" }}>AKTIVA LANCAR (CURRENT ASSETS)</td>
                  <td style={{ padding: "10px 14px", textAlign: "right" }}>Rp 16.672.500,00</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #21262d", color: "#c9d1d9" }}>
                  <td style={{ padding: "8px 24px" }}>11110000 Kas Kecil Kasir [CSH1]</td>
                  <td style={{ padding: "8px 14px", textAlign: "right" }}>Rp 1.485.000,00</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #21262d", color: "#c9d1d9" }}>
                  <td style={{ padding: "8px 24px" }}>11120000 Bank Mandiri Giro [BNK1] (Termasuk Settlement QRIS)</td>
                  <td style={{ padding: "8px 14px", textAlign: "right" }}>Rp 13.912.500,00</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #21262d", color: "#c9d1d9" }}>
                  <td style={{ padding: "8px 24px" }}>
                    11410000 Valuasi Persediaan Bahan Baku (Sisa 30m Kain Katun @ Rp 20.000)
                  </td>
                  <td style={{ padding: "8px 14px", textAlign: "right", color: "#79c0ff" }}>Rp 600.000,00</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #21262d", color: "#c9d1d9" }}>
                  <td style={{ padding: "8px 24px" }}>
                    11420000 Valuasi Persediaan Barang Jadi Rak Kasir (9 Pcs Sprei XL @ Rp 75.000)
                  </td>
                  <td style={{ padding: "8px 14px", textAlign: "right", color: "#79c0ff" }}>Rp 675.000,00</td>
                </tr>

                {/* 2. Liabilities */}
                <tr style={{ backgroundColor: "#21262d", fontWeight: 700, color: "#e3b341" }}>
                  <td style={{ padding: "10px 14px" }}>KEWAJIBAN & HUTANG (LIABILITIES)</td>
                  <td style={{ padding: "10px 14px", textAlign: "right" }}>Rp 0,00</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #21262d", color: "#c9d1d9" }}>
                  <td style={{ padding: "8px 24px" }}>21110000 Hutang Usaha (PT Tekstil Maju Jaya - Lunas)</td>
                  <td style={{ padding: "8px 14px", textAlign: "right", color: "#3fb950" }}>Rp 0,00 (Lunas)</td>
                </tr>

                {/* 3. Equity */}
                <tr style={{ backgroundColor: "#21262d", fontWeight: 700, color: "#bc8cff" }}>
                  <td style={{ padding: "10px 14px" }}>EKUITAS & LABA DITAHAN (EQUITY)</td>
                  <td style={{ padding: "10px 14px", textAlign: "right" }}>Rp 16.672.500,00</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #21262d", color: "#c9d1d9" }}>
                  <td style={{ padding: "8px 24px" }}>31110000 Modal Awal Pemilik Toko</td>
                  <td style={{ padding: "8px 14px", textAlign: "right" }}>Rp 16.650.000,00</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #21262d", color: "#c9d1d9" }}>
                  <td style={{ padding: "8px 24px" }}>Laba Bersih Tahun Berjalan (Net Profit POS)</td>
                  <td style={{ padding: "8px 14px", textAlign: "right", color: "#58a6ff", fontWeight: 700 }}>
                    Rp 22.500,00
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <TutorialCallout
        step={8}
        title="Neraca Keuangan & Valuasi Stok Persediaan"
        description={
          frame < 180
            ? "Neraca menyajikan gambaran utuh kekayaan toko: saldo kas tunai, rekening giro bank Mandiri, dan persediaan."
            : frame < 380
            ? "Metode perpetual secara otomatis memecah nilai stok gudang: sisa 30m kain (Rp 600rb) dan 9 Sprei XL di etalase kasir (Rp 675rb)."
            : "Total Aktiva (Rp 16.672.500) seimbang sempurna dengan Ekuitas + Laba Berjalan tanpa ada rupiah yang hilang."
        }
        visible={true}
      />

      <Cursor x={cursorX} y={cursorY} label={cursorLabel} />
    </AbsoluteFill>
  );
};
