/**
 * Invite token schema — Firestore collection: invites
 *
 * Tokens are single-use with a 7-day expiry. The token itself is the document
 * id so validation reads /invites/{token}. Accepting an invite creates a new
 * user with roles taken from the invite and marks it used.
 */
import { z } from "zod";
import {
  Email,
  FirestoreTimestamp,
  type FirestoreTimestampType,
  type NameParts,
  NamePartsFields,
  TimestampFields,
} from "./common.ts";

/** Full Firestore document for a single-use invite. */
export interface Invite extends NameParts {
  uid: string;
  email: string;
  roles: string[];
  invited_by: string;
  used: boolean;
  expires_at: FirestoreTimestampType;
  created_at?: FirestoreTimestampType;
  updated_at?: FirestoreTimestampType;
}

/** Zod schema for an Invite document. */
export const InviteSchema: z.ZodType<Invite> = z.strictObject({
  uid: z.string().min(1),
  email: Email,
  ...NamePartsFields,
  roles: z.array(z.string()).default([]),
  invited_by: z.string().min(1),
  used: z.boolean().default(false),
  expires_at: FirestoreTimestamp,
  ...TimestampFields,
}).meta({
  title: "Invite",
  collection: "invites",
  displayDefaults: {
    columns: ["email", "first_name", "middle_name", "last_name", "roles", "used"],
    filters: {},
    sort: { column: null, direction: "desc" },
  },
});

/** Input to POST /admin/users/invite. */
export interface CreateInviteInputType extends NameParts {
  email: string;
  roles: string[];
}

/** Input schema for POST /admin/users/invite. */
export const CreateInviteInput: z.ZodType<CreateInviteInputType> = z.object({
  email: Email,
  ...NamePartsFields,
  roles: z.array(z.string()).min(1),
});

/** Input to POST /auth/accept-invite. */
export interface AcceptInviteInputType {
  token: string;
  password: string;
}

/** Input schema for POST /auth/accept-invite. */
export const AcceptInviteInput: z.ZodType<AcceptInviteInputType> = z.object({
  token: z.string().min(1).meta({ pii: "redact" }),
  password: z.string().min(8).max(128).meta({ pii: "redact" }),
});
