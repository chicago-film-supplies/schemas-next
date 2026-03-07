/**
 * Typesense collection schemas for CFS.
 *
 * These are configuration objects (not Zod schemas) describing
 * the shape of each Typesense collection for the Collections API.
 */
export type {
  TypesenseCollectionConfig,
  TypesenseField,
  TypesenseFieldType,
  TypesenseSchema,
} from "./types.ts";

export { bookings } from "./bookings.ts";
export { chartOfAccounts } from "./chart-of-accounts.ts";
export { contacts } from "./contacts.ts";
export { destinations } from "./destinations.ts";
export { invoices } from "./invoices.ts";
export { locations } from "./locations.ts";
export { orders } from "./orders.ts";
export { organizations } from "./organizations.ts";
export { products } from "./products.ts";
export { stores } from "./stores.ts";
export { tags } from "./tags.ts";
export { trackingCategories } from "./tracking-categories.ts";
export { webshopProducts } from "./webshop-products.ts";

import type { TypesenseCollectionConfig } from "./types.ts";
import { bookings } from "./bookings.ts";
import { chartOfAccounts } from "./chart-of-accounts.ts";
import { contacts } from "./contacts.ts";
import { destinations } from "./destinations.ts";
import { invoices } from "./invoices.ts";
import { locations } from "./locations.ts";
import { orders } from "./orders.ts";
import { organizations } from "./organizations.ts";
import { products } from "./products.ts";
import { stores } from "./stores.ts";
import { tags } from "./tags.ts";
import { trackingCategories } from "./tracking-categories.ts";
import { webshopProducts } from "./webshop-products.ts";

const allSchemas: TypesenseCollectionConfig[] = [
  bookings,
  chartOfAccounts,
  contacts,
  destinations,
  invoices,
  locations,
  orders,
  organizations,
  products,
  stores,
  tags,
  trackingCategories,
  webshopProducts,
];

/** All Typesense collection configs keyed by alias. */
export const typesenseSchemas: Record<string, TypesenseCollectionConfig> =
  Object.fromEntries(allSchemas.map((s) => [s.alias, s]));
