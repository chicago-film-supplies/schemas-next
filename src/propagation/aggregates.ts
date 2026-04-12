/**
 * Aggregate definitions — DDD boundaries grouping collections under consistency roots.
 */
import type { AggregateDefinition } from "./types.ts";

export const aggregates: AggregateDefinition[] = [
  {
    id: "order",
    root: "orders",
    members: ["bookings", "stock-summaries", "public-stock-summaries", "quotes", "order-events"],
    description: "Rental/sale order lifecycle — from quote through active rental to completion",
  },
  {
    id: "product",
    root: "products",
    members: ["webshop-products", "inventory-ledgers"],
    description: "Product catalog and inventory state — the source of truth for what can be rented/sold",
  },
  {
    id: "organization",
    root: "organizations",
    members: [],
    description: "Customer/vendor organizations with billing, tax, and external system references",
  },
  {
    id: "contact",
    root: "contacts",
    members: [],
    description: "Individual people linked to organizations — delivery contacts, billing contacts",
  },
  {
    id: "invoice",
    root: "invoices",
    members: [],
    description: "Financial invoices generated from orders — syncs to Xero for accounting and payment tracking",
  },
  {
    id: "store",
    root: "stores",
    members: ["locations", "location-types"],
    description: "Physical storage locations and their capacity/layout configuration",
  },
  {
    id: "transaction",
    root: "transactions",
    members: ["out-of-service"],
    description: "Inventory movements (purchase, sale, adjustment, transfer) that modify ledger quantities",
  },
  {
    id: "reference-data",
    root: "",
    members: ["tags", "tracking-categories", "chart-of-accounts", "destinations", "templates", "holiday-dates"],
    description: "Shared lookup data referenced by other aggregates — low velocity, high fan-out on change",
  },
  {
    id: "infrastructure",
    root: "",
    members: ["sessions", "email-verifications", "password-resets", "rate-limits", "typesense-config", "cache-geocodes", "webhook-events"],
    description: "System plumbing — auth, caching, search config",
  },
];
