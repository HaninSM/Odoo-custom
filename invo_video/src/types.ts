import { z } from "zod";

export const tutorialSchema = z.object({
  appName: z.string().default("Invo. POS Enterprise"),
  version: z.string().default("2.2.0"),
  storeName: z.string().default("Toko Sprei Jendral"),
  cloudInstance: z.string().default("sage.odoo.com"),
  // Tahap 1: Hulu
  rawItemName: z.string().default('Kain Katun Sprei "XXX"'),
  baseUom: z.string().default("Meter (m)"),
  vendorName: z.string().default("PT. Tekstil Maju Jaya"),
  poQuantity: z.number().default(1),
  poUom: z.string().default("Kodi (60 Meter)"),
  poPrice: z.number().default(1200000),
  paymentTerm: z.string().default("Net 30 Days"),
  poDueDate: z.string().default("01 Des 2026"),
  // Tahap 2: Tengah
  targetVariant: z.string().default("Sprei XL (180 × 200)"),
  targetQty: z.number().default(10),
  meterPerUnit: z.number().default(3.0),
  laborCostPerUnit: z.number().default(10000),
  accCostPerUnit: z.number().default(5000),
  compositeHpp: z.number().default(75000),
  // Tahap 3: Hilir
  marginPct: z.number().default(50),
  sellingPrice: z.number().default(112500),
  cashierJournal: z.string().default("QRIS & EDC Merchant [QRIS1]"),
  qrisAccount: z.string().default("11120010"),
  // Tahap 4: Muara
  realizedProfit: z.number().default(37500),
});

export type TutorialProps = z.infer<typeof tutorialSchema>;
