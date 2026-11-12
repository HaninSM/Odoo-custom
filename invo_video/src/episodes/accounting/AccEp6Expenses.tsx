import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { OdooNavBar } from "../../components/OdooNavBar";
import { Cursor } from "../../components/Cursor";
import { TutorialCallout } from "../../components/TutorialCallout";
import { Badge } from "../../components/Badge";
import { TutorialProps } from "../../types";

export const ACC_EP6_DURATION = 600; // 20 Detik @ 30 FPS

export const AccEp6Expenses: React.FC<TutorialProps> = () => {
  const frame = useCurrentFrame();

  const isSaved = frame >= 360;

  let cursorX = 960;
  let cursorY = 540;
  let cursorLabel = "";
  let isClicking = false;
  let clickFrame = 0;

  if (frame < 180) {
    cursorX = interpolate(frame, [0, 80], [960, 480], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [0, 80], [540, 360], { extrapolateRight: "clamp" });
    cursorLabel = "Input Beban Listrik & Daya Toko: 61110000";
  } else if (frame < 360) {
    cursorX = interpolate(frame, [180, 260], [480, 1080], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [180, 260], [360, 360], { extrapolateRight: "clamp" });
    cursorLabel = "Potong Kas Kecil [CSH1]: Rp 15.000 -> Klik Save";
    if (frame >= 340 && frame <= 348) {
      isClicking = true;
      clickFrame = 344;
    }
  } else {
    cursorX = interpolate(frame, [360, 440], [1080, 720], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [360, 440], [360, 580], { extrapolateRight: "clamp" });
    cursorLabel = "Beban Operasional Terposting: Mengurangi Laba Kasir";
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
        breadcrumbModel="Accounting > Expenses"
        breadcrumbRecord="EXP/2026/11/0014 - Beban Listrik & Toko"
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
        EPISODE 6/10: OPERATIONAL EXPENSES (BEBAN OPERASIONAL)
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
              background: "#161b22",
            }}
          >
            <div style={{ display: "flex", gap: 10 }}>
              <button
                style={{
                  backgroundColor: isSaved ? "#21262d" : "#238636",
                  color: "#ffffff",
                  border: isSaved ? "1px solid #30363d" : "none",
                  borderRadius: 6,
                  padding: "8px 18px",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {isSaved ? "Saved" : "Save & Post"}
              </button>
            </div>
            <Badge variant={isSaved ? "success" : "warning"}>
              {isSaved ? "POSTED" : "DRAFT"}
            </Badge>
          </div>

          <div style={{ padding: "24px 32px" }}>
            <div style={{ marginBottom: 20 }}>
              <span style={{ fontSize: 12, color: "#8b949e" }}>Uraian Pengeluaran Toko:</span>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#f0f6fc", marginTop: 4 }}>
                Pembelian Token Listrik & Lampu Gerai Kasir Sesi 1
              </div>
            </div>

            {/* Entry Table */}
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #30363d", color: "#8b949e", textAlign: "left" }}>
                  <th style={{ padding: "10px 12px" }}>Kode & Nama Akun</th>
                  <th style={{ padding: "10px 12px" }}>Jurnal Sumber</th>
                  <th style={{ padding: "10px 12px", textAlign: "right" }}>Debit</th>
                  <th style={{ padding: "10px 12px", textAlign: "right" }}>Kredit</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid #21262d" }}>
                  <td style={{ padding: "12px", fontWeight: 600, color: "#bc8cff" }}>
                    61110000 Beban Listrik, Air & Utilitas Toko
                  </td>
                  <td style={{ padding: "12px", color: "#8b949e" }}>Operasional Kasir</td>
                  <td style={{ padding: "12px", textAlign: "right", fontWeight: 700, color: "#bc8cff" }}>
                    Rp 15.000
                  </td>
                  <td style={{ padding: "12px", textAlign: "right", color: "#6e7681" }}>Rp 0</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #21262d" }}>
                  <td style={{ padding: "12px", fontWeight: 600, color: "#58a6ff" }}>
                    11110000 Kas Kecil Kasir Toko [CSH1]
                  </td>
                  <td style={{ padding: "12px", color: "#8b949e" }}>Buku Kas Kasir</td>
                  <td style={{ padding: "12px", textAlign: "right", color: "#6e7681" }}>Rp 0</td>
                  <td style={{ padding: "12px", textAlign: "right", fontWeight: 700, color: "#e3b341" }}>
                    Rp 15.000
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Calculation Card */}
            <div
              style={{
                marginTop: 24,
                padding: 16,
                backgroundColor: "#0d1117",
                borderRadius: 8,
                border: "1px solid #30363d",
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 16,
                textAlign: "center",
              }}
            >
              <div>
                <div style={{ fontSize: 12, color: "#8b949e" }}>Laba Kotor Kasir:</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#3fb950", marginTop: 4 }}>
                  Rp 37.500
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: "#8b949e" }}>Beban Operasional Toko:</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#bc8cff", marginTop: 4 }}>
                  - Rp 15.000
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: "#8b949e" }}>Laba Bersih Toko (Net Profit):</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#58a6ff", marginTop: 4 }}>
                  Rp 22.500
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TutorialCallout
        step={6}
        title="Beban Operasional & Perhitungan Laba Bersih"
        description={
          frame < 180
            ? "Biaya toko di luar ongkos jahit (seperti listrik gerai) diinput ke akun Beban Utilitas 61110000."
            : frame < 360
            ? "Pembayaran diambil dari kas kecil kasir [CSH1] Rp 15.000 dan langsung mengurangi saldo laci kasir."
            : "Laba kotor kasir Rp 37.500 dikurangi beban Rp 15.000 menghasilkan Laba Bersih riil Rp 22.500 secara otomatis."
        }
        visible={true}
      />

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
