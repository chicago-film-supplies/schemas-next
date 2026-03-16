/**
 * Reference data propagation rules — tag, tracking-category, and location-type cascades.
 *
 * These are post-transaction fan-out operations (batched writes outside the main transaction).
 *
 * Traced from:
 *   api-cloudrun/src/services/tags.ts
 *   api-cloudrun/src/services/trackingCategories.ts
 *   api-cloudrun/src/services/locationTypes.ts
 */
import type { CollectionRule } from "./types.ts";

// ── Tag cascades ─────────────────────────────────────────────────

export const updateTagRules: CollectionRule[] = [
  {
    id: "update-tag:name-to-products",
    source: "tags",
    target: "products",
    mode: "fan-out",
    invariant: "Products embed tag names — a tag rename must cascade to all tagged products",
    trigger: "name change — post-transaction two-pass batch (arrayRemove old, arrayUnion new)",
    fields: [
      { source: "name", target: "tags[].name", transform: "two-pass idempotent: pass 1 removes {uid, oldName}, pass 2 adds {uid, newName}" },
    ],
  },
];

export const deleteTagRules: CollectionRule[] = [
  {
    id: "delete-tag:remove-from-products",
    source: "tags",
    target: "products",
    mode: "fan-out",
    invariant: "Deleting a tag must clean up all product references to prevent orphan refs",
    trigger: "delete — post-transaction batch",
    fields: [
      { source: "uid", target: "tags[]", transform: "arrayRemove tag ref" },
      { source: "uid", target: "query_by_tags[]", transform: "arrayRemove tag uid" },
    ],
  },
];

// ── Tracking category cascades ───────────────────────────────────

export const updateTrackingCategoryRules: CollectionRule[] = [
  {
    id: "update-tracking-category:name-to-products",
    source: "tracking-categories",
    target: "products",
    mode: "fan-out",
    invariant: "Products store tracking category name for display — must cascade on rename",
    trigger: "name change — post-transaction batch with existence check",
    fields: [
      { source: "name", target: "tracking_category_name" },
    ],
  },
];

// ── Location type cascades ───────────────────────────────────────

export const updateLocationTypeRules: CollectionRule[] = [
  {
    id: "update-location-type:capacities-to-locations",
    source: "location-types",
    target: "locations",
    mode: "fan-out",
    invariant: "Location-type capacity defaults cascade to all locations of that type — custom overrides are preserved",
    trigger: "product_capacities change — post-transaction batch (chunks of 400)",
    fields: [
      { source: "product_capacities[].max", target: "product_capacities[].max", transform: "only if location cap matches old default; otherwise updates max_default only" },
      { source: "product_capacities[].max", target: "product_capacities[].max_default", transform: "always updated to new type default" },
      { source: "product_capacities[] (new)", target: "product_capacities[]", transform: "new products added with type defaults" },
    ],
  },
];
