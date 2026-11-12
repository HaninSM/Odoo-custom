import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { OdooNavBar } from "../../components/OdooNavBar";
import { Cursor } from "../../components/Cursor";
import { TutorialCallout } from "../../components/TutorialCallout";
import { Badge } from "../../components/Badge";
import { CheckCircleIcon } from "../../components/Icons";
import { TutorialProps } from "../../types";

export const ACC_EP5_DURATION = 600; // 20 Detik @ 30 FPS

export const AccEp5QrisClearing: React.FC<TutorialProps> = () => {
  const frame = useCurrentFrame();

  const isReconciled = frame >= 380;

  let cursorX = 960;
  let cursorY = 540;
  let cursorLabel = "";
  let isClicking = false;
  let clickFrame = 0;

  if (frame < 180) {
    cursorX = interpolate(frame, [0, 80], [960, 420], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [0, 80], [540, 360], { extrapolateRight: "clamp" });
    cursorLabel = "Mutasi Masuk Rekening Koran: +Rp 112.500";
  } else if (frame < 380) {
    cursorX = interpolate(frame, [180, 260], [420, 1020], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [180, 260], [360, 520], { extrapolateRight: "clamp" });
    cursorLabel = "Pencocokan Otomatis Akun Kliring 11120010 -> Klik Validate";
    if (frame >= 350 && frame <= 358) {
      isClicking = true;
      clickFrame = 354;
    }
  } else {
    cursorX = interpolate(frame, [380, 460], [1020, 960], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [380, 460], [520, 640], { extrapolateRight: "clamp" });
    cursorLabel = "Rekonsiliasi Sukses: Dana Masuk Kas Bank Riil [BNK1]";
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
        breadcrumbModel="Accounting > Reconciliation"
        breadcrumbRecord="Rekonsiliasi Bank Mandiri Giro [BNK1]"
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
        EPISODE 5/10: QRIS CLEARING & BANK RECONCILIATION
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
              <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#f0f6fc" }}>
                Rekonsiliasi Bank Mandiri Giro & Kliring QRIS
              </h2>
              <span style={{ fontSize: 12, color: "#8b949e" }}>
                Memvalidasi pencairan settlement QRIS kasir ke rekening giro perusahaan
              </span>
            </div>
            <Badge variant={isReconciled ? "success" : "info"}>
              {isReconciled ? "RECONCILED" : "TO RECONCILE (1 Item)"}
            </Badge>
          </div>

          {/* Reconciliation Split View */}
          <div
            style={{
              padding: 24,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 20,
            }}
          >
            {/* Left: Bank Statement Line */}
            <div
              style={{
                backgroundColor: "#0d1117",
                border: "1px solid #30363d",
                borderRadius: 10,
                padding: 18,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#58a6ff" }}>
                  1. Mutasi Rekening Koran Bank Mandiri
                </span>
                <span style={{ fontSize: 12, color: "#8b949e" }}>13 Nov 2026</span>
              </div>
              <div
                style={{
                  padding: 14,
                  backgroundColor: "#161b22",
                  borderRadius: 8,
                  border: "1px solid #21262d",
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 600, color: "#f0f6fc", marginBottom: 4 }}>
                  CR SETTLEMENT QRIS TOKO JENDRAL
                </div>
                <div style={{ fontSize: 12, color: "#8b949e", marginBottom: 10 }}>
                  Referensi: MIDTRANS-QRIS-20261112001
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#3fb950" }}>
                  +Rp 112.500,00
                </div>
              </div>
            </div>

            {/* Right: Matched Journal Entry */}
            <div
              style={{
                backgroundColor: "#0d1117",
                border: isReconciled ? "1px solid #238636" : "1px solid #30363d",
                borderRadius: 10,
                padding: 18,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#79c0ff" }}>
                  2. Pasangan Pembukuan Akuntansi (Odoo)
                </span>
                <span style={{ fontSize: 12, color: "#8b949e" }}>Akun Kliring</span>
              </div>
              <div
                style={{
                  padding: 14,
                  backgroundColor: "#161b22",
                  borderRadius: 8,
                  border: "1px solid #21262d",
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 600, color: "#f0f6fc", marginBottom: 4 }}>
                  11120010 Kliring QRIS & EDC Kasir
                </div>
                <div style={{ fontSize: 12, color: "#8b949e", marginBottom: 10 }}>
                  Transaksi Kasir: 1x Sprei XL (180x200)
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#79c0ff" }}>
                  Rp 112.500,00
                </div>
              </div>

              {/* Action Button */}
              <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end" }}>
                {isReconciled ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#3fb950", fontWeight: 700, fontSize: 13 }}>
                    <CheckCircleIcon size={18} />
                    <span>Tervalidasi & Saldo Kliring Selesai</span>
                  </div>
                ) : (
                  <button
                    style={{
                      backgroundColor: "#238636",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: 6,
                      padding: "8px 20px",
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    Validate (Cocokkan)
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Summary Bar */}
          <div
            style={{
              padding: "12px 24px",
              backgroundColor: "#161b22",
              borderTop: "1px solid #21262d",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 13,
            }}
          >
            <span style={{ color: "#8b949e" }}>
              Selisih Rekonsiliasi: <strong style={{ color: "#3fb950" }}>Rp 0,00</strong>
            </span>
            <span style={{ color: "#c9d1d9" }}>
              Efek Jurnal: <strong>Debit Bank Mandiri</strong> (11120000) / <strong>Kredit Kliring QRIS</strong> (11120010)
            </span>
          </div>
        </div>
      </div>

      <TutorialCallout
        step={5}
        title="Pencairan Kliring QRIS & Rekonsiliasi Bank"
        description={
          frame < 180
            ? "Uang QRIS pelanggan kasir tidak langsung masuk rekening giro saat itu juga, melainkan ditampung di Akun Kliring 11120010."
            : frame < 380
            ? "Saat dana masuk ke rekening Bank Mandiri pada H+1, menu Bank Reconciliation mencocokkan mutasi bank dengan akun kliring."
            : "Validasi ini memindahkan saldo ke kas bank riil dan menolkan akun penampung, menjamin 100% uang kasir tidak bocor."
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
