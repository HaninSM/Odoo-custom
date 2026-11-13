import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { OdooNavBar } from "../../components/OdooNavBar";
import { Cursor } from "../../components/Cursor";
import { TutorialCallout } from "../../components/TutorialCallout";
import { Badge } from "../../components/Badge";
import { CheckCircleIcon } from "../../components/Icons";
import { TutorialProps } from "../../types";

export const LIVE_POS_CHECKOUT_DURATION = 660; // 22 Detik @ 30 FPS

export const LivePosCheckoutSpreiXl: React.FC<TutorialProps> = () => {
  const frame = useCurrentFrame();

  const isCartAdded = frame >= 120;
  const isPaymentScreen = frame >= 240 && frame < 460;
  const isPaidReceipt = frame >= 460;

  // Cursor movements
  let cursorX = 960;
  let cursorY = 540;
  let cursorLabel = "";
  let isClicking = false;
  let clickFrame = 0;

  if (frame < 120) {
    cursorX = interpolate(frame, [0, 80], [960, 480], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [0, 80], [540, 360], { extrapolateRight: "clamp" });
    cursorLabel = "Pilih Produk: Sprei XL (180x200) • Rp 112.500";
    if (frame >= 105 && frame <= 113) {
      isClicking = true;
      clickFrame = 109;
    }
  } else if (frame < 240) {
    cursorX = interpolate(frame, [120, 190], [480, 1150], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [120, 190], [360, 560], { extrapolateRight: "clamp" });
    cursorLabel = "Pelanggan: Ibu Sinta -> Klik Pembayaran";
    if (frame >= 225 && frame <= 233) {
      isClicking = true;
      clickFrame = 229;
    }
  } else if (frame < 360) {
    cursorX = interpolate(frame, [240, 300], [1150, 460], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [240, 300], [560, 380], { extrapolateRight: "clamp" });
    cursorLabel = "Pilih Metode: QRIS Dinamis (Kliring 11120010)";
  } else if (frame < 460) {
    cursorX = interpolate(frame, [360, 430], [460, 1080], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [360, 430], [380, 600], { extrapolateRight: "clamp" });
    cursorLabel = "Validasi Transaksi QRIS: Rp 112.500";
    if (frame >= 440 && frame <= 448) {
      isClicking = true;
      clickFrame = 444;
    }
  } else {
    cursorX = interpolate(frame, [460, 530], [1080, 920], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [460, 530], [600, 320], { extrapolateRight: "clamp" });
    cursorLabel = "Struk TRX-202611-0002 Terbit • Stok Rak Jadi 9 Pcs!";
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
        activeMenu="🛒 Point of Sale"
        breadcrumbModel="Kasir Gerai Utama"
        breadcrumbRecord={isPaidReceipt ? "Struk TRX-202611-0002 (Lunas)" : "Sesi Penjualan Toko Jendral"}
      />

      <div
        style={{
          position: "absolute",
          top: 18,
          right: 36,
          backgroundColor: "rgba(15, 23, 42, 0.85)",
          border: "1px solid rgba(16, 185, 129, 0.5)",
          borderRadius: 8,
          padding: "4px 12px",
          color: "#34d399",
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: "0.06em",
          zIndex: 100,
        }}
      >
        LIVE SYNC: SAGE.ODOO.COM (TRX #35)
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
          {/* Top Kasir Header */}
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
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  backgroundColor: "#238636",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 18,
                }}
              >
                POS
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#f0f6fc" }}>
                  Toko Sprei Jendral • Kasir Sesi #1
                </h3>
                <span style={{ fontSize: 12, color: "#8b949e" }}>
                  Operator: Bagus Hanindyo Kusuma • Online Terhubung
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Badge variant="blue">Pelanggan: Ibu Sinta</Badge>
              <Badge variant={isPaidReceipt ? "success" : "amber"}>
                {isPaidReceipt ? "PAID (LUNAS)" : "ORDER IN PROGRESS"}
              </Badge>
            </div>
          </div>

          {/* POS Workspace Layout */}
          <div style={{ padding: "24px 32px" }}>
            {!isPaymentScreen && !isPaidReceipt && (
              /* SCREEN 1: POS CATALOG & CART VIEW */
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 24 }}>
                {/* Left: Product Grid */}
                <div>
                  <h4 style={{ fontSize: 13, fontWeight: 700, color: "#8b949e", marginBottom: 12 }}>
                    Katalog Etalase Sprei Jadi:
                  </h4>
                  <div
                    style={{
                      padding: 20,
                      backgroundColor: "#0d1117",
                      border: "2px solid #58a6ff",
                      borderRadius: 10,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: "#f0f6fc", marginBottom: 4 }}>
                        Sprei XL (180 × 200)
                      </div>
                      <div style={{ fontSize: 12, color: "#8b949e", marginBottom: 8 }}>
                        Motif Kotak Minimalis • Bahan Katun Asli
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <Badge variant="green">Stok Rak: 10 Pcs Siap Jual</Badge>
                        <Badge variant="purple">HPP Modal: Rp 75.000</Badge>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 22, fontWeight: 800, color: "#3fb950" }}>
                        Rp 112.500
                      </div>
                      <span style={{ fontSize: 11, color: "#8b949e" }}>Margin +50%</span>
                    </div>
                  </div>
                </div>

                {/* Right: Cart Order Summary */}
                <div
                  style={{
                    backgroundColor: "#0d1117",
                    borderRadius: 10,
                    border: "1px solid #30363d",
                    padding: 20,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: 13, fontWeight: 700, color: "#8b949e", marginBottom: 12 }}>
                      Keranjang Kasir:
                    </h4>
                    {isCartAdded ? (
                      <div
                        style={{
                          padding: 12,
                          backgroundColor: "#161b22",
                          borderRadius: 8,
                          border: "1px solid #21262d",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: "#f0f6fc" }}>
                            1x Sprei XL (180 × 200)
                          </div>
                          <div style={{ fontSize: 12, color: "#8b949e" }}>
                            @ Rp 112.500
                          </div>
                        </div>
                        <span style={{ fontSize: 15, fontWeight: 800, color: "#3fb950" }}>
                          Rp 112.500
                        </span>
                      </div>
                    ) : (
                      <div style={{ padding: 24, textAlign: "center", color: "#8b949e", fontSize: 13 }}>
                        Keranjang masih kosong...
                      </div>
                    )}
                  </div>

                  <div style={{ borderTop: "1px solid #21262d", paddingTop: 16, marginTop: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                      <span style={{ fontSize: 14, color: "#8b949e" }}>Total Tagihan:</span>
                      <span style={{ fontSize: 22, fontWeight: 800, color: "#f0f6fc" }}>
                        {isCartAdded ? "Rp 112.500" : "Rp 0"}
                      </span>
                    </div>
                    <button
                      style={{
                        width: "100%",
                        backgroundColor: isCartAdded ? "#238636" : "#21262d",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: 6,
                        padding: "12px",
                        fontSize: 14,
                        fontWeight: 700,
                      }}
                    >
                      Bayar Sekarang (Payment)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {isPaymentScreen && (
              /* SCREEN 2: PAYMENT METHOD MODAL (QRIS) */
              <div style={{ maxWidth: 700, margin: "0 auto", padding: "10px 0" }}>
                <div
                  style={{
                    backgroundColor: "#0d1117",
                    border: "1px solid #30363d",
                    borderRadius: 12,
                    padding: 24,
                    textAlign: "center",
                  }}
                >
                  <span style={{ fontSize: 13, color: "#8b949e" }}>Total yang Harus Dibayar:</span>
                  <div style={{ fontSize: 32, fontWeight: 800, color: "#3fb950", margin: "8px 0 20px 0" }}>
                    Rp 112.500,00
                  </div>

                  {/* QRIS Card */}
                  <div
                    style={{
                      backgroundColor: "#161b22",
                      border: "2px solid #58a6ff",
                      borderRadius: 10,
                      padding: 20,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-around",
                      marginBottom: 20,
                    }}
                  >
                    <div
                      style={{
                        width: 130,
                        height: 130,
                        backgroundColor: "#ffffff",
                        borderRadius: 8,
                        padding: 10,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          border: "4px solid #000",
                          display: "grid",
                          gridTemplateColumns: "repeat(3, 1fr)",
                          gap: 4,
                          padding: 4,
                        }}
                      >
                        <div style={{ backgroundColor: "#000" }} />
                        <div style={{ backgroundColor: "#fff" }} />
                        <div style={{ backgroundColor: "#000" }} />
                        <div style={{ backgroundColor: "#fff" }} />
                        <div style={{ backgroundColor: "#000" }} />
                        <div style={{ backgroundColor: "#fff" }} />
                        <div style={{ backgroundColor: "#000" }} />
                        <div style={{ backgroundColor: "#fff" }} />
                        <div style={{ backgroundColor: "#000" }} />
                      </div>
                    </div>

                    <div style={{ textAlign: "left" }}>
                      <Badge variant="blue">QRIS Standar Nasional (GPN)</Badge>
                      <h4 style={{ fontSize: 16, fontWeight: 700, color: "#f0f6fc", margin: "10px 0 4px 0" }}>
                        Toko Sprei Jendral (EDC #1)
                      </h4>
                      <div style={{ fontSize: 12, color: "#8b949e" }}>
                        Akun Kliring Penampung: <strong>11120010</strong>
                      </div>
                      <div style={{ fontSize: 12, color: "#3fb950", marginTop: 4, fontWeight: 600 }}>
                        ✓ Scanner QRIS Pelanggan Terdeteksi
                      </div>
                    </div>
                  </div>

                  <button
                    style={{
                      width: "100%",
                      backgroundColor: "#238636",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: 8,
                      padding: "14px",
                      fontSize: 16,
                      fontWeight: 800,
                      boxShadow: "0 0 20px rgba(35, 134, 54, 0.4)",
                    }}
                  >
                    Validasi Pembayaran QRIS (Rp 112.500)
                  </button>
                </div>
              </div>
            )}

            {isPaidReceipt && (
              /* SCREEN 3: OFFICIAL RECEIPT & LIVE STOCK MUTATION (TRX-202611-0002) */
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                {/* Left: Official POS Receipt */}
                <div
                  style={{
                    backgroundColor: "#0d1117",
                    border: "1px solid #238636",
                    borderRadius: 10,
                    padding: 24,
                  }}
                >
                  <div style={{ textAlign: "center", borderBottom: "1px dashed #30363d", paddingBottom: 14, marginBottom: 14 }}>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#f0f6fc" }}>
                      TOKO SPREI JENDRAL
                    </h3>
                    <span style={{ fontSize: 12, color: "#8b949e" }}>
                      Pusat Sprei &amp; Bedcover Berkualitas
                    </span>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#58a6ff", marginTop: 6 }}>
                      STRUK: TRX-202611-0002
                    </div>
                    <span style={{ fontSize: 11, color: "#8b949e" }}>
                      Odoo Record ID: #35 • Pelanggan: Ibu Sinta
                    </span>
                  </div>

                  <div style={{ borderBottom: "1px dashed #30363d", paddingBottom: 12, marginBottom: 12, fontSize: 13 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ color: "#f0f6fc" }}>1x Sprei XL (180 × 200)</span>
                      <span style={{ color: "#f0f6fc", fontWeight: 700 }}>Rp 112.500</span>
                    </div>
                  </div>

                  <div style={{ fontSize: 13 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ color: "#8b949e" }}>Metode Bayar:</span>
                      <span style={{ color: "#3fb950", fontWeight: 700 }}>QRIS Dinamis</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ color: "#8b949e" }}>Status:</span>
                      <span style={{ color: "#3fb950", fontWeight: 800 }}>LUNAS (PAID)</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, paddingTop: 8, borderTop: "1px solid #21262d" }}>
                      <span style={{ color: "#f0f6fc", fontWeight: 700 }}>Total:</span>
                      <span style={{ color: "#3fb950", fontWeight: 800 }}>Rp 112.500</span>
                    </div>
                  </div>
                </div>

                {/* Right: Live Stock & Margin Sync Panel */}
                <div
                  style={{
                    backgroundColor: "#0d1117",
                    border: "1px solid #30363d",
                    borderRadius: 10,
                    padding: 24,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: 13, fontWeight: 700, color: "#8b949e", marginBottom: 14 }}>
                      Sinkronisasi Database Live (sage.odoo.com):
                    </h4>

                    {/* Stock Reduction Card */}
                    <div
                      style={{
                        padding: 14,
                        backgroundColor: "#161b22",
                        borderRadius: 8,
                        border: "1px solid #21262d",
                        marginBottom: 12,
                      }}
                    >
                      <span style={{ fontSize: 12, color: "#8b949e" }}>Stok Rak Etalase Kasir:</span>
                      <div style={{ fontSize: 20, fontWeight: 800, color: "#58a6ff", marginTop: 4 }}>
                        10 Pcs <span style={{ color: "#f85149" }}>➔ 9 Pcs</span> (Tersisa)
                      </div>
                      <span style={{ fontSize: 11, color: "#8b949e" }}>
                        Mode: Physical Allocation • Terpotong 1 pcs langsung di kasir
                      </span>
                    </div>

                    {/* Realized Profit Card */}
                    <div
                      style={{
                        padding: 14,
                        backgroundColor: "#161b22",
                        borderRadius: 8,
                        border: "1px solid #21262d",
                      }}
                    >
                      <span style={{ fontSize: 12, color: "#8b949e" }}>Realisasi Laba Kotor Kasir:</span>
                      <div style={{ fontSize: 22, fontWeight: 800, color: "#3fb950", marginTop: 4 }}>
                        +Rp 37.500,00
                      </div>
                      <span style={{ fontSize: 11, color: "#8b949e" }}>
                        Omzet Rp 112.500 dikurangi HPP Rp 75.000 = Margin 50%
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      padding: 12,
                      backgroundColor: "rgba(35, 134, 54, 0.15)",
                      border: "1px solid #238636",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      color: "#3fb950",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    <CheckCircleIcon size={18} />
                    <span>Sinkronisasi Sukses 100%: Record #35 Live di sage.odoo.com</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <TutorialCallout
        step={isPaymentScreen ? 2 : isPaidReceipt ? 3 : 1}
        title={
          isPaymentScreen
            ? "Pembayaran QRIS Merchant (Kliring 11120010)"
            : isPaidReceipt
            ? "Struk TRX-202611-0002 & Mutasi Stok Rak (9 Pcs)"
            : "Checkout Kasir POS Sprei XL (180x200)"
        }
        description={
          isPaymentScreen
            ? "Pelanggan Ibu Sinta memindai kode QRIS dinamis kasir senilai Rp 112.500 yang langsung masuk ke akun penampung 11120010."
            : isPaidReceipt
            ? "Struk TRX-202611-0002 terbit resmi. Stok kuota rak kasir di sage.odoo.com otomatis terpotong dari 10 menjadi 9 pcs, dan laba kotor Rp 37.500 terealisasi."
            : "Memilih produk Sprei XL yang baru saja dialokasikan dari hasil jahit konveksi. Kuota rak awal: 10 Pcs siap jual."
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
