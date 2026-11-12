import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { OdooNavBar } from "../components/OdooNavBar";
import { Cursor } from "../components/Cursor";
import { TutorialCallout } from "../components/TutorialCallout";
import { Badge } from "../components/Badge";
import { CheckCircleIcon } from "../components/Icons";
import { TutorialProps } from "../types";

export const EPISODE5_DURATION = 660; // 22 detik @ 30 FPS

export const Episode5Pelengkap: React.FC<TutorialProps> = () => {
  const frame = useCurrentFrame();

  const isRegisterModal = frame >= 80 && frame < 240;
  const isPaid = frame >= 240;
  const isExpenseSaved = frame >= 420;

  // Cursor movements
  let cursorX = 960;
  let cursorY = 540;
  let cursorLabel = "";
  let isClicking = false;
  let clickFrame = 0;

  if (frame < 80) {
    cursorX = interpolate(frame, [0, 60], [960, 300], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [0, 60], [540, 190], { extrapolateRight: "clamp" });
    cursorLabel = "Klik Register Payment Tagihan Vendor";
    if (frame >= 64 && frame <= 72) {
      isClicking = true;
      clickFrame = 68;
    }
  } else if (frame < 240) {
    cursorX = interpolate(frame, [80, 180], [300, 1080], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [80, 180], [190, 620], { extrapolateRight: "clamp" });
    cursorLabel = "Pilih Rekening Bank & Klik Create Payment";
    if (frame >= 200 && frame <= 208) {
      isClicking = true;
      clickFrame = 204;
    }
  } else if (frame < 420) {
    cursorX = interpolate(frame, [240, 340], [1080, 480], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [240, 340], [620, 480], { extrapolateRight: "clamp" });
    cursorLabel = "Input Beban Listrik Toko: Rp 15.000";
    if (frame >= 380 && frame <= 388) {
      isClicking = true;
      clickFrame = 384;
    }
  } else {
    cursorX = interpolate(frame, [420, 500], [480, 1200], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [420, 500], [480, 450], { extrapolateRight: "clamp" });
    cursorLabel = "Laba Bersih Riil Dihitung: Rp 22.500";
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
        breadcrumbModel="Operasional & Pelunasan"
        breadcrumbRecord={frame < 240 ? "Tagihan Supplier PT Tekstil Maju Jaya" : "Buku Kas & Laba Bersih Toko"}
      />

      <div
        style={{
          position: "absolute",
          top: 18,
          right: 36,
          backgroundColor: "rgba(15, 23, 42, 0.85)",
          border: "1px solid rgba(236, 72, 153, 0.5)",
          borderRadius: 8,
          padding: "4px 12px",
          color: "#f472b6",
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: "0.06em",
          zIndex: 100,
        }}
      >
        MODUL 5 • PELUNASAN HUTANG & LABA BERSIH
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
          {/* Top Stage Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 13, textTransform: "uppercase", color: "#60a5fa", fontWeight: 700 }}>
                Pelunasan Hutang Dagang & Realisasi Beban Toko
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#ffffff", marginTop: 4 }}>
                SOP Pelunasan Supplier Net 30 & Laba Bersih Usaha
              </div>
            </div>

            <Badge
              label={isPaid ? "Status: LUNAS (PAID)" : "Status: BELUM DIBAYAR (NOT PAID)"}
              variant={isPaid ? "green" : "red"}
              fontSize={13}
            />
          </div>

          {/* Dual Panel */}
          <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 28 }}>
            {/* Left: Vendor Bill Settlement Box */}
            <div
              style={{
                backgroundColor: "rgba(30, 41, 59, 0.4)",
                borderRadius: 14,
                padding: "20px 24px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: "#ffffff" }}>
                  Tagihan Supplier: PT. Tekstil Maju Jaya
                </span>
                <span style={{ fontSize: 13, color: "#fbbf24", fontWeight: 700 }}>Jatuh Tempo: 01 Des 2026</span>
              </div>

              <div style={{ marginTop: 14, padding: "14px", borderRadius: 10, backgroundColor: "rgba(15, 23, 42, 0.6)", display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#94a3b8" }}>Total Tagihan AP:</span>
                <strong style={{ fontSize: 20, color: "#f87171" }}>Rp 1.200.000</strong>
              </div>

              <div style={{ marginTop: 16 }}>
                <div
                  style={{
                    padding: "10px 18px",
                    borderRadius: 8,
                    backgroundColor: isPaid ? "rgba(255,255,255,0.06)" : "#1a62ff",
                    color: "#ffffff",
                    fontWeight: 800,
                    fontSize: 14,
                    display: "inline-block",
                  }}
                >
                  {isPaid ? "✓ Telah Dilunasi via Bank [BNK1]" : "Register Payment / Bayar Hutang"}
                </div>
              </div>
            </div>

            {/* Right: Net Profit with Expense Deduction */}
            <div
              style={{
                backgroundColor: "rgba(30, 41, 59, 0.4)",
                borderRadius: 14,
                padding: "20px 24px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 700, color: "#34d399" }}>
                Kalkulasi Laba Bersih Toko (Net Profit)
              </div>

              <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", fontSize: 14, paddingBottom: 8, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ color: "#cbd5e1" }}>Laba Kotor Penjualan Kasir:</span>
                <strong style={{ color: "#34d399" }}>Rp 37.500</strong>
              </div>

              <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", fontSize: 14, paddingBottom: 8, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ color: "#cbd5e1" }}>Beban Listrik & Toko (`x_pos_expense`):</span>
                <strong style={{ color: isExpenseSaved ? "#f87171" : "#64748b" }}>
                  {isExpenseSaved ? "(Rp 15.000)" : "Rp 0"}
                </strong>
              </div>

              <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: 16, fontWeight: 800, color: "#ffffff" }}>LABA BERSIH RIIL TOKO:</span>
                <span style={{ fontSize: 26, fontWeight: 900, color: isExpenseSaved ? "#34d399" : "#ffffff" }}>
                  {isExpenseSaved ? "Rp 22.500" : "Rp 37.500"}
                </span>
              </div>
            </div>
          </div>

          {/* Register Payment Modal Overlay */}
          {isRegisterModal && (
            <div
              style={{
                position: "absolute",
                top: 70,
                left: 200,
                right: 200,
                backgroundColor: "rgba(10, 15, 29, 0.98)",
                borderRadius: 16,
                padding: "28px 36px",
                border: "2px solid #3b82f6",
                boxShadow: "0 24px 60px rgba(0,0,0,0.85)",
                zIndex: 60,
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 800, color: "#ffffff" }}>
                Register Payment — Pelunasan Faktur Vendor
              </div>
              <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>
                Pelunasan tagihan supplier PT. Tekstil Maju Jaya
              </div>

              <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div>
                  <label style={{ fontSize: 12, color: "#94a3b8", fontWeight: 700 }}>REKENING PEMBAYAR</label>
                  <div style={{ height: 42, backgroundColor: "#0f172a", borderRadius: 8, display: "flex", alignItems: "center", padding: "0 14px", color: "#38bdf8", fontWeight: 700, marginTop: 4 }}>
                    🏦 [BNK1] Rekening Bisnis Bank
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 12, color: "#94a3b8", fontWeight: 700 }}>NOMINAL PELUNASAN</label>
                  <div style={{ height: 42, backgroundColor: "#0f172a", borderRadius: 8, display: "flex", alignItems: "center", padding: "0 14px", color: "#ffffff", fontWeight: 800, fontSize: 16, marginTop: 4 }}>
                    Rp 1.200.000 (LUNAS)
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end", gap: 12 }}>
                <div style={{ padding: "10px 22px", borderRadius: 8, backgroundColor: "#10b981", color: "#ffffff", fontWeight: 800 }}>
                  ✓ Create Payment / Konfirmasi Pelunasan
                </div>
              </div>
            </div>
          )}

          {/* Audit FIFO Batch Sisa */}
          <div
            style={{
              marginTop: 22,
              padding: "16px 20px",
              borderRadius: 12,
              backgroundColor: "rgba(26, 98, 255, 0.1)",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <CheckCircleIcon size={24} color="#38bdf8" />
              <div>
                <span style={{ fontSize: 15, fontWeight: 700, color: "#ffffff" }}>
                  Audit Kartu Stok FIFO Gudang (`x_pos_batch`)
                </span>
                <span style={{ fontSize: 13, color: "#94a3b8", marginLeft: 10 }}>
                  Batch 1 (Awal 60m $\rightarrow$ Terpotong 30m $\rightarrow$ Sisa **30 Meter**)
                </span>
              </div>
            </div>
            <Badge label="Stok Gudang Valid Presisi" variant="blue" fontSize={11} />
          </div>
        </div>
      </div>

      <TutorialCallout
        step="5"
        instruction="Pelunasan Hutang Supplier & Laba Bersih Usaha"
        detail="Pelunasan tagihan mengubah status ke Lunas (PAID) dan beban listrik memotong laba menjadi Rp 22.500!"
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
