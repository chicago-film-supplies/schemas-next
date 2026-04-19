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

/** Zod schema for an organization reference embedded in a contact. */
export const ContactOrganization: z.ZodType<ContactOrganizationType> = z.strictObject({
  uid: z.string(),
  name: z.string().min(1, "Organization name is required").max(100).meta({ pii: "mask" }),
});

/**
 * Full contact document schema (Firestore document shape).
 */
export interface Contact {
  uid: string;
  first_name: string;
  middle_name?: string;
  last_name?: string;
  pronunciation?: string;
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

/** Zod schema for a full contact Firestore document. */
export const ContactSchema: z.ZodType<Contact> = z.strictObject({
  uid: z.string(),
  first_name: z.string().min(1, "First name is required").max(50).meta({ pii: "mask" }),
  middle_name: z.string().min(1).max(50).meta({ pii: "mask" }).optional(),
  last_name: z.string().min(1).max(50).meta({ pii: "mask" }).optional(),
  pronunciation: z.string().min(1).max(100).meta({ pii: "mask" }).optional(),
  crms_id: z.number().optional(),
  emails: z.array(Email).default([]),
  phones: z.array(Phone).default([]),
  organizations: z.array(ContactOrganization).default([]),
  query_by_organizations: z.array(z.string()).default([]),
  uid_user: z.string().optional(),
  version: z.int().min(0).default(0),
  updated_by: z.string().optional(),
  ...TimestampFields,
}).meta({
  title: "Contact",
  collection: "contacts",
  displayDefaults: {
    columns: ["first_name", "middle_name", "last_name", "emails", "phones"],
    filters: {},
    sort: { column: "first_name", direction: "asc" },
  },
});

/**
 * Input schema for POST /contacts — what the endpoint accepts.
 */
export interface CreateContactInputType {
  uid: string;
  first_name: string;
  middle_name?: string;
  last_name?: string;
  pronunciation?: string;
  emails?: string[];
  phones?: string[];
  organizations?: ContactOrganizationType[];
}

/** Input schema for creating a contact. */
export const CreateContactInput: z.ZodType<CreateContactInputType> = z.object({
  uid: z.string(),
  first_name: z.string().min(1, "First name is required").max(50).meta({ pii: "mask" }),
  middle_name: z.string().min(1).max(50).meta({ pii: "mask" }).optional(),
  last_name: z.string().min(1).max(50).meta({ pii: "mask" }).optional(),
  pronunciation: z.string().min(1).max(100).meta({ pii: "mask" }).optional(),
  emails: z.array(Email).optional(),
  phones: z.array(Phone).optional(),
  organizations: z.array(ContactOrganization).optional(),
});

/**
 * Input schema for PUT /contacts/:uid — partial update.
 */
export interface UpdateContactInputType {
  uid?: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  pronunciation?: string;
  emails?: string[];
  phones?: string[];
  organizations?: ContactOrganizationType[];
  version: number;
}

/** Input schema for updating a contact. */
export const UpdateContactInput: z.ZodType<UpdateContactInputType> = z.object({
  uid: z.string().optional(),
  first_name: z.string().min(1, "First name is required").max(50).meta({ pii: "mask" }).optional(),
  middle_name: z.string().min(1).max(50).meta({ pii: "mask" }).optional(),
  last_name: z.string().min(1).max(50).meta({ pii: "mask" }).optional(),
  pronunciation: z.string().min(1).max(100).meta({ pii: "mask" }).optional(),
  emails: z.array(Email).optional(),
  phones: z.array(Phone).optional(),
  organizations: z.array(ContactOrganization).optional(),
  version: z.int().min(0),
});
