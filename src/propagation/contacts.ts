/**
 * Contact propagation rules — create and update transactions.
 *
 * Traced from: api-cloudrun/src/services/contacts.ts
 */
import type { CollectionRule, TransactionDefinition } from "./types.ts";

// ── create-contact ───────────────────────────────────────────────

export const createContactRules: CollectionRule[] = [
  {
    id: "create-contact:contact-to-orgs",
    source: "contacts",
    target: "organizations",
    mode: "co-write",
    invariant: "Organizations maintain a list of contacts for bidirectional navigation",
    transaction: "create-contact",
    fields: [
      { source: ["uid"], target: ["contacts", "uid"] },
      { source: ["name"], target: ["contacts", "name"] },
      { source: ["uid"], target: ["query_by_contacts"] },
    ],
  },
];

export const createContactTransaction: TransactionDefinition = {
  id: "create-contact",
  description: "Creates a contact with bidirectional organization cross-references.",
  steps: [
    "create-contact:contact-to-orgs",
  ],
};

// ── update-contact ───────────────────────────────────────────────

export const updateContactRules: CollectionRule[] = [
  {
    id: "update-contact:name-to-orgs",
    source: "contacts",
    target: "organizations",
    mode: "fan-out",
    invariant: "Organizations display contact names in their contacts list",
    transaction: "update-contact",
    fields: [
      { source: ["name"], target: ["contacts", "name"] },
    ],
  },
  {
    id: "update-contact:name-to-orders",
    source: "contacts",
    target: "orders",
    mode: "fan-out",
    invariant: "Active orders embed delivery/collection contact names in destinations",
    transaction: "update-contact",
    trigger: "name change — targets active orders (not canceled/complete)",
    fields: [
      { source: ["name"], target: ["destinations", "delivery", "contact", "name"] },
      { source: ["name"], target: ["destinations", "collection", "contact", "name"] },
    ],
  },
  {
    id: "update-contact:phones-to-orders",
    source: "contacts",
    target: "orders",
    mode: "fan-out",
    invariant: "Active orders embed delivery/collection contact phones for logistics",
    transaction: "update-contact",
    trigger: "phones change — targets active orders",
    fields: [
      { source: ["phones"], target: ["destinations", "delivery", "contact", "phones"] },
      { source: ["phones"], target: ["destinations", "collection", "contact", "phones"] },
    ],
  },
  {
    id: "update-contact:orgs-change",
    source: "contacts",
    target: "organizations",
    mode: "co-write",
    invariant: "When a contact's org list changes, added/removed orgs update their contact back-references",
    transaction: "update-contact",
    fields: [
      { source: [], target: ["contacts"], transform: "orgs added → add contact ref {uid, name, roles: []}" },
      { source: [], target: ["contacts"], transform: "orgs removed → remove contact ref" },
      { source: [], target: ["query_by_contacts"], transform: "orgs added → add contact uid" },
      { source: [], target: ["query_by_contacts"], transform: "orgs removed → remove contact uid" },
    ],
  },
];

export const updateContactTransaction: TransactionDefinition = {
  id: "update-contact",
  description: "Updates a contact with name cascades to organizations and active order destinations, phone cascades to active orders, and bidirectional org membership maintenance.",
  steps: [
    "update-contact:name-to-orgs",
    "update-contact:name-to-orders",
    "update-contact:phones-to-orders",
    "update-contact:orgs-change",
  ],
};
