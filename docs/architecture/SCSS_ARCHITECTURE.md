# Global SCSS Architecture

This directory contains the global SCSS architecture for the RA Portfolio application, organized following modern best practices for maintainability, scalability, and readability.

## 📁 Folder Structure

```
app/styles/
├── abstracts/          # Variables, mixins, functions (no CSS output)
│   ├── _breakpoints.scss
│   ├── _colors.scss
│   ├── _functions.scss
│   ├── _mixins.scss
│   ├── _typography.scss
│   ├── _variables.scss
│   └── _index.scss
├── base/              # Reset, theme, typography (foundational styles)
│   ├── _reset.scss
│   ├── _theme.scss
│   ├── _typography.scss
│   └── _index.scss
├── utilities/         # Layout, spacing, colors (utility classes)
│   ├── _colors.scss
│   ├── _layout.scss
│   ├── _spacing.scss
│   ├── _visibility.scss
│   └── _index.scss
├── animations/        # Transitions, keyframes (animation definitions)
│   ├── _keyframes.scss
│   ├── _transitions.scss
│   ├── _utilities.scss
│   └── _index.scss
├── main.scss          # Main entry point
└── README.md          # This file
```

## 🎯 Usage

### Importing in Your Application

```scss
// In your main entry file (e.g., main.tsx or App.tsx)
import '@app/styles/main.scss';
```

### Using in Component Styles

```scss
// In component SCSS modules
@use '@app/styles/abstracts' as *;

.my-component {
  @include flexbox(row, center, center);
  padding: map.get($spacing, md);
  color: var(--text-colour);
}
```

## 📚 Module Documentation

### Abstracts

Design tokens and utilities that don't output CSS directly.

#### Colors (`_colors.scss`)
- **Primary**: Brand colors with variants
- **Secondary**: Accent colors
- **Neutral**: White, black, and alpha variations
- **Grey**: 100-600 scale
- **Semantic**: Success, warning, error, info

```scss
// Usage
background-color: map.get($primary, base);
color: map.get($success, light);
```

#### Typography (`_typography.scss`)
- **Font Family**: Montserrat
- **Font Weights**: thin to black (100-900)
- **Font Sizes**: xs to 6xl (12px-60px)
- **Line Heights**: none to loose

```scss
// Usage
@include typography(lg, semi-bold, relaxed);
```

#### Variables (`_variables.scss`)
- **Spacing**: 0 to 7xl (0-192px)
- **Border**: xs to 4xl (1px-32px)
- **Z-Index**: Layering system
- **Percentage**: 0-100%

```scss
// Usage
padding: map.get($spacing, xl);
z-index: map.get($z-index, modal);
```

#### Mixins (`_mixins.scss`)
Reusable style patterns:
- `@mixin typography()` - Enhanced typography
- `@mixin flexbox()` - Flexbox layout
- `@mixin box-shadow()` - Consistent shadows
- `@mixin breakpoint()` - Responsive design
- `@mixin truncate` - Text truncation

#### Functions (`_functions.scss`)
Utility functions:
- `spacing($key)` - Get spacing value
- `color($family, $variant)` - Get color value
- `rem($px)` - Convert px to rem
- `strip-unit($value)` - Remove unit from value

### Base

Foundational styles that apply globally.

#### Reset (`_reset.scss`)
Modern CSS reset for consistent cross-browser styling.

#### Theme (`_theme.scss`)
CSS custom properties for light/dark themes with automatic system preference detection.

```scss
// Theme variables available:
--accent-colour
--text-colour
--background-colour
--surface-colour
--border-colour
// ... and many more
```

#### Typography (`_typography.scss`)
Base typography styles for headings and paragraphs with responsive sizing.

### Utilities

Utility classes for rapid development.

#### Layout (`_layout.scss`)
- `.container` - Responsive container
- `.flex`, `.flex-col`, `.flex-row` - Flexbox utilities
- `.grid`, `.grid-cols-*` - Grid utilities

#### Spacing (`_spacing.scss`)
- `.m-*`, `.mt-*`, `.mr-*`, etc. - Margin utilities
- `.p-*`, `.pt-*`, `.pr-*`, etc. - Padding utilities
- `.gap-*` - Gap utilities

#### Colors (`_colors.scss`)
- `.text-primary`, `.text-success`, etc. - Text colors
- `.bg-primary`, `.bg-surface`, etc. - Background colors

#### Visibility (`_visibility.scss`)
- `.hidden`, `.visible` - Display utilities
- `.sr-only` - Screen reader only
- `.hidden-{breakpoint}` - Responsive visibility

### Animations

Animation definitions and utilities.

#### Keyframes (`_keyframes.scss`)
Predefined animations:
- `fadeIn`, `fadeOut`
- `slideInUp`, `slideInDown`, `slideInLeft`, `slideInRight`
- `scaleIn`, `scaleOut`
- `spin`, `pulse`

#### Transitions (`_transitions.scss`)
- Duration scale: fast to slower (0.15s-1s)
- Easing curves: linear, smooth, bounce, etc.

#### Utilities (`_utilities.scss`)
Animation utility classes:
- `.animate-fade-in`
- `.animate-slide-in-up`
- `.animate-spin`
- etc.

## 🎨 Design System

### Color System

Colors are organized by family with semantic naming:

```scss
// Primary colors
$primary: (base, light, dark, alpha-08)

// Semantic colors
$success: (base, light, dark, alpha-08)
$warning: (base, light, dark, alpha-08)
$error: (base, light, dark, alpha-08)
$info: (base, light, dark, alpha-08)
```

### Spacing Scale

Based on 1rem (16px) with consistent multipliers:

```
3xs: 2px   | xs: 8px   | md: 16px  | xl: 24px   | 3xl: 48px  | 5xl: 96px
2xs: 4px   | sm: 12px  | lg: 20px  | 2xl: 32px  | 4xl: 64px  | 6xl: 128px
```

### Typography Scale

Modular scale (1.125 ratio) for harmonious sizing:

```
xs: 12px  | md: 16px  | xl: 20px   | 3xl: 30px  | 5xl: 48px
sm: 14px  | lg: 18px  | 2xl: 24px  | 4xl: 36px  | 6xl: 60px
```

## 🔧 Best Practices

### 1. Use Abstracts for Component Styles

```scss
@use '@app/styles/abstracts' as *;

.component {
  @include flexbox(row, space-between, center);
  padding: map.get($spacing, md);
  @include enhanced-transition(all, normal, smooth);
}
```

### 2. Use Theme Variables for Colors

```scss
// ✅ Good - theme-aware
color: var(--text-colour);
background: var(--surface-colour);

// ❌ Avoid - hardcoded
color: #2c3e50;
background: #fdfdfd;
```

### 3. Use Utility Classes for Rapid Development

```tsx
<div className="flex flex-center gap-md p-lg">
  <span className="text-primary">Hello</span>
</div>
```

### 4. Respect Reduced Motion

All animations automatically respect `prefers-reduced-motion`.

## 📱 Responsive Design

### Breakpoints

```scss
mobile-landscape: 480px-767px
tablet: 768px-991px
tablet-landscape: 992px-1199px
laptop: 1024px+
desktop: 1200px+
```

### Usage

```scss
.component {
  font-size: map.get($font-sizes, md);
  
  @include breakpoint('desktop') {
    font-size: map.get($font-sizes, lg);
  }
}
```

## 🌗 Theme Support

Automatic theme detection with manual override:

```tsx
// Light theme (default)
<html data-theme="light">

// Dark theme
<html data-theme="dark">

// System preference (automatic)
<html> // No data-theme attribute
```

## 🚀 Performance

- **No CSS output from abstracts** - Only when used
- **Modular imports** - Import only what you need
- **Utility classes** - Reduce custom CSS
- **CSS custom properties** - Efficient theme switching

## 📝 Migration from Old Structure

The old structure (`src/assets/`) has been reorganized:

```
Old → New
_colours.scss → abstracts/_colors.scss
_fonts.scss → abstracts/_typography.scss
_variables.scss → abstracts/_variables.scss
_mixins.scss → abstracts/_mixins.scss (enhanced)
index.scss → main.scss
```

## 🤝 Contributing

When adding new styles:

1. **Abstracts**: Add design tokens and mixins
2. **Base**: Add foundational styles
3. **Utilities**: Add utility classes
4. **Animations**: Add keyframes and transitions

Keep files focused and under 200 lines for maintainability.
