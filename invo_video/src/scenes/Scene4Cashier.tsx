import React from "react";
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { MacWindow } from "../components/MacWindow";
import { Badge } from "../components/Badge";
import { ShoppingCartIcon, QrCodeIcon } from "../components/Icons";

export const Scene4Cashier: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 15 } });
  const paymentSpring = spring({ frame: frame - 40, fps, config: { damping: 14 } });
  const receiptSpring = spring({ frame: frame - 90, fps, config: { damping: 14 } });

  const qrisGlow = interpolate(Math.sin(frame / 10), [-1, 1], [0.8, 1.2]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "100px 120px 120px 120px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1500,
          opacity: enter,
          transform: `scale(${enter})`,
        }}
      >
        <MacWindow
          title="🛒 Kasir POS & Split Jurnal Keuangan — TRX-202611-0001"
          subtitle="Checkout Cepat, Pembayaran Fleksibel (Cash / Bank / QRIS EDC), dan Auto-Pengurangan Stok Rak"
          badge={<Badge label="Kasir: MEJA-01" variant="blue" />}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 28 }}>
            {/* Left: Cart & Multi-Payment */}
            <div
              style={{
                backgroundColor: "rgba(30, 41, 59, 0.45)",
                borderRadius: 20,
                padding: "24px 28px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    backgroundColor: "rgba(26, 98, 255, 0.15)",
                    border: "1px solid rgba(26, 98, 255, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#60a5fa",
                  }}
                >
                  <ShoppingCartIcon size={28} color="#60a5fa" />
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#ffffff" }}>
                    Keranjang Transaksi Pelanggan
                  </div>
                  <div style={{ fontSize: 14, color: "#94a3b8", marginTop: 2 }}>
                    Pelanggan Umum (Walk-in Customer)
                  </div>
                </div>
              </div>

              {/* Cart Item Row */}
              <div
                style={{
                  marginTop: 20,
                  backgroundColor: "rgba(15, 23, 42, 0.7)",
                  borderRadius: 14,
                  padding: "16px 20px",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#ffffff" }}>
                    Sprei XL (180 × 200) — Siap Pakai
                  </div>
                  <div style={{ fontSize: 13, color: "#60a5fa", marginTop: 3 }}>
                    Stok Rak Terkini: <strong style={{ color: "#38bdf8" }}>10 Pcs $\rightarrow$ Sisa 9 Pcs</strong>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#34d399" }}>
                    Rp 112.500
                  </div>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>Qty: 1 Pcs</div>
                </div>
              </div>

              {/* 3 Payment Journals Selection */}
              <div style={{ marginTop: 20 }}>
                <div style={{ fontSize: 13, color: "#94a3b8", textTransform: "uppercase", marginBottom: 10 }}>
                  Pilih Jurnal Pembayaran:
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                  <div
                    style={{
                      padding: "12px",
                      borderRadius: 12,
                      backgroundColor: "rgba(15, 23, 42, 0.5)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      textAlign: "center",
                      opacity: 0.7,
                    }}
                  >
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>💵 CASH</div>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>[CSH1] Kas Tunai</div>
                  </div>

                  <div
                    style={{
                      padding: "12px",
                      borderRadius: 12,
                      backgroundColor: "rgba(15, 23, 42, 0.5)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      textAlign: "center",
                      opacity: 0.7,
                    }}
                  >
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>🏦 BANK</div>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>[BNK1] Rekening Bisnis</div>
                  </div>

                  {/* Highlighted QRIS */}
                  <div
                    style={{
                      padding: "12px",
                      borderRadius: 12,
                      backgroundColor: "rgba(26, 98, 255, 0.2)",
                      border: "2px solid #3b82f6",
                      textAlign: "center",
                      boxShadow: `0 0 16px rgba(59, 130, 246, ${0.4 * qrisGlow})`,
                    }}
                  >
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#38bdf8" }}>📱 QRIS / EDC</div>
                    <div style={{ fontSize: 11, color: "#93c5fd", marginTop: 2 }}>[QRIS1] Kliring Bank</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: QR Verification & POS Struk Receipt */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* QR Scan Verification Card */}
              <div
                style={{
                  opacity: Math.max(0, paymentSpring),
                  transform: `translateX(${(1 - Math.max(0, paymentSpring)) * 30}px)`,
                  backgroundColor: "rgba(30, 41, 59, 0.45)",
                  borderRadius: 18,
                  padding: "18px 24px",
                  border: "1px solid rgba(16, 185, 129, 0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div
                    style={{
                      padding: 10,
                      borderRadius: 12,
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      color: "#0f172a",
                    }}
                  >
                    <QrCodeIcon size={32} color="#0f172a" />
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#ffffff" }}>
                      QRIS Dynamic Verified
                    </div>
                    <div style={{ fontSize: 13, color: "#34d399", fontWeight: 600, marginTop: 2 }}>
                      Dana Masuk Rekening Kliring H+1
                    </div>
                  </div>
                </div>
                <Badge label="LUNAS (PAID)" variant="green" fontSize={12} />
              </div>

              {/* Receipt Struk Mockup */}
              <div
                style={{
                  opacity: Math.max(0, receiptSpring),
                  transform: `translateY(${(1 - Math.max(0, receiptSpring)) * 25}px)`,
                  backgroundColor: "#ffffff",
                  borderRadius: 16,
                  padding: "20px 24px",
                  color: "#0f172a",
                  boxShadow: "0 16px 36px rgba(0, 0, 0, 0.4)",
                  fontFamily: "monospace",
                }}
              >
                <div style={{ textAlign: "center", borderBottom: "1px dashed #cbd5e1", paddingBottom: 10 }}>
                  <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: "0.05em" }}>INVO. POS STORE</div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>Odoo Enterprise Cloud #202611-0001</div>
                </div>

                <div style={{ marginTop: 12, fontSize: 12, display: "flex", justifyContent: "space-between" }}>
                  <span>Sprei XL (180x200) x1</span>
                  <strong>112.500</strong>
                </div>

                <div style={{ marginTop: 10, borderTop: "1px dashed #cbd5e1", paddingTop: 8, display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 800 }}>
                  <span>TOTAL TAGIHAN</span>
                  <span>Rp 112.500</span>
                </div>

                <div style={{ marginTop: 6, display: "flex", justifyContent: "space-between", fontSize: 12, color: "#2563eb" }}>
                  <span>METODE: QRIS [QRIS1]</span>
                  <span>LUNAS</span>
                </div>
              </div>
            </div>
          </div>
        </MacWindow>
      </div>
    </div>
  );
};
