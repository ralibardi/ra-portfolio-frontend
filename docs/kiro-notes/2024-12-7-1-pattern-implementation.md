# 7-1 Pattern Implementation Guide

**Created**: December 2024  
**Type**: AI-Generated Implementation Guide  
**Status**: ✅ Complete

## 🎯 What is the 7-1 Pattern?

The 7-1 pattern is a popular SCSS architecture that organizes styles into **7 folders** plus **1 main file**. It's widely used in large-scale applications for better organization and maintainability.

## 📁 New Structure

```
src/app/styles/
├── abstracts/      # 1. Variables, functions, mixins (no CSS output)
├── vendors/        # 2. Third-party CSS
├── base/           # 3. Reset, typography, base styles
├── layout/         # 4. Layout components (header, footer, grid)
├── components/     # 5. UI components
├── pages/          # 6. Page-specific styles
├── themes/         # 7. Theme variations
├── utilities/      # Bonus: Utility classes
├── animations/     # Bonus: Animation definitions
└── main.scss       # Main file that imports everything
```

## 🔢 The 7 Folders Explained

### 1. `abstracts/` - Design Tokens
**Purpose**: Variables, functions, mixins - no CSS output

**Contains**:
- `_variables.scss` - Spacing, borders, z-index
- `_colors.scss` - Color palette
- `_typography.scss` - Font sizes, weights, families
- `_functions.scss` - SCSS functions
- `_mixins.scss` - Reusable mixins
- `_breakpoints.scss` - Responsive breakpoints

**Usage**: `@use 'abstracts' as *;`

---

### 2. `vendors/` - Third-Party
**Purpose**: Third-party library styles and overrides

**Contains**:
- Vendor CSS that can't be imported via npm
- Overrides for third-party styles

**Example**: FontAwesome overrides, React Query customizations

---

### 3. `base/` - Foundation
**Purpose**: Reset, typography, and foundational styles

**Contains**:
- `_reset.scss` - CSS reset
- `_theme.scss` - Theme system (light/dark)
- `_typography.scss` - Base typography styles

**Output**: Global foundational CSS

---

### 4. `layout/` - Structure
**Purpose**: Layout-related styles

**Contains**:
- `_header.scss` - Site header
- `_footer.scss` - Site footer
- `_navigation.scss` - Navigation menus
- `_grid.scss` - Grid system
- `_containers.scss` - Container utilities

**Output**: Layout structure CSS

---

### 5. `components/` - UI Components
**Purpose**: Component-specific styles

**Will contain**:
- `_buttons.scss`
- `_cards.scss`
- `_forms.scss`
- `_modals.scss`
- etc.

**Note**: Add files as components are created

---

### 6. `pages/` - Page-Specific
**Purpose**: Styles specific to individual pages

**Will contain**:
- `_home.scss`
- `_about.scss`
- `_projects.scss`
- `_contact.scss`

**Note**: Only add if page needs unique styles

---

### 7. `themes/` - Theme Variations
**Purpose**: Theme variations and color schemes

**Contains**:
- `_default.scss` - Default theme (references base/theme)

**Note**: Themes use CSS custom properties from base/theme

---

## 📝 Import Order in main.scss

```scss
// 1. Abstracts (no CSS output)
@use 'abstracts' as *;

// 2. Vendors (third-party)
@use 'vendors';

// 3. Base (foundational)
@use 'base';

// 4. Layout (structure)
@use 'layout';

// 5. Components (UI)
@use 'components';

// 6. Pages (page-specific)
@use 'pages';

// 7. Themes (variations)
@use 'themes';

// Bonus: Utilities & Animations
@use 'utilities';
@use 'animations';
```

## 🎨 What's New?

### New Folders
- ✅ `layout/` - Header, footer, grid, containers, navigation
- ✅ `components/` - Ready for component styles
- ✅ `pages/` - Ready for page-specific styles
- ✅ `themes/` - Theme system organization
- ✅ `vendors/` - Third-party overrides

### New Files
- ✅ `layout/_header.scss` - Site header styles
- ✅ `layout/_footer.scss` - Site footer styles
- ✅ `layout/_navigation.scss` - Navigation styles
- ✅ `layout/_grid.scss` - Enhanced grid system
- ✅ `layout/_containers.scss` - Container utilities

### Kept from Previous Structure
- ✅ `abstracts/` - All design tokens
- ✅ `base/` - Reset, theme, typography
- ✅ `utilities/` - Utility classes
- ✅ `animations/` - Animation system

## 🚀 How to Use

### In Components
```scss
// Import abstracts for design tokens
@use '@app/styles/abstracts' as *;

.my-component {
  @include flexbox(row, center, center);
  padding: map.get($spacing, md);
  color: var(--text-colour);
}
```

### Adding New Component Styles
```scss
// Create: src/app/styles/components/_button.scss
@use '../abstracts' as *;

.btn {
  @include typography(md, semi-bold);
  padding: map.get($spacing, sm) map.get($spacing, lg);
  @include border-radius(map.get($border, sm));
  // ... more styles
}
```

Then add to `components/_index.scss`:
```scss
@forward 'button';
```

### Adding Page-Specific Styles
```scss
// Create: src/app/styles/pages/_home.scss
@use '../abstracts' as *;

.home-page {
  // Page-specific styles
}
```

Then add to `pages/_index.scss`:
```scss
@forward 'home';
```

## 📊 Benefits of 7-1 Pattern

1. **Clear Organization** - Everything has its place
2. **Scalability** - Easy to add new styles
3. **Maintainability** - Easy to find and update
4. **Team-Friendly** - Standard pattern everyone knows
5. **Separation of Concerns** - Each folder has one purpose
6. **Industry Standard** - Used by major projects

## 🔄 Migration Notes

### No Breaking Changes
- All existing imports still work
- All existing styles preserved
- New structure is additive

### What Changed
- Added 5 new folders (layout, components, pages, themes, vendors)
- Updated main.scss import order
- Added layout styles (header, footer, grid, containers, navigation)

### What Stayed the Same
- abstracts/ - No changes
- base/ - No changes
- utilities/ - No changes
- animations/ - No changes

## 📚 Related Documentation

- [SCSS Architecture](../../architecture/SCSS_ARCHITECTURE.md) - Complete system
- [SCSS Quick Reference](scss-quick-reference.md) - Common patterns
- [Documentation Guide](../DOCUMENTATION_GUIDE.md) - How to organize docs

## 🆘 Questions?

- **Where do component styles go?** → `components/`
- **Where do layout styles go?** → `layout/`
- **Where do page styles go?** → `pages/`
- **Where do design tokens go?** → `abstracts/`
- **Where do utility classes go?** → `utilities/`

---

**Remember**: The 7-1 pattern is a guideline, not a strict rule. Adapt it to your needs!
