import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { OdooNavBar } from "../components/OdooNavBar";
import { Cursor } from "../components/Cursor";
import { TutorialCallout } from "../components/TutorialCallout";
import { Badge } from "../components/Badge";

export const WalkthroughScene2Purchase: React.FC = () => {
  const frame = useCurrentFrame();

  // States
  const isVendorSelected = frame >= 75;
  const isKodiSelected = frame >= 170;
  const isTermsSelected = frame >= 265;
  const isConfirmed = frame >= 350;

  // Cursor movements
  let cursorX = 960;
  let cursorY = 540;
  let cursorLabel = "";
  let isClicking = false;
  let clickFrame = 0;

  if (frame < 80) {
    // Select Vendor (x: 480, y: 275)
    cursorX = interpolate(frame, [0, 65], [960, 480], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [0, 65], [540, 275], { extrapolateRight: "clamp" });
    cursorLabel = "Pilih Supplier: PT. Tekstil Maju Jaya";
    if (frame >= 68 && frame <= 76) {
      isClicking = true;
      clickFrame = 72;
    }
  } else if (frame < 180) {
    // Select Satuan Beli Kodi (x: 520, y: 460)
    cursorX = interpolate(frame, [80, 160], [480, 520], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [80, 160], [275, 460], { extrapolateRight: "clamp" });
    cursorLabel = "Pilih Satuan Beli: 1 Kodi (60m)";
    if (frame >= 164 && frame <= 172) {
      isClicking = true;
      clickFrame = 168;
    }
  } else if (frame < 280) {
    // Select Payment Term Net 30 (x: 1100, y: 275)
    cursorX = interpolate(frame, [180, 255], [520, 1100], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [180, 255], [460, 275], { extrapolateRight: "clamp" });
    cursorLabel = "Pilih Termin: Tempo Net 30 Days";
    if (frame >= 258 && frame <= 266) {
      isClicking = true;
      clickFrame = 262;
    }
  } else if (frame < 380) {
    // Click button Confirm (x: 320, y: 190)
    cursorX = interpolate(frame, [280, 340], [1100, 320], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [280, 340], [275, 190], { extrapolateRight: "clamp" });
    cursorLabel = "Klik Validasi Masuk Gudang";
    if (frame >= 344 && frame <= 352) {
      isClicking = true;
      clickFrame = 348;
    }
  } else {
    // Inspect Generated FIFO Batch & Vendor Bill (x: 960, y: 650)
    cursorX = interpolate(frame, [380, 420], [320, 960], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [380, 420], [190, 650], { extrapolateRight: "clamp" });
    cursorLabel = "Lihat Batch FIFO & Tagihan AP Terbit";
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
        activeMenu="Pembelian & Restock"
        breadcrumbModel="Pembelian & Restock"
        breadcrumbRecord="PO-202611-0001"
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
                  backgroundColor: isConfirmed ? "rgba(255,255,255,0.06)" : "#10b981",
                  color: "#ffffff",
                  fontWeight: 800,
                  fontSize: 14,
                  boxShadow: isConfirmed ? "none" : "0 0 16px rgba(16, 185, 129, 0.5)",
                }}
              >
                {isConfirmed ? "Telah Tervalidasi" : "✓ Validasi & Masuk Gudang"}
              </div>
              <span style={{ fontSize: 24, fontWeight: 800, color: "#ffffff" }}>
                PO-202611-0001
              </span>
            </div>

            {/* Pipeline State */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  padding: "6px 14px",
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 700,
                  backgroundColor: !isConfirmed ? "#f59e0b" : "rgba(255,255,255,0.05)",
                  color: !isConfirmed ? "#ffffff" : "#64748b",
                }}
              >
                DRAFT
              </div>
              <span style={{ color: "#475569" }}>→</span>
              <div
                style={{
                  padding: "6px 14px",
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 700,
                  backgroundColor: isConfirmed ? "#10b981" : "rgba(255,255,255,0.05)",
                  color: isConfirmed ? "#ffffff" : "#64748b",
                  boxShadow: isConfirmed ? "0 0 14px rgba(16, 185, 129, 0.4)" : "none",
                }}
              >
                SELESAI (DONE)
              </div>
            </div>
          </div>

          {/* Form Fields Header */}
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
            {/* Vendor */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", display: "block", marginBottom: 6 }}>
                PEMASOK (VENDOR) <span style={{ color: "#ef4444" }}>*</span>
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
                  color: isVendorSelected ? "#ffffff" : "#64748b",
                }}
              >
                <span>{isVendorSelected ? "PT. Tekstil Maju Jaya" : "Pilih Vendor..."}</span>
                <span style={{ color: "#94a3b8" }}>▾</span>
              </div>
            </div>

            {/* Payment Terms */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", display: "block", marginBottom: 6 }}>
                SYARAT PEMBAYARAN (PAYMENT TERMS) <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <div
                style={{
                  height: 44,
                  backgroundColor: "#0f172a",
                  borderRadius: 8,
                  border: frame >= 180 && frame < 280 ? "2px solid #38bdf8" : "1px solid rgba(255, 255, 255, 0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0 16px",
                  fontSize: 16,
                  fontWeight: 700,
                  color: isTermsSelected ? "#f87171" : "#64748b",
                }}
              >
                <span>{isTermsSelected ? "Net 30 Days (Jatuh Tempo: 01 Des 2026)" : "Pilih Syarat Pembayaran..."}</span>
                <span style={{ color: "#94a3b8" }}>▾</span>
              </div>
            </div>
          </div>

          {/* Line Item */}
          <div style={{ marginTop: 20 }}>
            <div
              style={{
                borderRadius: 12,
                overflow: "hidden",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                backgroundColor: "rgba(15, 23, 42, 0.6)",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
                  padding: "10px 20px",
                  backgroundColor: "rgba(30, 41, 59, 0.7)",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                }}
              >
                <span>Produk Mentah</span>
                <span>Satuan Beli & Konversi</span>
                <span>Jumlah (Qty)</span>
                <span style={{ textAlign: "right" }}>Subtotal PO</span>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
                  padding: "14px 20px",
                  borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                  fontSize: 15,
                  color: "#f8fafc",
                  alignItems: "center",
                }}
              >
                <span style={{ fontWeight: 800 }}>Kain Katun Sprei "XXX"</span>
                <span style={{ color: isKodiSelected ? "#38bdf8" : "#94a3b8", fontWeight: 700 }}>
                  {isKodiSelected ? "1 Kodi = 60 Meter Gudang" : "Pilih Satuan..."}
                </span>
                <span style={{ fontWeight: 700 }}>1 Kodi</span>
                <span style={{ textAlign: "right", fontWeight: 800, color: "#34d399", fontSize: 17 }}>
                  Rp 1.200.000
                </span>
              </div>
            </div>
          </div>

          {/* Results: FIFO Batch Card & Vendor Bill Card (Revealed after Validasi) */}
          {isConfirmed && (
            <div
              style={{
                marginTop: 22,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 20,
              }}
            >
              {/* Batch FIFO */}
              <div
                style={{
                  padding: "16px 20px",
                  borderRadius: 12,
                  backgroundColor: "rgba(26, 98, 255, 0.12)",
                  border: "1px solid rgba(59, 130, 246, 0.4)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: "#60a5fa" }}>
                    📦 KARTU PERSEDIAAN FIFO TERBIT (Batch 1)
                  </span>
                  <Badge label="Prioritas Keluar 1" variant="blue" fontSize={11} />
                </div>
                <div style={{ marginTop: 10, fontSize: 14, color: "#cbd5e1" }}>
                  Stok Masuk: <strong style={{ color: "#38bdf8" }}>60 Meter</strong> • HPP Gudang: <strong style={{ color: "#34d399" }}>Rp 20.000 / m</strong>
                </div>
              </div>

              {/* Vendor Bill */}
              <div
                style={{
                  padding: "16px 20px",
                  borderRadius: 12,
                  backgroundColor: "rgba(239, 68, 68, 0.12)",
                  border: "1px solid rgba(239, 68, 68, 0.4)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: "#f87171" }}>
                    📑 FAKTUR TAGIHAN HUTANG (VENDOR BILL)
                  </span>
                  <Badge label="Status: Belum Dibayar" variant="red" fontSize={11} />
                </div>
                <div style={{ marginTop: 10, fontSize: 14, color: "#cbd5e1" }}>
                  Tagihan: <strong>Rp 1.200.000</strong> • Tempo 30 Hari: <strong style={{ color: "#fbbf24" }}>01 Des 2026</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <TutorialCallout
        step="2"
        instruction="Restock 1 Kodi, Sistem Otomatis Konversi 60 Meter Gudang"
        detail="Membentuk antrean FIFO Batch 1 dan menerbitkan tagihan hutang supplier 30 hari secara simultan!"
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
