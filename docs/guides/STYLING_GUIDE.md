# Styling Guide: 7-1 Pattern with CSS Modules

Complete developer documentation for the styling system in RA Portfolio.

## Table of Contents

1. [Overview](#overview)
2. [7-1 Folder Structure](#7-1-folder-structure)
3. [CSS Modules Integration](#css-modules-integration)
4. [Design Token Usage](#design-token-usage)
5. [Utility Classes](#utility-classes)
6. [Component Migration Guide](#component-migration-guide)
7. [Best Practices](#best-practices)
8. [Quick Reference](#quick-reference)

---

## Overview

This project uses a hybrid styling architecture that combines:

- **7-1 SCSS Pattern**: For global design tokens, layout, themes, and utilities
- **CSS Modules**: For component-scoped styles that prevent naming conflicts

This approach provides the best of both worlds: a consistent design system with scoped component styles.

### Key Benefits

- ✅ **Consistent Design System**: All components use shared design tokens
- ✅ **No Style Conflicts**: CSS Modules scope class names automatically
- ✅ **Theme Support**: Light/dark themes work seamlessly
- ✅ **Performance**: Tree-shaking removes unused styles
- ✅ **Developer Experience**: Clear patterns and autocomplete support

---

## 7-1 Folder Structure

The 7-1 pattern organizes styles into 7 folders plus 1 main file:

```
src/assets/
├── index.scss              # Main entry point (imports all folders)
├── abstracts/              # Design tokens (NO CSS output)
│   ├── _index.scss         # Forwards all abstracts
│   ├── _variables.scss     # Spacing, borders, z-index, transitions
│   ├── _colours.scss       # Color families and palettes
│   ├── _typography.scss    # Font sizes, weights, line heights
│   ├── _mixins.scss        # Reusable SCSS mixins
│   ├── _functions.scss     # SCSS functions for calculations
│   └── _breakpoints.scss   # Responsive breakpoint definitions
├── vendors/                # Third-party CSS
│   └── _normalize.scss     # CSS reset/normalize
├── base/                   # Base HTML element styles
│   ├── _reset.scss         # Custom reset rules
│   ├── _typography.scss    # Base typography styles
│   └── _animations.scss    # Global animation definitions
├── layout/                 # Layout-level styles
│   ├── _grid.scss          # Grid system
│   ├── _container.scss     # Container styles
│   ├── _header.scss        # Global header layout
│   ├── _footer.scss        # Global footer layout
│   └── _navigation.scss    # Navigation layout
├── components/             # Global component styles (minimal)
│   └── _buttons.scss       # Global button utilities
├── pages/                  # Page-specific global styles (minimal)
│   └── _home.scss          # Home page specific globals
├── themes/                 # Theme definitions
│   ├── _light.scss         # Light theme variables
│   ├── _dark.scss          # Dark theme variables
│   └── _theme-mixins.scss  # Theme-aware mixins
└── utilities/              # Utility classes
    ├── _index.scss         # Forwards all utilities
    ├── _spacing.scss       # Margin/padding utilities
    ├── _flexbox.scss       # Flexbox utilities
    ├── _text.scss          # Text utilities
    └── _animations.scss    # Animation utilities
```

### Folder Purposes

| Folder        | Purpose                               | CSS Output |
| ------------- | ------------------------------------- | ---------- |
| `abstracts/`  | Design tokens, mixins, functions      | ❌ No      |
| `vendors/`    | Third-party CSS (normalize, etc.)     | ✅ Yes     |
| `base/`       | HTML element defaults, reset          | ✅ Yes     |
| `layout/`     | Page structure (header, footer, grid) | ✅ Yes     |
| `components/` | Global component patterns             | ✅ Yes     |
| `pages/`      | Page-specific global styles           | ✅ Yes     |
| `themes/`     | Theme CSS custom properties           | ✅ Yes     |
| `utilities/`  | Utility classes (spacing, flex)       | ✅ Yes     |

### Import Order

The import order in `index.scss` is critical for proper CSS cascade:

```scss
// 1. Vendors (third-party base)
@use 'vendors/normalize';

// 2. Base (your foundation)
@use 'base/reset';
@use 'base/typography';
@use 'base/animations';

// 3. Layout (structure)
@use 'layout/grid';
@use 'layout/container';
@use 'layout/header';
@use 'layout/footer';
@use 'layout/navigation';

// 4. Components (global patterns)
@use 'components/buttons';

// 5. Pages (specific globals)
@use 'pages/home';

// 6. Utilities (highest specificity)
@use 'utilities/spacing';
@use 'utilities/flexbox';
@use 'utilities/text';
@use 'utilities/animations';
```

---

## CSS Modules Integration

### Component Structure

Each component with styles follows this structure:

```
src/components/component-name/
├── components/
│   └── component-name.tsx      # React component
├── assets/
│   └── component-name.module.scss  # CSS Module
└── types/
    └── component-name.types.ts # TypeScript types
```

### Creating a CSS Module

**Step 1**: Create the module file with `.module.scss` extension:

```scss
// component-name.module.scss

// Always import abstracts for design tokens
@use 'sass:map';
@use '@assets/abstracts' as *;

.container {
  // Use design tokens, not hardcoded values
  padding: map.get($spacing, lg);
  @include border-radius(map.get($border, md));

  // Use theme variables for colors
  background: var(--surface-colour);
  color: var(--text-colour);
}

.title {
  @include font-style(map.get($font-sizes, xl), map.get($font-weights, bold));
  margin-bottom: map.get($spacing, md);
}
```

**Step 2**: Import and use in your component:

```tsx
// component-name.tsx
import styles from '../assets/component-name.module.scss';

const ComponentName: React.FC = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Title</h2>
    </div>
  );
};
```

### Combining Module and Global Classes

You can combine CSS Module classes with global utility classes:

```tsx
// Using both module classes and global utilities
<div className={`${styles.card} p-lg animate-fade-in`}>
  <h3 className={styles.title}>Card Title</h3>
  <p className="text-muted">Description</p>
</div>
```

### Class Name Generation

- **Development**: `[name]__[local]__[hash:base64:5]` (readable)
- **Production**: `[hash:base64:5]` (optimized)

---

## Design Token Usage

### Spacing Scale

Use the `$spacing` map for all spacing values:

```scss
$spacing: (
  0: 0,
  '3xs': 0.125rem,
  // 2px
  '2xs': 0.25rem,
  // 4px
  xs: 0.5rem,
  // 8px
  sm: 0.75rem,
  // 12px
  md: 1rem,
  // 16px (base)
  lg: 1.25rem,
  // 20px
  xl: 1.5rem,
  // 24px
  '2xl': 2rem,
  // 32px
  '3xl': 3rem,
  // 48px
  '4xl': 4rem,
  // 64px
  '5xl': 6rem,
  // 96px
  '6xl': 8rem,
  // 128px
  '7xl': 12rem,
  // 192px
);

// Usage
padding: map.get($spacing, md); // 1rem
margin: map.get($spacing, lg); // 1.25rem
gap: map.get($spacing, xl); // 1.5rem
```

### Border Radius

Use the `$border` map for border sizes and radii:

```scss
$border: (
  xs: 0.0625rem,
  // 1px
  sm: 0.125rem,
  // 2px
  md: 0.25rem,
  // 4px
  lg: 0.5rem,
  // 8px
  xl: 0.75rem,
  // 12px
  '2xl': 1rem,
  // 16px
  '3xl': 1.5rem,
  // 24px
  '4xl': 2rem,
  // 32px
);

// Usage
border: map.get($border, xs) solid var(--border-colour);
@include border-radius(map.get($border, md));
```

### Typography

Use typography tokens for consistent text styling:

```scss
$font-sizes: (
  xs: 0.75rem,
  // 12px
  sm: 0.875rem,
  // 14px
  md: 1rem,
  // 16px (base)
  lg: 1.125rem,
  // 18px
  xl: 1.25rem,
  // 20px
  '2xl': 1.5rem,
  // 24px
  '3xl': 1.875rem,
  // 30px
  '4xl': 2.25rem,
  // 36px
  '5xl': 3rem,
  // 48px
  '6xl': 3.75rem,
  // 60px
);

$font-weights: (
  thin: 100,
  extra-light: 200,
  light: 300,
  regular: 400,
  medium: 500,
  semi-bold: 600,
  bold: 700,
  extra-bold: 800,
  black: 900,
);

// Usage with mixin
@include font-style(
  map.get($font-sizes, lg),
  map.get($font-weights, semi-bold),
  var(--text-colour)
);
```

### Theme Colors (CSS Custom Properties)

Always use CSS custom properties for colors to support theming:

```scss
// ✅ Correct - Theme-aware
background: var(--surface-colour);
color: var(--text-colour);
border-color: var(--border-colour);

// ❌ Wrong - Hardcoded colors
background: #ffffff;
color: #2c3e50;
```

**Available Theme Variables:**

| Variable                  | Purpose                    |
| ------------------------- | -------------------------- |
| `--background-colour`     | Page background            |
| `--foreground-colour`     | Content area background    |
| `--surface-colour`        | Card/component surfaces    |
| `--surface-colour-hover`  | Surface hover state        |
| `--surface-colour-active` | Surface active state       |
| `--text-colour`           | Primary text               |
| `--text-colour-muted`     | Secondary text             |
| `--text-colour-inverse`   | Text on dark backgrounds   |
| `--accent-colour`         | Primary accent/brand color |
| `--accent-colour-hover`   | Accent hover state         |
| `--border-colour`         | Default borders            |
| `--shadow-colour`         | Box shadow color           |
| `--success-colour`        | Success states             |
| `--warning-colour`        | Warning states             |
| `--error-colour`          | Error states               |
| `--info-colour`           | Info states                |

### Z-Index Layering

Use the `$z-index` map for consistent layering:

```scss
$z-index: (
  background: -1,
  base: 0,
  content: 1,
  elevated: 10,
  dropdown: 100,
  sticky: 200,
  overlay: 1000,
  modal: 1100,
  popover: 1200,
  tooltip: 1300,
  toast: 1400,
  debug: 9999,
);

// Usage
z-index: map.get($z-index, modal);
```

### Transitions and Easing

Use transition and easing tokens for consistent animations:

```scss
$transition: (
  0: 0s,
  fast: 0.15s,
  normal: 0.25s,
  medium: 0.4s,
  slow: 0.6s,
  slower: 1s,
);

$easing: (
  linear: cubic-bezier(0, 0, 1, 1),
  ease: cubic-bezier(0.25, 0.1, 0.25, 1),
  ease-in: cubic-bezier(0.42, 0, 1, 1),
  ease-out: cubic-bezier(0, 0, 0.58, 1),
  ease-in-out: cubic-bezier(0.42, 0, 0.58, 1),
  bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55),
  smooth: cubic-bezier(0.4, 0, 0.2, 1),
  snappy: cubic-bezier(0.4, 0, 0.6, 1),
);

// Usage with mixin
@include transition(transform, background-color);
@include enhanced-transition(all, normal, smooth);
```

---

## Utility Classes

Global utility classes are available for rapid development.

### Spacing Utilities

```html
<!-- Padding -->
<div class="p-md">Padding medium (1rem)</div>
<div class="px-lg">Padding horizontal large</div>
<div class="py-sm">Padding vertical small</div>

<!-- Margin -->
<div class="m-lg">Margin large</div>
<div class="mx-auto">Margin horizontal auto (centering)</div>
<div class="mt-xl">Margin top extra-large</div>
<div class="mb-md">Margin bottom medium</div>

<!-- Gap (for flex/grid) -->
<div class="flex gap-md">Flex with medium gap</div>
```

**Available sizes**: `0`, `3xs`, `2xs`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`

### Flexbox Utilities

```html
<div class="flex">Display flex</div>
<div class="flex-center">Flex with center alignment</div>
<div class="flex-between">Flex with space-between</div>
<div class="flex-column">Flex column direction</div>
<div class="flex-wrap">Flex with wrap</div>
```

### Text Utilities

```html
<p class="text-center">Centered text</p>
<p class="text-left">Left-aligned text</p>
<p class="text-right">Right-aligned text</p>
<p class="text-truncate">Truncated text with ellipsis...</p>
<p class="text-muted">Muted/secondary text</p>
```

### Animation Utilities

```html
<div class="animate-fade-in">Fades in on load</div>
<div class="animate-slide-in-up">Slides up on load</div>
<div class="animate-slide-in-down">Slides down on load</div>
<div class="animate-scale-in">Scales in on load</div>
```

All animations respect `prefers-reduced-motion` for accessibility.

---

## Component Migration Guide

Follow these steps to migrate an existing component to CSS Modules:

### Step 1: Create the CSS Module File

Create `component-name.module.scss` in the component's `assets/` folder:

```scss
// Import design tokens
@use 'sass:map';
@use '@assets/abstracts' as *;

// Component styles using design tokens
.container {
  // ... styles
}
```

### Step 2: Replace Hardcoded Values

```scss
// ❌ Before - Hardcoded values
.card {
  padding: 16px;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

// ✅ After - Design tokens
.card {
  padding: map.get($spacing, md);
  @include border-radius(map.get($border, lg));
  @include theme-aware-surface;
  @include theme-aware-elevation(1);
}
```

### Step 3: Update Component Import

```tsx
// ❌ Before
import './component.scss';

// ✅ After
import styles from '../assets/component.module.scss';
```

### Step 4: Update Class Names

```tsx
// ❌ Before
<div className="card card--elevated">

// ✅ After
<div className={`${styles.card} ${styles.elevated}`}>

// Or with classnames library
<div className={classNames(styles.card, { [styles.elevated]: isElevated })}>
```

### Step 5: Preserve Global Utilities

Keep using global utility classes alongside module classes:

```tsx
// Combine module classes with global utilities
<div className={`${styles.card} p-lg animate-fade-in`}>
```

### Migration Checklist

- [ ] Create `.module.scss` file in `assets/` folder
- [ ] Add `@use '@assets/abstracts' as *;` import
- [ ] Replace hardcoded spacing with `map.get($spacing, ...)`
- [ ] Replace hardcoded colors with CSS custom properties
- [ ] Replace hardcoded borders with `map.get($border, ...)`
- [ ] Use theme-aware mixins for surfaces and elevations
- [ ] Update component to import styles object
- [ ] Update className usage to use styles object
- [ ] Verify visual appearance matches original
- [ ] Test in both light and dark themes

---

## Best Practices

### Do's ✅

```scss
// ✅ Use design tokens
padding: map.get($spacing, md);

// ✅ Use theme variables
color: var(--text-colour);

// ✅ Use mixins for common patterns
@include theme-aware-surface;
@include border-radius(map.get($border, md));

// ✅ Import abstracts in every module
@use '@assets/abstracts' as *;

// ✅ Use semantic class names
.cardHeader {
}
.cardContent {
}
.cardFooter {
}
```

### Don'ts ❌

```scss
// ❌ Don't use hardcoded values
padding: 16px;
color: #2c3e50;

// ❌ Don't use hex colors directly
background: #ffffff;

// ❌ Don't create deep nesting
.card {
  .header {
    .title {
      .icon {
      } // Too deep!
    }
  }
}

// ❌ Don't duplicate utility patterns
.myFlexContainer {
  display: flex;
  justify-content: center;
  // Use .flex-center utility instead
}
```

### Performance Tips

1. **Keep modules focused**: One component per module
2. **Avoid deep nesting**: Max 3 levels
3. **Use utilities**: Don't recreate common patterns
4. **Leverage tree-shaking**: Unused styles are removed

---

## Quick Reference

### Common Mixins

```scss
// Surface styling (background, border)
@include theme-aware-surface;

// Elevation (box-shadow)
@include theme-aware-elevation(1); // 1-3 levels

// Focus state
@include theme-aware-focus;

// Border radius
@include border-radius(map.get($border, md));

// Transitions
@include transition(transform, background-color);
@include enhanced-transition(all, normal, smooth);

// Typography
@include font-style($size, $weight, $color);

// Flexbox
@include flexbox(row, center, center);

// Size
@include size($width, $height);

// Transform
@include transform(1.02); // scale
```

### Import Template

```scss
// Standard CSS Module imports
@use 'sass:map';
@use '@assets/abstracts' as *;

// Your styles here...
```

### File Naming

| Type       | Pattern                      | Example            |
| ---------- | ---------------------------- | ------------------ |
| CSS Module | `component-name.module.scss` | `card.module.scss` |
| Partial    | `_partial-name.scss`         | `_variables.scss`  |
| Index      | `_index.scss`                | `_index.scss`      |

---

## Linting and Enforcement

### Stylelint Configuration

The project uses Stylelint to enforce design token usage and CSS Module naming conventions. The configuration is in `.stylelintrc.json`.

#### Running Stylelint

```bash
# Check all SCSS files
pnpm run lint:styles

# Fix auto-fixable issues
pnpm run lint:styles:fix
```

#### Pre-commit Hooks

Stylelint runs automatically on staged SCSS files during commits via lint-staged:

```json
{
  "lint-staged": {
    "*.scss": ["stylelint --fix --cache"]
  }
}
```

### Design Token Enforcement Rules

Stylelint will warn you when using hardcoded values instead of design tokens:

#### Hardcoded Colors

```scss
// ⚠️ Warning: Use design tokens instead of hex colors
.card {
  background: #ffffff;
}

// ✅ Correct: Use CSS custom properties
.card {
  background: var(--surface-colour);
}
```

#### Hardcoded Spacing

```scss
// ⚠️ Warning: Use design tokens for spacing
.card {
  padding: 16px;
  margin: 24px;
}

// ✅ Correct: Use spacing map
.card {
  padding: map.get($spacing, md);
  margin: map.get($spacing, xl);
}
```

#### Hardcoded Z-Index

```scss
// ⚠️ Warning: Use design tokens for z-index
.modal {
  z-index: 1000;
}

// ✅ Correct: Use z-index map
.modal {
  z-index: map.get($z-index, modal);
}
```

#### Color Functions

```scss
// ⚠️ Warning: Use design tokens instead of color functions
.card {
  background: rgba(0, 0, 0, 0.1);
}

// ✅ Correct: Use color maps or CSS custom properties
.card {
  background: map.get($neutral, black-alpha-08);
  // or
  background: var(--shadow-colour);
}
```

### CSS Module Naming Conventions

Stylelint enforces consistent naming for CSS Module classes:

```scss
// ✅ Correct: camelCase or kebab-case
.container {
}
.cardHeader {
}
.spacing-md {
}
.isActive {
}

// ❌ Wrong: PascalCase or snake_case
.Container {
}
.card_header {
}
```

### Overrides for Special Files

The stylelint configuration has overrides for specific folders:

- **abstracts/**, **themes/**: Hex colors and color functions are allowed (these define the tokens)
- **vendors/**: All rules relaxed for third-party CSS
- **base/**, **layout/**, **utilities/**: Class pattern rules relaxed for global styles

### Disabling Rules

If you need to disable a rule for a specific line:

```scss
/* stylelint-disable-next-line color-no-hex */
$primary-base: #4a90e2;

// Or for a block
/* stylelint-disable color-no-hex */
$colors: (
  primary: #4a90e2,
  secondary: #e67e22,
);
/* stylelint-enable color-no-hex */
```

---

## Related Documentation

- [7-1 Pattern Architecture](../architecture/7-1-PATTERN.md)
- [CSS Modules with 7-1](../architecture/CSS-MODULES-WITH-7-1.md)
- [SCSS Architecture](../architecture/SCSS_ARCHITECTURE.md)
- [Styling Standards](../../.kiro/steering/styling.md)

---

**Last Updated**: December 2024  
**Maintained By**: Ronny Alibardi
