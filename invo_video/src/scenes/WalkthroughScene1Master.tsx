import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { OdooNavBar } from "../components/OdooNavBar";
import { Cursor } from "../components/Cursor";
import { TutorialCallout } from "../components/TutorialCallout";
import { Badge } from "../components/Badge";

export const WalkthroughScene1Master: React.FC = () => {
  const frame = useCurrentFrame();

  // Typing animation for Item Name: "Kain Katun Sprei XXX" (starts frame 35 to 80)
  const fullText = 'Kain Katun Sprei "XXX"';
  const charsTyped = Math.floor(
    interpolate(frame, [35, 80], [0, fullText.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  const typedName = fullText.slice(0, charsTyped);

  // UoM selected at frame 115
  const isUomSelected = frame >= 115;

  // Variants rows appearing
  const showRow1 = frame >= 170;
  const showRow2 = frame >= 250;
  const showRow3 = frame >= 330;

  // Saved state
  const isSaved = frame >= 410;

  // Cursor movements
  let cursorX = 960;
  let cursorY = 540;
  let cursorLabel = "";
  let isClicking = false;
  let clickFrame = 0;

  if (frame < 80) {
    // Moving to Name Input (around x: 480, y: 270)
    cursorX = interpolate(frame, [0, 35], [800, 480], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [0, 35], [600, 275], { extrapolateRight: "clamp" });
    cursorLabel = "Ketik Nama Barang Induk";
    if (frame >= 32 && frame <= 38) {
      isClicking = true;
      clickFrame = 35;
    }
  } else if (frame < 140) {
    // Moving to Satuan Dasar Dropdown (around x: 1050, y: 275)
    cursorX = interpolate(frame, [80, 110], [480, 1050], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [80, 110], [275, 275], { extrapolateRight: "clamp" });
    cursorLabel = "Pilih Satuan Gudang: Meter";
    if (frame >= 112 && frame <= 118) {
      isClicking = true;
      clickFrame = 115;
    }
  } else if (frame < 220) {
    // Moving to "+ Tambah Baris Varian" (around x: 340, y: 640)
    cursorX = interpolate(frame, [140, 165], [1050, 340], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [140, 165], [275, 640], { extrapolateRight: "clamp" });
    cursorLabel = "Klik Tambah Varian Sprei M";
    if (frame >= 166 && frame <= 172) {
      isClicking = true;
      clickFrame = 168;
    }
  } else if (frame < 300) {
    cursorX = interpolate(frame, [220, 245], [340, 340], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [220, 245], [640, 640], { extrapolateRight: "clamp" });
    cursorLabel = "Klik Tambah Varian Sprei L";
    if (frame >= 246 && frame <= 252) {
      isClicking = true;
      clickFrame = 248;
    }
  } else if (frame < 380) {
    cursorX = 340;
    cursorY = 640;
    cursorLabel = "Klik Tambah Varian Sprei XL";
    if (frame >= 326 && frame <= 332) {
      isClicking = true;
      clickFrame = 328;
    }
  } else {
    // Moving to Save Button at top bar (around x: 1720, y: 78)
    cursorX = interpolate(frame, [380, 405], [340, 1720], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [380, 405], [640, 78], { extrapolateRight: "clamp" });
    cursorLabel = "Klik Simpan Data";
    if (frame >= 406 && frame <= 414) {
      isClicking = true;
      clickFrame = 410;
    }
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
      {/* Top Authentic Odoo Enterprise Nav */}
      <OdooNavBar
        activeMenu="Master Barang"
        breadcrumbModel="Master Barang"
        breadcrumbRecord={isSaved ? 'Kain Katun Sprei "XXX"' : "Baru"}
      />

      {/* Main Odoo Sheet Container */}
      <div
        style={{
          flex: 1,
          padding: "24px 60px 80px 60px",
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
            padding: "36px 48px",
          }}
        >
          {/* Header Form Titles & Status */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 13, textTransform: "uppercase", color: "#60a5fa", fontWeight: 700, letterSpacing: "0.05em" }}>
                Formulir Master Produk (x_pos_item_master)
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#ffffff", marginTop: 4 }}>
                Setup Barang Mentah & Aturan Multi-Satuan
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Badge
                label={isSaved ? "✅ Tersimpan (Active)" : "Draft (Sedang Diisi)"}
                variant={isSaved ? "green" : "amber"}
                fontSize={14}
              />
            </div>
          </div>

          {/* Form Fields Grid */}
          <div
            style={{
              marginTop: 32,
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr",
              gap: 36,
              padding: "24px",
              backgroundColor: "rgba(30, 41, 59, 0.35)",
              borderRadius: 14,
              border: "1px solid rgba(255, 255, 255, 0.05)",
            }}
          >
            {/* Field: Nama Barang */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", display: "block", marginBottom: 8 }}>
                NAMA BARANG INDUK <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <div
                style={{
                  height: 48,
                  backgroundColor: "#0f172a",
                  borderRadius: 10,
                  border: frame < 80 ? "2px solid #38bdf8" : "1px solid rgba(255, 255, 255, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  padding: "0 18px",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#ffffff",
                  boxShadow: frame < 80 ? "0 0 12px rgba(56, 189, 248, 0.4)" : "none",
                }}
              >
                <span>{typedName}</span>
                {frame < 80 && (
                  <span style={{ color: "#38bdf8", animation: "blink 1s infinite" }}>|</span>
                )}
              </div>
            </div>

            {/* Field: Satuan Dasar Gudang */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", display: "block", marginBottom: 8 }}>
                SATUAN DASAR GUDANG (UoM) <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <div
                style={{
                  height: 48,
                  backgroundColor: "#0f172a",
                  borderRadius: 10,
                  border: frame >= 80 && frame < 140 ? "2px solid #38bdf8" : "1px solid rgba(255, 255, 255, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0 18px",
                  fontSize: 16,
                  fontWeight: 600,
                  color: isUomSelected ? "#34d399" : "#64748b",
                  boxShadow: frame >= 80 && frame < 140 ? "0 0 12px rgba(56, 189, 248, 0.4)" : "none",
                }}
              >
                <span>{isUomSelected ? "Meter (m) — [Satuan Terkecil Gudang]" : "Pilih Satuan..."}</span>
                <span style={{ color: "#94a3b8" }}>▾</span>
              </div>
            </div>
          </div>

          {/* Varian Table Section */}
          <div style={{ marginTop: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#cbd5e1" }}>
                Pecahan Varian Eceran (Multi-Satuan)
              </div>
              <div
                style={{
                  padding: "6px 14px",
                  borderRadius: 8,
                  backgroundColor: "rgba(26, 98, 255, 0.15)",
                  border: "1px solid rgba(59, 130, 246, 0.4)",
                  color: "#60a5fa",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                + Tambah Baris Varian
              </div>
            </div>

            {/* Table */}
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
                  padding: "12px 20px",
                  backgroundColor: "rgba(30, 41, 59, 0.7)",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                }}
              >
                <span>Nama Varian Jual</span>
                <span>Kebutuhan Kain Dasar</span>
                <span>Metode Penentuan Harga</span>
                <span style={{ textAlign: "right" }}>Estimasi Harga Jual</span>
              </div>

              {/* Rows */}
              {showRow1 && (
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
                  <span style={{ fontWeight: 700 }}>Sprei M (120 × 200)</span>
                  <span style={{ color: "#38bdf8", fontWeight: 600 }}>2.0 Meter / pcs</span>
                  <span style={{ color: "#94a3b8" }}>Manual Fixed</span>
                  <span style={{ textAlign: "right", fontWeight: 700, color: "#34d399" }}>Rp 60.000</span>
                </div>
              )}

              {showRow2 && (
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
                  <span style={{ fontWeight: 700 }}>Sprei L (160 × 200)</span>
                  <span style={{ color: "#38bdf8", fontWeight: 600 }}>2.5 Meter / pcs</span>
                  <span style={{ color: "#c084fc" }}>Margin +40%</span>
                  <span style={{ textAlign: "right", fontWeight: 700, color: "#34d399" }}>Rp 70.000</span>
                </div>
              )}

              {showRow3 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
                    padding: "14px 20px",
                    borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                    fontSize: 15,
                    color: "#f8fafc",
                    alignItems: "center",
                    backgroundColor: "rgba(26, 98, 255, 0.08)",
                  }}
                >
                  <span style={{ fontWeight: 800, color: "#ffffff" }}>Sprei XL (180 × 200)</span>
                  <span style={{ color: "#60a5fa", fontWeight: 800 }}>3.0 Meter / pcs</span>
                  <span style={{ color: "#fbbf24", fontWeight: 700 }}>Margin +50%</span>
                  <span style={{ textAlign: "right", fontWeight: 800, color: "#fbbf24" }}>Rp 90.000 - 112.500</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Instructional Step Callout */}
      <TutorialCallout
        step="1"
        instruction="Ketik Nama Kain Mentah & Masukkan Pecahan Varian"
        detail="Satu data master induk otomatis terbagi ke pecahan sprei M, L, dan XL tanpa perlu buat produk terpisah!"
        bottom={40}
        left={80}
      />

      {/* Animated Cursor */}
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
