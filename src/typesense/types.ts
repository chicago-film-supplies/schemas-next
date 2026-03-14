/**
 * Type definitions for Typesense collection schemas.
 */
import { z } from "zod";

const TYPESENSE_FIELD_TYPES = [
  "string", "string[]",
  "int32", "int32[]",
  "int64", "int64[]",
  "float", "float[]",
  "bool", "bool[]",
  "object", "object[]",
] as const;

/** Field type in a Typesense collection schema. */
export type TypesenseFieldType = typeof TYPESENSE_FIELD_TYPES[number];

export const TypesenseFieldTypeEnum: z.ZodType<TypesenseFieldType> =
  z.enum(TYPESENSE_FIELD_TYPES);

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

export const TypesenseFieldSchema: z.ZodType<TypesenseField> = z.strictObject({
  name: z.string(),
  type: TypesenseFieldTypeEnum,
  sort: z.boolean().optional(),
  stem: z.boolean().optional(),
  facet: z.boolean().optional(),
  index: z.boolean().optional(),
  optional: z.boolean().optional(),
});

/** The schema portion passed to the Typesense collections API. */
export interface TypesenseSchema {
  name: string;
  enable_nested_fields?: boolean;
  token_separators?: string[];
  fields: TypesenseField[];
  default_sorting_field?: string;
}

export const TypesenseSchemaSchema: z.ZodType<TypesenseSchema> = z.strictObject({
  name: z.string(),
  enable_nested_fields: z.boolean().optional(),
  token_separators: z.array(z.string()).optional(),
  fields: z.array(TypesenseFieldSchema),
  default_sorting_field: z.string().optional(),
});

/** Display defaults for a Typesense collection in the UI. */
export interface TypesenseDisplayDefaults {
  columns: string[];
  filters: Record<string, (string | boolean)[]>;
  sort: { column: string | null; direction: "asc" | "desc" };
  group: string | null;
  facet: string[];
}

export const TypesenseDisplayDefaultsSchema: z.ZodType<TypesenseDisplayDefaults> = z.strictObject({
  columns: z.array(z.string()),
  filters: z.record(z.string(), z.array(z.union([z.string(), z.boolean()]))),
  sort: z.strictObject({
    column: z.string().nullable(),
    direction: z.enum(["asc", "desc"]),
  }),
  group: z.string().nullable(),
  facet: z.array(z.string()),
});

/** Full collection config with alias, version, and Firestore mapping. */
export interface TypesenseCollectionConfig {
  alias: string;
  version: number;
  firestoreCollection: string;
  collectionName: string;
  schema: TypesenseSchema;
  displayDefaults: TypesenseDisplayDefaults;
}

export const TypesenseCollectionConfigSchema: z.ZodType<TypesenseCollectionConfig> = z.strictObject({
  alias: z.string(),
  version: z.number(),
  firestoreCollection: z.string(),
  collectionName: z.string(),
  schema: TypesenseSchemaSchema,
  displayDefaults: TypesenseDisplayDefaultsSchema,
});
