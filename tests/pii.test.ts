/**
 * PII classification enforcement test.
 *
 * Walks document and input schemas, asserts that fields matching sensitive
 * key patterns always carry a `.meta({ pii })` annotation.
 */
import { assertEquals } from "@std/assert";
import { z } from "zod";

import { ContactSchema, CreateContactInput, UpdateContactInput } from "../src/contact.ts";
import {
  OrganizationSchema,
  CreateOrganizationInput,
  UpdateOrganizationInput,
  NewContactInput,
} from "../src/organization.ts";
import {
  OrderSchema,
  CreateOrderInput,
  UpdateOrderInput,
} from "../src/order.ts";
import { InvoiceSchema } from "../src/invoice.ts";
import { BookingSchema } from "../src/booking.ts";
import { UserSchema } from "../src/user.ts";
import { LoginInput, RegisterInput, ResetPasswordInput, EmailInput } from "../src/auth.ts";
import { LogRecordSchema } from "../src/log.ts";

// ── Sensitive field patterns ─────────────────────────────────────────

/** Fields that MUST have a `pii` meta value when they appear at any depth. */
const SENSITIVE_EXACT = new Set([
  "email",
  "emails",
  "password",
  "password_hash",
  "token",
  "user_id",
  "phones",
  "billing_address",
  "address",
  "external_notes",
  "internal_notes",
]);

/** Field names that require `pii` when they appear in contact/org/user-adjacent schemas. */
const SENSITIVE_NAME_FIELD = "name";

/** Schemas where a top-level or nested `name` field refers to a person/org and needs PII. */
const NAME_SENSITIVE_SCHEMAS = new Set([
  "ContactSchema",
  "CreateContactInput",
  "UpdateContactInput",
  "OrganizationSchema",
  "CreateOrganizationInput",
  "UpdateOrganizationInput",
  "NewContactInput",
]);

// ── Helpers ──────────────────────────────────────────────────────────

/**
 * Unwrap wrapper types (optional, default, nullable) to reach the inner
 * schema where `.meta()` was called.
 */
function unwrap(schema: z.ZodType): z.ZodType {
  const def = (schema as unknown as { _zod: { def: { type: string; innerType?: z.ZodType } } })._zod.def;
  if (
    (def.type === "optional" || def.type === "default" || def.type === "nullable") &&
    def.innerType
  ) {
    return unwrap(def.innerType);
  }
  return schema;
}

function getMeta(schema: z.ZodType): Record<string, unknown> | undefined {
  return z.globalRegistry.get(schema) as Record<string, unknown> | undefined;
}

type ZodDef = { type: string; innerType?: z.ZodType; element?: z.ZodType; shape?: Record<string, z.ZodType> };

function getDef(schema: z.ZodType): ZodDef {
  return (schema as unknown as { _zod: { def: ZodDef } })._zod.def;
}

function hasPii(schema: z.ZodType): boolean {
  // Check meta at this level
  if (getMeta(schema)?.pii) return true;

  const def = getDef(schema);

  // Unwrap one level and recurse
  if (
    (def.type === "optional" || def.type === "default" || def.type === "nullable") &&
    def.innerType
  ) {
    return hasPii(def.innerType);
  }

  // For arrays, check element type (e.g. z.array(Email) where Email has pii)
  if (def.type === "array" && def.element) {
    return hasPii(def.element);
  }

  return false;
}

type ShapeDef = { type: string; shape?: Record<string, z.ZodType>; innerType?: z.ZodType };

function getShape(schema: z.ZodType): Record<string, z.ZodType> | null {
  const def = (schema as unknown as { _zod: { def: ShapeDef } })._zod.def;
  if (def.shape) return def.shape;
  if (def.innerType) return getShape(def.innerType);
  return null;
}

// ── Collect violations ───────────────────────────────────────────────

interface Violation {
  schema: string;
  field: string;
}

function checkSchema(
  schemaName: string,
  schema: z.ZodType,
  nameIsSensitive: boolean,
): Violation[] {
  const violations: Violation[] = [];
  const shape = getShape(schema);
  if (!shape) return violations;

  for (const [key, fieldSchema] of Object.entries(shape)) {
    const isSensitive =
      SENSITIVE_EXACT.has(key) ||
      (key === SENSITIVE_NAME_FIELD && nameIsSensitive);

    if (isSensitive && !hasPii(fieldSchema)) {
      violations.push({ schema: schemaName, field: key });
    }

    // Recurse into nested objects (denormalized org, destinations, etc.)
    // Don't flag `name` inside nested objects — those are typically labels
    // (e.g. address.name), not person/org names.
    const innerShape = getShape(unwrap(fieldSchema));
    if (innerShape) {
      for (const [nestedKey, nestedSchema] of Object.entries(innerShape)) {
        if (!SENSITIVE_EXACT.has(nestedKey)) continue;
        if (!hasPii(nestedSchema)) {
          violations.push({ schema: schemaName, field: `${key}.${nestedKey}` });
        }
      }
    }
  }

  return violations;
}

// ── Tests ────────────────────────────────────────────────────────────

const ALL_SCHEMAS: [string, z.ZodType, boolean][] = [
  // [name, schema, whether `name` field is PII-sensitive]
  ["ContactSchema", ContactSchema, true],
  ["CreateContactInput", CreateContactInput, true],
  ["UpdateContactInput", UpdateContactInput, true],
  ["OrganizationSchema", OrganizationSchema, true],
  ["CreateOrganizationInput", CreateOrganizationInput, true],
  ["UpdateOrganizationInput", UpdateOrganizationInput, true],
  ["NewContactInput", NewContactInput, true],
  ["OrderSchema", OrderSchema, false],
  ["CreateOrderInput", CreateOrderInput, false],
  ["UpdateOrderInput", UpdateOrderInput, false],
  ["InvoiceSchema", InvoiceSchema, false],
  ["BookingSchema", BookingSchema, false],
  ["UserSchema", UserSchema, false],
  ["LoginInput", LoginInput, false],
  ["RegisterInput", RegisterInput, false],
  ["ResetPasswordInput", ResetPasswordInput, false],
  ["EmailInput", EmailInput, false],
  ["LogRecordSchema", LogRecordSchema, false],
];

Deno.test("sensitive fields have PII meta annotations", () => {
  const allViolations: Violation[] = [];

  for (const [name, schema, nameIsSensitive] of ALL_SCHEMAS) {
    allViolations.push(...checkSchema(name, schema, nameIsSensitive));
  }

  assertEquals(
    allViolations,
    [],
    `Fields missing pii meta:\n${allViolations.map((v) => `  ${v.schema}.${v.field}`).join("\n")}`,
  );
});
