/**
 * Destination document schema — Firestore collection: destinations
 */
import { z } from "zod";
import {
  Address,
  type AddressType,
  type FirestoreTimestampType,
  TimestampFields,
  UidNameRef,
  type UidNameRefType,
} from "./common.ts";

/**
 * Contact reference embedded in a destination document.
 *
 * Mirrors the split-name shape used in `organizations.contacts[]` so that the
 * Typesense `destinations_v5` collection can index the same `first_name /
 * middle_name / last_name / pronunciation` fields without an adapter.
 */
export interface DestinationContactRefType {
  uid: string;
  first_name: string;
  middle_name?: string;
  last_name?: string;
  pronunciation?: string;
}

/** Zod schema for a contact reference embedded in a destination. */
export const DestinationContactRef: z.ZodType<DestinationContactRefType> = z.strictObject({
  uid: z.string(),
  first_name: z.string().min(1, "First name is required").max(50).meta({ pii: "mask" }),
  middle_name: z.string().min(1).max(50).meta({ pii: "mask" }).optional(),
  last_name: z.string().min(1).max(50).meta({ pii: "mask" }).optional(),
  pronunciation: z.string().min(1).max(100).meta({ pii: "mask" }).optional(),
});

/** Full Firestore document for a destination (a physical address used in orders). */
export interface Destination {
  uid: string;
  address: AddressType | null;
  mapbox_ids: string[];
  organizations?: UidNameRefType[];
  query_by_organizations?: string[];
  products?: UidNameRefType[];
  query_by_products?: string[];
  contacts?: DestinationContactRefType[];
  query_by_contacts?: string[];
  version: number;
  created_at?: FirestoreTimestampType;
  updated_at?: FirestoreTimestampType;
}

/** Zod schema for Destination. */
export const DestinationSchema: z.ZodType<Destination> = z.strictObject({
  uid: z.string(),
  address: Address,
  mapbox_ids: z.array(z.string()).default([]),
  organizations: z.array(UidNameRef).default([]).optional(),
  query_by_organizations: z.array(z.string()).default([]).optional(),
  products: z.array(UidNameRef).default([]).optional(),
  query_by_products: z.array(z.string()).default([]).optional(),
  contacts: z.array(DestinationContactRef).default([]).optional(),
  query_by_contacts: z.array(z.string()).default([]).optional(),
  version: z.int().min(0).default(0),
  ...TimestampFields,
}).meta({
  title: "Destination",
  collection: "destinations",
  displayDefaults: {
    columns: ["address.full", "address.city", "address.region"],
    filters: {},
    sort: { column: null, direction: "desc" },
  },
});
