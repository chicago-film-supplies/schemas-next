import type { TypesenseCollectionConfig } from "./types.ts";

/** Typesense collection config for comments. */
export const comments: TypesenseCollectionConfig = {
  alias: "comments",
  version: 1,
  firestoreCollection: "comments",
  collectionName: "comments_v1",
  schema: {
    name: "comments_v1",
    enable_nested_fields: true,
    fields: [
      { name: "uid", type: "string", sort: true, facet: false },
      { name: "uid_thread", type: "string", index: true, facet: true },
      { name: "sources", type: "object[]" },
      { name: "sources.collection", type: "string[]", facet: true },
      { name: "sources.uid", type: "string[]", facet: true, index: true },
      { name: "body_text", type: "string", stem: true, sort: false, facet: false },
      { name: "uid_creator", type: "string", facet: true, index: true },
      { name: "creator_name", type: "string", facet: true, optional: true },
      { name: "deleted_at", type: "int64", index: true, sort: true, facet: false, optional: true },
      { name: "created_at", type: "int64", sort: true, index: true, facet: false },
      { name: "updated_at", type: "int64", sort: true, index: true, facet: false, optional: true },
    ],
    default_sorting_field: "created_at",
  },
  synonyms: [],
  displayDefaults: {
    columns: ["sources.collection", "creator_name", "body_text", "updated_at"],
    filters: {},
    sort: { column: "updated_at", direction: "desc" },
    group: null,
    facet: [],
  },
};
