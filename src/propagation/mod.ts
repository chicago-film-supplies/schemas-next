/**
 * Propagation rules — documents how data flows between Firestore collections.
 *
 * Re-exports types, aggregate definitions, and all concrete rules.
 * The doc generator imports `rules`, `transactions`, and `aggregates` from here.
 */

// ── Types ────────────────────────────────────────────────────────────

export type {
  FieldPath,
  PropagationMode,
  FieldMapping,
  CollectionRule,
  TransactionDefinition,
  AggregateDefinition,
} from "./types.ts";

// ── Aggregates ───────────────────────────────────────────────────────

export { aggregates } from "./aggregates.ts";

// ── Order rules ──────────────────────────────────────────────────────

export {
  createOrderRules,
  createOrderTransaction,
  updateOrderRules,
  updateOrderTransaction,
} from "./orders.ts";

// ── Transaction rules ────────────────────────────────────────────────

export {
  createTransactionRules,
  createTransactionTransaction,
} from "./transactions.ts";

// ── Product rules ────────────────────────────────────────────────────

export {
  createProductRules,
  createProductTransaction,
  updateProductRules,
  updateProductTransaction,
} from "./products.ts";

// ── Organization rules ───────────────────────────────────────────────

export {
  createOrganizationRules,
  createOrganizationTransaction,
  updateOrganizationRules,
  updateOrganizationTransaction,
} from "./organizations.ts";

// ── Contact rules ────────────────────────────────────────────────────

export {
  createContactRules,
  createContactTransaction,
  updateContactRules,
  updateContactTransaction,
} from "./contacts.ts";

// ── Reference data rules ─────────────────────────────────────────────

export {
  updateTagRules,
  deleteTagRules,
  updateTrackingCategoryRules,
  updateLocationTypeRules,
  updateLocationRules,
} from "./reference-data.ts";

// ── Convenience arrays ───────────────────────────────────────────────

import type { CollectionRule, TransactionDefinition } from "./types.ts";

import { createOrderRules, createOrderTransaction, updateOrderRules, updateOrderTransaction } from "./orders.ts";
import { createTransactionRules, createTransactionTransaction } from "./transactions.ts";
import { createProductRules, createProductTransaction, updateProductRules, updateProductTransaction } from "./products.ts";
import { createOrganizationRules, createOrganizationTransaction, updateOrganizationRules, updateOrganizationTransaction } from "./organizations.ts";
import { createContactRules, createContactTransaction, updateContactRules, updateContactTransaction } from "./contacts.ts";
import { updateTagRules, deleteTagRules, updateTrackingCategoryRules, updateLocationTypeRules, updateLocationRules } from "./reference-data.ts";

export const transactions: TransactionDefinition[] = [
  createOrderTransaction,
  updateOrderTransaction,
  createTransactionTransaction,
  createProductTransaction,
  updateProductTransaction,
  createOrganizationTransaction,
  updateOrganizationTransaction,
  createContactTransaction,
  updateContactTransaction,
];

/** All propagation rules across all transactions and cascades. */
export const rules: CollectionRule[] = [
  ...createOrderRules,
  ...updateOrderRules,
  ...createTransactionRules,
  ...createProductRules,
  ...updateProductRules,
  ...createOrganizationRules,
  ...updateOrganizationRules,
  ...createContactRules,
  ...updateContactRules,
  ...updateTagRules,
  ...deleteTagRules,
  ...updateTrackingCategoryRules,
  ...updateLocationTypeRules,
  ...updateLocationRules,
];
