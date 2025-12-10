# 7-1 Pattern Architecture

Official documentation for the 7-1 SCSS architecture pattern implementation.

## 📐 Pattern Overview

The 7-1 pattern is an industry-standard SCSS architecture that organizes styles into 7 folders plus 1 main file. This pattern is used by major projects and frameworks for its clarity and scalability.

## 🏗️ Architecture Structure

```
styles/
├── 1. abstracts/      Variables, functions, mixins (no CSS output)
├── 2. vendors/        Third-party CSS and overrides
├── 3. base/           Reset, typography, base styles
├── 4. layout/         Layout components (header, footer, grid)
├── 5. components/     UI component styles
├── 6. pages/          Page-specific styles
├── 7. themes/         Theme variations
└── main.scss          Main import file
```

## 📋 Folder Responsibilities

### 1. Abstracts
**No CSS Output** - Design tokens and utilities

- Variables (spacing, colors, typography)
- Functions (calculations, utilities)
- Mixins (reusable patterns)
- Breakpoints (responsive design)

### 2. Vendors
**Third-Party** - External library styles

- Vendor CSS files
- Library overrides
- Third-party customizations

### 3. Base
**Foundation** - Global base styles

- CSS reset/normalize
- Typography base styles
- Theme system
- Global element styles

### 4. Layout
**Structure** - Page layout components

- Header
- Footer
- Navigation
- Grid system
- Containers

### 5. Components
**UI Elements** - Reusable components

- Buttons
- Cards
- Forms
- Modals
- Alerts
- etc.

### 6. Pages
**Page-Specific** - Unique page styles

- Home page
- About page
- Projects page
- Contact page
- etc.

### 7. Themes
**Variations** - Theme definitions

- Default theme
- Alternative themes
- Color scheme variations

## 🎯 Design Principles

### Separation of Concerns
Each folder has a single, clear purpose. No overlap between folders.

### Scalability
Easy to add new files without restructuring. Grows with your project.

### Maintainability
Clear organization makes finding and updating styles simple.

### Team Collaboration
Standard pattern that all developers understand.

### Performance
Organized imports allow for better tree-shaking and optimization.

## 📝 File Naming Conventions

### Partials
All files except main.scss are partials (prefixed with `_`):
```
_header.scss
_buttons.scss
_variables.scss
```

### Index Files
Each folder has an `_index.scss` that forwards all partials:
```scss
// components/_index.scss
@forward 'buttons';
@forward 'cards';
@forward 'forms';
```

### Main File
Single `main.scss` imports everything in correct order:
```scss
@use 'abstracts' as *;
@use 'vendors';
@use 'base';
// ... etc
```

## 🔄 Import Order

**Critical**: Import order matters for CSS cascade

```scss
// 1. Abstracts first (no CSS output)
@use 'abstracts' as *;

// 2. Vendors (third-party base)
@use 'vendors';

// 3. Base (your foundation)
@use 'base';

// 4. Layout (structure)
@use 'layout';

// 5. Components (UI elements)
@use 'components';

// 6. Pages (specific overrides)
@use 'pages';

// 7. Themes (variations)
@use 'themes';
```

## 🎨 Usage Examples

### Creating a New Component

1. Create file: `components/_card.scss`
```scss
@use '../abstracts' as *;

.card {
  @include theme-aware-surface;
  @include border-radius(map.get($border, md));
  padding: map.get($spacing, lg);
}
```

2. Add to `components/_index.scss`:
```scss
@forward 'card';
```

3. Styles automatically included via main.scss

### Creating a New Page Style

1. Create file: `pages/_projects.scss`
```scss
@use '../abstracts' as *;

.projects-page {
  &__grid {
    @include flexbox(row, flex-start, stretch, wrap);
    gap: map.get($spacing, xl);
  }
}
```

2. Add to `pages/_index.scss`:
```scss
@forward 'projects';
```

### Adding a Theme Variation

1. Create file: `themes/_dark-mode.scss`
```scss
@use '../abstracts/colors' as *;

[data-theme="dark"] {
  --background-colour: map.get($grey, 600);
  --text-colour: map.get($neutral, white);
  // ... more theme variables
}
```

2. Add to `themes/_index.scss`:
```scss
@forward 'dark-mode';
```

## 📊 Comparison with Previous Structure

### Before (Custom Structure)
```
styles/
├── abstracts/
├── base/
├── utilities/
└── animations/
```

### After (7-1 Pattern)
```
styles/
├── abstracts/      ✅ Kept
├── vendors/        ✨ New
├── base/           ✅ Kept
├── layout/         ✨ New
├── components/     ✨ New
├── pages/          ✨ New
├── themes/         ✨ New
├── utilities/      ✅ Kept (bonus)
└── animations/     ✅ Kept (bonus)
```

## 🎯 When to Use Each Folder

### Use `abstracts/` for:
- Design tokens
- Variables
- Functions
- Mixins
- Breakpoints

### Use `vendors/` for:
- Third-party CSS
- Library overrides
- External dependencies

### Use `base/` for:
- CSS reset
- Typography base
- Theme system
- Global element styles

### Use `layout/` for:
- Header
- Footer
- Navigation
- Grid system
- Containers
- Sidebars

### Use `components/` for:
- Buttons
- Cards
- Forms
- Modals
- Alerts
- Badges
- Any reusable UI element

### Use `pages/` for:
- Page-specific styles
- Unique layouts
- One-off designs
- Page overrides

### Use `themes/` for:
- Color schemes
- Theme variations
- Dark/light modes
- Brand variations

## 🚀 Benefits

### For Development
- Clear file organization
- Easy to find styles
- Predictable structure
- Fast onboarding

### For Maintenance
- Easy to update
- Clear dependencies
- Isolated changes
- Reduced conflicts

### For Performance
- Better tree-shaking
- Optimized imports
- Smaller bundles
- Faster builds

### For Teams
- Standard pattern
- Clear conventions
- Easy collaboration
- Reduced confusion

## 📚 Industry Adoption

The 7-1 pattern is used by:
- Bootstrap
- Foundation
- Material Design
- Bulma
- Many enterprise applications

## 🔍 Best Practices

### Do's
✅ Keep abstracts/ with no CSS output
✅ Use index files for forwarding
✅ Follow import order
✅ One component per file
✅ Use semantic naming

### Don'ts
❌ Don't output CSS from abstracts/
❌ Don't skip index files
❌ Don't mix concerns between folders
❌ Don't create deep nesting
❌ Don't use generic names

## 📖 Further Reading

- [Sass Guidelines](https://sass-guidelin.es/#architecture) - Official 7-1 pattern docs
- [SCSS Architecture](SCSS_ARCHITECTURE.md) - Our complete system
- [7-1 Implementation Guide](../kiro-notes/2024-12-7-1-pattern-implementation.md) - Migration guide

---

**Maintained By**: Ronny Alibardi  
**Last Updated**: December 2024  
**Pattern Version**: 7-1 Standard
