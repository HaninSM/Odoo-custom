import React from "react";
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { MacWindow } from "../components/MacWindow";
import { Badge } from "../components/Badge";
import { TruckIcon } from "../components/Icons";

export const Scene2Purchase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 15 } });
  const batchEnter = spring({ frame: frame - 40, fps, config: { damping: 14 } });
  const billEnter = spring({ frame: frame - 80, fps, config: { damping: 14 } });

  // Calculating counter for 60m
  const meterCount = Math.floor(interpolate(frame, [20, 60], [0, 60], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

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
          title="Inbound Restock & Hutang Dagang (x_pos_purchase) — PO-202611-0001"
          subtitle="Konversi Satuan Grosir ke Gudang, Pembentukan Batch FIFO & Tagihan AP 30 Hari"
          badge={<Badge label="Status: DONE" variant="green" />}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 28 }}>
            {/* Left Column: PO Document */}
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
                    backgroundColor: "rgba(16, 185, 129, 0.15)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#34d399",
                  }}
                >
                  <TruckIcon size={28} color="#34d399" />
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#ffffff" }}>
                    PT. Tekstil Maju Jaya
                  </div>
                  <div style={{ fontSize: 14, color: "#94a3b8", marginTop: 2 }}>
                    Vendor Utama Kain Sprei • Tgl PO: 01 Nov 2026
                  </div>
                </div>
              </div>

              {/* Items Breakdown Table */}
              <div
                style={{
                  marginTop: 22,
                  borderRadius: 14,
                  backgroundColor: "rgba(15, 23, 42, 0.7)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  padding: "16px 20px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8", fontSize: 13, textTransform: "uppercase" }}>
                  <span>Barang & Satuan Grosir</span>
                  <span>Total Tagihan PO</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#ffffff" }}>
                      Kain Katun Sprei "XXX"
                    </div>
                    <div style={{ fontSize: 14, color: "#60a5fa", marginTop: 2 }}>
                      1 Kodi (Faktor Konversi: 60 Meter/Kodi)
                    </div>
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "#f8fafc" }}>
                    Rp 1.200.000
                  </div>
                </div>
              </div>

              {/* Live Formula Computation */}
              <div
                style={{
                  marginTop: 18,
                  padding: "16px 20px",
                  borderRadius: 14,
                  backgroundColor: "rgba(26, 98, 255, 0.1)",
                  border: "1px solid rgba(59, 130, 246, 0.3)",
                }}
              >
                <div style={{ fontSize: 13, color: "#60a5fa", fontWeight: 700, textTransform: "uppercase" }}>
                  Kalkulasi Otomatis Sistem:
                </div>
                <div style={{ fontSize: 17, color: "#e2e8f0", marginTop: 6 }}>
                  1 Kodi = <strong style={{ color: "#38bdf8" }}>{meterCount} Meter</strong> Masuk Gudang
                </div>
                <div style={{ fontSize: 16, color: "#cbd5e1", marginTop: 4 }}>
                  HPP Satuan Gudang = Rp 1.200.000 / 60m = <strong style={{ color: "#34d399" }}>Rp 20.000 / meter</strong>
                </div>
              </div>
            </div>

            {/* Right Column: Output Artifacts (FIFO Batch + Vendor Bill) */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Card 1: Batch 1 FIFO */}
              <div
                style={{
                  opacity: Math.max(0, batchEnter),
                  transform: `translateX(${(1 - Math.max(0, batchEnter)) * 30}px)`,
                  backgroundColor: "rgba(30, 41, 59, 0.45)",
                  borderRadius: 18,
                  padding: "20px 24px",
                  border: "1px solid rgba(59, 130, 246, 0.3)",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#38bdf8" }} />
                    <span style={{ fontSize: 18, fontWeight: 700, color: "#ffffff" }}>
                      Terbit Kartu Persediaan FIFO (Batch 1)
                    </span>
                  </div>
                  <Badge label="Prioritas 1 (Oldest)" variant="blue" fontSize={12} />
                </div>
                <div style={{ display: "flex", gap: 16, marginTop: 14 }}>
                  <div style={{ flex: 1, backgroundColor: "rgba(15, 23, 42, 0.6)", padding: "10px 16px", borderRadius: 12 }}>
                    <div style={{ fontSize: 12, color: "#94a3b8" }}>Stok Tersedia</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#38bdf8" }}>60 Meter</div>
                  </div>
                  <div style={{ flex: 1, backgroundColor: "rgba(15, 23, 42, 0.6)", padding: "10px 16px", borderRadius: 12 }}>
                    <div style={{ fontSize: 12, color: "#94a3b8" }}>HPP Terkunci</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#34d399" }}>Rp 20.000 / m</div>
                  </div>
                </div>
              </div>

              {/* Card 2: Vendor Bill AP Net 30 */}
              <div
                style={{
                  opacity: Math.max(0, billEnter),
                  transform: `translateX(${(1 - Math.max(0, billEnter)) * 30}px)`,
                  backgroundColor: "rgba(30, 41, 59, 0.45)",
                  borderRadius: 18,
                  padding: "20px 24px",
                  border: "1px solid rgba(239, 68, 68, 0.35)",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#f87171" }} />
                    <span style={{ fontSize: 18, fontWeight: 700, color: "#ffffff" }}>
                      Tagihan Hutang Supplier (Vendor Bill)
                    </span>
                  </div>
                  <Badge label="Belum Lunas (Not Paid)" variant="red" fontSize={12} />
                </div>
                <div style={{ display: "flex", gap: 16, marginTop: 14 }}>
                  <div style={{ flex: 1, backgroundColor: "rgba(15, 23, 42, 0.6)", padding: "10px 16px", borderRadius: 12 }}>
                    <div style={{ fontSize: 12, color: "#94a3b8" }}>Termin Pembayaran</div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: "#f87171" }}>Tempo Net 30 Days</div>
                  </div>
                  <div style={{ flex: 1, backgroundColor: "rgba(15, 23, 42, 0.6)", padding: "10px 16px", borderRadius: 12 }}>
                    <div style={{ fontSize: 12, color: "#94a3b8" }}>Jatuh Tempo</div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: "#fbbf24" }}>01 Des 2026</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MacWindow>
      </div>
    </div>
  );
};
