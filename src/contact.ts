/**
 * Contact document schema — Firestore collection: contacts
 */
import { z } from "zod";
import { Email, type FirestoreTimestampType, Phone, TimestampFields } from "./common.ts";

/**
 * Organization reference embedded in a contact document.
 */
export interface ContactOrganizationType {
  uid: string;
  name: string;
}

export const ContactOrganization: z.ZodType<ContactOrganizationType> = z.strictObject({
  uid: z.string(),
  name: z.string().min(1, "Organization name is required").max(100).meta({ pii: "mask" }),
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
  uid_user?: string;
  version: number;
  updated_by?: string;
  created_at?: FirestoreTimestampType;
  updated_at?: FirestoreTimestampType;
}

export const ContactSchema: z.ZodType<Contact> = z.strictObject({
  uid: z.string(),
  name: z.string().min(1, "Contact name is required").max(100).meta({ pii: "mask" }),
  crms_id: z.number().optional(),
  emails: z.array(Email).default([]),
  phones: z.array(Phone).default([]),
  organizations: z.array(ContactOrganization).default([]),
  query_by_organizations: z.array(z.string()).default([]),
  uid_user: z.string().optional(),
  version: z.int().default(0),
  updated_by: z.string().optional(),
  ...TimestampFields,
}).meta({
  title: "Contact",
  collection: "contacts",
  initial: {"uid":null,"name":"","emails":[],"phones":[],"organizations":[],"query_by_organizations":[],"version":0},
  displayDefaults: {
    columns: ["name", "emails", "phones"],
    filters: {},
    sort: { column: "name", direction: "asc" },
  },
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
  name: z.string().min(1, "Contact name is required").max(100).meta({ pii: "mask" }),
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
  version: number;
}

export const UpdateContactInput: z.ZodType<UpdateContactInputType> = z.object({
  uid: z.string().optional(),
  name: z.string().min(1, "Contact name is required").max(100).meta({ pii: "mask" }).optional(),
  emails: z.array(Email).optional(),
  phones: z.array(Phone).optional(),
  organizations: z.array(ContactOrganization).optional(),
  version: z.int(),
});
