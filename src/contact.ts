/**
 * Contact document schema — Firestore collection: contacts
 */
import { z } from "zod";
import { Email, Phone, TimestampFields } from "./common.ts";

/**
 * Organization reference embedded in a contact document.
 */
export interface ContactOrganizationType {
  uid: string;
  name: string;
}

export const ContactOrganization: z.ZodType<ContactOrganizationType> = z.strictObject({
  uid: z.string(),
  name: z.string().min(1, "Organization name is required").max(100),
});

/**
 * Full contact document schema (Firestore document shape).
 */
export interface Contact {
  uid: string;
  name: string;
  crms_id?: number;
  emails: string[];
  phones: string[];
  organizations: ContactOrganizationType[];
  query_by_organizations: string[];
  updated_by?: string;
  created_at?: unknown;
  updated_at?: unknown;
}

export const ContactSchema: z.ZodType<Contact> = z.strictObject({
  uid: z.string(),
  name: z.string().min(1, "Contact name is required").max(100),
  crms_id: z.number().optional(),
  emails: z.array(Email).default([]),
  phones: z.array(Phone).default([]),
  organizations: z.array(ContactOrganization).default([]),
  query_by_organizations: z.array(z.string()).default([]),
  updated_by: z.string().optional(),
  ...TimestampFields,
});

/**
 * Input schema for POST /contacts — what the endpoint accepts.
 */
export interface CreateContactInputType {
  uid: string;
  name: string;
  emails?: string[];
  phones?: string[];
  organizations?: ContactOrganizationType[];
}

export const CreateContactInput: z.ZodType<CreateContactInputType> = z.object({
  uid: z.string(),
  name: z.string().min(1, "Contact name is required").max(100),
  emails: z.array(Email).optional(),
  phones: z.array(Phone).optional(),
  organizations: z.array(ContactOrganization).optional(),
});

/**
 * Input schema for PUT /contacts/:uid — partial update.
 */
export interface UpdateContactInputType {
  uid?: string;
  name?: string;
  emails?: string[];
  phones?: string[];
  organizations?: ContactOrganizationType[];
}

export const UpdateContactInput: z.ZodType<UpdateContactInputType> = z.object({
  uid: z.string().optional(),
  name: z.string().min(1, "Contact name is required").max(100).optional(),
  emails: z.array(Email).optional(),
  phones: z.array(Phone).optional(),
  organizations: z.array(ContactOrganization).optional(),
});
