import React from "react";
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { MacWindow } from "../components/MacWindow";
import { Badge } from "../components/Badge";
import { ScissorsIcon, CheckCircleIcon } from "../components/Icons";

export const Scene3Production: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 15 } });
  const cutProgress = interpolate(frame, [15, 60], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const hppSpring = spring({ frame: frame - 60, fps, config: { damping: 14 } });
  const shelfSpring = spring({ frame: frame - 100, fps, config: { damping: 14 } });

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
          title="✂️ Konveksi Make-to-Stock & HPP Komposit (x_pos_production) — PRD-202611-0001"
          subtitle="Potong Kain FIFO Tertua + Ongkos Jahit + Aksesoris = Mengunci HPP Sprei Jadi di Rak"
          badge={<Badge label="Status: DONE" variant="green" />}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 28 }}>
            {/* Left: Input & FIFO Cut */}
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
                    backgroundColor: "rgba(245, 158, 11, 0.15)",
                    border: "1px solid rgba(245, 158, 11, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fbbf24",
                  }}
                >
                  <ScissorsIcon size={28} color="#fbbf24" />
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#ffffff" }}>
                    Jahit Sprei XL (180 × 200)
                  </div>
                  <div style={{ fontSize: 14, color: "#94a3b8", marginTop: 2 }}>
                    Target Produksi: <strong style={{ color: "#f8fafc" }}>10 Pcs Jadi</strong> • Pola: 3.0 m/pcs
                  </div>
                </div>
              </div>

              {/* FIFO Deduct Box */}
              <div
                style={{
                  marginTop: 20,
                  backgroundColor: "rgba(15, 23, 42, 0.7)",
                  borderRadius: 16,
                  padding: "16px 20px",
                  border: "1px solid rgba(59, 130, 246, 0.25)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: "#94a3b8", textTransform: "uppercase" }}>
                    Pemotongan Kain FIFO Terpilih
                  </span>
                  <Badge label="Batch 1 @ Rp 20.000/m" variant="blue" fontSize={12} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#38bdf8" }}>
                      10 pcs × 3.0m = 30 Meter
                    </div>
                    <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>
                      Sisa Batch 1 di Gudang: 30 Meter
                    </div>
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#ffffff" }}>
                    Rp 600.000
                  </div>
                </div>

                {/* Progress bar cutting */}
                <div style={{ width: "100%", height: 6, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 3, marginTop: 14, overflow: "hidden" }}>
                  <div style={{ width: `${cutProgress}%`, height: "100%", backgroundColor: "#38bdf8" }} />
                </div>
              </div>

              {/* Additional Direct Costs */}
              <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ backgroundColor: "rgba(15, 23, 42, 0.6)", padding: "12px 16px", borderRadius: 12 }}>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>✂️ Upah Jahit Borongan</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#ffffff", marginTop: 4 }}>
                    10 pcs @ Rp 10.000
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#cbd5e1" }}>= Rp 100.000</div>
                </div>

                <div style={{ backgroundColor: "rgba(15, 23, 42, 0.6)", padding: "12px 16px", borderRadius: 12 }}>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>📦 Karet & Tas Kemasan</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#ffffff", marginTop: 4 }}>
                    10 pcs @ Rp 5.000
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#cbd5e1" }}>= Rp 50.000</div>
                </div>
              </div>
            </div>

            {/* Right: Composite Cost & Shelf Allocation */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Cost Summary Card */}
              <div
                style={{
                  opacity: Math.max(0, hppSpring),
                  transform: `translateX(${(1 - Math.max(0, hppSpring)) * 30}px)`,
                  backgroundColor: "rgba(26, 98, 255, 0.12)",
                  borderRadius: 18,
                  padding: "20px 24px",
                  border: "2px solid #3b82f6",
                  boxShadow: "0 10px 30px rgba(26, 98, 255, 0.25)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#60a5fa", textTransform: "uppercase" }}>
                    Akumulasi Biaya HPP Komposit
                  </span>
                  <Badge label="Terkunci Presisi" variant="green" fontSize={12} />
                </div>
                <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <div style={{ fontSize: 13, color: "#94a3b8" }}>Total Biaya Produksi:</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: "#ffffff" }}>Rp 750.000</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 13, color: "#94a3b8" }}>HPP Sprei XL / pcs:</div>
                    <div style={{ fontSize: 32, fontWeight: 900, color: "#34d399" }}>Rp 75.000</div>
                  </div>
                </div>
              </div>

              {/* Shelf Allocation Card */}
              <div
                style={{
                  opacity: Math.max(0, shelfSpring),
                  transform: `translateX(${(1 - Math.max(0, shelfSpring)) * 30}px)`,
                  backgroundColor: "rgba(30, 41, 59, 0.45)",
                  borderRadius: 18,
                  padding: "20px 24px",
                  border: "1px solid rgba(16, 185, 129, 0.35)",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <CheckCircleIcon size={20} color="#34d399" />
                    <span style={{ fontSize: 18, fontWeight: 700, color: "#ffffff" }}>
                      Alokasi Fisik Rak Toko
                    </span>
                  </div>
                  <Badge label="Mode: ALLOCATED" variant="amber" fontSize={12} />
                </div>

                <div style={{ display: "flex", gap: 16, marginTop: 14 }}>
                  <div style={{ flex: 1, backgroundColor: "rgba(15, 23, 42, 0.6)", padding: "10px 16px", borderRadius: 12 }}>
                    <div style={{ fontSize: 12, color: "#94a3b8" }}>Stok Siap Jual di Rak</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "#38bdf8" }}>+10 Pcs</div>
                  </div>
                  <div style={{ flex: 1, backgroundColor: "rgba(15, 23, 42, 0.6)", padding: "10px 16px", borderRadius: 12 }}>
                    <div style={{ fontSize: 12, color: "#94a3b8" }}>Harga Jual Kasir (+50%)</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "#fbbf24" }}>Rp 112.500</div>
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
