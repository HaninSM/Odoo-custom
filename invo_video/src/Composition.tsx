import React from "react";
import { Composition } from "remotion";
import { MainTutorial, TOTAL_DURATION } from "./MainTutorial";
import { Episode1Gudang, EPISODE1_DURATION } from "./episodes/Episode1Gudang";
import { Episode2Konveksi } from "./episodes/Episode2Konveksi";
import { Episode3Kasir } from "./episodes/Episode3Kasir";
import { Episode4Keuangan } from "./episodes/Episode4Keuangan";
import { Episode5Pelengkap, EPISODE5_DURATION } from "./episodes/Episode5Pelengkap";
import { PanduanAkuntansiLengkap, PANDUAN_AKUNTANSI_DURATION } from "./episodes/PanduanAkuntansiLengkap";
import { AccEp1Dashboard, ACC_EP1_DURATION } from "./episodes/accounting/AccEp1Dashboard";
import { AccEp2VendorBills, ACC_EP2_DURATION } from "./episodes/accounting/AccEp2VendorBills";
import { AccEp3RegisterPayment, ACC_EP3_DURATION } from "./episodes/accounting/AccEp3RegisterPayment";
import { AccEp4JournalEntries, ACC_EP4_DURATION } from "./episodes/accounting/AccEp4JournalEntries";
import { AccEp5QrisClearing, ACC_EP5_DURATION } from "./episodes/accounting/AccEp5QrisClearing";
import { AccEp6Expenses, ACC_EP6_DURATION } from "./episodes/accounting/AccEp6Expenses";
import { AccEp7ProfitLoss, ACC_EP7_DURATION } from "./episodes/accounting/AccEp7ProfitLoss";
import { AccEp8BalanceSheet, ACC_EP8_DURATION } from "./episodes/accounting/AccEp8BalanceSheet";
import { AccEp9AgedPayables, ACC_EP9_DURATION } from "./episodes/accounting/AccEp9AgedPayables";
import { AccEp10CreditNotes, ACC_EP10_DURATION } from "./episodes/accounting/AccEp10CreditNotes";
import { MrpEp1TextileBomSpk, MRP_EP1_DURATION } from "./episodes/mrp/MrpEp1TextileBomSpk";
import { LivePosCheckoutSpreiXl, LIVE_POS_CHECKOUT_DURATION } from "./episodes/pos/LivePosCheckoutSpreiXl";
import { tutorialSchema } from "./types";

const defaultProps = {
  appName: "Invo. POS Enterprise",
  version: "2.2.0",
  storeName: "Toko Sprei Jendral",
  cloudInstance: "sage.odoo.com",
  rawItemName: 'Kain Katun Sprei "XXX"',
  baseUom: "Meter (m)",
  vendorName: "PT. Tekstil Maju Jaya",
  poQuantity: 1,
  poUom: "Kodi (60 Meter)",
  poPrice: 1200000,
  paymentTerm: "Net 30 Days",
  poDueDate: "01 Des 2026",
  targetVariant: "Sprei XL (180 × 200)",
  targetQty: 10,
  meterPerUnit: 3.0,
  laborCostPerUnit: 10000,
  accCostPerUnit: 5000,
  compositeHpp: 75000,
  marginPct: 50,
  sellingPrice: 112500,
  cashierJournal: "QRIS & EDC Merchant [QRIS1]",
  qrisAccount: "11120010",
  realizedProfit: 37500,
};

export const InvoPosComposition: React.FC = () => {
  return (
    <>
      {/* 1. Master Composition: Full Supply Chain Walkthrough (75 Detik) */}
      <Composition
        id="InvoPosTutorial"
        component={MainTutorial}
        durationInFrames={TOTAL_DURATION}
        fps={30}
        width={1920}
        height={1080}
        schema={tutorialSchema}
        defaultProps={defaultProps}
      />

      {/* 2. Episode 1: Divisi Gudang & Pengadaan (30 Detik) */}
      <Composition
        id="Episode1-Gudang"
        component={Episode1Gudang}
        durationInFrames={EPISODE1_DURATION}
        fps={30}
        width={1920}
        height={1080}
        schema={tutorialSchema}
        defaultProps={defaultProps}
      />

      {/* 3. Episode 2: Divisi Konveksi & Jahit (22 Detik) */}
      <Composition
        id="Episode2-Konveksi"
        component={Episode2Konveksi}
        durationInFrames={660}
        fps={30}
        width={1920}
        height={1080}
        schema={tutorialSchema}
        defaultProps={defaultProps}
      />

      {/* 4. Episode 3: Divisi Kasir & Penjualan (22 Detik) */}
      <Composition
        id="Episode3-Kasir"
        component={Episode3Kasir}
        durationInFrames={660}
        fps={30}
        width={1920}
        height={1080}
        schema={tutorialSchema}
        defaultProps={defaultProps}
      />

      {/* 5. Episode 4: Divisi Keuangan & Akuntansi (20 Detik) */}
      <Composition
        id="Episode4-Keuangan"
        component={Episode4Keuangan}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
        schema={tutorialSchema}
        defaultProps={defaultProps}
      />

      {/* 6. Episode 5: Pelunasan Hutang & Laba Bersih Toko (22 Detik) */}
      <Composition
        id="Episode5-Pelengkap"
        component={Episode5Pelengkap}
        durationInFrames={EPISODE5_DURATION}
        fps={30}
        width={1920}
        height={1080}
        schema={tutorialSchema}
        defaultProps={defaultProps}
      />

      {/* 7. Panduan Lengkap Akuntansi & Keuangan Invo. POS (30 Detik) */}
      <Composition
        id="Panduan-Akuntansi-Lengkap"
        component={PanduanAkuntansiLengkap}
        durationInFrames={PANDUAN_AKUNTANSI_DURATION}
        fps={30}
        width={1920}
        height={1080}
        schema={tutorialSchema}
        defaultProps={defaultProps}
      />

      {/* 8. Akuntansi Ep 1: Accounting Dashboard & Ikhtisar POS */}
      <Composition
        id="AccEp1-Dashboard"
        component={AccEp1Dashboard}
        durationInFrames={ACC_EP1_DURATION}
        fps={30}
        width={1920}
        height={1080}
        schema={tutorialSchema}
        defaultProps={defaultProps}
      />

      {/* 9. Akuntansi Ep 2: Faktur Pembelian Vendor (Vendor Bills) */}
      <Composition
        id="AccEp2-VendorBills"
        component={AccEp2VendorBills}
        durationInFrames={ACC_EP2_DURATION}
        fps={30}
        width={1920}
        height={1080}
        schema={tutorialSchema}
        defaultProps={defaultProps}
      />

      {/* 10. Akuntansi Ep 3: Pelunasan Hutang via Bank (Register Payment) */}
      <Composition
        id="AccEp3-RegisterPayment"
        component={AccEp3RegisterPayment}
        durationInFrames={ACC_EP3_DURATION}
        fps={30}
        width={1920}
        height={1080}
        schema={tutorialSchema}
        defaultProps={defaultProps}
      />

      {/* 11. Akuntansi Ep 4: Jurnal Entri Double-Entry POS */}
      <Composition
        id="AccEp4-JournalEntries"
        component={AccEp4JournalEntries}
        durationInFrames={ACC_EP4_DURATION}
        fps={30}
        width={1920}
        height={1080}
        schema={tutorialSchema}
        defaultProps={defaultProps}
      />

      {/* 12. Akuntansi Ep 5: Kliring QRIS 11120010 & Rekonsiliasi Bank */}
      <Composition
        id="AccEp5-QrisClearing"
        component={AccEp5QrisClearing}
        durationInFrames={ACC_EP5_DURATION}
        fps={30}
        width={1920}
        height={1080}
        schema={tutorialSchema}
        defaultProps={defaultProps}
      />

      {/* 13. Akuntansi Ep 6: Pencatatan Beban Operasional Toko */}
      <Composition
        id="AccEp6-Expenses"
        component={AccEp6Expenses}
        durationInFrames={ACC_EP6_DURATION}
        fps={30}
        width={1920}
        height={1080}
        schema={tutorialSchema}
        defaultProps={defaultProps}
      />

      {/* 14. Akuntansi Ep 7: Laporan Laba Rugi Real-Time (Profit & Loss) */}
      <Composition
        id="AccEp7-ProfitLoss"
        component={AccEp7ProfitLoss}
        durationInFrames={ACC_EP7_DURATION}
        fps={30}
        width={1920}
        height={1080}
        schema={tutorialSchema}
        defaultProps={defaultProps}
      />

      {/* 15. Akuntansi Ep 8: Neraca Keuangan & Valuasi Persediaan */}
      <Composition
        id="AccEp8-BalanceSheet"
        component={AccEp8BalanceSheet}
        durationInFrames={ACC_EP8_DURATION}
        fps={30}
        width={1920}
        height={1080}
        schema={tutorialSchema}
        defaultProps={defaultProps}
      />

      {/* 16. Akuntansi Ep 9: Kontrol Umur Hutang Dagang (Aged Payables) */}
      <Composition
        id="AccEp9-AgedPayables"
        component={AccEp9AgedPayables}
        durationInFrames={ACC_EP9_DURATION}
        fps={30}
        width={1920}
        height={1080}
        schema={tutorialSchema}
        defaultProps={defaultProps}
      />

      {/* 17. Akuntansi Ep 10: Retur Kasir & Pembalikan Jurnal (Credit Notes) */}
      <Composition
        id="AccEp10-CreditNotes"
        component={AccEp10CreditNotes}
        durationInFrames={ACC_EP10_DURATION}
        fps={30}
        width={1920}
        height={1080}
        schema={tutorialSchema}
        defaultProps={defaultProps}
      />

      {/* 18. Modul Invo MRP: Standarisasi BoM Tekstil & SPK Jahit Konveksi */}
      <Composition
        id="MrpEp1-TextileBomSpk"
        component={MrpEp1TextileBomSpk}
        durationInFrames={MRP_EP1_DURATION}
        fps={30}
        width={1920}
        height={1080}
        schema={tutorialSchema}
        defaultProps={defaultProps}
      />

      {/* 19. Live POS Checkout & Stock Reduction: Transaksi #35 di sage.odoo.com */}
      <Composition
        id="LivePosCheckout-SpreiXl"
        component={LivePosCheckoutSpreiXl}
        durationInFrames={LIVE_POS_CHECKOUT_DURATION}
        fps={30}
        width={1920}
        height={1080}
        schema={tutorialSchema}
        defaultProps={defaultProps}
      />
    </>
  );
};
