# SCSS Quick Reference Guide

Quick reference for common patterns and utilities in the new SCSS architecture.

## 🎨 Colors

### Using Theme Variables (Recommended)
```scss
// Text colors
color: var(--text-colour);
color: var(--text-colour-muted);
color: var(--text-colour-inverse);

// Background colors
background: var(--background-colour);
background: var(--surface-colour);
background: var(--surface-colour-hover);

// Accent colors
color: var(--accent-colour);
background: var(--accent-colour-hover);
border-color: var(--accent-colour-active);

// Semantic colors
color: var(--success-colour);
color: var(--warning-colour);
color: var(--error-colour);
color: var(--info-colour);
```

### Using Color Maps
```scss
// Primary colors
map.get($primary, base)
map.get($primary, light)
map.get($primary, dark)

// Semantic colors
map.get($success, base)
map.get($warning, light)
map.get($error, dark)
map.get($info, base)

// Neutral colors
map.get($neutral, white)
map.get($neutral, black)
map.get($neutral, white-alpha-90)

// Grey scale
map.get($grey, 100)  // Lightest
map.get($grey, 600)  // Darkest
```

## 📏 Spacing

```scss
// Spacing scale
map.get($spacing, 0)     // 0
map.get($spacing, '3xs') // 2px
map.get($spacing, xs)    // 8px
map.get($spacing, sm)    // 12px
map.get($spacing, md)    // 16px (base)
map.get($spacing, lg)    // 20px
map.get($spacing, xl)    // 24px
map.get($spacing, '2xl') // 32px
map.get($spacing, '3xl') // 48px
map.get($spacing, '4xl') // 64px
map.get($spacing, '5xl') // 96px

// Usage
padding: map.get($spacing, md);
margin: map.get($spacing, lg) map.get($spacing, xs);
gap: map.get($spacing, sm);
```

## 🔤 Typography

### Font Sizes
```scss
map.get($font-sizes, xs)   // 12px
map.get($font-sizes, sm)   // 14px
map.get($font-sizes, md)   // 16px (base)
map.get($font-sizes, lg)   // 18px
map.get($font-sizes, xl)   // 20px
map.get($font-sizes, '2xl') // 24px
map.get($font-sizes, '3xl') // 30px
map.get($font-sizes, '4xl') // 36px
map.get($font-sizes, '5xl') // 48px
map.get($font-sizes, '6xl') // 60px
```

### Font Weights
```scss
map.get($font-weights, thin)        // 100
map.get($font-weights, light)       // 300
map.get($font-weights, regular)     // 400
map.get($font-weights, medium)      // 500
map.get($font-weights, semi-bold)   // 600
map.get($font-weights, bold)        // 700
map.get($font-weights, black)       // 900
```

### Typography Mixins
```scss
// Basic
@include typography(lg, semi-bold, normal);

// Responsive
@include responsive-typography(md, '2xl');

// Legacy (still works)
@include font-style(map.get($font-sizes, md), map.get($font-weights, medium));
```

## 📐 Layout

### Flexbox
```scss
// Basic flexbox
@include flexbox(row, center, center);

// Parameters: direction, justify, align, wrap
@include flexbox(column, space-between, stretch, wrap);
```

### Size
```scss
@include size(100%, auto);
@include size(map.get($percentage, 100), 100vh);
```

### Centering
```scss
@include absolute-center;
```

## 🎭 Visual Effects

### Box Shadow
```scss
@include box-shadow(
  map.get($spacing, 0),
  map.get($spacing, xs),
  map.get($spacing, md),
  map.get($spacing, 0),
  var(--shadow-colour)
);
```

### Border Radius
```scss
@include border-radius(map.get($border, md));
@include border-radius(map.get($border, '3xl')); // Pill shape
```

### Transform
```scss
@include transform(1.05);                    // Scale
@include transform(1, 45deg);                // Rotate
@include transform(1, 0deg, (10px, 20px));  // Translate
```

## 🔄 Transitions & Animations

### Transitions
```scss
// Basic
@include transition(all map.get($transition, fast) ease);

// Enhanced
@include enhanced-transition(transform, normal, smooth);

// Multiple properties
@include transition(
  (background-color map.get($transition, fast) ease),
  (transform map.get($transition, normal) ease)
);
```

### Animation Classes
```tsx
<div className="animate-fade-in">Fade in</div>
<div className="animate-slide-in-up">Slide up</div>
<div className="animate-spin">Spinning</div>
<div className="animate-pulse">Pulsing</div>
```

## 📱 Responsive Design

### Breakpoints
```scss
@include breakpoint('mobile-landscape') { }  // 480px-767px
@include breakpoint('tablet') { }            // 768px-991px
@include breakpoint('tablet-landscape') { }  // 992px-1199px
@include breakpoint('laptop') { }            // 1024px+
@include breakpoint('desktop') { }           // 1200px+
```

## 🎯 Utility Classes

### Layout
```tsx
<div className="container">Responsive container</div>
<div className="flex flex-center">Centered flex</div>
<div className="flex flex-between">Space between</div>
<div className="grid grid-cols-3">3 column grid</div>
```

### Spacing
```tsx
<div className="m-md">Margin medium</div>
<div className="p-lg">Padding large</div>
<div className="mt-xl">Margin top XL</div>
<div className="px-sm">Padding horizontal small</div>
<div className="gap-md">Gap medium</div>
```

### Colors
```tsx
<span className="text-primary">Primary text</span>
<span className="text-success">Success text</span>
<div className="bg-surface">Surface background</div>
```

### Visibility
```tsx
<div className="hidden">Hidden</div>
<div className="sr-only">Screen reader only</div>
<div className="hidden-mobile">Hidden on mobile</div>
```

## 🎨 Theme-Aware Mixins

```scss
// Surface styling
@include theme-aware-surface;

// Elevation/shadows
@include theme-aware-elevation(1);
@include theme-aware-elevation(2);

// Focus states
@include theme-aware-focus;
```

## 🔧 Common Patterns

### Card Component
```scss
.card {
  @include theme-aware-surface;
  @include border-radius(map.get($border, md));
  @include theme-aware-elevation(1);
  padding: map.get($spacing, lg);
  
  &:hover {
    @include theme-aware-elevation(2);
    @include transform(1.02);
  }
}
```

### Button Component
```scss
.button {
  @include typography(md, semi-bold, normal);
  @include border-radius(map.get($border, sm));
  padding: map.get($spacing, sm) map.get($spacing, lg);
  background: var(--accent-colour);
  color: var(--text-colour-inverse);
  @include enhanced-transition(all, fast, smooth);
  
  &:hover {
    background: var(--accent-colour-hover);
    @include transform(1.05);
  }
  
  &:active {
    @include transform(0.95);
  }
}
```

### Responsive Container
```scss
.container {
  width: 100%;
  max-width: 1200px;
  margin-inline: auto;
  padding-inline: map.get($spacing, md);
  
  @include breakpoint('desktop') {
    padding-inline: map.get($spacing, xl);
  }
}
```

### Text Truncation
```scss
.truncated-text {
  @include truncate;
}
```

## 🌗 Theme Support

### Manual Theme Toggle
```tsx
// Light theme
<html data-theme="light">

// Dark theme
<html data-theme="dark">

// System preference (automatic)
<html> // No data-theme attribute
```

### Theme-Specific Styles
```scss
// Light theme only
@include light-theme-only {
  background: #ffffff;
}

// Dark theme only
@include dark-theme-only {
  background: #000000;
}
```

## ♿ Accessibility

### Reduced Motion
```scss
@include prefers-reduced-motion {
  animation: none;
  transition: none;
}
```

### Visually Hidden
```scss
.sr-only {
  @include visually-hidden;
}
```

### Focus States
```scss
&:focus-visible {
  @include theme-aware-focus;
}
```

## 📦 Import Patterns

### Component SCSS File
```scss
// Import abstracts for design tokens
@use '@app/styles/abstracts' as *;

.component {
  @include flexbox(row, center, center);
  padding: map.get($spacing, md);
  color: var(--text-colour);
}
```

### Main Entry File
```tsx
// Import main stylesheet
import '@app/styles/main.scss';
```

## 🚀 Performance Tips

1. **Use theme variables** for colors (better performance)
2. **Use utility classes** when possible (reduce custom CSS)
3. **Import only abstracts** in component files (no CSS output)
4. **Leverage CSS custom properties** for dynamic theming
5. **Use semantic color names** for maintainability

## 📝 Notes

- All spacing uses rem units for accessibility
- All colors support light/dark themes
- All animations respect reduced motion preferences
- All utilities are mobile-first responsive
- All mixins are documented in source files
