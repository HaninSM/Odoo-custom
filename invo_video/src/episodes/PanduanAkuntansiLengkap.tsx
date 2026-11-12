import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { OdooNavBar } from "../components/OdooNavBar";
import { Cursor } from "../components/Cursor";
import { TutorialCallout } from "../components/TutorialCallout";
import { Badge } from "../components/Badge";
import { ChartIcon, CheckCircleIcon } from "../components/Icons";
import { TutorialProps } from "../types";

export const PANDUAN_AKUNTANSI_DURATION = 900; // 30 detik @ 30 FPS

export const PanduanAkuntansiLengkap: React.FC<TutorialProps> = () => {
  const frame = useCurrentFrame();

  // Timing breakpoints
  // 0 - 330: Laba Rugi & Mutasi QRIS
  // 330 - 600: Input Beban Listrik Rp 15.000 & Laba Bersih Rp 22.500
  // 600 - 900: Register Payment Vendor Bill PT Tekstil Maju Jaya -> PAID
  const isExpenseSaved = frame >= 460;
  const isRegisterModal = frame >= 680 && frame < 810;
  const isBillPaid = frame >= 810;

  // Cursor movements
  let cursorX = 960;
  let cursorY = 540;
  let cursorLabel = "";
  let isClicking = false;
  let clickFrame = 0;

  if (frame < 160) {
    cursorX = interpolate(frame, [0, 80], [960, 480], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [0, 80], [540, 360], { extrapolateRight: "clamp" });
    cursorLabel = "Cek Laba Kotor Penjualan: Rp 37.500";
  } else if (frame < 330) {
    cursorX = interpolate(frame, [160, 240], [480, 1150], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [160, 240], [360, 350], { extrapolateRight: "clamp" });
    cursorLabel = "Mutasi Rekening Kliring QRIS 11120010: +Rp 112.500";
  } else if (frame < 460) {
    cursorX = interpolate(frame, [330, 420], [1150, 480], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [330, 420], [350, 520], { extrapolateRight: "clamp" });
    cursorLabel = "Input Beban Listrik & Toko: Rp 15.000";
    if (frame >= 440 && frame <= 448) {
      isClicking = true;
      clickFrame = 444;
    }
  } else if (frame < 600) {
    cursorX = interpolate(frame, [460, 520], [480, 1150], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [460, 520], [520, 520], { extrapolateRight: "clamp" });
    cursorLabel = "Laba Bersih Riil Terhitung: Rp 22.500";
  } else if (frame < 720) {
    cursorX = interpolate(frame, [600, 670], [1150, 300], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [600, 670], [520, 190], { extrapolateRight: "clamp" });
    cursorLabel = "Klik Register Payment Tagihan Vendor (Rp 1.2jt)";
    if (frame >= 674 && frame <= 682) {
      isClicking = true;
      clickFrame = 678;
    }
  } else if (frame < 820) {
    cursorX = interpolate(frame, [720, 790], [300, 1080], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [720, 790], [190, 620], { extrapolateRight: "clamp" });
    cursorLabel = "Pilih Bank [BNK1] & Klik Create Payment";
    if (frame >= 804 && frame <= 812) {
      isClicking = true;
      clickFrame = 808;
    }
  } else {
    cursorX = interpolate(frame, [820, 860], [1080, 960], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [820, 860], [620, 680], { extrapolateRight: "clamp" });
    cursorLabel = "Tagihan LUNAS (PAID) & Pembukuan Lengkap!";
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
        breadcrumbModel="Akuntansi & Keuangan"
        breadcrumbRecord={
          frame < 330
            ? "Laporan Laba Rugi & Jurnal Kasir"
            : frame < 600
            ? "Beban Operasional & Laba Bersih Usaha"
            : "Tagihan Supplier PT Tekstil Maju Jaya"
        }
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
        MODUL AKUNTANSI & KEUANGAN LENGKAP
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
            maxWidth: 1600,
            backgroundColor: "#161b22",
            borderRadius: 16,
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
            padding: "28px 44px",
            position: "relative",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: "rgba(139, 92, 246, 0.2)",
                  border: "1px solid rgba(139, 92, 246, 0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#c084fc",
                }}
              >
                <ChartIcon size={24} color="#c084fc" />
              </div>
              <div>
                <div style={{ fontSize: 13, textTransform: "uppercase", color: "#c084fc", fontWeight: 700 }}>
                  Dashboard Pembukuan Keuangan Terpadu (Double-Entry Odoo 20)
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#ffffff", marginTop: 2 }}>
                  Panduan Lengkap Akuntansi: Laba Rugi, Rekening Kliring & Pelunasan AP
                </div>
              </div>
            </div>

            <Badge
              label={isBillPaid ? "✅ Tagihan Lunas (PAID)" : "Jatuh Tempo: 01 Des 2026"}
              variant={isBillPaid ? "green" : "amber"}
              fontSize={13}
            />
          </div>

          {/* 3 Main Accounting Sections Grid */}
          <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 26 }}>
            {/* Left: Profit & Loss Statement */}
            <div
              style={{
                backgroundColor: "rgba(30, 41, 59, 0.4)",
                borderRadius: 14,
                padding: "20px 24px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 800, color: "#ffffff", marginBottom: 14 }}>
                1. Laporan Laba Rugi Usaha (P&L)
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 14 }}>
                <span style={{ color: "#cbd5e1" }}>Penjualan Kasir (1 pcs Sprei XL):</span>
                <strong style={{ color: "#ffffff" }}>Rp 112.500</strong>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 14 }}>
                <span style={{ color: "#f87171" }}>Beban Pokok Penjualan (HPP Komposit):</span>
                <strong style={{ color: "#f87171" }}>(Rp 75.000)</strong>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 14 }}>
                <span style={{ color: "#34d399", fontWeight: 700 }}>Laba Kotor Penjualan:</span>
                <strong style={{ color: "#34d399" }}>Rp 37.500 (+50%)</strong>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 14 }}>
                <span style={{ color: "#cbd5e1" }}>Beban Operasional Listrik Toko:</span>
                <strong style={{ color: isExpenseSaved ? "#f87171" : "#64748b" }}>
                  {isExpenseSaved ? "(Rp 15.000)" : "Rp 0"}
                </strong>
              </div>

              <div
                style={{
                  marginTop: 12,
                  padding: "12px 16px",
                  borderRadius: 10,
                  backgroundColor: "rgba(16, 185, 129, 0.15)",
                  border: "1px solid rgba(16, 185, 129, 0.35)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 15, fontWeight: 800, color: "#ffffff" }}>LABA BERSIH RIIL TOKO:</span>
                <span style={{ fontSize: 24, fontWeight: 900, color: "#34d399" }}>
                  {isExpenseSaved ? "Rp 22.500" : "Rp 37.500"}
                </span>
              </div>
            </div>

            {/* Right: Cash Movement & Vendor Bill Settlement */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Box 1: QRIS Clearing Journal */}
              <div
                style={{
                  backgroundColor: "rgba(30, 41, 59, 0.4)",
                  borderRadius: 14,
                  padding: "16px 20px",
                  border: "1px solid rgba(59, 130, 246, 0.3)",
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 700, color: "#60a5fa", textTransform: "uppercase" }}>
                  2. Buku Akun Kliring QRIS & EDC
                </div>
                <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 14, color: "#cbd5e1" }}>Akun Kliring 11120010:</span>
                  <strong style={{ fontSize: 18, color: "#38bdf8" }}>+Rp 112.500</strong>
                </div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
                  Otomatis terpisah dari brankas tunai kasir (Settlement H+1 ke rekening bisnis bank)
                </div>
              </div>

              {/* Box 2: Vendor Bill AP Settlement */}
              <div
                style={{
                  backgroundColor: "rgba(30, 41, 59, 0.4)",
                  borderRadius: 14,
                  padding: "16px 20px",
                  border: isBillPaid ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid rgba(245, 158, 11, 0.4)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#fbbf24", textTransform: "uppercase" }}>
                    3. Hutang Dagang Supplier (Vendor Bill AP)
                  </span>
                  <Badge label={isBillPaid ? "PAID" : "Not Paid"} variant={isBillPaid ? "green" : "red"} fontSize={11} />
                </div>
                <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 14, color: "#cbd5e1" }}>PT. Tekstil Maju Jaya:</span>
                  <strong style={{ fontSize: 17, color: isBillPaid ? "#94a3b8" : "#f87171" }}>
                    {isBillPaid ? "Rp 0 (LUNAS)" : "Rp 1.200.000"}
                  </strong>
                </div>
                <div style={{ marginTop: 10 }}>
                  <div
                    style={{
                      padding: "8px 16px",
                      borderRadius: 6,
                      backgroundColor: isBillPaid ? "rgba(255,255,255,0.06)" : "#1a62ff",
                      color: "#ffffff",
                      fontSize: 12,
                      fontWeight: 700,
                      display: "inline-block",
                    }}
                  >
                    {isBillPaid ? "✓ Telah Dilunasi via Rekening Bank [BNK1]" : "Register Payment / Lunasi Tagihan"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Register Payment Modal Overlay */}
          {isRegisterModal && (
            <div
              style={{
                position: "absolute",
                top: 80,
                left: 180,
                right: 180,
                backgroundColor: "rgba(10, 15, 29, 0.98)",
                borderRadius: 16,
                padding: "24px 32px",
                border: "2px solid #3b82f6",
                boxShadow: "0 24px 60px rgba(0,0,0,0.85)",
                zIndex: 60,
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 800, color: "#ffffff" }}>
                Register Payment — Pelunasan Faktur Vendor PT. Tekstil Maju Jaya
              </div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
                Pengurangan kewajiban hutang dagang supplier (AP)
              </div>

              <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700 }}>REKENING SUMBER DANA</label>
                  <div style={{ height: 38, backgroundColor: "#0f172a", borderRadius: 8, display: "flex", alignItems: "center", padding: "0 12px", color: "#38bdf8", fontWeight: 700, marginTop: 4, fontSize: 13 }}>
                    🏦 [BNK1] Rekening Bisnis Bank
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700 }}>NOMINAL DIBAYARKAN</label>
                  <div style={{ height: 38, backgroundColor: "#0f172a", borderRadius: 8, display: "flex", alignItems: "center", padding: "0 12px", color: "#ffffff", fontWeight: 800, fontSize: 15, marginTop: 4 }}>
                    Rp 1.200.000 (LUNAS PENUH)
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 18, display: "flex", justifyContent: "flex-end" }}>
                <div style={{ padding: "8px 20px", borderRadius: 8, backgroundColor: "#10b981", color: "#ffffff", fontWeight: 800, fontSize: 13 }}>
                  ✓ Create Payment / Konfirmasi Pelunasan
                </div>
              </div>
            </div>
          )}

          {/* Bottom Double-Entry Summary */}
          <div
            style={{
              marginTop: 20,
              padding: "14px 20px",
              borderRadius: 12,
              background: "linear-gradient(135deg, rgba(26,98,255,0.15) 0%, rgba(16,185,129,0.15) 100%)",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <CheckCircleIcon size={24} color="#34d399" />
              <div>
                <span style={{ fontSize: 14, fontWeight: 800, color: "#ffffff" }}>
                  Sistem Pembukuan Berpasangan (*Double-Entry Bookkeeping*) Otomatis Seimbang
                </span>
                <span style={{ fontSize: 12, color: "#cbd5e1", marginLeft: 10 }}>
                  Debit: Piutang Kliring + Persediaan Gudang • Kredit: Penjualan + Pelunasan Hutang
                </span>
              </div>
            </div>
            <Badge label="Standar Akuntansi Odoo 20" variant="green" fontSize={11} />
          </div>
        </div>
      </div>

      <TutorialCallout
        step="4"
        instruction="Panduan Akuntansi: Laba Rugi, Rekening Kliring & Pelunasan AP"
        detail="Seluruh transaksi hulu-ke-hilir bermuara pada laporan keuangan yang presisi tanpa pembukuan ganda manual!"
        bottom={40}
        left={80}
      />

      <Cursor
        x={cursorX}
        y={cursorY}
        isClicking={isClicking}
        clickFrame={clickFrame}
        currentFrame={frame}
        actionLabel={cursorLabel}
      />
    </AbsoluteFill>
  );
};
