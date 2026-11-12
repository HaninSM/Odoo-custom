import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { OdooNavBar } from "../../components/OdooNavBar";
import { Cursor } from "../../components/Cursor";
import { TutorialCallout } from "../../components/TutorialCallout";
import { Badge } from "../../components/Badge";
import { TutorialProps } from "../../types";

export const ACC_EP9_DURATION = 600; // 20 Detik @ 30 FPS

export const AccEp9AgedPayables: React.FC<TutorialProps> = () => {
  const frame = useCurrentFrame();

  let cursorX = 960;
  let cursorY = 540;
  let cursorLabel = "";

  if (frame < 180) {
    cursorX = interpolate(frame, [0, 80], [960, 420], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [0, 80], [540, 320], { extrapolateRight: "clamp" });
    cursorLabel = "Vendor: PT Tekstil Maju Jaya (Tagihan Bahan Kain)";
  } else if (frame < 380) {
    cursorX = interpolate(frame, [180, 260], [420, 800], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [180, 260], [320, 320], { extrapolateRight: "clamp" });
    cursorLabel = "Status: Belum Jatuh Tempo (0-30 Hari) • Rp 1.200.000";
  } else {
    cursorX = interpolate(frame, [380, 460], [800, 1100], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [380, 460], [320, 320], { extrapolateRight: "clamp" });
    cursorLabel = "Kolom Keterlambatan: Rp 0 (Kredit Skor Toko Aman)";
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
        breadcrumbModel="Reporting > Partner Reports"
        breadcrumbRecord="Analisis Umur Hutang (Aged Payable)"
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
        EPISODE 9/10: AGED PAYABLES (KONTROL UMUR HUTANG)
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
          {/* Header Bar */}
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
            <div>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#f0f6fc" }}>
                Analisis Umur Hutang Supplier (Aged Payable)
              </h2>
              <span style={{ fontSize: 12, color: "#8b949e" }}>
                Monitoring Termin Jatuh Tempo Pengadaan Bahan Baku Sprei
              </span>
            </div>
            <Badge variant="info">Termin Net 30 Hari Terpantau</Badge>
          </div>

          {/* Aging Matrix Table */}
          <div style={{ padding: "24px 32px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #30363d", color: "#8b949e", textAlign: "left" }}>
                  <th style={{ padding: "10px 12px" }}>Nama Vendor / Mitra</th>
                  <th style={{ padding: "10px 12px" }}>Nomor Faktur</th>
                  <th style={{ padding: "10px 12px", textAlign: "right", color: "#3fb950" }}>
                    Belum Jatuh Tempo
                  </th>
                  <th style={{ padding: "10px 12px", textAlign: "right", color: "#e3b341" }}>
                    Terlambat 1 - 30 Hari
                  </th>
                  <th style={{ padding: "10px 12px", textAlign: "right", color: "#f85149" }}>
                    Terlambat &gt; 30 Hari
                  </th>
                  <th style={{ padding: "10px 12px", textAlign: "right" }}>Total Hutang</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid #21262d", color: "#f0f6fc" }}>
                  <td style={{ padding: "14px 12px", fontWeight: 700, color: "#58a6ff" }}>
                    PT. Tekstil Maju Jaya
                  </td>
                  <td style={{ padding: "14px 12px", color: "#c9d1d9" }}>
                    BILL/2026/11/0001 (Kain Katun)
                  </td>
                  <td style={{ padding: "14px 12px", textAlign: "right", fontWeight: 700, color: "#3fb950" }}>
                    Rp 1.200.000
                  </td>
                  <td style={{ padding: "14px 12px", textAlign: "right", color: "#8b949e" }}>Rp 0</td>
                  <td style={{ padding: "14px 12px", textAlign: "right", color: "#8b949e" }}>Rp 0</td>
                  <td style={{ padding: "14px 12px", textAlign: "right", fontWeight: 700, color: "#f0f6fc" }}>
                    Rp 1.200.000
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Health Indicators */}
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
              }}
            >
              <div>
                <span style={{ fontSize: 12, color: "#8b949e" }}>Batas Waktu Jatuh Tempo:</span>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#e3b341", marginTop: 4 }}>
                  01 Desember 2026
                </div>
              </div>
              <div>
                <span style={{ fontSize: 12, color: "#8b949e" }}>Sisa Waktu Fleksibilitas:</span>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#3fb950", marginTop: 4 }}>
                  19 Hari Menuju Jatuh Tempo
                </div>
              </div>
              <div>
                <span style={{ fontSize: 12, color: "#8b949e" }}>Resiko Penalti / Bunga:</span>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#58a6ff", marginTop: 4 }}>
                  0% (Kolektibilitas Lancar)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TutorialCallout
        step={9}
        title="Kontrol Umur Hutang & Manajemen Cashflow"
        description={
          frame < 180
            ? "Laporan Aged Payables memetakan seluruh kewajiban pembelian bahan kain berdasarkan usia faktur."
            : frame < 380
            ? "Faktur Rp 1.200.000 tercatat di kolom 'Belum Jatuh Tempo', membuktikan toko memaksimalkan perputaran modal kerja."
            : "Zero default dan zero penalty: barang terjual di kasir lebih cepat daripada waktu jatuh tempo tagihan pabrik kain."
        }
        visible={true}
      />

      <Cursor x={cursorX} y={cursorY} label={cursorLabel} />
    </AbsoluteFill>
  );
};
