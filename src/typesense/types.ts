/**
 * Type definitions for Typesense collection schemas.
 */

/** Field type in a Typesense collection schema. */
export type TypesenseFieldType =
  | "string"
  | "string[]"
  | "int32"
  | "int32[]"
  | "int64"
  | "int64[]"
  | "float"
  | "float[]"
  | "bool"
  | "bool[]"
  | "object"
  | "object[]";

/** A single field definition in a Typesense collection schema. */
export interface TypesenseField {
  name: string;
  type: TypesenseFieldType;
  sort?: boolean;
  stem?: boolean;
  facet?: boolean;
  index?: boolean;
  optional?: boolean;
}

/** The schema portion passed to the Typesense collections API. */
export interface TypesenseSchema {
  name: string;
  enable_nested_fields?: boolean;
  token_separators?: string[];
  fields: TypesenseField[];
  default_sorting_field?: string;
}

/** Display defaults for a Typesense collection in the UI. */
export interface TypesenseDisplayDefaults {
  columns: string[];
  filters: Record<string, (string | boolean)[]>;
  sort: { column: string | null; direction: "asc" | "desc" };
  group: string | null;
  facet: string[];
}

/** Full collection config with alias, version, and Firestore mapping. */
export interface TypesenseCollectionConfig {
  alias: string;
  version: number;
  firestoreCollection: string;
  collectionName: string;
  schema: TypesenseSchema;
  displayDefaults: TypesenseDisplayDefaults;
}
