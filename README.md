# DocSearch

DocSearch is organized as a monorepo.

## Workspaces

- `packages/core`: shared documentation registry, search clients, formatters, and types.
- `apps/raycast`: Raycast extension. The directory keeps the normal Raycast extension shape with `package.json`, `src`, `assets`, and `metadata`.

The VSCode extension has not been added yet.

## Commands

```bash
npm run typecheck
npm run test:core
npm run build
```
