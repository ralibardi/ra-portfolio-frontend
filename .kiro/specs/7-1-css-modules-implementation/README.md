# 7-1 Pattern with CSS Modules Implementation Spec

## 📋 Overview

This spec defines the implementation of the 7-1 SCSS architecture pattern with CSS Modules across all components in the RA Portfolio application.

## 🎯 Goals

1. **Consistent Architecture**: All components follow the same styling pattern
2. **Scoped Styles**: Component styles don't conflict using CSS Modules
3. **Design Tokens**: All components use shared design tokens from 7-1 abstracts
4. **Theme Support**: Seamless light/dark theme switching
5. **Performance**: Optimized CSS bundle size and load times

## 📊 Scope

### Components to Migrate (21 total)
- badge
- buttons (primary, secondary, with-icon)
- card
- company-info
- container
- divider
- error-boundary
- footer
- grid
- header
- icon-link
- loading
- pwa-update ✅ (already using CSS Modules)
- section
- text-area
- text-input
- theme-toggle
- toast
- toggle (4 variants)
- topbar

### Pages to Migrate (10 total)
- about-page ✅ (already using CSS Modules)
- base-page ✅ (already using CSS Modules)
- coding-page ✅ (already using CSS Modules)
- contact-page ✅ (already using CSS Modules)
- cv-page ✅ (already using CSS Modules)
- error-page ✅ (already using CSS Modules)
- gaming-page ✅ (already using CSS Modules)
- health-page ✅ (already using CSS Modules)
- home-page ✅ (already using CSS Modules)
- photography-page ✅ (already using CSS Modules)

**Note**: All pages already use CSS Modules! Focus on components.

## 🏗️ Architecture

### Global Styles (7-1 Pattern)
```
src/app/styles/
├── abstracts/      # Design tokens (spacing, colors, typography)
├── vendors/        # Third-party overrides
├── base/           # Reset, theme, typography
├── layout/         # Header, footer, grid, containers
├── components/     # Global component styles (if needed)
├── pages/          # Global page styles (if needed)
├── themes/         # Theme definitions
├── utilities/      # Utility classes
├── animations/     # Animation definitions
└── main.scss       # Main import file
```

### Component Styles (CSS Modules)
```
components/Button/
├── Button.tsx
├── Button.module.scss    # Scoped styles
└── index.ts
```

## 📝 Implementation Pattern

### Component CSS Module Template
```scss
// Always import abstracts first
@use '@app/styles/abstracts' as *;

.component {
  // Use design tokens
  @include typography(md, semi-bold);
  padding: map.get($spacing, md);
  @include border-radius(map.get($border, sm));
  
  // Use theme variables
  background: var(--surface-colour);
  color: var(--text-colour);
  
  // Use mixins
  @include enhanced-transition(all, fast, smooth);
  
  &:hover {
    background: var(--surface-colour-hover);
  }
}
```

### Component Usage Template
```tsx
import styles from './Component.module.scss';

export const Component = () => {
  return (
    // Mix module classes with global utilities
    <div className={`${styles.component} flex gap-md p-lg`}>
      <span className={styles.title}>Title</span>
      <p className="text-muted">Description</p>
    </div>
  );
};
```

## 🚀 How to Use This Spec

### Option 1: Start Spec Workflow
```
Create a new spec for implementing 7-1 pattern with CSS Modules across all components in the portfolio app. Use the requirements from .kiro/specs/7-1-css-modules-implementation/requirements.md
```

### Option 2: Direct Implementation Request
```
Implement the 7-1 pattern with CSS Modules for the [component-name] component following the spec in .kiro/specs/7-1-css-modules-implementation/
```

### Option 3: Batch Implementation
```
Migrate all components in the buttons/ folder to use 7-1 pattern with CSS Modules following the spec in .kiro/specs/7-1-css-modules-implementation/
```

## 📚 Reference Documentation

- [7-1 Pattern Architecture](../../../docs/architecture/7-1-PATTERN.md)
- [CSS Modules with 7-1](../../../docs/architecture/CSS-MODULES-WITH-7-1.md)
- [Practical Examples](../../../docs/kiro-notes/css-modules-7-1-examples.md)
- [SCSS Architecture](../../../docs/architecture/SCSS_ARCHITECTURE.md)

## ✅ Success Criteria

- [ ] All 21 components migrated to CSS Modules
- [ ] All components import abstracts
- [ ] Zero hardcoded values (spacing, colors, typography)
- [ ] All components work in light/dark themes
- [ ] CSS bundle size reduced by 20%
- [ ] Build time under 30 seconds
- [ ] All tests passing

## 📊 Progress Tracking

### Components Status
- ✅ pwa-update (already done)
- ⏳ badge (pending)
- ⏳ buttons (pending)
- ⏳ card (pending)
- ⏳ company-info (pending)
- ⏳ container (pending)
- ⏳ divider (pending)
- ⏳ error-boundary (pending)
- ⏳ footer (pending)
- ⏳ grid (pending)
- ⏳ header (pending)
- ⏳ icon-link (pending)
- ⏳ loading (pending)
- ⏳ section (pending)
- ⏳ text-area (pending)
- ⏳ text-input (pending)
- ⏳ theme-toggle (pending)
- ⏳ toast (pending)
- ⏳ toggle (pending)
- ⏳ topbar (pending)

### Pages Status
- ✅ All pages already use CSS Modules!

## 🎯 Priority Order

### Phase 1: Foundation Components (High Priority)
1. buttons (primary, secondary, with-icon)
2. card
3. container
4. grid
5. section

### Phase 2: Form Components (Medium Priority)
6. text-input
7. text-area
8. toggle (all variants)

### Phase 3: Layout Components (Medium Priority)
9. header
10. footer
11. topbar

### Phase 4: Utility Components (Low Priority)
12. badge
13. divider
14. loading
15. icon-link
16. toast
17. theme-toggle
18. company-info
19. error-boundary

## 💡 Tips

1. **Start Small**: Begin with simple components (badge, divider)
2. **Test Thoroughly**: Verify light/dark theme switching after each migration
3. **Use Examples**: Reference the practical examples documentation
4. **Check Bundle**: Monitor CSS bundle size after migrations
5. **Maintain Appearance**: Visual appearance should not change

## 🆘 Common Issues

### Issue: Design tokens not available
**Solution**: Ensure `@use '@app/styles/abstracts' as *;` is at the top of the CSS Module

### Issue: Global utilities not working
**Solution**: Global utilities work alongside module classes, just combine them in className

### Issue: Theme colors not updating
**Solution**: Use CSS custom properties (var(--*-colour)) instead of SCSS color maps

### Issue: Styles not scoped
**Solution**: Ensure file ends with `.module.scss` not just `.scss`

---

**Ready to implement?** Use one of the prompts above to start the spec workflow or begin implementation!
