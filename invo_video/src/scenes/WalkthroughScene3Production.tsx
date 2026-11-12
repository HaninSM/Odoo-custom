import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { OdooNavBar } from "../components/OdooNavBar";
import { Cursor } from "../components/Cursor";
import { TutorialCallout } from "../components/TutorialCallout";

export const WalkthroughScene3Production: React.FC = () => {
  const frame = useCurrentFrame();

  const isVariantSelected = frame >= 70;
  const isQtyTyped = frame >= 150;
  const isCostTyped = frame >= 240;
  const isProcessed = frame >= 340;

  // Cursor movements
  let cursorX = 960;
  let cursorY = 540;
  let cursorLabel = "";
  let isClicking = false;
  let clickFrame = 0;

  if (frame < 80) {
    cursorX = interpolate(frame, [0, 60], [960, 480], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [0, 60], [540, 275], { extrapolateRight: "clamp" });
    cursorLabel = "Pilih Varian: Sprei XL (180x200)";
    if (frame >= 64 && frame <= 72) {
      isClicking = true;
      clickFrame = 68;
    }
  } else if (frame < 170) {
    cursorX = interpolate(frame, [80, 140], [480, 1050], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [80, 140], [275, 275], { extrapolateRight: "clamp" });
    cursorLabel = "Input Target Produksi: 10 Pcs";
    if (frame >= 144 && frame <= 152) {
      isClicking = true;
      clickFrame = 148;
    }
  } else if (frame < 260) {
    cursorX = interpolate(frame, [170, 230], [1050, 480], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [170, 230], [275, 410], { extrapolateRight: "clamp" });
    cursorLabel = "Input Ongkos Jahit & Aksesoris";
    if (frame >= 234 && frame <= 242) {
      isClicking = true;
      clickFrame = 238;
    }
  } else if (frame < 360) {
    cursorX = interpolate(frame, [260, 330], [480, 320], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [260, 330], [410, 190], { extrapolateRight: "clamp" });
    cursorLabel = "Klik Potong Bahan & Alokasikan Rak";
    if (frame >= 334 && frame <= 342) {
      isClicking = true;
      clickFrame = 338;
    }
  } else {
    cursorX = interpolate(frame, [360, 400], [320, 1100], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [360, 400], [190, 520], { extrapolateRight: "clamp" });
    cursorLabel = "HPP Rp 75.000 Terkunci & Siap Jual";
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
        activeMenu="✂️ Produksi Jahit"
        breadcrumbModel="Produksi & Jahit Sprei"
        breadcrumbRecord="PRD-202611-0001"
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
          {/* Action Header & Workflow Pipeline */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  padding: "8px 20px",
                  borderRadius: 8,
                  backgroundColor: isProcessed ? "rgba(255,255,255,0.06)" : "#f59e0b",
                  color: "#ffffff",
                  fontWeight: 800,
                  fontSize: 14,
                  boxShadow: isProcessed ? "none" : "0 0 16px rgba(245, 158, 11, 0.5)",
                }}
              >
                {isProcessed ? "Selesai Dipotong & Dijahit" : "✂️ Potong Bahan & Alokasikan ke Rak"}
              </div>
              <span style={{ fontSize: 24, fontWeight: 800, color: "#ffffff" }}>
                PRD-202611-0001
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  padding: "6px 14px",
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 700,
                  backgroundColor: !isProcessed ? "#f59e0b" : "rgba(255,255,255,0.05)",
                  color: !isProcessed ? "#ffffff" : "#64748b",
                }}
              >
                DRAFT PRODUKSI
              </div>
              <span style={{ color: "#475569" }}>→</span>
              <div
                style={{
                  padding: "6px 14px",
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 700,
                  backgroundColor: isProcessed ? "#10b981" : "rgba(255,255,255,0.05)",
                  color: isProcessed ? "#ffffff" : "#64748b",
                  boxShadow: isProcessed ? "0 0 14px rgba(16, 185, 129, 0.4)" : "none",
                }}
              >
                TERALOKASI (ALLOCATED)
              </div>
            </div>
          </div>

          {/* Form Inputs Grid */}
          <div
            style={{
              marginTop: 24,
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr",
              gap: 28,
              padding: "20px 24px",
              backgroundColor: "rgba(30, 41, 59, 0.35)",
              borderRadius: 14,
              border: "1px solid rgba(255, 255, 255, 0.05)",
            }}
          >
            {/* Target Variant */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", display: "block", marginBottom: 6 }}>
                VARIAN PRODUK TARGET <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <div
                style={{
                  height: 44,
                  backgroundColor: "#0f172a",
                  borderRadius: 8,
                  border: frame < 80 ? "2px solid #38bdf8" : "1px solid rgba(255, 255, 255, 0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0 16px",
                  fontSize: 16,
                  fontWeight: 700,
                  color: isVariantSelected ? "#ffffff" : "#64748b",
                }}
              >
                <span>{isVariantSelected ? 'Sprei XL (180 × 200) — Kain Katun "XXX"' : "Pilih Varian Sprei..."}</span>
                <span style={{ color: "#94a3b8" }}>▾</span>
              </div>
            </div>

            {/* Qty to Produce */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", display: "block", marginBottom: 6 }}>
                JUMLAH TARGET PRODUKSI (PCS) <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <div
                style={{
                  height: 44,
                  backgroundColor: "#0f172a",
                  borderRadius: 8,
                  border: frame >= 80 && frame < 170 ? "2px solid #38bdf8" : "1px solid rgba(255, 255, 255, 0.12)",
                  display: "flex",
                  alignItems: "center",
                  padding: "0 16px",
                  fontSize: 18,
                  fontWeight: 800,
                  color: isQtyTyped ? "#38bdf8" : "#64748b",
                }}
              >
                <span>{isQtyTyped ? "10 Pcs (Kebutuhan: 10 × 3.0m = 30 Meter)" : "Ketik Jumlah Pcs..."}</span>
              </div>
            </div>
          </div>

          {/* Cost Allocation Row */}
          <div
            style={{
              marginTop: 18,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 20,
            }}
          >
            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.6)", padding: "14px 18px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)" }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", display: "block", marginBottom: 4 }}>
                ONGKOS JAHIT BORONGAN (PER PCS)
              </label>
              <div style={{ fontSize: 18, fontWeight: 800, color: isCostTyped ? "#ffffff" : "#64748b" }}>
                {isCostTyped ? "Rp 10.000 / pcs (Total: Rp 100.000)" : "Rp 0"}
              </div>
            </div>

            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.6)", padding: "14px 18px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)" }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", display: "block", marginBottom: 4 }}>
                BIAYA KARET & TAS KEMASAN (PER PCS)
              </label>
              <div style={{ fontSize: 18, fontWeight: 800, color: isCostTyped ? "#ffffff" : "#64748b" }}>
                {isCostTyped ? "Rp 5.000 / pcs (Total: Rp 50.000)" : "Rp 0"}
              </div>
            </div>
          </div>

          {/* Live Composite Calculation & Target Shelf Allocation */}
          <div
            style={{
              marginTop: 22,
              padding: "20px 24px",
              borderRadius: 14,
              backgroundColor: isProcessed ? "rgba(16, 185, 129, 0.12)" : "rgba(26, 98, 255, 0.1)",
              border: isProcessed ? "2px solid #10b981" : "1px solid rgba(59, 130, 246, 0.3)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontSize: 13, textTransform: "uppercase", color: "#60a5fa", fontWeight: 700 }}>
                Rincian Biaya Produksi:
              </div>
              <div style={{ fontSize: 15, color: "#cbd5e1", marginTop: 4 }}>
                Bahan Baku FIFO (30m @ Rp 20k) + Upah Jahit (100k) + Aksesoris (50k) = <strong>Rp 750.000</strong>
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#34d399", marginTop: 6 }}>
                HPP Komposit Terkunci: <strong style={{ fontSize: 26 }}>Rp 75.000 / pcs</strong>
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, color: "#94a3b8" }}>Stok Rak Fisik Terkini:</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: isProcessed ? "#38bdf8" : "#94a3b8" }}>
                {isProcessed ? "+10 Pcs Siap Jual" : "Menunggu Validasi"}
              </div>
              <div style={{ fontSize: 14, color: "#fbbf24", fontWeight: 700, marginTop: 4 }}>
                Harga Jual (+50%): Rp 112.500
              </div>
            </div>
          </div>
        </div>
      </div>

      <TutorialCallout
        step="3"
        instruction="Make-to-Stock: Potong Kain FIFO & Akumulasi Ongkos Jahit"
        detail="Sistem mengunci HPP Rp 75.000/pcs dan mengalokasikan 10 pcs fisik ke rak kasir!"
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
    </div>
  );
};
