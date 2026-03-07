import type { TypesenseCollectionConfig } from "./types.ts";

export const contacts: TypesenseCollectionConfig = {
  alias: "contacts",
  version: 6,
  firestoreCollection: "contacts",
  collectionName: "contacts_v6",
  schema: {
    name: "contacts_v6",
    enable_nested_fields: true,
    token_separators: ["(", ")", "-", "+", " "],
    fields: [
      { name: "uid", type: "string", sort: true, facet: false },
      { name: "name", type: "string", sort: true, stem: true, facet: false },
      { name: "crms_id", type: "int64", sort: true, index: true, facet: false, optional: true },
      { name: "crms_id_str", type: "string", index: true, sort: false, facet: false, optional: true },
      { name: "emails", type: "string[]", stem: true },
      { name: "phones", type: "string[]" },
      { name: "organizations", type: "object[]", optional: true },
      { name: "organizations.uid", type: "string[]", facet: false, optional: true },
      { name: "organizations.name", type: "string[]", stem: true, optional: true },
      { name: "updated_by", type: "string", facet: false, optional: true },
      { name: "created_at", type: "int64", sort: true, index: true, facet: false, optional: true },
      { name: "updated_at", type: "int64", sort: true, index: true, facet: false },
    ],
    default_sorting_field: "name",
  },
};
