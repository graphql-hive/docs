# Hive Docs

GraphQL Hive documentation site.

## Quick Start

```bash
bun install
bun dev
```

## Structure

- `packages/documentation/` - TanStack Start + Fumadocs docs site
- `packages/design-system/` - React components with Tailwind CSS v4

## Commands

```bash
bun build        # Build all packages
bun test         # Run tests
bun fix          # Lint and format
```

## Tech

- Bun + Turborepo
- React 19 + TypeScript
- TanStack Start + Fumadocs
- Tailwind CSS v4
- Playwright testing

## Choices

- Using Mermaid Rehype plugin instead of runtime mermaid to save bundle size
