import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { OdooNavBar } from "../components/OdooNavBar";
import { Cursor } from "../components/Cursor";
import { TutorialCallout } from "../components/TutorialCallout";
import { Badge } from "../components/Badge";
import { QrCodeIcon } from "../components/Icons";

export const WalkthroughScene4Cashier: React.FC = () => {
  const frame = useCurrentFrame();

  const isItemAdded = frame >= 75;
  const isPayModalOpen = frame >= 170;
  const isQrisSelected = frame >= 265;
  const isPaid = frame >= 360;

  // Cursor movements
  let cursorX = 960;
  let cursorY = 540;
  let cursorLabel = "";
  let isClicking = false;
  let clickFrame = 0;

  if (frame < 80) {
    // Click on Product Card Sprei XL (x: 420, y: 340)
    cursorX = interpolate(frame, [0, 65], [960, 420], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [0, 65], [540, 340], { extrapolateRight: "clamp" });
    cursorLabel = "Klik Sprei XL ke Keranjang";
    if (frame >= 68 && frame <= 76) {
      isClicking = true;
      clickFrame = 72;
    }
  } else if (frame < 180) {
    // Click on Pay Button (x: 1400, y: 700)
    cursorX = interpolate(frame, [80, 160], [420, 1400], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [80, 160], [340, 700], { extrapolateRight: "clamp" });
    cursorLabel = "Klik Pembayaran / Pay";
    if (frame >= 164 && frame <= 172) {
      isClicking = true;
      clickFrame = 168;
    }
  } else if (frame < 280) {
    // Click on QRIS Journal button in Modal (x: 1080, y: 440)
    cursorX = interpolate(frame, [180, 255], [1400, 1080], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [180, 255], [700, 440], { extrapolateRight: "clamp" });
    cursorLabel = "Pilih Metode: QRIS / EDC Merchant";
    if (frame >= 258 && frame <= 266) {
      isClicking = true;
      clickFrame = 262;
    }
  } else if (frame < 380) {
    // Click on Validate / Selesai (x: 1100, y: 640)
    cursorX = interpolate(frame, [280, 350], [1080, 1100], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [280, 350], [440, 640], { extrapolateRight: "clamp" });
    cursorLabel = "Klik Validasi & Cetak Struk";
    if (frame >= 354 && frame <= 362) {
      isClicking = true;
      clickFrame = 358;
    }
  } else {
    // Move to Receipt & updated stock (x: 1400, y: 400)
    cursorX = interpolate(frame, [380, 420], [1100, 1400], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [380, 420], [640, 400], { extrapolateRight: "clamp" });
    cursorLabel = "Struk Tercetak & Stok Berkurang ke 9 Pcs";
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
        activeMenu="🛒 POS Kasir"
        breadcrumbModel="Point of Sale"
        breadcrumbRecord="Toko Sprei Jendral (Sesi Kasir #01)"
      />

      <div
        style={{
          flex: 1,
          padding: "20px 60px 80px 60px",
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: 28,
        }}
      >
        {/* Left: Product Catalog Grid */}
        <div
          style={{
            backgroundColor: "#161b22",
            borderRadius: 16,
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
            padding: "24px 28px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: "#ffffff" }}>
              Katalog Produk Kasir
            </span>
            <span style={{ fontSize: 13, color: "#94a3b8" }}>
              Kategori: Semua Sprei Siap Jual
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* Product Card 1: Sprei XL (Highlighted) */}
            <div
              style={{
                padding: "20px",
                borderRadius: 14,
                backgroundColor: frame < 80 ? "rgba(26, 98, 255, 0.18)" : "rgba(30, 41, 59, 0.5)",
                border: frame < 80 ? "2px solid #38bdf8" : "1px solid rgba(255, 255, 255, 0.08)",
                cursor: "pointer",
                boxShadow: frame < 80 ? "0 0 16px rgba(56, 189, 248, 0.35)" : "none",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: 18, fontWeight: 800, color: "#ffffff" }}>
                  Sprei XL (180 × 200)
                </span>
                <Badge
                  label={isPaid ? "Sisa 9 Pcs" : "Stok 10 Pcs"}
                  variant={isPaid ? "amber" : "blue"}
                  fontSize={11}
                />
              </div>
              <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>
                HPP Terkunci: Rp 75.000 / pcs
              </div>
              <div style={{ marginTop: 14, fontSize: 22, fontWeight: 900, color: "#34d399" }}>
                Rp 112.500
              </div>
            </div>

            {/* Product Card 2: Sprei L */}
            <div
              style={{
                padding: "20px",
                borderRadius: 14,
                backgroundColor: "rgba(30, 41, 59, 0.3)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                opacity: 0.6,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: "#cbd5e1" }}>
                  Sprei L (160 × 200)
                </span>
                <Badge label="Mode Floating" variant="neutral" fontSize={11} />
              </div>
              <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
                Potong On-The-Fly (2.5m)
              </div>
              <div style={{ marginTop: 14, fontSize: 22, fontWeight: 800, color: "#cbd5e1" }}>
                Rp 70.000
              </div>
            </div>
          </div>
        </div>

        {/* Right: Cart & Payment Checkout */}
        <div
          style={{
            backgroundColor: "#161b22",
            borderRadius: 16,
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
            padding: "24px 28px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 14 }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: "#ffffff" }}>
                Keranjang Belanja
              </span>
              <span style={{ fontSize: 13, color: "#60a5fa" }}>Pelanggan Umum</span>
            </div>

            {isItemAdded && (
              <div
                style={{
                  marginTop: 18,
                  padding: "14px 18px",
                  borderRadius: 12,
                  backgroundColor: "rgba(30, 41, 59, 0.5)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#ffffff" }}>
                    Sprei XL (180 × 200)
                  </div>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>1 Pcs × Rp 112.500</div>
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#34d399" }}>
                  Rp 112.500
                </div>
              </div>
            )}
          </div>

          {/* Cart Bottom Summary */}
          <div>
            <div style={{ padding: "16px 0", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 16, color: "#94a3b8" }}>TOTAL HARUS DIBAYAR:</span>
              <span style={{ fontSize: 32, fontWeight: 900, color: "#34d399" }}>
                {isItemAdded ? "Rp 112.500" : "Rp 0"}
              </span>
            </div>

            <div
              style={{
                height: 52,
                borderRadius: 12,
                backgroundColor: isItemAdded ? "#1a62ff" : "rgba(255,255,255,0.08)",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: 18,
                cursor: "pointer",
                boxShadow: isItemAdded ? "0 4px 16px rgba(26,98,255,0.5)" : "none",
              }}
            >
              💳 Pembayaran / Pay
            </div>
          </div>

          {/* Modal Multi-Payment Dialog (Overlay) */}
          {isPayModalOpen && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(10, 15, 29, 0.95)",
                borderRadius: 16,
                padding: "28px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                border: "2px solid #3b82f6",
                boxShadow: "0 20px 50px rgba(0,0,0,0.8)",
                zIndex: 50,
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <span style={{ fontSize: 20, fontWeight: 800, color: "#ffffff" }}>
                    Pilih Buku Jurnal Pembayaran
                  </span>
                  <Badge label="Total: Rp 112.500" variant="green" fontSize={12} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 12 }}>
                  <div style={{ padding: "12px", borderRadius: 10, backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", textAlign: "center" }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: "#cbd5e1" }}>💵 KAS TUNAI</div>
                    <div style={{ fontSize: 10, color: "#94a3b8" }}>[CSH1] Brankas Kasir</div>
                  </div>

                  <div style={{ padding: "12px", borderRadius: 10, backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", textAlign: "center" }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: "#cbd5e1" }}>🏦 TRANSFER BANK</div>
                    <div style={{ fontSize: 10, color: "#94a3b8" }}>[BNK1] Rek Bisnis</div>
                  </div>

                  {/* QRIS Active */}
                  <div
                    style={{
                      padding: "12px",
                      borderRadius: 10,
                      backgroundColor: "rgba(26,98,255,0.25)",
                      border: "2px solid #38bdf8",
                      textAlign: "center",
                      boxShadow: "0 0 14px rgba(56, 189, 248, 0.4)",
                    }}
                  >
                    <div style={{ fontWeight: 800, fontSize: 13, color: "#38bdf8" }}>📱 QRIS & EDC</div>
                    <div style={{ fontSize: 10, color: "#93c5fd" }}>[QRIS1] Kliring Merchant</div>
                  </div>
                </div>

                {/* QR Display */}
                {isQrisSelected && (
                  <div
                    style={{
                      marginTop: 20,
                      padding: "16px",
                      borderRadius: 12,
                      backgroundColor: "rgba(30, 41, 59, 0.6)",
                      display: "flex",
                      alignItems: "center",
                      gap: 20,
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <div style={{ padding: 8, backgroundColor: "#ffffff", borderRadius: 10 }}>
                      <QrCodeIcon size={64} color="#0f172a" />
                    </div>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: "#ffffff" }}>
                        Scan QRIS Statis / EDC
                      </div>
                      <div style={{ fontSize: 12, color: "#34d399", fontWeight: 700, marginTop: 4 }}>
                        ✓ Saldo Otomatis Masuk Akun 11120010
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Validate */}
              <div
                style={{
                  height: 50,
                  borderRadius: 12,
                  backgroundColor: isPaid ? "#10b981" : "#1a62ff",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: 17,
                  boxShadow: "0 4px 16px rgba(16, 185, 129, 0.4)",
                }}
              >
                {isPaid ? "✅ Pembayaran Lunas & Struk Dicetak" : "✓ Validasi & Selesaikan Transaksi"}
              </div>
            </div>
          )}
        </div>
      </div>

      <TutorialCallout
        step="4"
        instruction="Kasir POS: Checkout Sprei XL & Multi-Payment QRIS"
        detail="Stok rak otomatis terpotong dari 10 pcs menjadi 9 pcs, dan dana masuk ke rekening kliring terpisah!"
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
