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

/** Full Firestore document for a destination (a physical address used in orders). */
export interface Destination {
  uid: string;
  address: AddressType | null;
  mapbox_ids: string[];
  organizations?: UidNameRefType[];
  query_by_organizations?: string[];
  products?: UidNameRefType[];
  query_by_products?: string[];
  contacts?: UidNameRefType[];
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
  contacts: z.array(UidNameRef).default([]).optional(),
  query_by_contacts: z.array(z.string()).default([]).optional(),
  version: z.int().min(0).default(0),
  ...TimestampFields,
}).meta({
  title: "Destination",
  collection: "destinations",
  initial: {"uid":null,"address":null,"mapbox_ids":[],"organizations":[],"query_by_organizations":[],"products":[],"query_by_products":[],"contacts":[],"query_by_contacts":[],"version":0},
  displayDefaults: {
    columns: ["address.full", "address.city", "address.region"],
    filters: {},
    sort: { column: null, direction: "desc" },
  },
});
