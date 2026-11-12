import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { OdooNavBar } from "../../components/OdooNavBar";
import { Cursor } from "../../components/Cursor";
import { TutorialCallout } from "../../components/TutorialCallout";
import { Badge } from "../../components/Badge";
import { TutorialProps } from "../../types";

export const ACC_EP4_DURATION = 600; // 20 Detik @ 30 FPS

export const AccEp4JournalEntries: React.FC<TutorialProps> = () => {
  const frame = useCurrentFrame();

  let cursorX = 960;
  let cursorY = 540;
  let cursorLabel = "";

  if (frame < 180) {
    cursorX = interpolate(frame, [0, 80], [960, 480], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [0, 80], [540, 360], { extrapolateRight: "clamp" });
    cursorLabel = "Baris 1 & 2: Penerimaan QRIS (Debit) & Omzet Penjualan (Kredit)";
  } else if (frame < 380) {
    cursorX = interpolate(frame, [180, 260], [480, 520], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [180, 260], [360, 480], { extrapolateRight: "clamp" });
    cursorLabel = "Baris 3 & 4: Pengakuan HPP (Debit 75k) & Pengurangan Stok (Kredit 75k)";
  } else {
    cursorX = interpolate(frame, [380, 460], [520, 1150], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [380, 460], [480, 560], { extrapolateRight: "clamp" });
    cursorLabel = "Total Debit = Kredit: Rp 187.500 (Seimbang & Valid)";
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
        breadcrumbModel="Accounting > Journal Entries"
        breadcrumbRecord="POS/2026/11/01 - Jurnal Transaksi Sprei XL"
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
        EPISODE 4/10: JOURNAL ENTRIES (DOUBLE-ENTRY POS)
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
          {/* Action & Status Header */}
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
              <span style={{ fontSize: 12, color: "#8b949e" }}>Nomor Entri Jurnal:</span>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#f0f6fc" }}>
                POS/2026/11/01/0088 (Sesi Kasir #1)
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Badge variant="info">Point of Sale</Badge>
              <Badge variant="success">POSTED (OTOMATIS)</Badge>
            </div>
          </div>

          {/* Journal Items Table */}
          <div style={{ padding: "20px 28px" }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#c9d1d9", marginBottom: 12 }}>
              Daftar Baris Jurnal Akuntansi (Journal Items):
            </h3>

            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #30363d", color: "#8b949e", textAlign: "left" }}>
                  <th style={{ padding: "10px 12px" }}>Kode Akun</th>
                  <th style={{ padding: "10px 12px" }}>Nama Akun & Keterangan</th>
                  <th style={{ padding: "10px 12px" }}>Partner</th>
                  <th style={{ padding: "10px 12px", textAlign: "right" }}>Debit</th>
                  <th style={{ padding: "10px 12px", textAlign: "right" }}>Kredit</th>
                </tr>
              </thead>
              <tbody>
                {/* Line 1: QRIS clearing */}
                <tr style={{ borderBottom: "1px solid #21262d", backgroundColor: frame < 180 ? "rgba(56, 139, 253, 0.08)" : "transparent" }}>
                  <td style={{ padding: "12px", fontWeight: 700, color: "#58a6ff" }}>11120010</td>
                  <td style={{ padding: "12px", color: "#f0f6fc" }}>
                    Kliring QRIS & EDC Merchant (Kasir POS)
                  </td>
                  <td style={{ padding: "12px", color: "#8b949e" }}>Pelanggan Umum</td>
                  <td style={{ padding: "12px", textAlign: "right", fontWeight: 700, color: "#3fb950" }}>
                    Rp 112.500
                  </td>
                  <td style={{ padding: "12px", textAlign: "right", color: "#6e7681" }}>Rp 0</td>
                </tr>

                {/* Line 2: Revenue */}
                <tr style={{ borderBottom: "1px solid #21262d", backgroundColor: frame < 180 ? "rgba(56, 139, 253, 0.08)" : "transparent" }}>
                  <td style={{ padding: "12px", fontWeight: 700, color: "#d29922" }}>41110000</td>
                  <td style={{ padding: "12px", color: "#f0f6fc" }}>
                    Pendapatan Penjualan Sprei XL (180x200)
                  </td>
                  <td style={{ padding: "12px", color: "#8b949e" }}>Pelanggan Umum</td>
                  <td style={{ padding: "12px", textAlign: "right", color: "#6e7681" }}>Rp 0</td>
                  <td style={{ padding: "12px", textAlign: "right", fontWeight: 700, color: "#e3b341" }}>
                    Rp 112.500
                  </td>
                </tr>

                {/* Line 3: COGS */}
                <tr style={{ borderBottom: "1px solid #21262d", backgroundColor: frame >= 180 && frame < 380 ? "rgba(163, 113, 247, 0.08)" : "transparent" }}>
                  <td style={{ padding: "12px", fontWeight: 700, color: "#bc8cff" }}>51110000</td>
                  <td style={{ padding: "12px", color: "#f0f6fc" }}>
                    Harga Pokok Penjualan (HPP Sprei XL)
                  </td>
                  <td style={{ padding: "12px", color: "#8b949e" }}>Toko Sprei Jendral</td>
                  <td style={{ padding: "12px", textAlign: "right", fontWeight: 700, color: "#bc8cff" }}>
                    Rp 75.000
                  </td>
                  <td style={{ padding: "12px", textAlign: "right", color: "#6e7681" }}>Rp 0</td>
                </tr>

                {/* Line 4: Inventory asset deduction */}
                <tr style={{ borderBottom: "1px solid #21262d", backgroundColor: frame >= 180 && frame < 380 ? "rgba(163, 113, 247, 0.08)" : "transparent" }}>
                  <td style={{ padding: "12px", fontWeight: 700, color: "#79c0ff" }}>11410000</td>
                  <td style={{ padding: "12px", color: "#f0f6fc" }}>
                    Persediaan Barang Jadi Rak Toko (-1 Pcs)
                  </td>
                  <td style={{ padding: "12px", color: "#8b949e" }}>Toko Sprei Jendral</td>
                  <td style={{ padding: "12px", textAlign: "right", color: "#6e7681" }}>Rp 0</td>
                  <td style={{ padding: "12px", textAlign: "right", fontWeight: 700, color: "#79c0ff" }}>
                    Rp 75.000
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Total Balance Bar */}
            <div
              style={{
                marginTop: 20,
                padding: "12px 20px",
                backgroundColor: "#0d1117",
                borderRadius: 8,
                border: "1px solid #30363d",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13, color: "#3fb950", fontWeight: 700 }}>
                  ✓ Status Jurnal: SEIMBANG (BALANCED)
                </span>
                <span style={{ fontSize: 12, color: "#8b949e" }}>
                  Selisih: Rp 0 • Otomatis diposting dari kasir
                </span>
              </div>
              <div style={{ display: "flex", gap: 32, fontSize: 14 }}>
                <div>
                  <span style={{ color: "#8b949e", marginRight: 8 }}>Total Debit:</span>
                  <span style={{ color: "#f0f6fc", fontWeight: 700 }}>Rp 187.500</span>
                </div>
                <div>
                  <span style={{ color: "#8b949e", marginRight: 8 }}>Total Kredit:</span>
                  <span style={{ color: "#f0f6fc", fontWeight: 700 }}>Rp 187.500</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TutorialCallout
        step={4}
        title="Double-Entry Otomatis dari Transaksi Kasir"
        description={
          frame < 180
            ? "Penjualan kasir Sprei XL Rp 112.500 mendebit akun Kliring QRIS 11120010 dan mengkredit Penjualan Barang 41110000."
            : frame < 380
            ? "Simultan tanpa jeda, sistem mendebit Beban Pokok Penjualan (HPP Rp 75.000) dan mengkredit Persediaan Barang Jadi (-1 unit)."
            : "Laba kotor Rp 37.500 langsung terealisasi secara sah dalam standar akuntansi double-entry tanpa perlu entri manual."
        }
        visible={true}
      />

      <Cursor x={cursorX} y={cursorY} label={cursorLabel} />
    </AbsoluteFill>
  );
};
