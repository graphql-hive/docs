# Hive Docs Migration Loop

Run with: `claude -p "$(cat MIGRATION_LOOP_PROMPT.md)" --model sonnet`

---

You are migrating hive-docs from the old graphql-hive docs. Your goal is to find visual/functional differences and fix them.

## Locations

- **New docs (local):** http://localhost:1440
- **Old docs (production):** https://the-guild.dev/graphql/hive
- **New codebase:** /Users/hasparus/workspace/hive-docs
- **Old codebase:** /Users/hasparus/workspace/graphql-hive/packages/web/docs

## Loop

Repeat until no more differences found:

1. **Compare visually** using agent-browser
   - Open both sites side by side (use --session for parallel)
   - Take screenshots of same pages
   - Look for: colors, spacing, typography, layout, components, interactions

2. **Identify a difference**
   - Describe what's wrong
   - Note which page/component is affected

3. **Investigate**
   - Find the component in both codebases
   - Check Tailwind classes, CSS, component logic
   - Understand why the difference exists

4. **Decide: Fix or Backlog**

   **Fix if:**
   - Missing Tailwind color/utility
   - Missing CSS variable
   - Simple component style difference
   - Configuration issue

   **Backlog if:**
   - Requires new component implementation
   - Needs significant refactoring
   - Involves framework differences (Next.js vs TanStack Start)
   - Would take >30 min to fix properly

5. **Act**
   - If fixing: Edit files in /Users/hasparus/workspace/hive-docs, verify with agent-browser
   - If backlogging: Append to BACKLOG.md with description and file references

## BACKLOG.md format

```markdown
## [Component/Page Name]

**Difference:** What looks/works wrong
**Old:** path/to/old/file.tsx:line
**New:** path/to/new/file.tsx:line
**Reason:** Why it's hard to fix
**Effort:** S/M/L
```

## Key files

- Tailwind config: `hive-docs/packages/documentation/src/styles/app.css`
- Design system: `hive-docs/packages/design-system/src/`
- Old tailwind: `graphql-hive/packages/web/docs/tailwind.config.ts`

## Pages to check

1. / (landing page)
2. /docs
3. /docs/get-started/first-steps
4. /pricing
5. /federation
6. /gateway

## agent-browser commands

```bash
agent-browser --session new open http://localhost:1440
agent-browser --session old open https://the-guild.dev/graphql/hive
agent-browser --session new screenshot /tmp/new-home.png
agent-browser --session old screenshot /tmp/old-home.png
```

## Start

Begin by comparing the landing pages. Take screenshots of both, identify the first difference, and proceed with the loop.
