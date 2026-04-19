/**
 * Typesense collection schemas for CFS.
 *
 * These are configuration objects (not Zod schemas) describing
 * the shape of each Typesense collection for the Collections API.
 */
export type {
  TypesenseCollectionConfig,
  TypesenseDisplayDefaults,
  TypesenseField,
  TypesenseFieldType,
  TypesenseMultiWaySynonym,
  TypesenseOneWaySynonym,
  TypesenseSchema,
  TypesenseSynonym,
} from "./types.ts";

export {
  TypesenseFieldTypeEnum,
  TypesenseFieldSchema,
  TypesenseSchemaSchema,
  TypesenseDisplayDefaultsSchema,
  TypesenseCollectionConfigSchema,
  TypesenseMultiWaySynonymSchema,
  TypesenseOneWaySynonymSchema,
  TypesenseSynonymSchema,
  typesenseAddressFields,
} from "./types.ts";

export type {
  TypesenseAddressFields,
  BookingDocument,
  ChartOfAccountsDocument,
  ContactDocument,
  DestinationDocument,
  InvoiceDocument,
  LocationDocument,
  OrderDocument,
  OrganizationDocument,
  ProductDocument,
  ProductDocumentComponent,
  StoreDocument,
  TagDocument,
  TemplateDocument,
  TrackingCategoryDocument,
  UserDocument,
  WebshopProductDocument,
  WebshopProductDocumentComponent,
  TypesenseDocument,
  TypesenseDocumentMap,
} from "./documents.ts";

export { bookings } from "./bookings.ts";
export { chartOfAccounts } from "./chart-of-accounts.ts";
export { contacts } from "./contacts.ts";
export { destinations } from "./destinations.ts";
export { invoices } from "./invoices.ts";
export { locations } from "./locations.ts";
export { orders } from "./orders.ts";
export { orderWarehouses } from "./order-warehouses.ts";
export { organizations } from "./organizations.ts";
export { products } from "./products.ts";
export { stores } from "./stores.ts";
export { tags } from "./tags.ts";
export { trackingCategories } from "./tracking-categories.ts";
export { templates } from "./templates.ts";
export { users } from "./users.ts";
export { webshopProducts } from "./webshop-products.ts";

import type { Permission } from "../permissions.ts";
import type { TypesenseCollectionConfig } from "./types.ts";
import { bookings } from "./bookings.ts";
import { chartOfAccounts } from "./chart-of-accounts.ts";
import { contacts } from "./contacts.ts";
import { destinations } from "./destinations.ts";
import { invoices } from "./invoices.ts";
import { locations } from "./locations.ts";
import { orders } from "./orders.ts";
import { orderWarehouses } from "./order-warehouses.ts";
import { organizations } from "./organizations.ts";
import { products } from "./products.ts";
import { stores } from "./stores.ts";
import { tags } from "./tags.ts";
import { trackingCategories } from "./tracking-categories.ts";
import { templates } from "./templates.ts";
import { users } from "./users.ts";
import { webshopProducts } from "./webshop-products.ts";

const allSchemas: TypesenseCollectionConfig[] = [
  bookings,
  chartOfAccounts,
  contacts,
  destinations,
  invoices,
  locations,
  orders,
  orderWarehouses,
  organizations,
  products,
  stores,
  tags,
  templates,
  trackingCategories,
  users,
  webshopProducts,
];

/** Union of all Typesense collection alias names. */
export type TypesenseAlias =
  | "bookings"
  | "chart-of-accounts"
  | "contacts"
  | "destinations"
  | "invoices"
  | "locations"
  | "orders"
  | "order-warehouses"
  | "organizations"
  | "products"
  | "stores"
  | "tags"
  | "templates"
  | "tracking-categories"
  | "users"
  | "webshop-products";

/** All Typesense collection configs keyed by alias. */
export const typesenseSchemas: Record<TypesenseAlias, TypesenseCollectionConfig> =
  Object.fromEntries(allSchemas.map((s) => [s.alias, s])) as Record<TypesenseAlias, TypesenseCollectionConfig>;

/** Firestore collection names that are actively synced to Typesense (enabled !== false). */
export const typesenseEnabledCollections: Set<string> = new Set(
  allSchemas
    .filter((s) => s.enabled !== false && s.firestoreCollection !== "")
    .map((s) => s.firestoreCollection),
);

/**
 * Maps each Typesense alias to its `.search` RBAC permission.
 *
 * Used by the drift-guard test (every enabled alias must map to a cataloged
 * permission) and by the api-cloudrun scoped-key minter (resolve which parent
 * key to derive a user's scoped key from per granted `.search` permission).
 *
 * Disabled aliases (`enabled: false`, e.g. `bookings`) are omitted — no search
 * UI surface is expected for them until they are provisioned in Typesense.
 */
export const SEARCH_PERMISSION_BY_ALIAS: Partial<Record<TypesenseAlias, Permission>> = {
  "chart-of-accounts": "chartOfAccounts.search",
  "contacts": "contacts.search",
  "destinations": "destinations.search",
  "invoices": "invoices.search",
  "locations": "locations.search",
  "orders": "orders.search",
  "order-warehouses": "orderWarehouses.search",
  "organizations": "organizations.search",
  "products": "products.search",
  "stores": "stores.search",
  "tags": "tags.search",
  "templates": "templates.search",
  "tracking-categories": "trackingCategories.search",
  "users": "users.search",
  "webshop-products": "webshopProducts.search",
};
