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
  name: z.string().min(1, "Contact name is required").max(100),
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
  name: z.string().min(1, "Organization name is required").max(100),
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

/**
 * New contact data submitted inline when creating/updating an organization.
 */
export interface NewContactInputType {
  uid: string;
  name: string;
  emails?: string[];
  phones?: string[];
}

export const NewContactInput: z.ZodType<NewContactInputType> = z.object({
  uid: z.string(),
  name: z.string().min(1, "Contact name is required").max(100),
  emails: z.array(Email).optional(),
  phones: z.array(Phone).optional(),
});

/**
 * Input schema for POST /organizations.
 * crms_id and xero_id are obtained from external APIs — not in input.
 */
export interface CreateOrganizationInputType {
  uid: string;
  name: string;
  tax_profile: "tax_applied" | "tax_exempt" | "tax_rantoul";
  billing_address: AddressType | null;
  contacts?: OrganizationContactType[];
  newContacts?: NewContactInputType[];
  emails?: string[];
  phones?: string[];
}

export const CreateOrganizationInput: z.ZodType<CreateOrganizationInputType> = z.object({
  uid: z.string(),
  name: z.string().min(1, "Organization name is required").max(100),
  tax_profile: z.enum(["tax_applied", "tax_exempt", "tax_rantoul"]),
  billing_address: Address,
  contacts: z.array(OrganizationContact).optional(),
  newContacts: z.array(NewContactInput).optional(),
  emails: z.array(Email).optional(),
  phones: z.array(Phone).optional(),
});

/**
 * Input schema for PUT /organizations/:uid — partial update.
 */
export interface UpdateOrganizationInputType {
  uid?: string;
  name?: string;
  tax_profile?: "tax_applied" | "tax_exempt" | "tax_rantoul";
  description?: string;
  billing_address?: AddressType | null;
  contacts?: OrganizationContactType[];
  newContacts?: NewContactInputType[];
  emails?: string[];
  phones?: string[];
}

export const UpdateOrganizationInput: z.ZodType<UpdateOrganizationInputType> = z.object({
  uid: z.string().optional(),
  name: z.string().min(1, "Organization name is required").max(100).optional(),
  tax_profile: z.enum(["tax_applied", "tax_exempt", "tax_rantoul"]).optional(),
  description: z.string().optional(),
  billing_address: Address.optional(),
  contacts: z.array(OrganizationContact).optional(),
  newContacts: z.array(NewContactInput).optional(),
  emails: z.array(Email).optional(),
  phones: z.array(Phone).optional(),
});
