import type { TypesenseCollectionConfig } from "./types.ts";
import { typesenseAddressFields } from "./types.ts";

/** Typesense collection config for organizations. */
export const organizations: TypesenseCollectionConfig = {
  alias: "organizations",
  version: 9,
  firestoreCollection: "organizations",
  collectionName: "organizations_v9",
  schema: {
    name: "organizations_v9",
    enable_nested_fields: true,
    token_separators: ["(", ")", "-", "+", " "],
    fields: [
      { name: "uid", type: "string", sort: true, facet: false },
      { name: "name", type: "string", sort: true, stem: true, facet: false },
      { name: "description", type: "string", stem: true, optional: true },
      { name: "crms_id", type: "int64", sort: true, index: true, facet: false },
      { name: "crms_id_str", type: "string", index: true, sort: false, facet: false, optional: true },
      { name: "xero_id", type: "string", facet: false, optional: true },
      { name: "tax_profile", type: "string", facet: true },
      { name: "emails", type: "string[]", stem: true, optional: true },
      { name: "phones", type: "string[]", optional: true },
      ...typesenseAddressFields("billing_address", { sortFull: true, parentOptional: false }),
      { name: "contacts", type: "object[]" },
      { name: "contacts.uid", type: "string[]", facet: false, optional: true },
      { name: "contacts.name", type: "string[]", stem: true, facet: false, optional: true },
      { name: "contacts.roles", type: "string[]", facet: false, optional: true },
      { name: "updated_by", type: "string", facet: false, optional: true, sort: true },
      { name: "last_order", type: "int64", sort: true, index: true, facet: false, optional: true },
      { name: "created_at", type: "int64", sort: true, index: true, facet: false, optional: true },
      { name: "updated_at", type: "int64", sort: true, index: true, facet: false },
    ],
    default_sorting_field: "name",
  },
  synonyms: [],
  displayDefaults: {
    columns: ["name", "contacts", "emails", "phones"],
    filters: {},
    sort: { column: "name", direction: "asc" },
    group: null,
    facet: [],
  },
};
