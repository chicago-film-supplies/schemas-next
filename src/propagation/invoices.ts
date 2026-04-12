/**
 * Invoice propagation rules — order items fan-out to unpaid invoices.
 *
 * When an order's items change, any unpaid invoice (payments.length === 0)
 * that references the order via uid_orders is updated:
 * - Items scoped to the order (under its order divider) are rebuilt
 * - Invoice-specific overrides (coa_revenue, tracking_category, xero_id) are
 *   carried forward on items matched by uid
 * - Totals are recalculated server-side after item sync
 *
 * Traced from: api-cloudrun/src/services/orders.ts (planned)
 */
import type { CollectionRule } from "./types.ts";

export const updateOrderInvoiceRules: CollectionRule[] = [
  {
    id: "update-order:items-to-invoices",
    source: "orders",
    target: "invoices",
    mode: "fan-out",
    invariant: "Unpaid invoices stay in sync with their source orders — items scoped by order divider are rebuilt when the order changes",
    trigger: "items change on order — targets invoices where uid_orders contains order uid AND payments is empty",
    fields: [
      { source: ["uid"], target: ["items", "uid_order"], transform: "match order divider by uid_order to scope removal/rebuild" },
      { source: ["items"], target: ["items"], transform: "rebuild items under the order divider: add new, update existing (carry forward coa_revenue, tracking_category, xero_id), remove deleted. path prepends order divider uid." },
      { source: ["items"], target: ["totals"], transform: "recalculate totals server-side after item sync" },
    ],
  },
  {
    id: "update-order:status-to-invoices",
    source: "orders",
    target: "invoices",
    mode: "fan-out",
    invariant: "When an order is canceled, unpaid invoices referencing it remove the order's scoped items and uid from uid_orders",
    trigger: "status change to canceled — targets invoices where uid_orders contains order uid AND payments is empty",
    fields: [
      { source: ["uid"], target: ["uid_orders"], transform: "remove order uid from uid_orders array" },
      { source: ["uid"], target: ["items"], transform: "remove order divider and all items under its path scope" },
      { source: [], target: ["totals"], transform: "recalculate totals after scoped removal" },
    ],
  },
];
