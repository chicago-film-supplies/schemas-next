# CLAUDE.md

## Overview

Shared Zod schemas for CFS Firestore collections, published to JSR as `@cfs/schemas`.

## Setup

- **Deno** runtime
- `deno task setup` — install dependencies and enable git hooks

## Commands

- `deno task check` — type-check (`deno check src/mod.ts`)
- `deno task lint` — lint (includes JSR `no-slow-types` validation)
- `deno task test` — run tests

## Conventions

### JSR imports over npm

Prefer `jsr:` imports over `npm:` when a package is available on JSR. JSR packages are Deno-native, faster to install, and have better type integration.

### Explicit type annotations for JSR (`no-slow-types`)

JSR requires explicit type annotations on all public exports. For Zod schemas, the pattern is:

1. Define the TypeScript interface first
2. Annotate the schema const with `z.ZodType<T>`

```typescript
export interface Contact {
  uid: string;
  name: string;
  emails: string[];
}

export const ContactSchema: z.ZodType<Contact> = z.strictObject({
  uid: z.string(),
  name: z.string().min(1).max(100),
  emails: z.array(Email).default([]),
});
```

This satisfies JSR's `no-slow-types` rule and gives consumers clean importable interfaces.

### Zod 4 API

This package uses Zod 4 (`jsr:@zod/zod@^4`), not Zod 3. Key differences from v3:

- `z.strictObject()` instead of `z.object().strict()`
- `z.email()` instead of `z.string().email()` (top-level string formats)
- `z.infer<>` still works as a type utility but we define interfaces explicitly for JSR

### Schema structure

- `src/common.ts` — shared fragments (Email, Phone, Address, Coordinates, TimestampFields)
- `src/contact.ts` — contact document + input schemas
- `src/organization.ts` — organization document schema
- `src/mod.ts` — re-exports everything

Each schema file exports: Zod schema object, TypeScript interface, and input schemas (where applicable).

### UID property naming

Any `uid` property should be named either `uid` (for the document's own user ID) or `uid_{descriptor}` (e.g., `uid_owner`, `uid_creator`) when referencing another user.

### Dependencies

When introducing a new dependency, always double check you are introducing the latest version.

### Document vs input schemas

- **Document schemas** (`ContactSchema`, `OrganizationSchema`) — full Firestore document shape, use `z.strictObject()`
- **Input schemas** (`CreateContactInput`, `UpdateContactInput`) — what API endpoints accept, use `z.object()` (no strict)
