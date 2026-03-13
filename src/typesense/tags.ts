import type { TypesenseCollectionConfig } from "./types.ts";

export const tags: TypesenseCollectionConfig = {
  alias: "tags",
  version: 5,
  firestoreCollection: "tags",
  collectionName: "tags_v5",
  schema: {
    name: "tags_v5",
    enable_nested_fields: true,
    fields: [
      { name: "uid", type: "string", sort: true, facet: false },
      { name: "name", type: "string", sort: true, stem: true },
      { name: "count", type: "int32", sort: true, index: true },
      { name: "products", type: "object[]", optional: true },
      { name: "products.uid", type: "string[]", facet: false, optional: true },
      { name: "products.name", type: "string[]", stem: true, facet: false, optional: true },
      { name: "updated_at", type: "int64", sort: true, index: true },
      { name: "updated_by", type: "string", sort: true, facet: false, optional: true },
    ],
    default_sorting_field: "count",
  },
  displayDefaults: {
    columns: ["name", "count"],
    filters: {},
    sort: { column: "count", direction: "desc" },
    group: null,
    facet: [],
  },
};
