# SCSS Architecture Migration Guide

This guide helps you migrate from the old SCSS structure (`src/assets/`) to the new organized structure (`src/app/styles/`).

## 🎯 What Changed

### Old Structure
```
src/assets/
├── _colours.scss
├── _fonts.scss
├── _variables.scss
├── _mixins.scss
├── _breakpoints.scss
├── _animations.scss
├── global.scss
└── index.scss
```

### New Structure
```
src/app/styles/
├── abstracts/          # Design tokens (no CSS output)
├── base/              # Foundational styles
├── utilities/         # Utility classes
├── animations/        # Transitions & keyframes
└── main.scss          # Entry point
```

## 📝 Step-by-Step Migration

### Step 1: Update Main Import

**Old:**
```tsx
// In main.tsx or App.tsx
import '@assets/index.scss';
```

**New:**
```tsx
// In main.tsx or App.tsx
import '@app/styles/main.scss';
```

### Step 2: Update Component Imports

**Old:**
```scss
// In component SCSS files
@use '@assets/global' as *;
```

**New:**
```scss
// In component SCSS files
@use '@app/styles/abstracts' as *;
```

### Step 3: Update Color Usage

**Old:**
```scss
// Using old color variables
background: $white;
color: $black;
border: 1px solid map.get($primary, 1);
```

**New:**
```scss
// Using theme variables
background: var(--background-colour);
color: var(--text-colour);
border: 1px solid var(--border-colour);

// Or using color maps
background: map.get($neutral, white);
color: map.get($primary, base);
```

### Step 4: Update Mixin Usage

Most mixins remain the same, but some have been enhanced:

**Old:**
```scss
@include font-style(map.get($font-sizes, md), map.get($font-weights, medium));
```

**New (Enhanced):**
```scss
// Option 1: Original mixin (still works)
@include font-style(map.get($font-sizes, md), map.get($font-weights, medium));

// Option 2: New enhanced mixin
@include typography(md, medium, normal, var(--text-colour));

// Option 3: Responsive typography
@include responsive-typography(md, lg);
```

### Step 5: Update Breakpoint Usage

**No changes needed** - breakpoint mixins work the same way:

```scss
@include breakpoint('desktop') {
  font-size: map.get($font-sizes, lg);
}
```

## 🔄 Import Path Changes

### TypeScript/TSX Files

**Old:**
```tsx
import styles from './Component.module.scss';
import '@assets/index.scss';
```

**New:**
```tsx
import styles from './Component.module.scss';
import '@app/styles/main.scss';
```

### SCSS Files

**Old:**
```scss
@use '@assets/global' as *;
@use '@assets/colours' as *;
@use '@assets/mixins' as *;
```

**New:**
```scss
// Import everything
@use '@app/styles/abstracts' as *;

// Or import specific modules
@use '@app/styles/abstracts/colors' as *;
@use '@app/styles/abstracts/mixins' as *;
```

## 🎨 Color System Changes

### Primary/Secondary Colors

**Old:**
```scss
$primary: (
  1: #4a90e2,
  2: #357ABD,
  3: #2A5D9E,
);
```

**New:**
```scss
$primary: (
  base: #4a90e2,
  light: #357ABD,
  dark: #2A5D9E,
);
```

**Migration:**
```scss
// Old
color: map.get($primary, 1);

// New
color: map.get($primary, base);
// Or use theme variable
color: var(--accent-colour);
```

### Neutral Colors

**Old:**
```scss
$white: #fdfdfd;
$black: #2c3e50;
```

**New:**
```scss
$neutral: (
  white: #fdfdfd,
  black: #2c3e50,
);
```

**Migration:**
```scss
// Old
background: $white;
color: $black;

// New
background: map.get($neutral, white);
color: map.get($neutral, black);
// Or use theme variables (recommended)
background: var(--background-colour);
color: var(--text-colour);
```

## 🛠️ New Features Available

### 1. Semantic Colors

```scss
// Success, warning, error, info colors
@include semantic-color('success', 'base');
@include semantic-background('error', 'light');
```

### 2. Enhanced Typography

```scss
// Responsive typography
@include responsive-typography(md, '2xl');

// Full typography control
@include typography('lg', semi-bold, relaxed, var(--text-colour));
```

### 3. Utility Classes

```tsx
// Use utility classes for rapid development
<div className="flex flex-center gap-md p-lg">
  <span className="text-primary">Hello</span>
</div>
```

### 4. Animation Utilities

```tsx
// Predefined animations
<div className="animate-fade-in">Content</div>
<div className="animate-slide-in-up">Content</div>
```

### 5. Enhanced Transitions

```scss
// Old
@include transition(all map.get($transition, fast) ease);

// New (enhanced)
@include enhanced-transition(all, fast, smooth);
```

## 🔍 Common Migration Issues

### Issue 1: Color Not Found

**Error:**
```
Error: map.get($primary, 1) returns null
```

**Solution:**
```scss
// Change numeric keys to semantic names
map.get($primary, 1) → map.get($primary, base)
map.get($primary, 2) → map.get($primary, light)
map.get($primary, 3) → map.get($primary, dark)
```

### Issue 2: Variable Not Found

**Error:**
```
Error: Undefined variable $white
```

**Solution:**
```scss
// Use color maps or theme variables
$white → map.get($neutral, white)
$black → map.get($neutral, black)
// Or use theme variables (recommended)
$white → var(--background-colour)
$black → var(--text-colour)
```

### Issue 3: Import Path Not Found

**Error:**
```
Error: Can't find stylesheet to import '@assets/global'
```

**Solution:**
```scss
// Update import path
@use '@assets/global' as *;
// to
@use '@app/styles/abstracts' as *;
```

## ✅ Migration Checklist

- [ ] Update main stylesheet import in entry file
- [ ] Update all component SCSS imports
- [ ] Replace numeric color keys with semantic names
- [ ] Replace `$white` and `$black` with theme variables or color maps
- [ ] Test all components for visual regressions
- [ ] Update any custom mixins that depend on old structure
- [ ] Remove old `src/assets/` files (after confirming everything works)
- [ ] Update documentation and comments

## 🚀 Benefits of New Structure

1. **Better Organization**: Clear separation of concerns
2. **Improved Maintainability**: Easier to find and update styles
3. **Enhanced Features**: New mixins and utilities
4. **Better Performance**: Optimized imports and tree-shaking
5. **Future-Proof**: Modern SCSS architecture patterns
6. **Theme Support**: Built-in light/dark theme system
7. **Utility Classes**: Rapid development with utility classes
8. **Semantic Colors**: Success, warning, error, info colors

## 📚 Additional Resources

- [README.md](./src/app/styles/README.md) - Complete documentation
- [Styling Standards](../.kiro/steering/styling.md) - Design system guide
- [Biome Best Practices](../.kiro/steering/biome-best-practices.md) - Code quality

## 🆘 Need Help?

If you encounter issues during migration:

1. Check the [README.md](./src/app/styles/README.md) for usage examples
2. Review the [Styling Standards](../.kiro/steering/styling.md)
3. Compare old and new file structures side-by-side
4. Test incrementally - migrate one component at a time

## 🎉 Post-Migration

After successful migration:

1. Delete old `src/assets/` SCSS files
2. Update any documentation referencing old paths
3. Run tests to ensure no regressions
4. Commit changes with clear migration message
5. Update team members about new structure
