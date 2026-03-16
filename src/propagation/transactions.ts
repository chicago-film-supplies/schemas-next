/**
 * Transaction propagation rules — create-transaction.
 *
 * Traced from: api-cloudrun/src/services/transactions.ts
 */
import type { CollectionRule, TransactionDefinition } from "./types.ts";

export const createTransactionRules: CollectionRule[] = [
  {
    id: "create-transaction:transaction-to-ledger",
    source: "transactions",
    target: "inventory-ledgers",
    mode: "co-write",
    invariant: "Every inventory transaction immediately updates the ledger — the ledger is the source of truth for current stock levels",
    transaction: "create-transaction",
    fields: [
      { source: "quantity", target: "quantity_held", transform: "± based on transaction type multiplier" },
      { source: "quantity", target: "quantity_in_service", transform: "± based on transaction type multiplier" },
      { source: "total_cost", target: "total_cost_basis", transform: "± based on transaction type" },
      { source: "total_cost", target: "average_unit_cost", transform: "total_cost_basis / quantity_held" },
      { source: "stores[].locations[].transactionQuantity", target: "store_breakdown[].locations[].quantity", transform: "± per location" },
    ],
  },
  {
    id: "create-transaction:transaction-to-locations",
    source: "transactions",
    target: "locations",
    mode: "co-write",
    invariant: "Locations track which products are stored there and how many, updated on every transaction",
    transaction: "create-transaction",
    fields: [
      { source: "uid_product", target: "products[].uid" },
      { source: "(product name)", target: "products[].name" },
      { source: "stores[].locations[].transactionQuantity", target: "products[].quantity", transform: "± per location" },
      { source: "uid_product", target: "product_capacities[].uid", transform: "creates capacity entry if missing, using location-type defaults" },
      { source: "uid_product", target: "query_by_products", transform: "adds product uid if missing" },
    ],
  },
  {
    id: "create-transaction:ledger-to-stock-summaries",
    source: "inventory-ledgers",
    target: "stock-summaries",
    mode: "co-write",
    invariant: "Stock summaries are recalculated from the updated ledger after every transaction",
    transaction: "create-transaction",
    fields: [
      { source: "quantity_held", target: "quantity_held" },
      { source: "quantity_in_service", target: "quantity_in_service" },
      { source: "quantity_out_of_service", target: "quantity_out_of_service" },
      { source: "store_breakdown", target: "store_breakdown" },
      { source: "(derived)", target: "quantity_available", transform: "quantity_held - quantity_booked - quantity_out_of_service" },
    ],
  },
  {
    id: "create-transaction:stock-to-public-stock",
    source: "stock-summaries",
    target: "public-stock-summaries",
    mode: "derive",
    invariant: "Public view updated whenever stock summaries change",
    transaction: "create-transaction",
    fields: [
      { source: "*", target: "*", transform: "same derivation as order rules — simplified store_breakdown" },
    ],
  },
];

export const createTransactionTransaction: TransactionDefinition = {
  id: "create-transaction",
  description: "Creates an inventory transaction, updates ledger quantities, location product tracking, and recalculates all stock summaries for the product.",
  steps: [
    "create-transaction:transaction-to-ledger",
    "create-transaction:transaction-to-locations",
    "create-transaction:ledger-to-stock-summaries",
    "create-transaction:stock-to-public-stock",
  ],
};
