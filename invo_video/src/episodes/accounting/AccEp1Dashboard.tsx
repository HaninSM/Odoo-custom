import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { OdooNavBar } from "../../components/OdooNavBar";
import { Cursor } from "../../components/Cursor";
import { TutorialCallout } from "../../components/TutorialCallout";
import { Badge } from "../../components/Badge";
import { ChartIcon, CheckCircleIcon } from "../../components/Icons";
import { TutorialProps } from "../../types";

export const ACC_EP1_DURATION = 600; // 20 Detik @ 30 FPS

export const AccEp1Dashboard: React.FC<TutorialProps> = () => {
  const frame = useCurrentFrame();

  // Cursor navigation
  let cursorX = 960;
  let cursorY = 540;
  let cursorLabel = "";
  let isClicking = false;
  let clickFrame = 0;

  if (frame < 180) {
    cursorX = interpolate(frame, [0, 90], [960, 430], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [0, 90], [540, 360], { extrapolateRight: "clamp" });
    cursorLabel = "Jurnal POS Kasir & QRIS [QRIS1] Terkoneksi Real-Time";
  } else if (frame < 380) {
    cursorX = interpolate(frame, [180, 260], [430, 1100], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [180, 260], [360, 360], { extrapolateRight: "clamp" });
    cursorLabel = "Kartu Bank [BNK1]: Saldo & Kliring Harian";
    if (frame >= 280 && frame <= 288) {
      isClicking = true;
      clickFrame = 284;
    }
  } else {
    cursorX = interpolate(frame, [380, 460], [1100, 770], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [380, 460], [360, 680], { extrapolateRight: "clamp" });
    cursorLabel = "Tagihan Hutang Vendor (PT Tekstil Maju Jaya: Rp 1.200.000)";
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
        breadcrumbModel="Accounting"
        breadcrumbRecord="Dashboard Ikhtisar Jurnal & POS"
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
        EPISODE 1/10: ACCOUNTING DASHBOARD
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
          {/* Header Action Bar */}
          <div
            style={{
              padding: "16px 24px",
              borderBottom: "1px solid #21262d",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "linear-gradient(to right, #161b22, #0d1117)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  backgroundColor: "#714B67",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                }}
              >
                <ChartIcon size={20} />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#f0f6fc" }}>
                  Ikhtisar Buku Besar & Jurnal Transaksi
                </h2>
                <span style={{ fontSize: 12, color: "#8b949e" }}>
                  Odoo 20.0 Enterprise • Multi-Journal POS Integration
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                style={{
                  backgroundColor: "#238636",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: 6,
                  padding: "8px 16px",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                + Transaksi Baru
              </button>
              <button
                style={{
                  backgroundColor: "#21262d",
                  color: "#c9d1d9",
                  border: "1px solid #30363d",
                  borderRadius: 6,
                  padding: "8px 16px",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                🔄 Refresh Sinkronisasi POS
              </button>
            </div>
          </div>

          {/* Kanban Cards Grid */}
          <div
            style={{
              padding: 24,
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 20,
            }}
          >
            {/* Card 1: Customer Invoices & POS Sales */}
            <div
              style={{
                backgroundColor: "#0d1117",
                border: "1px solid #30363d",
                borderRadius: 10,
                padding: 20,
                position: "relative",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: "#58a6ff" }}>
                  Point of Sale & Kasir Toko
                </span>
                <Badge variant="success">Online • Terhubung</Badge>
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#f0f6fc", marginBottom: 6 }}>
                Rp 112.500
              </div>
              <div style={{ fontSize: 12, color: "#8b949e", marginBottom: 16 }}>
                1 Transaksi Sesi Hari Ini (1x Sprei XL)
              </div>
              <div
                style={{
                  padding: 10,
                  backgroundColor: "#161b22",
                  borderRadius: 6,
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                }}
              >
                <span style={{ color: "#8b949e" }}>Metode Bayar:</span>
                <span style={{ color: "#3fb950", fontWeight: 700 }}>QRIS & EDC (11120010)</span>
              </div>
            </div>

            {/* Card 2: Bank Journal */}
            <div
              style={{
                backgroundColor: "#0d1117",
                border: "1px solid #30363d",
                borderRadius: 10,
                padding: 20,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: "#58a6ff" }}>
                  Bank Mandiri Giro [BNK1]
                </span>
                <Badge variant="info">Rekening Utama</Badge>
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#f0f6fc", marginBottom: 6 }}>
                Rp 15.000.000
              </div>
              <div style={{ fontSize: 12, color: "#8b949e", marginBottom: 16 }}>
                Saldo Buku Kas Siap Kliring & Pelunasan
              </div>
              <div
                style={{
                  padding: 10,
                  backgroundColor: "#161b22",
                  borderRadius: 6,
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                }}
              >
                <span style={{ color: "#8b949e" }}>Status Rekonsiliasi:</span>
                <span style={{ color: "#79c0ff", fontWeight: 700 }}>1 Mutasi QRIS Siap Cair</span>
              </div>
            </div>

            {/* Card 3: Vendor Bills */}
            <div
              style={{
                backgroundColor: "#0d1117",
                border: "1px solid #30363d",
                borderRadius: 10,
                padding: 20,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: "#d29922" }}>
                  Hutang Dagang (Vendor Bills)
                </span>
                <Badge variant="warning">1 Tagihan Menunggu</Badge>
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#f0f6fc", marginBottom: 6 }}>
                Rp 1.200.000
              </div>
              <div style={{ fontSize: 12, color: "#8b949e", marginBottom: 16 }}>
                PO Bahan Kain Katun (PT Tekstil Maju Jaya)
              </div>
              <div
                style={{
                  padding: 10,
                  backgroundColor: "#161b22",
                  borderRadius: 6,
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                }}
              >
                <span style={{ color: "#8b949e" }}>Termin Jatuh Tempo:</span>
                <span style={{ color: "#e3b341", fontWeight: 700 }}>Net 30 Days (01 Des 2026)</span>
              </div>
            </div>

            {/* Card 4: Miscellaneous / Expenses */}
            <div
              style={{
                backgroundColor: "#0d1117",
                border: "1px solid #30363d",
                borderRadius: 10,
                padding: 20,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: "#bc8cff" }}>
                  Beban Operasional Toko
                </span>
                <Badge variant="neutral">Buku Operasional</Badge>
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#f0f6fc", marginBottom: 6 }}>
                Rp 15.000
              </div>
              <div style={{ fontSize: 12, color: "#8b949e", marginBottom: 16 }}>
                Biaya Listrik & Daya Toko (Non-HPP)
              </div>
              <div
                style={{
                  padding: 10,
                  backgroundColor: "#161b22",
                  borderRadius: 6,
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                }}
              >
                <span style={{ color: "#8b949e" }}>Dampak Laba Bersih:</span>
                <span style={{ color: "#3fb950", fontWeight: 700 }}>Laba Bersih Rp 22.500</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tutorial Callout Card */}
      <TutorialCallout
        step={1}
        title="Odoo Accounting Dashboard & Integrasi POS"
        description={
          frame < 180
            ? "Dashboard merangkum seluruh pergerakan kas toko, pos penjualan kasir, mutasi bank kliring QRIS, dan hutang supplier secara terpusat."
            : frame < 380
            ? "Penjualan kasir POS langsung tercatat di jurnal terkait tanpa perlu rekap nota manual di akhir shift."
            : "Tagihan supplier dari penerimaan bahan baku terpantau transparan lengkap dengan batas waktu jatuh tempo Net 30 hari."
        }
        visible={true}
      />

      {/* Mouse Cursor */}
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
