/**
 * ChartOfAccounts document schema — Firestore collection: chart-of-accounts
 */
import { z } from "zod";
import { type FirestoreTimestampType, TimestampFields } from "./common.ts";

const COA_CODES = [
  "2210", "2800",
  "4000", "4100", "4110", "4120", "4130", "4140", "4150",
  "4200", "4210", "4300", "4400", "4600", "4700", "4800", "4810", "4820", "4830",
  "5000", "5001", "5100", "5200", "5300", "5400", "5500", "5600",
] as const;

const COA_TYPES = [
  "Current Asset", "Fixed Asset", "Inventory", "Non-current Asset", "Prepayment",
  "Equity", "Depreciation", "Direct Costs", "Expense", "Overhead",
  "Current Liability", "Liability", "Non-current Liability",
  "Other Income", "Revenue", "Sales",
] as const;

export type COACodeType = typeof COA_CODES[number];
export type COATypeType = typeof COA_TYPES[number];

export const COACode: z.ZodType<COACodeType> = z.enum(COA_CODES);
export const COAType: z.ZodType<COATypeType> = z.enum(COA_TYPES);

export interface ChartOfAccounts {
  uid: string;
  code: COACodeType;
  name: string;
  type: COATypeType;
  description?: string;
  default_tax_profile: string;
  updated_by: string;
  created_at?: FirestoreTimestampType;
  updated_at?: FirestoreTimestampType;
}

export const ChartOfAccountsSchema: z.ZodType<ChartOfAccounts> = z.strictObject({
  uid: z.string(),
  code: COACode,
  name: z.string().min(1).max(100),
  type: COAType,
  description: z.string().optional(),
  default_tax_profile: z.string(),
  updated_by: z.string(),
  ...TimestampFields,
}).meta({ title: "Chart of Accounts", collection: "chart-of-accounts" });
