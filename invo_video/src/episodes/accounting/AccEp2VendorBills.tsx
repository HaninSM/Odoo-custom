import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { OdooNavBar } from "../../components/OdooNavBar";
import { Cursor } from "../../components/Cursor";
import { TutorialCallout } from "../../components/TutorialCallout";
import { Badge } from "../../components/Badge";
import { TutorialProps } from "../../types";

export const ACC_EP2_DURATION = 600; // 20 Detik @ 30 FPS

export const AccEp2VendorBills: React.FC<TutorialProps> = () => {
  const frame = useCurrentFrame();

  let cursorX = 960;
  let cursorY = 540;
  let cursorLabel = "";

  if (frame < 180) {
    cursorX = interpolate(frame, [0, 80], [960, 420], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [0, 80], [540, 290], { extrapolateRight: "clamp" });
    cursorLabel = "Faktur Tagihan Masuk: PT Tekstil Maju Jaya";
  } else if (frame < 380) {
    cursorX = interpolate(frame, [180, 260], [420, 1080], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [180, 260], [290, 290], { extrapolateRight: "clamp" });
    cursorLabel = "Termin Net 30 Hari: Jatuh Tempo 01 Des 2026";
  } else {
    cursorX = interpolate(frame, [380, 460], [1080, 720], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [380, 460], [290, 480], { extrapolateRight: "clamp" });
    cursorLabel = "Jurnal: Debit Persediaan Bahan (1.2jt) / Kredit Hutang AP";
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
        breadcrumbModel="Vendors > Bills"
        breadcrumbRecord="BILL/2026/11/0001 (PT Tekstil Maju Jaya)"
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
        EPISODE 2/10: VENDOR BILLS (HUTANG DAGANG)
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
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <button
                style={{
                  backgroundColor: "#238636",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: 6,
                  padding: "8px 18px",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                Register Payment
              </button>
              <button
                style={{
                  backgroundColor: "#21262d",
                  color: "#c9d1d9",
                  border: "1px solid #30363d",
                  borderRadius: 6,
                  padding: "8px 16px",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                Kirim Nota Kredit
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, color: "#8b949e", marginRight: 8 }}>Status:</span>
              <Badge variant="info">POSTED</Badge>
              <Badge variant="warning">NOT PAID</Badge>
            </div>
          </div>

          {/* Form Content */}
          <div style={{ padding: "24px 32px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 24,
                marginBottom: 24,
                paddingBottom: 20,
                borderBottom: "1px solid #21262d",
              }}
            >
              <div>
                <label style={{ fontSize: 12, color: "#8b949e", display: "block", marginBottom: 6 }}>
                  Vendor / Supplier:
                </label>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#58a6ff" }}>
                  PT. Tekstil Maju Jaya
                </div>
                <div style={{ fontSize: 12, color: "#8b949e", marginTop: 4 }}>
                  NPWP: 01.892.345.2-012.000 • Inbound PO: PO-00101
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, color: "#8b949e", display: "block", marginBottom: 6 }}>
                  Ketentuan Pembayaran (Terms):
                </label>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#e3b341" }}>
                  Net 30 Days (Jatuh Tempo: 01 Des 2026)
                </div>
                <div style={{ fontSize: 12, color: "#8b949e", marginTop: 4 }}>
                  Tanggal Tagihan: 01 Nov 2026 • Jurnal: Vendor Bills
                </div>
              </div>
            </div>

            {/* Invoice Line Table */}
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#c9d1d9", marginBottom: 12 }}>
                Rincian Barang Diterima (Inbound Stock):
              </h3>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #30363d", color: "#8b949e", textAlign: "left" }}>
                    <th style={{ padding: "8px 12px" }}>Produk Bahan Baku</th>
                    <th style={{ padding: "8px 12px" }}>Akun Beban / Aset</th>
                    <th style={{ padding: "8px 12px", textAlign: "right" }}>Kuantitas</th>
                    <th style={{ padding: "8px 12px", textAlign: "right" }}>Harga Satuan</th>
                    <th style={{ padding: "8px 12px", textAlign: "right" }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: "1px solid #21262d", color: "#f0f6fc" }}>
                    <td style={{ padding: "12px", fontWeight: 600 }}>Kain Katun Sprei "XXX"</td>
                    <td style={{ padding: "12px", color: "#79c0ff" }}>11410000 Stock Interim (Received)</td>
                    <td style={{ padding: "12px", textAlign: "right" }}>1 Kodi (60 Meter)</td>
                    <td style={{ padding: "12px", textAlign: "right" }}>Rp 1.200.000</td>
                    <td style={{ padding: "12px", textAlign: "right", fontWeight: 700, color: "#58a6ff" }}>
                      Rp 1.200.000
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Total Summary */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: 10,
              }}
            >
              <div
                style={{
                  width: 320,
                  backgroundColor: "#0d1117",
                  padding: 16,
                  borderRadius: 8,
                  border: "1px solid #30363d",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}>
                  <span style={{ color: "#8b949e" }}>Total Tagihan:</span>
                  <span style={{ color: "#f0f6fc", fontWeight: 700 }}>Rp 1.200.000</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, paddingTop: 8, borderTop: "1px solid #21262d" }}>
                  <span style={{ color: "#e3b341", fontWeight: 700 }}>Sisa Hutang:</span>
                  <span style={{ color: "#e3b341", fontWeight: 800 }}>Rp 1.200.000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TutorialCallout
        step={2}
        title="Faktur Vendor (Bills) & Pengakuan Hutang Dagang"
        description={
          frame < 180
            ? "Penerimaan 1 Kodi (60m) kain katun dari supplier otomatis membentuk dokumen Vendor Bill senilai Rp 1.200.000."
            : frame < 380
            ? "Termin Net 30 hari memberi fleksibilitas modal kerja: kain bisa langsung diproduksi dan dijual di kasir POS sebelum tagihan jatuh tempo."
            : "Akuntansi mencatat debit persediaan barang interim Rp 1.200.000 dan kredit hutang usaha tanpa mengganggu arus kas hari ini."
        }
        visible={true}
      />

      <Cursor x={cursorX} y={cursorY} label={cursorLabel} />
    </AbsoluteFill>
  );
};
