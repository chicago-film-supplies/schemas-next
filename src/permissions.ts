/**
 * RBAC permission catalog.
 *
 * The canonical list of permission strings that roles can grant and API routes
 * can require. Role documents in Firestore reference these strings; the API
 * uses the `Permission` union to type-check route-level declarations so that
 * a permission string that isn't in this list fails the build.
 */

/** The full catalog of permissions. Adding a new route? Add its permission here first. */
export const PERMISSIONS = [
  "orders.create",
  "orders.read",
  "orders.update",
  "orders.delete",

  "products.create",
  "products.read",
  "products.update",
  "products.delete",

  "webshopProducts.read",

  "contacts.create",
  "contacts.read",
  "contacts.update",
  "contacts.delete",

  "organizations.create",
  "organizations.read",
  "organizations.update",
  "organizations.delete",

  "transactions.create",
  "transactions.read",
  "transactions.update",
  "transactions.delete",

  "invoices.create",
  "invoices.read",
  "invoices.update",
  "invoices.delete",

  "quotes.create",
  "quotes.read",
  "quotes.update",
  "quotes.delete",

  "locations.create",
  "locations.read",
  "locations.update",
  "locations.delete",

  "locationTypes.create",
  "locationTypes.read",
  "locationTypes.update",
  "locationTypes.delete",

  "stores.create",
  "stores.read",
  "stores.update",
  "stores.delete",

  "taxes.create",
  "taxes.read",
  "taxes.update",
  "taxes.delete",

  "tags.create",
  "tags.read",
  "tags.update",
  "tags.delete",

  "trackingCategories.create",
  "trackingCategories.read",
  "trackingCategories.update",
  "trackingCategories.delete",

  "holidays.create",
  "holidays.read",
  "holidays.update",
  "holidays.delete",

  "templates.create",
  "templates.read",
  "templates.update",
  "templates.delete",

  "orderEvents.create",
  "orderEvents.read",

  "bookings.read",
  "chartOfAccounts.read",
  "dateHelpers.read",
  "destinations.read",
  "ledgers.read",
  "orderWarehouses.read",
  "outOfServiceRecords.read",
  "stockSummaries.read",
  "typesenseSync.read",

  "users.read",
  "users.update",
  "users.assignRoles",

  "roles.read",
  "roles.edit",

  "uploads.sign",

  "admin.reindex",
  "admin.validate",
  "admin.sync",
] as const;

/** Union type of every permission string in the catalog. */
export type Permission = typeof PERMISSIONS[number];

/** HTTP methods accepted by the runtime route manifest. */
export type RouteMethod = "get" | "post" | "put" | "delete" | "patch";

/** A single entry in the runtime route manifest — one per protected route. */
export interface RouteManifestEntry {
  method: RouteMethod;
  path: string;
  permission: Permission;
  operationId?: string;
}

/** Runtime route manifest — emitted by api-cloudrun at GET /permissions/manifest. */
export interface RouteManifest {
  version: string;
  permissions: readonly Permission[];
  routes: RouteManifestEntry[];
}
