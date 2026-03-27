# @cfs/schemas

Shared Zod 4 schemas for CFS Firestore collections and Typesense collections, published to JSR as `@cfs/schemas`. Also includes programmatically enforceable propagation rules and shared TypeScript types and interfaces.

## Setup

Requires [Deno](https://deno.land/).

```sh
deno task setup   # install dependencies and enable git hooks
```

## Commands

```sh
deno task check   # type-check
deno task lint    # lint (includes JSR no-slow-types validation)
deno task test    # run tests
```

## Publishing

Push to the `beta` branch to trigger a GitHub Actions workflow that runs [semantic-release](https://github.com/semantic-release/semantic-release) and publishes to JSR.

## Commit conventions

This repo uses semantic-release with the **Conventional Commits** preset. The commit message determines the version bump automatically.

### Format

```
<type>(<optional scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type | Version bump | When to use |
|------|-------------|-------------|
| `fix` | Patch (1.0.x) | Bug fixes |
| `feat` | Minor (1.x.0) | New schemas, fields, or features |
| `feat!` / `fix!` / `BREAKING CHANGE:` footer | Major (x.0.0) | Removing/renaming fields, changing validation rules, any change that breaks existing consumers |
| `chore` | No release | Tooling, CI, deps, docs |
| `refactor` | No release | Code restructuring with no behavior change |
| `test` | No release | Adding or updating tests |
| `docs` | No release | Documentation only |

### Scopes

Use the schema/module name as the scope when the change is limited to one area:

```
feat(contact): add middle_name field
fix(order): correct line_items default
feat!: remove deprecated AddressV1 schema
```

### Breaking changes

Any commit that removes a field, renames an export, or changes validation in a way that could break consumers **must** be marked as breaking — either with `!` after the type or a `BREAKING CHANGE:` footer.

## Project structure

- `src/common.ts` — shared fragments (Email, Phone, Address, Coordinates, TimestampFields)
- `src/mod.ts` — re-exports all schemas
- `src/typesense/` — Typesense collection schemas
- `tests/` — test suite

## Schema conventions

- **Document schemas** (`ContactSchema`, `OrganizationSchema`) use `z.strictObject()` — rejects unknown properties
- **Input schemas** (`CreateContactInput`, `UpdateContactInput`) use `z.object()` — silently strips unknown properties

This applies to nested objects within each schema type as well.

## License

MIT
