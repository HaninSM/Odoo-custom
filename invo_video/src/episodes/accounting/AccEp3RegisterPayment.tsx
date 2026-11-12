import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { OdooNavBar } from "../../components/OdooNavBar";
import { Cursor } from "../../components/Cursor";
import { TutorialCallout } from "../../components/TutorialCallout";
import { Badge } from "../../components/Badge";
import { CheckCircleIcon } from "../../components/Icons";
import { TutorialProps } from "../../types";

export const ACC_EP3_DURATION = 600; // 20 Detik @ 30 FPS

export const AccEp3RegisterPayment: React.FC<TutorialProps> = () => {
  const frame = useCurrentFrame();

  const isModalOpen = frame >= 80 && frame < 380;
  const isPaid = frame >= 380;

  let cursorX = 960;
  let cursorY = 540;
  let cursorLabel = "";
  let isClicking = false;
  let clickFrame = 0;

  if (frame < 80) {
    cursorX = interpolate(frame, [0, 70], [960, 260], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [0, 70], [540, 190], { extrapolateRight: "clamp" });
    cursorLabel = "Klik Tombol Register Payment";
    if (frame >= 68 && frame <= 76) {
      isClicking = true;
      clickFrame = 72;
    }
  } else if (frame < 380) {
    cursorX = interpolate(frame, [80, 240], [260, 1080], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [80, 240], [190, 620], { extrapolateRight: "clamp" });
    cursorLabel = "Pilih Jurnal Bank [BNK1] & Klik Create Payment";
    if (frame >= 360 && frame <= 368) {
      isClicking = true;
      clickFrame = 364;
    }
  } else {
    cursorX = interpolate(frame, [380, 480], [1080, 940], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [380, 480], [620, 280], { extrapolateRight: "clamp" });
    cursorLabel = "Status Tagihan: LUNAS (PAID)";
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
        breadcrumbModel="Vendors > Payments"
        breadcrumbRecord="Pelunasan Faktur BILL/2026/11/0001"
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
        EPISODE 3/10: REGISTER PAYMENT (PELUNASAN HUTANG)
      </div>

      <div
        style={{
          flex: 1,
          padding: "20px 60px 80px 60px",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          position: "relative",
        }}
      >
        {/* Background Vendor Bill Form */}
        <div
          style={{
            width: "100%",
            maxWidth: 1400,
            backgroundColor: "#161b22",
            borderRadius: 12,
            border: "1px solid #30363d",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6)",
            overflow: "hidden",
            filter: isModalOpen ? "blur(3px) brightness(0.6)" : "none",
            transition: "filter 0.2s ease",
          }}
        >
          <div
            style={{
              padding: "16px 24px",
              borderBottom: "1px solid #21262d",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <button
              style={{
                backgroundColor: isPaid ? "#30363d" : "#238636",
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
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Badge variant="info">POSTED</Badge>
              {isPaid ? (
                <Badge variant="success">PAID</Badge>
              ) : (
                <Badge variant="warning">NOT PAID</Badge>
              )}
            </div>
          </div>

          <div style={{ padding: "24px 32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <span style={{ fontSize: 12, color: "#8b949e" }}>Faktur Supplier:</span>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#58a6ff" }}>
                  BILL/2026/11/0001 (PT Tekstil Maju Jaya)
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: 12, color: "#8b949e" }}>Total Terbayar:</span>
                <div style={{ fontSize: 22, fontWeight: 800, color: isPaid ? "#3fb950" : "#e3b341" }}>
                  {isPaid ? "Rp 1.200.000 (Lunas)" : "Rp 0 / Rp 1.200.000"}
                </div>
              </div>
            </div>

            <div
              style={{
                padding: 16,
                backgroundColor: "#0d1117",
                borderRadius: 8,
                border: "1px solid #30363d",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#c9d1d9" }}>
                  Bahan Baku: Kain Katun Sprei "XXX" (1 Kodi = 60 Meter)
                </div>
                <div style={{ fontSize: 12, color: "#8b949e" }}>
                  Telah diproduksi menjadi 10 Sprei XL & dijual di kasir POS
                </div>
              </div>
              {isPaid && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#3fb950", fontWeight: 700 }}>
                  <CheckCircleIcon size={18} />
                  <span>Pelunasan Selesai via Mandiri Giro</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Realistic Modal Popup: Register Payment */}
        {isModalOpen && (
          <div
            style={{
              position: "absolute",
              top: 80,
              width: 580,
              backgroundColor: "#1c2128",
              borderRadius: 12,
              border: "1px solid #444c56",
              boxShadow: "0 25px 60px rgba(0,0,0,0.8)",
              zIndex: 50,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "14px 20px",
                borderBottom: "1px solid #30363d",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#22272e",
              }}
            >
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#f0f6fc" }}>
                Daftarkan Pembayaran (Register Payment)
              </h3>
              <span style={{ fontSize: 12, color: "#8b949e" }}>BILL/2026/11/0001</span>
            </div>

            <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, color: "#8b949e", display: "block", marginBottom: 4 }}>
                  Jurnal Pembayaran (Bank Account):
                </label>
                <div
                  style={{
                    padding: "8px 12px",
                    backgroundColor: "#0d1117",
                    border: "1px solid #58a6ff",
                    borderRadius: 6,
                    color: "#f0f6fc",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  Bank Mandiri Giro [BNK1] (11120000)
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, color: "#8b949e", display: "block", marginBottom: 4 }}>
                    Jumlah Bayar:
                  </label>
                  <div
                    style={{
                      padding: "8px 12px",
                      backgroundColor: "#0d1117",
                      border: "1px solid #30363d",
                      borderRadius: 6,
                      color: "#3fb950",
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  >
                    Rp 1.200.000,00
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 12, color: "#8b949e", display: "block", marginBottom: 4 }}>
                    Tanggal Bayar:
                  </label>
                  <div
                    style={{
                      padding: "8px 12px",
                      backgroundColor: "#0d1117",
                      border: "1px solid #30363d",
                      borderRadius: 6,
                      color: "#f0f6fc",
                      fontSize: 13,
                    }}
                  >
                    01 Des 2026
                  </div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, color: "#8b949e", display: "block", marginBottom: 4 }}>
                  Rekening Penerima:
                </label>
                <div
                  style={{
                    padding: "8px 12px",
                    backgroundColor: "#0d1117",
                    border: "1px solid #30363d",
                    borderRadius: 6,
                    color: "#c9d1d9",
                    fontSize: 12,
                  }}
                >
                  BCA 782-019-2837 a/n PT Tekstil Maju Jaya
                </div>
              </div>
            </div>

            <div
              style={{
                padding: "14px 20px",
                borderTop: "1px solid #30363d",
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                backgroundColor: "#22272e",
              }}
            >
              <button
                style={{
                  backgroundColor: "#21262d",
                  color: "#c9d1d9",
                  border: "1px solid #30363d",
                  borderRadius: 6,
                  padding: "8px 16px",
                  fontSize: 12,
                }}
              >
                Batal
              </button>
              <button
                style={{
                  backgroundColor: "#238636",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: 6,
                  padding: "8px 20px",
                  fontSize: 13,
                  fontWeight: 700,
                  boxShadow: "0 0 12px rgba(35, 134, 54, 0.4)",
                }}
              >
                Create Payment
              </button>
            </div>
          </div>
        )}
      </div>

      <TutorialCallout
        step={3}
        title="Pelunasan Hutang Vendor via Bank Transfer"
        description={
          frame < 80
            ? "Membuka wizard Register Payment dari tagihan vendor untuk menyelesaikan kewajiban tepat waktu."
            : frame < 380
            ? "Memilih akun Bank Mandiri Giro [BNK1] untuk mencatat arus kas keluar riil perbankan sebesar Rp 1.200.000."
            : "Hutang vendor dinyatakan LUNAS (PAID). Arus kas dan neraca hutang otomatis sinkron dan terlindungi dari bunga/penalti."
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
