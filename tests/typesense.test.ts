import { assertEquals } from "@std/assert";
import {
  bookings,
  chartOfAccounts,
  contacts,
  destinations,
  invoices,
  locations,
  orders,
  organizations,
  products,
  stores,
  tags,
  templates,
  trackingCategories,
  typesenseSchemas,
  webshopProducts,
} from "../src/typesense/mod.ts";

const allConfigs = [
  bookings,
  chartOfAccounts,
  contacts,
  destinations,
  invoices,
  locations,
  orders,
  organizations,
  products,
  stores,
  tags,
  templates,
  trackingCategories,
  webshopProducts,
];

Deno.test("all configs have required properties", () => {
  for (const config of allConfigs) {
    assertEquals(typeof config.alias, "string");
    assertEquals(typeof config.version, "number");
    assertEquals(typeof config.firestoreCollection, "string");
    assertEquals(typeof config.collectionName, "string");
    assertEquals(config.collectionName, `${config.alias}_v${config.version}`);
    assertEquals(Array.isArray(config.schema.fields), true);
    assertEquals(config.schema.fields.length > 0, true);
  }
});

Deno.test("typesenseSchemas contains all aliases", () => {
  for (const config of allConfigs) {
    assertEquals(typesenseSchemas[config.alias], config);
  }
  assertEquals(Object.keys(typesenseSchemas).length, allConfigs.length);
});

Deno.test("schema.name matches collectionName", () => {
  for (const config of allConfigs) {
    assertEquals(config.schema.name, config.collectionName);
  }
});

Deno.test("each field has a name and valid type", () => {
  const validTypes = new Set([
    "string", "string[]",
    "int32", "int32[]",
    "int64", "int64[]",
    "float", "float[]",
    "bool", "bool[]",
    "object", "object[]",
  ]);
  for (const config of allConfigs) {
    for (const field of config.schema.fields) {
      assertEquals(typeof field.name, "string", `${config.alias}: field missing name`);
      assertEquals(validTypes.has(field.type), true, `${config.alias}.${field.name}: invalid type "${field.type}"`);
    }
  }
});
