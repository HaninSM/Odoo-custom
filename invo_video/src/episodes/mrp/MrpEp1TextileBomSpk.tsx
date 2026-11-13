import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { OdooNavBar } from "../../components/OdooNavBar";
import { Cursor } from "../../components/Cursor";
import { TutorialCallout } from "../../components/TutorialCallout";
import { Badge } from "../../components/Badge";
import { CheckCircleIcon } from "../../components/Icons";
import { TutorialProps } from "../../types";

export const MRP_EP1_DURATION = 660; // 22 Detik @ 30 FPS

export const MrpEp1TextileBomSpk: React.FC<TutorialProps> = () => {
  const frame = useCurrentFrame();

  const isBomView = frame < 220;
  const isSpkDone = frame >= 500;

  // Cursor movements
  let cursorX = 960;
  let cursorY = 540;
  let cursorLabel = "";
  let isClicking = false;
  let clickFrame = 0;

  if (frame < 120) {
    cursorX = interpolate(frame, [0, 80], [960, 480], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [0, 80], [540, 360], { extrapolateRight: "clamp" });
    cursorLabel = "BoM Tekstil: 3m Kain Katun + Karet Sudut 1.2m";
  } else if (frame < 220) {
    cursorX = interpolate(frame, [120, 180], [480, 1080], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [120, 180], [360, 480], { extrapolateRight: "clamp" });
    cursorLabel = "HPP Komposit Terkalkulasi: Rp 75.000 / Pcs";
  } else if (frame < 360) {
    cursorX = interpolate(frame, [220, 290], [1080, 420], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [220, 290], [480, 340], { extrapolateRight: "clamp" });
    cursorLabel = "SPK Jahit: Penugasan Mitra Pak Joko (10 Pcs)";
  } else if (frame < 500) {
    cursorX = interpolate(frame, [360, 440], [420, 250], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [360, 440], [340, 190], { extrapolateRight: "clamp" });
    cursorLabel = "Klik Mark as Done (Selesai Jahit)";
    if (frame >= 480 && frame <= 488) {
      isClicking = true;
      clickFrame = 484;
    }
  } else {
    cursorX = interpolate(frame, [500, 560], [250, 920], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [500, 560], [190, 290], { extrapolateRight: "clamp" });
    cursorLabel = "Auto-Push Sukses: +10 Pcs Sprei XL ke Kasir POS!";
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
        activeMenu="🧵 Manufaktur"
        breadcrumbModel={isBomView ? "Products > Bills of Materials" : "Operations > Manufacturing Orders"}
        breadcrumbRecord={isBomView ? "BOM/SPREI-XL/001 (Sprei XL 180x200)" : "SPK/2026/0042 (Konveksi Sprei XL)"}
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
        MODUL INVO_MRP: KONVEKSI &amp; BoM TEKSTIL
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
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              {!isBomView && (
                <>
                  <button
                    style={{
                      backgroundColor: isSpkDone ? "#21262d" : "#238636",
                      color: "#ffffff",
                      border: isSpkDone ? "1px solid #30363d" : "none",
                      borderRadius: 6,
                      padding: "8px 18px",
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    {isSpkDone ? "Completed" : "Mark as Done"}
                  </button>
                  <button
                    style={{
                      backgroundColor: "#21262d",
                      color: "#c9d1d9",
                      border: "1px solid #30363d",
                      borderRadius: 6,
                      padding: "8px 14px",
                      fontSize: 12,
                    }}
                  >
                    🖨️ Cetak SPK PDF
                  </button>
                </>
              )}
              {isBomView && (
                <div style={{ fontSize: 16, fontWeight: 700, color: "#f0f6fc" }}>
                  Bill of Materials (BoM) Tekstil: Sprei XL (180 × 200)
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Badge variant="purple">BoM Tekstil Standar</Badge>
              {!isBomView && (
                <Badge variant={isSpkDone ? "success" : "warning"}>
                  {isSpkDone ? "DONE (SELESAI)" : "IN PROGRESS"}
                </Badge>
              )}
            </div>
          </div>

          {/* Main Form Content */}
          <div style={{ padding: "24px 32px" }}>
            {/* View 1: BoM Tekstil View */}
            {isBomView ? (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                  <div>
                    <label style={{ fontSize: 12, color: "#8b949e", display: "block", marginBottom: 4 }}>
                      Produk Jadi (Varian Kasir):
                    </label>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#58a6ff" }}>
                      Sprei XL (180 × 200) • Motif Minimalis
                    </div>
                    <div style={{ fontSize: 12, color: "#8b949e", marginTop: 4 }}>
                      Lebar Kain Mentah: 2.40m • Toleransi Susut: 2.50%
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: 12, color: "#8b949e", display: "block", marginBottom: 4 }}>
                      Struktur HPP Komposit Standar:
                    </label>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "#3fb950" }}>
                      Rp 75.000,00 / pcs
                    </div>
                    <div style={{ fontSize: 12, color: "#8b949e", marginTop: 4 }}>
                      Bahan Kain (Rp 60.000) + Upah Jahit (Rp 10.000) + Aksesoris (Rp 5.000)
                    </div>
                  </div>
                </div>

                {/* BoM Lines Table */}
                <h4 style={{ fontSize: 13, fontWeight: 700, color: "#c9d1d9", marginBottom: 10 }}>
                  Komponen Bill of Materials (BoM):
                </h4>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #30363d", color: "#8b949e", textAlign: "left" }}>
                      <th style={{ padding: "8px 12px" }}>Komponen Bahan</th>
                      <th style={{ padding: "8px 12px" }}>Peran Tekstil</th>
                      <th style={{ padding: "8px 12px", textAlign: "right" }}>Kebutuhan</th>
                      <th style={{ padding: "8px 12px", textAlign: "right" }}>Harga Satuan</th>
                      <th style={{ padding: "8px 12px", textAlign: "right" }}>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: "1px solid #21262d" }}>
                      <td style={{ padding: "10px 12px", fontWeight: 600, color: "#f0f6fc" }}>
                        Kain Katun Sprei "XXX"
                      </td>
                      <td style={{ padding: "10px 12px", color: "#58a6ff" }}>Kain Utama (Roll FIFO)</td>
                      <td style={{ padding: "10px 12px", textAlign: "right" }}>3.00 Meter</td>
                      <td style={{ padding: "10px 12px", textAlign: "right" }}>Rp 20.000</td>
                      <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 700, color: "#58a6ff" }}>
                        Rp 60.000
                      </td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid #21262d" }}>
                      <td style={{ padding: "10px 12px", fontWeight: 600, color: "#f0f6fc" }}>
                        Karet Elastis Sudut 2.5cm
                      </td>
                      <td style={{ padding: "10px 12px", color: "#e3b341" }}>Karet Sudut 4 Sisi</td>
                      <td style={{ padding: "10px 12px", textAlign: "right" }}>1.20 Meter</td>
                      <td style={{ padding: "10px 12px", textAlign: "right" }}>Rp 2.500</td>
                      <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 700, color: "#e3b341" }}>
                        Rp 3.000
                      </td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid #21262d" }}>
                      <td style={{ padding: "10px 12px", fontWeight: 600, color: "#f0f6fc" }}>
                        Kemasan Mika &amp; Hangtag Jendral
                      </td>
                      <td style={{ padding: "10px 12px", color: "#bc8cff" }}>Kemasan Toko</td>
                      <td style={{ padding: "10px 12px", textAlign: "right" }}>1.00 Unit</td>
                      <td style={{ padding: "10px 12px", textAlign: "right" }}>Rp 2.000</td>
                      <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 700, color: "#bc8cff" }}>
                        Rp 2.000
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              /* View 2: SPK Jahit & Auto-Push POS View */
              <div>
                {/* SPK Banner */}
                <div
                  style={{
                    padding: "12px 18px",
                    backgroundColor: isSpkDone ? "rgba(35, 134, 54, 0.15)" : "rgba(56, 139, 253, 0.12)",
                    border: isSpkDone ? "1px solid #238636" : "1px solid #58a6ff",
                    borderRadius: 8,
                    marginBottom: 20,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <span style={{ fontSize: 12, color: "#8b949e" }}>Surat Perintah Kerja (SPK) Jahit:</span>
                    <div style={{ fontSize: 17, fontWeight: 800, color: "#f0f6fc" }}>
                      SPK/2026/0042 • Mitra: Pak Joko (Konveksi Jendral)
                    </div>
                  </div>
                  {isSpkDone && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#3fb950", fontWeight: 700 }}>
                      <CheckCircleIcon size={20} />
                      <span>✓ Stok Terhubung ke Rak Kasir POS (+10 Pcs)</span>
                    </div>
                  )}
                </div>

                {/* Cutting & Production Stats Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 20 }}>
                  <div style={{ padding: 16, backgroundColor: "#0d1117", borderRadius: 8, border: "1px solid #30363d" }}>
                    <span style={{ fontSize: 12, color: "#8b949e" }}>Batch FIFO Kain Katun:</span>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#58a6ff", marginTop: 4 }}>
                      BATCH-2026-11-001
                    </div>
                    <div style={{ fontSize: 12, color: "#8b949e", marginTop: 4 }}>
                      Potong: 30.0m • Sisa di Gudang: {isSpkDone ? "30.0m" : "60.0m"}
                    </div>
                  </div>

                  <div style={{ padding: 16, backgroundColor: "#0d1117", borderRadius: 8, border: "1px solid #30363d" }}>
                    <span style={{ fontSize: 12, color: "#8b949e" }}>Target Produksi:</span>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#f0f6fc", marginTop: 4 }}>
                      10 Pcs Sprei XL
                    </div>
                    <div style={{ fontSize: 12, color: "#8b949e", marginTop: 4 }}>
                      Tarif Upah Jahit: Rp 10.000 / pcs
                    </div>
                  </div>

                  <div style={{ padding: 16, backgroundColor: "#0d1117", borderRadius: 8, border: "1px solid #30363d" }}>
                    <span style={{ fontSize: 12, color: "#8b949e" }}>Status Kuota Rak Kasir:</span>
                    <div style={{ fontSize: 18, fontWeight: 800, color: isSpkDone ? "#3fb950" : "#e3b341", marginTop: 4 }}>
                      {isSpkDone ? "10 Pcs (Siap Jual)" : "0 Pcs (Dalam Jahit)"}
                    </div>
                    <div style={{ fontSize: 12, color: "#8b949e", marginTop: 4 }}>
                      HPP Riil Kasir: Rp 75.000 / Pcs
                    </div>
                  </div>
                </div>

                {/* Auto-Push Integration Confirmation Box */}
                {isSpkDone && (
                  <div
                    style={{
                      padding: 14,
                      backgroundColor: "#161b22",
                      border: "1px solid #30363d",
                      borderRadius: 8,
                      fontSize: 13,
                      color: "#c9d1d9",
                    }}
                  >
                    <span style={{ color: "#3fb950", fontWeight: 700 }}>Chatter Log Odoo: </span>
                    Auto-Push ke Kasir Berhasil: Ditambahkan <strong>10 pcs Sprei XL (180 × 200)</strong> ke etalase kasir POS. Saldo kain batch terpotong 30 meter secara otomatis.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <TutorialCallout
        step={isBomView ? 1 : isSpkDone ? 3 : 2}
        title={
          isBomView
            ? "Standarisasi BoM Tekstil & HPP Komposit"
            : isSpkDone
            ? "Auto-Push Stok Selesai Jahit ke Kasir POS"
            : "Surat Perintah Kerja (SPK) Jahit Konveksi"
        }
        description={
          isBomView
            ? "BoM mengunci formula 3m kain katun + karet elastis 1.2m + upah jahit borongan Rp 10.000 = HPP Komposit Rp 75.000 per pcs."
            : isSpkDone
            ? "Menekan Mark as Done otomatis memotong 30m kain dari kartu batch FIFO dan menambahkan 10 pcs Sprei XL langsung ke etalase kasir!"
            : "Menerbitkan SPK penugasan ke penjahit mitra Pak Joko untuk memotong 30 meter kain katun menjadi 10 pcs Sprei XL."
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
