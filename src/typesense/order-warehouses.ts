import type { TypesenseCollectionConfig } from "./types.ts";
import { typesenseAddressFields } from "./types.ts";

/**
 * Typesense collection config for the sanitized warehouse order view.
 *
 * Mirrors `orders` by uid but strips all pricing, totals, tax profile,
 * invoice refs, CRM/Xero ids, and financial line-item fields. Sorted
 * by delivery start (ascending-soonest is what warehouse wants; use
 * desc in display so upcoming-nearest shows first when filtered by
 * date range).
 */
export const orderWarehouses: TypesenseCollectionConfig = {
  alias: "order-warehouses",
  version: 1,
  firestoreCollection: "order-warehouses",
  collectionName: "order-warehouses_v1",
  schema: {
    name: "order-warehouses_v1",
    enable_nested_fields: true,
    fields: [
      { name: "uid", type: "string", sort: true, facet: false },
      { name: "number", type: "int64", sort: true, index: true, facet: false },
      { name: "number_str", type: "string", index: true, sort: false, facet: false, optional: true },
      { name: "status", type: "string", facet: true },
      { name: "customer_collecting", type: "bool", facet: true, optional: true },
      { name: "customer_returning", type: "bool", facet: true, optional: true },
      { name: "subject", type: "string", sort: true, stem: true, optional: true },
      { name: "reference", type: "string", stem: true, sort: true, optional: true },
      { name: "organization", type: "object" },
      { name: "organization.uid", type: "string", facet: false, optional: true },
      { name: "organization.name", type: "string", sort: true, stem: true, facet: false },
      { name: "dates", type: "object" },
      { name: "dates.delivery_start_fs", type: "int64", sort: true, index: true, facet: false, optional: true },
      { name: "dates.delivery_end_fs", type: "int64", sort: true, index: true, facet: false, optional: true },
      { name: "dates.collection_start_fs", type: "int64", sort: true, index: true, facet: false, optional: true },
      { name: "dates.collection_end_fs", type: "int64", sort: true, index: true, facet: false, optional: true },
      { name: "dates.charge_start_fs", type: "int64", sort: true, index: true, facet: false, optional: true },
      { name: "dates.charge_end_fs", type: "int64", sort: true, index: true, facet: false, optional: true },
      { name: "destinations", type: "object[]" },
      { name: "destinations.delivery", type: "object[]", optional: true },
      ...typesenseAddressFields("destinations.delivery.address", { array: true }),
      { name: "destinations.delivery.instructions", type: "string[]", stem: true, optional: true },
      { name: "destinations.delivery.uid", type: "string[]", optional: true },
      { name: "destinations.delivery.contact", type: "object[]", optional: true },
      { name: "destinations.delivery.contact.uid", type: "string[]", facet: false, optional: true },
      { name: "destinations.delivery.contact.name", type: "string[]", stem: true, optional: true },
      { name: "destinations.collection", type: "object[]", optional: true },
      ...typesenseAddressFields("destinations.collection.address", { array: true }),
      { name: "destinations.collection.instructions", type: "string[]", stem: true, optional: true },
      { name: "destinations.collection.uid", type: "string[]", optional: true },
      { name: "destinations.collection.contact", type: "object[]", optional: true },
      { name: "destinations.collection.contact.uid", type: "string[]", facet: false, optional: true },
      { name: "destinations.collection.contact.name", type: "string[]", stem: true, optional: true },
      { name: "items", type: "object[]", optional: true },
      { name: "items.uid", type: "string[]", facet: false, optional: true },
      { name: "items.name", type: "string[]", stem: true, optional: true },
      { name: "items.quantity", type: "int32[]", optional: true },
      { name: "items.type", type: "string[]", facet: true, optional: true },
      { name: "items.description", type: "string[]", stem: true, optional: true },
      { name: "items.stock_method", type: "string[]", facet: true, optional: true },
      { name: "items.path", type: "string[]", optional: true, facet: false },
      { name: "items.uid_delivery", type: "string[]", optional: true },
      { name: "items.uid_collection", type: "string[]", optional: true },
      { name: "items.order_number", type: "int32[]", optional: true },
      { name: "items.uid_order", type: "string[]", optional: true },
      { name: "created_at", type: "int64", sort: true, index: true, facet: false, optional: true },
      { name: "updated_at", type: "int64", sort: true, index: true, facet: false },
    ],
    default_sorting_field: "dates.delivery_start_fs",
  },
  synonyms: [],
  displayDefaults: {
    columns: ["number", "organization.name", "subject", "dates.delivery_start_fs", "status"],
    filters: { status: [] },
    sort: { column: "dates.delivery_start_fs", direction: "desc" },
    group: null,
    facet: [],
  },
};
