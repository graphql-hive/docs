# Tailwind CSS v3 to v4 Migration Guide

> Reference for migrating hive-docs tailwind config

## Using the upgrade tool

```bash
npx @tailwindcss/upgrade
```

Requires Node.js 20+.

## Manual Upgrade

### Using Vite

```ts
// vite.config.ts
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  plugins: [tailwindcss()],
});
```

## Key Changes from v3

### Removed @tailwind directives

```css
/* v3 */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* v4 */
@import "tailwindcss";
```

### Renamed utilities

| v3           | v4             |
| ------------ | -------------- |
| shadow-sm    | shadow-xs      |
| shadow       | shadow-sm      |
| blur-sm      | blur-xs        |
| blur         | blur-sm        |
| rounded-sm   | rounded-xs     |
| rounded      | rounded-sm     |
| outline-none | outline-hidden |
| ring         | ring-3         |

### Removed deprecated utilities

| Deprecated        | Replacement                                  |
| ----------------- | -------------------------------------------- |
| bg-opacity-\*     | Use opacity modifiers like `bg-black/50`     |
| text-opacity-\*   | Use opacity modifiers like `text-black/50`   |
| border-opacity-\* | Use opacity modifiers like `border-black/50` |
| flex-shrink-\*    | shrink-\*                                    |
| flex-grow-\*      | grow-\*                                      |

### Default border color

Changed from `gray-200` to `currentColor`. Add explicit colors:

```html
<div class="border border-gray-200 px-2 py-3"></div>
```

### Default ring width

Changed from 3px to 1px. Replace `ring` with `ring-3`:

```html
<button class="focus:ring-3 focus:ring-blue-500"></button>
```

### Adding custom utilities

```css
/* v3 */
@layer utilities {
  .tab-4 {
    tab-size: 4;
  }
}

/* v4 */
@utility tab-4 {
  tab-size: 4;
}
```

### Variant stacking order

v4 applies left to right (like CSS):

```html
<!-- v3 -->
<ul class="first:*:pt-0 last:*:pb-0">
  <!-- v4 -->
  <ul class="*:first:pt-0 *:last:pb-0"></ul>
</ul>
```

### Variables in arbitrary values

```html
<!-- v3 -->
<div class="bg-[--brand-color]"></div>

<!-- v4 -->
<div class="bg-(--brand-color)"></div>
```

### theme() function

Use CSS variables instead:

```css
/* v3 */
.my-class {
  background-color: theme(colors.red.500);
}

/* v4 */
.my-class {
  background-color: var(--color-red-500);
}
```

For media queries:

```css
/* v3 */
@media (width >= theme(screens.xl)) {
}

/* v4 */
@media (width >= theme(--breakpoint-xl)) {
}
```

### JavaScript config

No longer auto-detected. Load explicitly:

```css
@config "../../tailwind.config.js";
```

### Using @apply with Vue, Svelte, or CSS modules

Use `@reference` to import definitions:

```vue
<style>
@reference "../../app.css";
h1 {
  @apply text-2xl font-bold text-red-500;
}
</style>
```

Or use CSS variables directly:

```vue
<style>
h1 {
  color: var(--text-red-500);
}
</style>
```

## Browser Requirements

Safari 16.4+, Chrome 111+, Firefox 128+. Uses `@property` and `color-mix()`.
