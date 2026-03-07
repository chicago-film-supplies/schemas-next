/**
 * Organization document schema — Firestore collection: organizations
 */
import { z } from "zod";
import {
  Address,
  type AddressType,
  Email,
  Phone,
  TimestampFields,
} from "./common.ts";

/**
 * Contact reference embedded in an organization document.
 */
export interface OrganizationContactType {
  uid: string;
  name: string;
  roles: string[];
}

export const OrganizationContact: z.ZodType<OrganizationContactType> = z.strictObject({
  uid: z.string(),
  name: z.string().min(1).max(100),
  roles: z.array(z.string()).default([]),
});

/**
 * Full organization document schema (Firestore document shape).
 */
export interface Organization {
  uid: string;
  name: string;
  crms_id: number;
  xero_id: string | null;
  tax_profile: "tax_applied" | "tax_exempt" | "tax_rantoul";
  description?: string;
  emails: string[];
  phones: string[];
  billing_address: AddressType | null;
  contacts: OrganizationContactType[];
  query_by_contacts: string[];
  last_order?: unknown;
  updated_by?: string;
  created_at?: unknown;
  updated_at?: unknown;
}

export const OrganizationSchema: z.ZodType<Organization> = z.strictObject({
  uid: z.string(),
  name: z.string().min(1).max(100),
  crms_id: z.number(),
  xero_id: z.string().nullable(),
  tax_profile: z.enum(["tax_applied", "tax_exempt", "tax_rantoul"]).default("tax_applied"),
  description: z.string().default("").optional(),
  emails: z.array(Email).default([]),
  phones: z.array(Phone).default([]),
  billing_address: Address,
  contacts: z.array(OrganizationContact).default([]),
  query_by_contacts: z.array(z.string()).default([]),
  last_order: z.any().optional(),
  updated_by: z.string().optional(),
  ...TimestampFields,
});
