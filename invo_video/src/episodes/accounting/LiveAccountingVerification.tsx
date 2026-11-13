import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { OdooNavBar } from "../../components/OdooNavBar";
import { Cursor } from "../../components/Cursor";
import { TutorialCallout } from "../../components/TutorialCallout";
import { Badge } from "../../components/Badge";
import { CheckCircleIcon, ChartIcon } from "../../components/Icons";
import { TutorialProps } from "../../types";

export const LIVE_ACCOUNTING_VERIFICATION_DURATION = 660; // 22 Detik @ 30 FPS

export const LiveAccountingVerification: React.FC<TutorialProps> = () => {
  const frame = useCurrentFrame();

  // Active view:
  // 0 - 200: Vendor Bill & Pelunasan Bank (BILL/2026/11/0001 - PAID)
  // 200 - 420: Jurnal POS & QRIS Settlement (QRIS1 & BNK1 - Reconciled 0)
  // 420 - 660: Laporan Laba Rugi Live (Laba Bersih Rp 22.500)
  const activeTab = frame < 200 ? "bills" : frame < 420 ? "journals" : "pnl";

  // Cursor movements
  let cursorX = 380;
  let cursorY = 260;
  let cursorLabel = "";
  let isClicking = false;
  let clickFrame = 0;

  if (frame < 200) {
    cursorX = interpolate(frame, [0, 90], [320, 680], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [0, 90], [220, 310], { extrapolateRight: "clamp" });
    cursorLabel = "Vendor Bill BILL/2026/11/0001 (PT Tekstil Maju Jaya) • Status: PAID via Bank";
    if (frame >= 105 && frame <= 113) {
      isClicking = true;
      clickFrame = 109;
    }
  } else if (frame < 420) {
    cursorX = interpolate(frame, [200, 290], [680, 720], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [200, 290], [310, 480], { extrapolateRight: "clamp" });
    cursorLabel = "Settlement QRIS 11120010 -> Bank Mandiri Giro (Saldo Kliring = Rp 0)";
    if (frame >= 305 && frame <= 313) {
      isClicking = true;
      clickFrame = 309;
    }
  } else {
    cursorX = interpolate(frame, [420, 510], [720, 1420], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [420, 510], [480, 540], { extrapolateRight: "clamp" });
    cursorLabel = "Laporan Laba Rugi Live: Laba Bersih Bersih Final = Rp 22.500 (100% VALID)";
    if (frame >= 530 && frame <= 538) {
      isClicking = true;
      clickFrame = 534;
    }
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
        activeMenu="📊 Invoicing & Accounting"
        breadcrumbModel="General Ledger & Financial Reports"
        breadcrumbRecord="Live Telemetry: sage.odoo.com"
      />

      <div
        style={{
          position: "absolute",
          top: 18,
          right: 36,
          backgroundColor: "rgba(15, 23, 42, 0.9)",
          border: "1px solid rgba(16, 185, 129, 0.6)",
          borderRadius: 8,
          padding: "5px 14px",
          color: "#34d399",
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: "0.06em",
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#10b981", display: "inline-block", boxShadow: "0 0 10px #10b981" }} />
        LIVE SYNC: SAGE.ODOO.COM (ACCOUNTING ENGINE)
      </div>

      <div
        style={{
          flex: 1,
          padding: "20px 48px 60px 48px",
          display: "flex",
          gap: 28,
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        {/* Main Column */}
        <div
          style={{
            flex: 1.4,
            backgroundColor: "#161b22",
            borderRadius: 12,
            border: "1px solid #30363d",
            padding: 24,
            boxShadow: "0 12px 36px rgba(0,0,0,0.45)",
          }}
        >
          {/* Header tabs */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, paddingBottom: 14, borderBottom: "1px solid #21262d" }}>
            <div style={{ display: "flex", gap: 12 }}>
              <div
                style={{
                  padding: "6px 14px",
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 700,
                  backgroundColor: activeTab === "bills" ? "#238636" : "#21262d",
                  color: activeTab === "bills" ? "#ffffff" : "#8b949e",
                }}
              >
                1. Vendor Bills (AP)
              </div>
              <div
                style={{
                  padding: "6px 14px",
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 700,
                  backgroundColor: activeTab === "journals" ? "#238636" : "#21262d",
                  color: activeTab === "journals" ? "#ffffff" : "#8b949e",
                }}
              >
                2. Buku Jurnal & Kliring QRIS
              </div>
              <div
                style={{
                  padding: "6px 14px",
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 700,
                  backgroundColor: activeTab === "pnl" ? "#238636" : "#21262d",
                  color: activeTab === "pnl" ? "#ffffff" : "#8b949e",
                }}
              >
                3. Laporan Laba Rugi
              </div>
            </div>
            <Badge text="POSTED IN GENERAL LEDGER" variant="success" />
          </div>

          {/* Tab 1: Vendor Bills */}
          <div
            style={{
              backgroundColor: "#0d1117",
              border: activeTab === "bills" ? "1.5px solid #38bdf8" : "1px solid #21262d",
              borderRadius: 10,
              padding: 18,
              marginBottom: 14,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#f0f6fc" }}>
                Tagihan Vendor: BILL/2026/11/0001
              </div>
              <span style={{ fontSize: 12, fontWeight: 800, color: "#34d399", backgroundColor: "rgba(16, 185, 129, 0.2)", padding: "4px 10px", borderRadius: 6, border: "1px solid rgba(16, 185, 129, 0.4)" }}>
                STATUS: PAID (LUNAS)
              </span>
            </div>
            <div style={{ fontSize: 13, color: "#8b949e", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              <div>Vendor: <strong style={{ color: "#f0f6fc" }}>PT. Tekstil Maju Jaya</strong></div>
              <div>Jatuh Tempo: <strong style={{ color: "#f0f6fc" }}>01 Des 2026 (Net 30)</strong></div>
              <div>Total Tagihan: <strong style={{ color: "#38bdf8" }}>Rp 1.200.000,00</strong></div>
              <div>Akun Hutang: <strong style={{ color: "#f0f6fc" }}>21100010 (Payable)</strong></div>
              <div>Metode Bayar: <strong style={{ color: "#34d399" }}>Bank Mandiri Giro [BNK1]</strong></div>
              <div>Sisa Hutang: <strong style={{ color: "#34d399" }}>Rp 0,00</strong></div>
            </div>
          </div>

          {/* Tab 2: Journal Entries */}
          <div
            style={{
              backgroundColor: "#0d1117",
              border: activeTab === "journals" ? "1.5px solid #a855f7" : "1px solid #21262d",
              borderRadius: 10,
              padding: 18,
              marginBottom: 14,
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 700, color: "#f0f6fc", marginBottom: 10 }}>
              Entri Jurnal Kasir & Rekonsiliasi Kliring QRIS
            </div>
            <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ color: "#8b949e", borderBottom: "1px solid #21262d", textAlign: "left" }}>
                  <th style={{ padding: "6px" }}>Nomor Jurnal</th>
                  <th style={{ padding: "6px" }}>Akun Debit / Kredit</th>
                  <th style={{ padding: "6px" }}>Keterangan Transaksi</th>
                  <th style={{ padding: "6px", textAlign: "right" }}>Jumlah</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid #161b22", color: "#f0f6fc" }}>
                  <td style={{ padding: "6px", color: "#38bdf8" }}>QRIS1/2026</td>
                  <td style={{ padding: "6px" }}>11120010 Kliring QRIS / 41000010 Sales</td>
                  <td style={{ padding: "6px", color: "#8b949e" }}>Kasir POS TRX-202611-0002</td>
                  <td style={{ padding: "6px", textAlign: "right", color: "#34d399" }}>Rp 112.500</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #161b22", color: "#f0f6fc" }}>
                  <td style={{ padding: "6px", color: "#c084fc" }}>MISC/2026</td>
                  <td style={{ padding: "6px" }}>51000010 COGS / 11300180 Inventory</td>
                  <td style={{ padding: "6px", color: "#8b949e" }}>HPP Komposit Sprei XL (1 Pcs)</td>
                  <td style={{ padding: "6px", textAlign: "right", color: "#fbbf24" }}>Rp 75.000</td>
                </tr>
                <tr style={{ color: "#f0f6fc" }}>
                  <td style={{ padding: "6px", color: "#34d399" }}>BNK1/2026</td>
                  <td style={{ padding: "6px" }}>11120004 Bank Mandiri / 11120010 Kliring</td>
                  <td style={{ padding: "6px", color: "#8b949e" }}>Settlement QRIS Merchant Harian</td>
                  <td style={{ padding: "6px", textAlign: "right", color: "#34d399" }}>Rp 112.500</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Tab 3: Profit & Loss Preview */}
          <div
            style={{
              backgroundColor: "#0d1117",
              border: activeTab === "pnl" ? "1.5px solid #10b981" : "1px solid #21262d",
              borderRadius: 10,
              padding: 18,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#f0f6fc" }}>
                Laporan Laba Rugi Operasional Kasir
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#34d399" }}>
                LABA BERSIH: +Rp 22.500,00
              </div>
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 10, fontSize: 13 }}>
              <div style={{ color: "#8b949e" }}>Pendapatan Kasir: <span style={{ color: "#f0f6fc", fontWeight: 700 }}>Rp 112.500</span></div>
              <div style={{ color: "#8b949e" }}>Beban Pokok (HPP): <span style={{ color: "#f87171", fontWeight: 700 }}>-Rp 75.000</span></div>
              <div style={{ color: "#8b949e" }}>Beban Listrik: <span style={{ color: "#f87171", fontWeight: 700 }}>-Rp 15.000</span></div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Telemetry */}
        <div style={{ flex: 1.0, display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              backgroundColor: "#161b22",
              borderRadius: 12,
              border: "1px solid #30363d",
              padding: 22,
              boxShadow: "0 12px 36px rgba(0,0,0,0.45)",
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 700, color: "#f0f6fc", display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <ChartIcon size={20} color="#38bdf8" /> Neraca Saldo Live (Trial Balance)
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", backgroundColor: "#0d1117", borderRadius: 6 }}>
                <span style={{ color: "#8b949e" }}>Pendapatan Penjualan (41000010)</span>
                <span style={{ color: "#34d399", fontWeight: 700 }}>Rp 112.500 (Cr)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", backgroundColor: "#0d1117", borderRadius: 6 }}>
                <span style={{ color: "#8b949e" }}>Beban Pokok / COGS (51000010)</span>
                <span style={{ color: "#fbbf24", fontWeight: 700 }}>Rp 75.000 (Dr)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", backgroundColor: "#0d1117", borderRadius: 6 }}>
                <span style={{ color: "#8b949e" }}>Beban Operasional Listrik (61100000)</span>
                <span style={{ color: "#f87171", fontWeight: 700 }}>Rp 15.000 (Dr)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", backgroundColor: "#0d1117", borderRadius: 6 }}>
                <span style={{ color: "#8b949e" }}>Rekening Giro Mandiri (11120004)</span>
                <span style={{ color: "#38bdf8", fontWeight: 700 }}>Rp 112.500 (Dr)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", backgroundColor: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.4)", borderRadius: 6 }}>
                <span style={{ color: "#34d399", fontWeight: 600 }}>Rekening Antara Kliring QRIS (11120010)</span>
                <span style={{ color: "#34d399", fontWeight: 800 }}>Rp 0,00 (Clear)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", backgroundColor: "rgba(56, 189, 248, 0.1)", border: "1px solid rgba(56, 189, 248, 0.4)", borderRadius: 6 }}>
                <span style={{ color: "#38bdf8", fontWeight: 600 }}>Hutang Dagang Vendor (21100010)</span>
                <span style={{ color: "#38bdf8", fontWeight: 800 }}>Rp 0,00 (Lunas)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Callout */}
      <TutorialCallout
        title="Modul Akuntansi & Buku Besar (Live Odoo 20.0)"
        description={
          activeTab === "bills"
            ? "Vendor Bill BILL/2026/11/0001 PT Tekstil Maju Jaya (Rp 1.200.000) telah diposting dan dilunasi penuh (PAID) via Bank Mandiri Giro."
            : activeTab === "journals"
            ? "Jurnal POS mendebit Kliring QRIS 11120010, kemudian mutasi harian mentransfer Rp 112.500 ke Giro Mandiri hingga akun kliring bersih (Rp 0)."
            : "Laba Bersih Operasional Toko terealisasi sebesar Rp 22.500 (Pendapatan Rp 112.500 - HPP Rp 75.000 - Beban Listrik Rp 15.000)."
        }
        stepNumber={activeTab === "bills" ? 1 : activeTab === "journals" ? 2 : 3}
        totalSteps={3}
      />

      {/* Animated Cursor */}
      <Cursor
        x={cursorX}
        y={cursorY}
        label={cursorLabel}
        isClicking={isClicking}
        clickFrame={clickFrame}
      />
    </AbsoluteFill>
  );
};
