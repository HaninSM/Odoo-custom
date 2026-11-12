import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { OdooNavBar } from "../components/OdooNavBar";
import { Cursor } from "../components/Cursor";
import { TutorialCallout } from "../components/TutorialCallout";
import { Badge } from "../components/Badge";
import { CheckCircleIcon } from "../components/Icons";

export const WalkthroughScene5Finance: React.FC = () => {
  const frame = useCurrentFrame();

  // Cursor movements
  let cursorX = 960;
  let cursorY = 540;
  let cursorLabel = "";

  if (frame < 120) {
    cursorX = interpolate(frame, [0, 80], [960, 480], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [0, 80], [540, 360], { extrapolateRight: "clamp" });
    cursorLabel = "Cek Laba Bersih Penjualan: Rp 37.500";
  } else if (frame < 220) {
    cursorX = interpolate(frame, [120, 180], [480, 1200], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [120, 180], [360, 360], { extrapolateRight: "clamp" });
    cursorLabel = "Cek Jadwal Jatuh Tempo Hutang 01 Des 2026";
  } else {
    cursorX = interpolate(frame, [220, 270], [1200, 960], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [220, 270], [360, 680], { extrapolateRight: "clamp" });
    cursorLabel = "Alur Input Selesai & Terintegrasi Sempurna!";
  }

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        backgroundColor: "#0d1117",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <OdooNavBar
        activeMenu="📊 Akuntansi"
        breadcrumbModel="Akuntansi"
        breadcrumbRecord="Laporan Laba Rugi & Jadwal Jatuh Tempo"
      />

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
            maxWidth: 1600,
            backgroundColor: "#161b22",
            borderRadius: 16,
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
            padding: "30px 48px",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 13, textTransform: "uppercase", color: "#34d399", fontWeight: 700 }}>
                Laporan Keuangan Otomatis (Live Odoo Ledger)
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#ffffff", marginTop: 4 }}>
                Hasil Akhir Seluruh Rangkaian Input Data
              </div>
            </div>

            <Badge label="Laporan Sinkron Real-Time" variant="green" fontSize={13} />
          </div>

          <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 32 }}>
            {/* Left: Profit & Loss Statement */}
            <div
              style={{
                backgroundColor: "rgba(30, 41, 59, 0.4)",
                borderRadius: 14,
                padding: "22px 26px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <div style={{ fontSize: 17, fontWeight: 800, color: "#ffffff", marginBottom: 16 }}>
                Laporan Laba Rugi Toko
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 15 }}>
                <span style={{ color: "#cbd5e1" }}>Penjualan Bersih Kasir (1 Pcs Sprei XL)</span>
                <strong style={{ color: "#ffffff" }}>Rp 112.500</strong>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 15 }}>
                <span style={{ color: "#f87171" }}>HPP Komposit Terpotong (COGS)</span>
                <strong style={{ color: "#f87171" }}>(Rp 75.000)</strong>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "16px 0 6px 0",
                  fontSize: 20,
                  fontWeight: 900,
                  color: "#34d399",
                }}
              >
                <span>LABA KOTOR PENJUALAN:</span>
                <span>Rp 37.500 (+50%)</span>
              </div>
            </div>

            {/* Right: Cash Journals & Due Date Reminders */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Cash Movement */}
              <div
                style={{
                  backgroundColor: "rgba(30, 41, 59, 0.4)",
                  borderRadius: 14,
                  padding: "18px 22px",
                  border: "1px solid rgba(59, 130, 246, 0.3)",
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 700, color: "#60a5fa", textTransform: "uppercase" }}>
                  Buku Pembantu Bank & QRIS
                </div>
                <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 15, color: "#cbd5e1" }}>[QRIS1] Akun Kliring 11120010:</span>
                  <span style={{ fontSize: 18, fontWeight: 800, color: "#38bdf8" }}>+Rp 112.500</span>
                </div>
              </div>

              {/* Vendor Bill Aging Reminder */}
              <div
                style={{
                  backgroundColor: "rgba(30, 41, 59, 0.4)",
                  borderRadius: 14,
                  padding: "18px 22px",
                  border: "1px solid rgba(245, 158, 11, 0.4)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#fbbf24", textTransform: "uppercase" }}>
                    Kontrol Jatuh Tempo Hutang
                  </span>
                  <Badge label="Tempo 30 Hari" variant="amber" fontSize={11} />
                </div>
                <div style={{ marginTop: 8, fontSize: 14, color: "#cbd5e1" }}>
                  Tagihan PT. Tekstil Maju Jaya: <strong style={{ color: "#ffffff" }}>Rp 1.200.000</strong>
                </div>
                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>
                  Batas Akhir Bayar: <strong style={{ color: "#fbbf24" }}>01 Desember 2026</strong> (Aman)
                </div>
              </div>
            </div>
          </div>

          {/* Outro Success Card */}
          <div
            style={{
              marginTop: 24,
              padding: "16px 24px",
              borderRadius: 12,
              background: "linear-gradient(135deg, rgba(26,98,255,0.2) 0%, rgba(16,185,129,0.2) 100%)",
              border: "2px solid #3b82f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <CheckCircleIcon size={32} color="#34d399" />
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, color: "#ffffff" }}>
                  Alur Input Data Selesai & Terintegrasi Sempurna!
                </div>
                <div style={{ fontSize: 13, color: "#cbd5e1" }}>
                  Dari Bahan Baku Mentah, PO FIFO, Jahit Sprei, Kasir Multi-Payment hingga Pembukuan Otomatis.
                </div>
              </div>
            </div>
            <div style={{ fontWeight: 800, fontSize: 15, color: "#38bdf8" }}>
              https://sage.odoo.com
            </div>
          </div>
        </div>
      </div>

      <TutorialCallout
        step="5"
        instruction="Laporan Laba Rugi Instan & Kontrol Jatuh Tempo"
        detail="Seluruh transaksi langsung tersaji ke laporan keuangan tanpa pembukuan ganda!"
        bottom={40}
        left={80}
      />

      <Cursor
        x={cursorX}
        y={cursorY}
        isClicking={false}
        currentFrame={frame}
        actionLabel={cursorLabel}
      />
    </div>
  );
};
