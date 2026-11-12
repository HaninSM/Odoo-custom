import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { OdooNavBar } from "../../components/OdooNavBar";
import { Cursor } from "../../components/Cursor";
import { TutorialCallout } from "../../components/TutorialCallout";
import { Badge } from "../../components/Badge";
import { CheckCircleIcon } from "../../components/Icons";
import { TutorialProps } from "../../types";

export const ACC_EP10_DURATION = 600; // 20 Detik @ 30 FPS

export const AccEp10CreditNotes: React.FC<TutorialProps> = () => {
  const frame = useCurrentFrame();

  const isConfirmed = frame >= 380;

  let cursorX = 960;
  let cursorY = 540;
  let cursorLabel = "";
  let isClicking = false;
  let clickFrame = 0;

  if (frame < 180) {
    cursorX = interpolate(frame, [0, 80], [960, 420], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [0, 80], [540, 290], { extrapolateRight: "clamp" });
    cursorLabel = "Nota Kredit Retur Kasir: Sprei XL (Rp 112.500)";
  } else if (frame < 380) {
    cursorX = interpolate(frame, [180, 260], [420, 240], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [180, 260], [290, 190], { extrapolateRight: "clamp" });
    cursorLabel = "Klik Konfirmasi Pengembalian Dana (Refund)";
    if (frame >= 350 && frame <= 358) {
      isClicking = true;
      clickFrame = 354;
    }
  } else {
    cursorX = interpolate(frame, [380, 460], [240, 920], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [380, 460], [190, 460], { extrapolateRight: "clamp" });
    cursorLabel = "Pembalikan Jurnal & Stok Berhasil (HPP & Omzet Disesuaikan)";
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
        breadcrumbModel="Customers > Credit Notes"
        breadcrumbRecord="RINV/2026/11/0001 - Retur Sprei XL"
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
        EPISODE 10/10: CREDIT NOTES & REVERSAL JURNAL
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
          {/* Action Header */}
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
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button
                style={{
                  backgroundColor: isConfirmed ? "#21262d" : "#238636",
                  color: "#ffffff",
                  border: isConfirmed ? "1px solid #30363d" : "none",
                  borderRadius: 6,
                  padding: "8px 18px",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {isConfirmed ? "Refunded" : "Confirm Refund"}
              </button>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Badge variant="info">Credit Note</Badge>
              <Badge variant={isConfirmed ? "success" : "warning"}>
                {isConfirmed ? "POSTED & REVERSED" : "DRAFT"}
              </Badge>
            </div>
          </div>

          {/* Form Content */}
          <div style={{ padding: "24px 32px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              <div>
                <span style={{ fontSize: 12, color: "#8b949e" }}>Pelanggan & Dokumen Asal:</span>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#58a6ff", marginTop: 4 }}>
                  Walk-in Customer • Referensi: POS/2026/11/01/0088
                </div>
                <div style={{ fontSize: 12, color: "#8b949e", marginTop: 4 }}>
                  Alasan: Penukaran / Retur Motif Cacat Jahitan
                </div>
              </div>

              <div>
                <span style={{ fontSize: 12, color: "#8b949e" }}>Pengembalian Kas:</span>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#f85149", marginTop: 4 }}>
                  - Rp 112.500,00 (Pengembalian Dana Kasir)
                </div>
              </div>
            </div>

            {/* Reversal Table */}
            <div style={{ marginBottom: 16 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: "#c9d1d9", marginBottom: 10 }}>
                Pembalikan Jurnal Akuntansi & Persediaan (Reversal Entries):
              </h4>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #30363d", color: "#8b949e", textAlign: "left" }}>
                    <th style={{ padding: "8px 12px" }}>Akun Pembukuan</th>
                    <th style={{ padding: "8px 12px" }}>Pengaruh Pembukuan</th>
                    <th style={{ padding: "8px 12px", textAlign: "right" }}>Debit</th>
                    <th style={{ padding: "8px 12px", textAlign: "right" }}>Kredit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: "1px solid #21262d" }}>
                    <td style={{ padding: "10px 12px", color: "#58a6ff", fontWeight: 600 }}>
                      41110000 Retur & Pengurangan Penjualan
                    </td>
                    <td style={{ padding: "10px 12px", color: "#8b949e" }}>Membatalkan omzet kasir</td>
                    <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 700, color: "#f85149" }}>
                      Rp 112.500
                    </td>
                    <td style={{ padding: "10px 12px", textAlign: "right", color: "#6e7681" }}>Rp 0</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid #21262d" }}>
                    <td style={{ padding: "10px 12px", color: "#f0f6fc", fontWeight: 600 }}>
                      11110000 Kas Kecil Kasir Toko [CSH1]
                    </td>
                    <td style={{ padding: "10px 12px", color: "#8b949e" }}>Kas keluar refund</td>
                    <td style={{ padding: "10px 12px", textAlign: "right", color: "#6e7681" }}>Rp 0</td>
                    <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 700, color: "#e3b341" }}>
                      Rp 112.500
                    </td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid #21262d" }}>
                    <td style={{ padding: "10px 12px", color: "#79c0ff", fontWeight: 600 }}>
                      11420000 Persediaan Barang Jadi Toko
                    </td>
                    <td style={{ padding: "10px 12px", color: "#8b949e" }}>Stok kembali bertambah (+1 unit)</td>
                    <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 700, color: "#79c0ff" }}>
                      Rp 75.000
                    </td>
                    <td style={{ padding: "10px 12px", textAlign: "right", color: "#6e7681" }}>Rp 0</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid #21262d" }}>
                    <td style={{ padding: "10px 12px", color: "#bc8cff", fontWeight: 600 }}>
                      51110000 Beban Pokok Penjualan (HPP)
                    </td>
                    <td style={{ padding: "10px 12px", color: "#8b949e" }}>Beban dibatalkan karena retur</td>
                    <td style={{ padding: "10px 12px", textAlign: "right", color: "#6e7681" }}>Rp 0</td>
                    <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 700, color: "#bc8cff" }}>
                      Rp 75.000
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {isConfirmed && (
              <div
                style={{
                  padding: 12,
                  backgroundColor: "rgba(35, 134, 54, 0.15)",
                  border: "1px solid #238636",
                  borderRadius: 6,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  color: "#3fb950",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                <CheckCircleIcon size={18} />
                <span>
                  Retur sukses: Kuota stok fisik kasir otomatis pulih dan buku akuntansi 100% netral.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <TutorialCallout
        step={10}
        title="Retur Kasir & Pembalikan Jurnal Akuntansi"
        description={
          frame < 180
            ? "Menu Credit Notes menangani pembatalan atau retur pembelian pelanggan kasir secara formal dan tertib administrasi."
            : frame < 380
            ? "Mengonfirmasi refund mengembalikan uang ke pelanggan Rp 112.500 dan membalik omzet penjualan."
            : "Persediaan Sprei XL bertambah kembali (+1 unit) dan HPP Rp 75.000 dibalik, mencegah selisih stok fisik vs sistem."
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
