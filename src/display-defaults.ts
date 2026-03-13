/**
 * Display defaults for Firestore collections and a helper for Typesense defaults.
 */
import { typesenseSchemas, type TypesenseDisplayDefaults } from "./typesense/mod.ts";

/** Display defaults for a Firestore collection in the UI. */
export interface FirestoreDisplayDefaults {
  columns: string[];
  filters: Record<string, (string | boolean)[]>;
  sort: { column: string | null; direction: "asc" | "desc" };
}

/** Display defaults for every Firestore collection, keyed by collection name. */
export const firestoreDisplayDefaults: Record<string, FirestoreDisplayDefaults> = {
  "bookings": {
    columns: ["order_number", "status", "organization", "quantity", "date_start", "date_end"],
    filters: {},
    sort: { column: "order_number", direction: "desc" },
  },
  "cache-geocodes": {
    columns: ["address.full", "address.city", "address.region"],
    filters: {},
    sort: { column: null, direction: "desc" },
  },
  "chart-of-accounts": {
    columns: ["code", "name", "type"],
    filters: {},
    sort: { column: "code", direction: "asc" },
  },
  "contacts": {
    columns: ["name", "emails", "phones"],
    filters: {},
    sort: { column: "name", direction: "asc" },
  },
  "destinations": {
    columns: ["address.full", "address.city", "address.region"],
    filters: {},
    sort: { column: null, direction: "desc" },
  },
  "email-verification": {
    columns: ["email", "code"],
    filters: {},
    sort: { column: null, direction: "desc" },
  },
  "error-sync": {
    columns: ["service", "message"],
    filters: {},
    sort: { column: null, direction: "desc" },
  },
  "holiday-dates": {
    columns: ["name", "date"],
    filters: {},
    sort: { column: "date", direction: "asc" },
  },
  "inventory-ledger": {
    columns: ["uid_product", "stores"],
    filters: {},
    sort: { column: null, direction: "desc" },
  },
  "invoices": {
    columns: ["number", "organization.name", "status", "subject"],
    filters: { status: [] },
    sort: { column: "number", direction: "desc" },
  },
  "locations": {
    columns: ["name", "active", "default"],
    filters: {},
    sort: { column: "name", direction: "asc" },
  },
  "location-types": {
    columns: ["name"],
    filters: {},
    sort: { column: "name", direction: "asc" },
  },
  "orders": {
    columns: ["number", "organization.name", "subject", "status"],
    filters: { status: [] },
    sort: { column: "number", direction: "desc" },
  },
  "organizations": {
    columns: ["name", "emails", "phones"],
    filters: {},
    sort: { column: "name", direction: "asc" },
  },
  "out-of-service": {
    columns: ["source.type", "reason", "quantity", "date_start", "date_end"],
    filters: {},
    sort: { column: "date_start", direction: "desc" },
  },
  "password-reset": {
    columns: ["email"],
    filters: {},
    sort: { column: null, direction: "desc" },
  },
  "products": {
    columns: ["type", "name", "active"],
    filters: { type: ["rental", "sale", "service"], active: [true] },
    sort: { column: "name", direction: "asc" },
  },
  "public-stock-summary": {
    columns: ["uid_product", "stores"],
    filters: {},
    sort: { column: null, direction: "desc" },
  },
  "quotes": {
    columns: ["uid_order", "version"],
    filters: {},
    sort: { column: "version", direction: "desc" },
  },
  "rate-limit": {
    columns: ["key", "count"],
    filters: {},
    sort: { column: null, direction: "desc" },
  },
  "stock-summary": {
    columns: ["uid_product", "stores"],
    filters: {},
    sort: { column: null, direction: "desc" },
  },
  "stores": {
    columns: ["name", "active", "default"],
    filters: {},
    sort: { column: "name", direction: "asc" },
  },
  "tags": {
    columns: ["name", "count"],
    filters: {},
    sort: { column: "count", direction: "desc" },
  },
  "templates": {
    columns: ["name", "version"],
    filters: {},
    sort: { column: null, direction: "desc" },
  },
  "tracking-categories": {
    columns: ["name", "count"],
    filters: {},
    sort: { column: "name", direction: "asc" },
  },
  "transactions": {
    columns: ["date", "quantity", "source.type", "type", "reference"],
    filters: {},
    sort: { column: "date", direction: "desc" },
  },
  "typesense-config": {
    columns: ["uid", "current_collection"],
    filters: {},
    sort: { column: null, direction: "desc" },
  },
  "users": {
    columns: ["email", "roles"],
    filters: {},
    sort: { column: "email", direction: "asc" },
  },
  "webhook-events": {
    columns: ["type", "status"],
    filters: {},
    sort: { column: null, direction: "desc" },
  },
  "webshop-products": {
    columns: ["name", "type", "active"],
    filters: {},
    sort: { column: "name", direction: "asc" },
  },
};

/** Get the display defaults for a Typesense collection by alias. */
export function getTypesenseDisplayDefaults(alias: string): TypesenseDisplayDefaults | undefined {
  return typesenseSchemas[alias]?.displayDefaults;
}
