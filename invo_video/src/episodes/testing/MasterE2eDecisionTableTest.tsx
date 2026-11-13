import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { OdooNavBar } from "../../components/OdooNavBar";
import { Cursor } from "../../components/Cursor";
import { TutorialCallout } from "../../components/TutorialCallout";
import { Badge } from "../../components/Badge";
import { CheckCircleIcon, BoxIcon, TruckIcon, ScissorsIcon, ShoppingCartIcon, ChartIcon } from "../../components/Icons";
import { TutorialProps } from "../../types";

export const MASTER_E2E_DECISION_TABLE_DURATION = 900; // 30 Detik @ 30 FPS

export const MasterE2eDecisionTableTest: React.FC<TutorialProps> = () => {
  const frame = useCurrentFrame();

  // Highlight stage depending on frame
  // 0-180: Stage 1 (Hulu)
  // 180-360: Stage 2 (Tengah)
  // 360-540: Stage 3 (Hilir)
  // 540-720: Stage 4 (Muara)
  // 720-900: Stage 5 (Pelengkap & Final Summary)
  const activeStage =
    frame < 180 ? 1 :
    frame < 360 ? 2 :
    frame < 540 ? 3 :
    frame < 720 ? 4 : 5;

  // Cursor movements across the 5 test stages
  let cursorX = 350;
  let cursorY = 280;
  let cursorLabel = "";
  let isClicking = false;
  let clickFrame = 0;

  if (frame < 180) {
    cursorX = interpolate(frame, [0, 80], [300, 480], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [0, 80], [220, 310], { extrapolateRight: "clamp" });
    cursorLabel = "Uji Tahap 1 Hulu: PO-202611-0001, Batch 1 FIFO 60m @ Rp 20k -> PASS";
    if (frame >= 95 && frame <= 103) {
      isClicking = true;
      clickFrame = 99;
    }
  } else if (frame < 360) {
    cursorX = interpolate(frame, [180, 260], [480, 520], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [180, 260], [310, 430], { extrapolateRight: "clamp" });
    cursorLabel = "Uji Tahap 2 Tengah: SPK Potong 30m, HPP Rp 75k, Alokasi Rak +10 Pcs -> PASS";
    if (frame >= 275 && frame <= 283) {
      isClicking = true;
      clickFrame = 279;
    }
  } else if (frame < 540) {
    cursorX = interpolate(frame, [360, 440], [520, 560], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [360, 440], [430, 550], { extrapolateRight: "clamp" });
    cursorLabel = "Uji Tahap 3 Hilir: Kasir POS TRX-202611-0002, QRIS Rp 112.500, Stok Rak 9 Pcs -> PASS";
    if (frame >= 455 && frame <= 463) {
      isClicking = true;
      clickFrame = 459;
    }
  } else if (frame < 720) {
    cursorX = interpolate(frame, [540, 620], [560, 600], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [540, 620], [550, 670], { extrapolateRight: "clamp" });
    cursorLabel = "Uji Tahap 4 Muara: Rekening Kliring QRIS 11120010 & Aging AP Net 30 -> PASS";
    if (frame >= 635 && frame <= 643) {
      isClicking = true;
      clickFrame = 639;
    }
  } else {
    cursorX = interpolate(frame, [720, 800], [600, 1450], { extrapolateRight: "clamp" });
    cursorY = interpolate(frame, [720, 800], [670, 480], { extrapolateRight: "clamp" });
    cursorLabel = "Uji Tahap 5 Pelengkap: Beban Listrik Toko -Rp 15k, Laba Bersih Rp 22.5k -> 100% VALID!";
    if (frame >= 810 && frame <= 818) {
      isClicking = true;
      clickFrame = 814;
    }
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
        activeMenu="🧪 Testing Suite"
        breadcrumbModel="ISTQB Decision Table Test Runner"
        breadcrumbRecord="Full E2E Live Verification (sage.odoo.com)"
      />

      <div
        style={{
          position: "absolute",
          top: 18,
          right: 36,
          backgroundColor: "rgba(15, 23, 42, 0.9)",
          border: "1px solid rgba(16, 185, 129, 0.6)",
          borderRadius: 8,
          padding: "5px 14px",
          color: "#34d399",
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: "0.06em",
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#10b981", display: "inline-block", boxShadow: "0 0 10px #10b981" }} />
        LIVE SYNC: SAGE.ODOO.COM (ALL 5 STAGES PASS 100%)
      </div>

      <div
        style={{
          flex: 1,
          padding: "20px 48px 60px 48px",
          display: "flex",
          gap: 28,
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        {/* Left Column: 5 Decision Table Test Stages */}
        <div
          style={{
            flex: 1.35,
            backgroundColor: "#161b22",
            borderRadius: 12,
            border: "1px solid #30363d",
            padding: 24,
            boxShadow: "0 12px 36px rgba(0,0,0,0.45)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, paddingBottom: 14, borderBottom: "1px solid #21262d" }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#f0f6fc", display: "flex", alignItems: "center", gap: 10 }}>
                📋 ISTQB Decision Table E2E Test Execution
              </div>
              <div style={{ fontSize: 13, color: "#8b949e", marginTop: 4 }}>
                Odoo 20.0 Enterprise • Database: sage • User: hanindyo.kusuma@yahoo.co.id (UID 2)
              </div>
            </div>
            <Badge text="5 / 5 TEST SUITES PASSED" variant="success" />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Stage 1: Hulu */}
            <div
              style={{
                backgroundColor: activeStage === 1 ? "rgba(56, 189, 248, 0.08)" : "#0d1117",
                border: activeStage === 1 ? "1.5px solid #38bdf8" : "1px solid #21262d",
                borderRadius: 10,
                padding: "14px 18px",
                transition: "all 0.3s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ padding: 8, borderRadius: 8, backgroundColor: "rgba(56, 189, 248, 0.15)", color: "#38bdf8" }}>
                    <TruckIcon size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#f0f6fc" }}>
                      1. Tahap Hulu — Pengadaan Bahan & Kartu Batch FIFO
                    </div>
                    <div style={{ fontSize: 12, color: "#8b949e", marginTop: 2 }}>
                      PO-202611-0001 • PT. Tekstil Maju Jaya • 1 Kodi (60m @ Rp 20k) • Vendor Bill Net 30
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#34d399", backgroundColor: "rgba(16, 185, 129, 0.15)", padding: "4px 10px", borderRadius: 6, border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                    ✓ PASS (Batch #25: 60m)
                  </span>
                </div>
              </div>
            </div>

            {/* Stage 2: Tengah */}
            <div
              style={{
                backgroundColor: activeStage === 2 ? "rgba(168, 85, 247, 0.08)" : "#0d1117",
                border: activeStage === 2 ? "1.5px solid #a855f7" : "1px solid #21262d",
                borderRadius: 10,
                padding: "14px 18px",
                transition: "all 0.3s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ padding: 8, borderRadius: 8, backgroundColor: "rgba(168, 85, 247, 0.15)", color: "#c084fc" }}>
                    <ScissorsIcon size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#f0f6fc" }}>
                      2. Tahap Tengah — Konveksi SPK, HPP Komposit & Alokasi Rak
                    </div>
                    <div style={{ fontSize: 12, color: "#8b949e", marginTop: 2 }}>
                      SPK/2026/0001 • Potong 30m dari Batch 1 • Jahit 10k + Aks 5k = HPP Rp 75k • Kuota Rak +10 Pcs
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#34d399", backgroundColor: "rgba(16, 185, 129, 0.15)", padding: "4px 10px", borderRadius: 6, border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                    ✓ PASS (HPP Rp 75k)
                  </span>
                </div>
              </div>
            </div>

            {/* Stage 3: Hilir */}
            <div
              style={{
                backgroundColor: activeStage === 3 ? "rgba(16, 185, 129, 0.08)" : "#0d1117",
                border: activeStage === 3 ? "1.5px solid #10b981" : "1px solid #21262d",
                borderRadius: 10,
                padding: "14px 18px",
                transition: "all 0.3s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ padding: 8, borderRadius: 8, backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#34d399" }}>
                    <ShoppingCartIcon size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#f0f6fc" }}>
                      3. Tahap Hilir — Kasir POS Checkout & Mutasi Stok Rak
                    </div>
                    <div style={{ fontSize: 12, color: "#8b949e", marginTop: 2 }}>
                      Struk TRX-202611-0002 • Pelanggan: Ibu Sinta • QRIS Dinamis Rp 112.500 • Rak Kasir 10 → 9 Pcs
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#34d399", backgroundColor: "rgba(16, 185, 129, 0.15)", padding: "4px 10px", borderRadius: 6, border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                    ✓ PASS (Rak: 9 Pcs)
                  </span>
                </div>
              </div>
            </div>

            {/* Stage 4: Muara */}
            <div
              style={{
                backgroundColor: activeStage === 4 ? "rgba(245, 158, 11, 0.08)" : "#0d1117",
                border: activeStage === 4 ? "1.5px solid #f59e0b" : "1px solid #21262d",
                borderRadius: 10,
                padding: "14px 18px",
                transition: "all 0.3s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ padding: 8, borderRadius: 8, backgroundColor: "rgba(245, 158, 11, 0.15)", color: "#fbbf24" }}>
                    <ChartIcon size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#f0f6fc" }}>
                      4. Tahap Muara — Rekening Kliring QRIS & Kontrol Aging AP
                    </div>
                    <div style={{ fontSize: 12, color: "#8b949e", marginTop: 2 }}>
                      Kliring Akun 11120010 (+Rp 112.500) • Giro Bank Mandiri [BNK1] • Aged Payables Lancar
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#34d399", backgroundColor: "rgba(16, 185, 129, 0.15)", padding: "4px 10px", borderRadius: 6, border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                    ✓ PASS (Kliring OK)
                  </span>
                </div>
              </div>
            </div>

            {/* Stage 5: Pelengkap */}
            <div
              style={{
                backgroundColor: activeStage === 5 ? "rgba(16, 185, 129, 0.12)" : "#0d1117",
                border: activeStage === 5 ? "1.5px solid #10b981" : "1px solid #21262d",
                borderRadius: 10,
                padding: "14px 18px",
                transition: "all 0.3s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ padding: 8, borderRadius: 8, backgroundColor: "rgba(16, 185, 129, 0.2)", color: "#34d399" }}>
                    <CheckCircleIcon size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#f0f6fc" }}>
                      5. Tahap Pelengkap — Beban Listrik, Laba Bersih & Pelunasan Vendor
                    </div>
                    <div style={{ fontSize: 12, color: "#8b949e", marginTop: 2 }}>
                      Laba Kotor Rp 37.5k - Listrik Rp 15k = Laba Bersih Rp 22.500 • Pelunasan Bill Status: PAID
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#34d399", backgroundColor: "rgba(16, 185, 129, 0.15)", padding: "4px 10px", borderRadius: 6, border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                    ✓ PASS (Net Rp 22.5k)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Telemetry & Decision Table Matrix */}
        <div style={{ flex: 1.0, display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Live Telemetry Card */}
          <div
            style={{
              backgroundColor: "#161b22",
              borderRadius: 12,
              border: "1px solid #30363d",
              padding: 22,
              boxShadow: "0 12px 36px rgba(0,0,0,0.45)",
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 700, color: "#f0f6fc", display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <span style={{ color: "#38bdf8" }}>⚡</span> Live Telemetry (sage.odoo.com)
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div style={{ backgroundColor: "#0d1117", padding: "10px 12px", borderRadius: 8, border: "1px solid #21262d" }}>
                <div style={{ fontSize: 11, color: "#8b949e" }}>PO Pembelian</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#58a6ff", marginTop: 2 }}>PO-202611-0001</div>
                <div style={{ fontSize: 11, color: "#34d399" }}>Rp 1.200.000</div>
              </div>

              <div style={{ backgroundColor: "#0d1117", padding: "10px 12px", borderRadius: 8, border: "1px solid #21262d" }}>
                <div style={{ fontSize: 11, color: "#8b949e" }}>Batch 1 FIFO (Sisa)</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#f0f6fc", marginTop: 2 }}>30.0 / 60.0 Meter</div>
                <div style={{ fontSize: 11, color: "#fbbf24" }}>ID 25 • Potong 30m</div>
              </div>

              <div style={{ backgroundColor: "#0d1117", padding: "10px 12px", borderRadius: 8, border: "1px solid #21262d" }}>
                <div style={{ fontSize: 11, color: "#8b949e" }}>SPK Selesai & HPP</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#c084fc", marginTop: 2 }}>SPK/2026/0001</div>
                <div style={{ fontSize: 11, color: "#34d399" }}>Rp 75.000 / Pcs</div>
              </div>

              <div style={{ backgroundColor: "#0d1117", padding: "10px 12px", borderRadius: 8, border: "1px solid #21262d" }}>
                <div style={{ fontSize: 11, color: "#8b949e" }}>Stok Rak Sprei XL</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#34d399", marginTop: 2 }}>9 Pcs Siap Jual</div>
                <div style={{ fontSize: 11, color: "#8b949e" }}>10 - 1 = 9 Pcs</div>
              </div>

              <div style={{ backgroundColor: "#0d1117", padding: "10px 12px", borderRadius: 8, border: "1px solid #21262d" }}>
                <div style={{ fontSize: 11, color: "#8b949e" }}>Checkout POS (QRIS)</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#f0f6fc", marginTop: 2 }}>TRX-202611-0002</div>
                <div style={{ fontSize: 11, color: "#34d399" }}>Rp 112.500 (PAID)</div>
              </div>

              <div style={{ backgroundColor: "rgba(16, 185, 129, 0.1)", padding: "10px 12px", borderRadius: 8, border: "1px solid rgba(16, 185, 129, 0.4)" }}>
                <div style={{ fontSize: 11, color: "#34d399", fontWeight: 600 }}>Laba Bersih Toko</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#34d399", marginTop: 2 }}>+Rp 22.500</div>
                <div style={{ fontSize: 11, color: "#8b949e" }}>Net Operasional</div>
              </div>
            </div>
          </div>

          {/* ISTQB Decision Table Verification Card */}
          <div
            style={{
              backgroundColor: "#161b22",
              borderRadius: 12,
              border: "1px solid #30363d",
              padding: 20,
              boxShadow: "0 12px 36px rgba(0,0,0,0.45)",
            }}
          >
            <div style={{ fontSize: 15, fontWeight: 700, color: "#f0f6fc", marginBottom: 12 }}>
              🎯 ISTQB Decision Table Matrix Compliance
            </div>
            <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ color: "#8b949e", borderBottom: "1px solid #30363d", textAlign: "left" }}>
                  <th style={{ padding: "6px 8px" }}>Rule</th>
                  <th style={{ padding: "6px 8px" }}>Condition</th>
                  <th style={{ padding: "6px 8px" }}>Action</th>
                  <th style={{ padding: "6px 8px", textAlign: "right" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid #21262d", color: "#f0f6fc" }}>
                  <td style={{ padding: "8px" }}><strong style={{ color: "#38bdf8" }}>R1</strong></td>
                  <td style={{ padding: "8px" }}>PO 1 Kodi received</td>
                  <td style={{ padding: "8px" }}>Kartu Batch 60m aktif</td>
                  <td style={{ padding: "8px", textAlign: "right", color: "#34d399", fontWeight: 700 }}>PASS</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #21262d", color: "#f0f6fc" }}>
                  <td style={{ padding: "8px" }}><strong style={{ color: "#c084fc" }}>R2</strong></td>
                  <td style={{ padding: "8px" }}>SPK 10 pcs Sprei XL</td>
                  <td style={{ padding: "8px" }}>Potong 30m FIFO, HPP 75k</td>
                  <td style={{ padding: "8px", textAlign: "right", color: "#34d399", fontWeight: 700 }}>PASS</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #21262d", color: "#f0f6fc" }}>
                  <td style={{ padding: "8px" }}><strong style={{ color: "#34d399" }}>R3</strong></td>
                  <td style={{ padding: "8px" }}>Kasir POS jual 1 pcs</td>
                  <td style={{ padding: "8px" }}>QRIS 112.5k, Rak sisa 9</td>
                  <td style={{ padding: "8px", textAlign: "right", color: "#34d399", fontWeight: 700 }}>PASS</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #21262d", color: "#f0f6fc" }}>
                  <td style={{ padding: "8px" }}><strong style={{ color: "#fbbf24" }}>R4</strong></td>
                  <td style={{ padding: "8px" }}>Settlement QRIS</td>
                  <td style={{ padding: "8px" }}>Kliring 11120010 Mandiri</td>
                  <td style={{ padding: "8px", textAlign: "right", color: "#34d399", fontWeight: 700 }}>PASS</td>
                </tr>
                <tr style={{ color: "#f0f6fc" }}>
                  <td style={{ padding: "8px" }}><strong style={{ color: "#10b981" }}>R5</strong></td>
                  <td style={{ padding: "8px" }}>Beban listrik toko</td>
                  <td style={{ padding: "8px" }}>Net profit Rp 22.500</td>
                  <td style={{ padding: "8px", textAlign: "right", color: "#34d399", fontWeight: 700 }}>PASS</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Floating Tutorial Callout */}
      <TutorialCallout
        title="Live Decision Table E2E Test Suite"
        description={
          activeStage === 1
            ? "Tahap Hulu: Memverifikasi PO Pembelian Bahan Baku 1 Kodi, Batch FIFO 60m @ Rp 20k/m dan Tagihan Vendor Bill Net 30."
            : activeStage === 2
            ? "Tahap Tengah: Memotong 30m kain dari Batch 1, menghitung HPP Komposit Rp 75.000/pcs, dan mengalokasikan 10 pcs ke rak kasir."
            : activeStage === 3
            ? "Tahap Hilir: Kasir POS menjual 1 pcs Sprei XL via QRIS Dinamis Rp 112.500, memotong stok rak menjadi 9 pcs, laba kotor +Rp 37.500."
            : activeStage === 4
            ? "Tahap Muara: Mutasi rekening kliring QRIS 11120010 ke Giro Mandiri dan kontrol aging hutang dagang (19 hari lancar)."
            : "Tahap Pelengkap: Rekonsiliasi beban operasional listrik kasir Rp 15.000 menghasilkan Laba Bersih Final Rp 22.500 (100% PASS)."
        }
        stepNumber={activeStage}
        totalSteps={5}
      />

      {/* Animated Cursor */}
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
