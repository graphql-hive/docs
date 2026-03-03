## Complete Migration Checklist (from codemod source)

### Template Migrations (class renames)

#### Simple Legacy Classes

- [ ] `overflow-ellipsis` → `text-ellipsis`
- [ ] `flex-grow` → `grow`
- [ ] `flex-grow-0` → `grow-0`
- [ ] `flex-shrink` → `shrink`
- [ ] `flex-shrink-0` → `shrink-0`
- [ ] `decoration-clone` → `box-decoration-clone`
- [ ] `decoration-slice` → `box-decoration-slice`
- [ ] `outline-none` → `outline-hidden` (v3→v4 only)
- [ ] `bg-left-top` → `bg-top-left`
- [ ] `bg-left-bottom` → `bg-bottom-left`
- [ ] `bg-right-top` → `bg-top-right`
- [ ] `bg-right-bottom` → `bg-bottom-right`
- [ ] `object-left-top` → `object-top-left`
- [ ] `object-left-bottom` → `object-bottom-left`
- [ ] `object-right-top` → `object-top-right`
- [ ] `object-right-bottom` → `object-bottom-right`

#### Scale-shifted Classes (values changed)

- [ ] `shadow` → `shadow-sm`
- [ ] `shadow-sm` → `shadow-xs`
- [ ] `shadow-xs` → `shadow-2xs`
- [ ] `inset-shadow` → `inset-shadow-sm`
- [ ] `inset-shadow-sm` → `inset-shadow-xs`
- [ ] `inset-shadow-xs` → `inset-shadow-2xs`
- [ ] `drop-shadow` → `drop-shadow-sm`
- [ ] `drop-shadow-sm` → `drop-shadow-xs`
- [ ] `rounded` → `rounded-sm`
- [ ] `rounded-sm` → `rounded-xs`
- [ ] `blur` → `blur-sm`
- [ ] `blur-sm` → `blur-xs`
- [ ] `backdrop-blur` → `backdrop-blur-sm`
- [ ] `backdrop-blur-sm` → `backdrop-blur-xs`
- [ ] `ring` → `ring-3`
- [ ] `outline` → `outline-solid`

### CSS Migrations

#### Directives

- [ ] `@tailwind base/components/utilities` → `@import "tailwindcss"`
- [ ] `@layer utilities { ... }` → `@utility name { ... }`
- [ ] `@variants` directive → removed (use variant syntax in classes)
- [ ] `theme()` function → `var(--theme-key)`
- [ ] `@apply` in Vue/Svelte → needs `@reference`

#### Theme

- [ ] `theme(colors.X)` → `var(--color-X)`
- [ ] `theme(screens.X)` → `theme(--breakpoint-X)` in media queries

### NOT Handled by Codemod (Manual fixes needed)

#### Default Value Changes

- Border color: `gray-200` → `currentColor` (add explicit colors)
- Ring width: `3px` → `1px` (use `ring-3` for old behavior)
- Colors now use OKLCH (may affect exact color matching)

### Verification

The scale-shifted classes (`shadow`→`shadow-sm`→`shadow-xs`) can't be verified by grep—no way to tell if `shadow-sm` is migrated or not.

Only the codemod knows (it checks if migrating from v3 and refuses to re-run).
