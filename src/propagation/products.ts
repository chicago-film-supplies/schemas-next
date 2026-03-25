/**
 * Product propagation rules — create-product and update-product transactions.
 *
 * Traced from: api-cloudrun/src/services/products.ts
 */
import type { CollectionRule, TransactionDefinition } from "./types.ts";

// ── create-product ───────────────────────────────────────────────

export const createProductRules: CollectionRule[] = [
  {
    id: "create-product:product-to-tags",
    source: "products",
    target: "tags",
    mode: "co-write",
    invariant: "Tags track which products reference them for reverse lookup and count display",
    transaction: "create-product",
    fields: [
      { source: ["uid"], target: ["products", "uid"] },
      { source: ["name"], target: ["products", "name"] },
      { source: [], target: ["count"], transform: "FieldValue.increment(1)" },
    ],
  },
  {
    id: "create-product:product-to-tracking-categories",
    source: "products",
    target: "tracking-categories",
    mode: "co-write",
    invariant: "Tracking categories track which products are assigned for Xero reporting",
    transaction: "create-product",
    fields: [
      { source: ["uid"], target: ["products", "uid"] },
      { source: ["name"], target: ["products", "name"] },
      { source: [], target: ["count"], transform: "FieldValue.increment(1)" },
    ],
  },
  {
    id: "create-product:product-to-components",
    source: "products",
    target: "products",
    mode: "co-write",
    invariant: "Component products maintain a back-reference to their parent products",
    transaction: "create-product",
    fields: [
      { source: ["uid"], target: ["component_of", "uid"] },
      { source: ["name"], target: ["component_of", "name"] },
    ],
  },
  {
    id: "create-product:product-to-ledger",
    source: "products",
    target: "inventory-ledgers",
    mode: "co-write",
    invariant: "Products with tracked stock (bulk/serialized) need an inventory ledger from day one",
    transaction: "create-product",
    fields: [
      { source: ["uid"], target: ["uid"] },
      { source: ["type"], target: ["type"] },
      { source: ["stock_method"], target: ["stock_method"] },
    ],
  },
  {
    id: "create-product:product-to-webshop",
    source: "products",
    target: "webshop-products",
    mode: "co-write",
    invariant: "Webshop products are a public-safe subset of the product catalog for the online store",
    transaction: "create-product",
    fields: [
      { source: ["uid"], target: ["uid"] },
      { source: ["name"], target: ["name"] },
      { source: ["description"], target: ["description"] },
      { source: ["type"], target: ["type"] },
      { source: ["stock_method"], target: ["stock_method"] },
      { source: ["active"], target: ["active"] },
      { source: ["price"], target: ["price"], transform: "strips coa_revenue field" },
      { source: ["tags"], target: ["tags"], transform: "copies tag refs" },
      { source: ["components"], target: ["components"], transform: "strips crms fields from component price" },
      { source: ["component_of"], target: ["component_of"], transform: "strips crms fields" },
      { source: ["alternates"], target: ["alternates"] },
      { source: ["shipping"], target: ["shipping"] },
      { source: ["webshop"], target: ["webshop"] },
    ],
  },
];

export const createProductTransaction: TransactionDefinition = {
  id: "create-product",
  description: "Creates a product with tag/category cross-refs, optional inventory ledger, and webshop fan-out. CRMS + Xero sync runs post-transaction.",
  steps: [
    "create-product:product-to-tags",
    "create-product:product-to-tracking-categories",
    "create-product:product-to-components",
    "create-product:product-to-ledger",
    "create-product:product-to-webshop",
  ],
};

// ── update-product ───────────────────────────────────────────────

export const updateProductRules: CollectionRule[] = [
  {
    id: "update-product:name-to-components",
    source: "products",
    target: "products",
    mode: "co-write",
    invariant: "Product name changes cascade to all component and alternate cross-references",
    transaction: "update-product",
    fields: [
      { source: ["name"], target: ["component_of", "name"], transform: "updates name in parent products' component_of map" },
      { source: ["name"], target: ["components", "name"], transform: "updates name in child products' components map" },
      { source: ["name"], target: ["alternates", "name"], transform: "updates name in alternate products" },
    ],
  },
  {
    id: "update-product:name-to-locations",
    source: "products",
    target: "locations",
    mode: "co-write",
    invariant: "Location product lists show product names — must stay current",
    transaction: "update-product",
    fields: [
      { source: ["name"], target: ["products", "name"] },
    ],
  },
  {
    id: "update-product:name-to-tags",
    source: "products",
    target: "tags",
    mode: "co-write",
    invariant: "Tags display product names in their product list",
    transaction: "update-product",
    fields: [
      { source: ["name"], target: ["products", "name"] },
    ],
  },
  {
    id: "update-product:name-to-tracking-categories",
    source: "products",
    target: "tracking-categories",
    mode: "co-write",
    invariant: "Tracking categories display product names",
    transaction: "update-product",
    fields: [
      { source: ["name"], target: ["products", "name"] },
    ],
  },
  {
    id: "update-product:to-webshop",
    source: "products",
    target: "webshop-products",
    mode: "co-write",
    invariant: "All public-facing product fields propagate to the webshop on every update",
    transaction: "update-product",
    fields: [
      { source: ["name"], target: ["name"] },
      { source: ["active"], target: ["active"] },
      { source: ["price"], target: ["price"], transform: "strips coa_revenue" },
      { source: ["tags"], target: ["tags"] },
      { source: ["components"], target: ["components"], transform: "strips crms fields" },
      { source: ["component_of"], target: ["component_of"], transform: "strips crms fields" },
      { source: ["alternates"], target: ["alternates"] },
      { source: ["webshop"], target: ["webshop"] },
    ],
  },
  {
    id: "update-product:tags-to-tags",
    source: "products",
    target: "tags",
    mode: "co-write",
    invariant: "When a product's tag list changes, old tags lose the product ref and new tags gain it",
    transaction: "update-product",
    fields: [
      { source: [], target: ["products"], transform: "tags removed → remove product ref, decrement count" },
      { source: [], target: ["products"], transform: "tags added → add product ref, increment count" },
    ],
  },
  {
    id: "update-product:tracking-category-change",
    source: "products",
    target: "tracking-categories",
    mode: "co-write",
    invariant: "When a product's tracking category changes, old category loses the ref and new one gains it",
    transaction: "update-product",
    fields: [
      { source: [], target: ["products"], transform: "old tracking category → remove product, decrement count" },
      { source: [], target: ["products"], transform: "new tracking category → add product, increment count" },
    ],
  },
  {
    id: "update-product:stock-method-change",
    source: "products",
    target: "inventory-ledgers",
    mode: "co-write",
    invariant: "Changing stock method to 'none' deletes the ledger; changing from 'none' creates one",
    transaction: "update-product",
    fields: [
      { source: ["stock_method"], target: [], transform: "delete ledger if 'none', create empty ledger if 'bulk'/'serialized'" },
    ],
  },
];

export const updateProductTransaction: TransactionDefinition = {
  id: "update-product",
  description: "Updates a product with cascading name changes to components/alternates/locations/tags/tracking-categories, tag/category cross-ref diffs, and webshop fan-out.",
  steps: [
    "update-product:name-to-components",
    "update-product:name-to-locations",
    "update-product:name-to-tags",
    "update-product:name-to-tracking-categories",
    "update-product:to-webshop",
    "update-product:tags-to-tags",
    "update-product:tracking-category-change",
    "update-product:stock-method-change",
  ],
};
