# CSS Modules with 7-1 Pattern

How to effectively combine CSS Modules with the 7-1 SCSS architecture pattern.

## 🎯 Strategy Overview

**7-1 Pattern** = Global styles (layout, base, themes)  
**CSS Modules** = Component-specific styles (scoped)

```
Global Styles (7-1)          Component Styles (CSS Modules)
├── abstracts/               ├── Button.module.scss
├── vendors/                 ├── Card.module.scss
├── base/                    ├── Modal.module.scss
├── layout/                  └── Form.module.scss
├── themes/
└── main.scss
```

## 📁 Recommended Structure

```
src/
├── app/
│   └── styles/              # 7-1 Pattern (Global)
│       ├── abstracts/
│       ├── base/
│       ├── layout/
│       ├── themes/
│       └── main.scss
│
└── components/
    ├── Button/
    │   ├── Button.tsx
    │   └── Button.module.scss    # CSS Module (Scoped)
    ├── Card/
    │   ├── Card.tsx
    │   └── Card.module.scss      # CSS Module (Scoped)
    └── Modal/
        ├── Modal.tsx
        └── Modal.module.scss     # CSS Module (Scoped)
```

## 🎨 Usage Patterns

### Pattern 1: Component with CSS Module

**Component File** (`Button.tsx`):
```tsx
import styles from './Button.module.scss';

export const Button = ({ children, variant = 'primary' }) => {
  return (
    <button className={styles.button} data-variant={variant}>
      {children}
    </button>
  );
};
```

**CSS Module** (`Button.module.scss`):
```scss
// Import abstracts for design tokens
@use '@app/styles/abstracts' as *;

.button {
  // Use design tokens from 7-1 pattern
  @include typography(md, semi-bold, none);
  padding: map.get($spacing, sm) map.get($spacing, lg);
  @include border-radius(map.get($border, sm));
  @include enhanced-transition(all, fast, smooth);
  border: none;
  cursor: pointer;
  
  // Use theme variables
  background: var(--accent-colour);
  color: var(--text-colour-inverse);
  
  &:hover {
    background: var(--accent-colour-hover);
    @include transform(1.05);
  }
  
  &:active {
    @include transform(0.95);
  }
  
  // Variants using data attributes (not scoped)
  &[data-variant="secondary"] {
    background: var(--secondary-colour);
  }
  
  &[data-variant="outline"] {
    background: transparent;
    border: map.get($border, xs) solid var(--accent-colour);
    color: var(--accent-colour);
  }
}
```

### Pattern 2: Component with Global Classes

**Component File** (`Card.tsx`):
```tsx
import styles from './Card.module.scss';

export const Card = ({ children, elevated = false }) => {
  return (
    <div className={`${styles.card} ${elevated ? styles.elevated : ''}`}>
      <div className={styles.header}>
        {/* Header content */}
      </div>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};
```

**CSS Module** (`Card.module.scss`):
```scss
@use '@app/styles/abstracts' as *;

.card {
  @include theme-aware-surface;
  @include border-radius(map.get($border, md));
  padding: map.get($spacing, lg);
  @include enhanced-transition(all, normal, smooth);
  
  &.elevated {
    @include theme-aware-elevation(2);
  }
}

.header {
  @include typography(lg, semi-bold, tight);
  margin-bottom: map.get($spacing, md);
  padding-bottom: map.get($spacing, md);
  border-bottom: map.get($border, xs) solid var(--border-colour);
}

.content {
  @include typography(md, regular, relaxed);
  color: var(--text-colour);
}
```

### Pattern 3: Mixing Global and Module Classes

**Component File** (`ProjectCard.tsx`):
```tsx
import styles from './ProjectCard.module.scss';

export const ProjectCard = ({ project }) => {
  return (
    // Global utility classes + CSS Module classes
    <div className={`${styles.card} animate-fade-in`}>
      <img 
        src={project.image} 
        alt={project.title}
        className={styles.image}
      />
      <div className={`${styles.content} p-lg`}>
        <h3 className={styles.title}>{project.title}</h3>
        <p className="text-muted">{project.description}</p>
        
        {/* Global utility classes */}
        <div className="flex gap-sm mt-md">
          {project.tags.map(tag => (
            <span key={tag} className={`${styles.tag} text-sm`}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
```

**CSS Module** (`ProjectCard.module.scss`):
```scss
@use '@app/styles/abstracts' as *;

.card {
  @include theme-aware-surface;
  @include border-radius(map.get($border, md));
  overflow: hidden;
  @include enhanced-transition(transform, normal, smooth);
  
  &:hover {
    @include transform(1.02);
    @include theme-aware-elevation(2);
  }
}

.image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.content {
  // Padding applied via global utility class
}

.title {
  @include typography(xl, bold, tight);
  color: var(--text-colour);
  margin-bottom: map.get($spacing, sm);
}

.tag {
  @include typography(xs, medium, none);
  padding: map.get($spacing, '3xs') map.get($spacing, xs);
  @include border-radius(map.get($border, xs));
  background: var(--accent-colour);
  color: var(--text-colour-inverse);
}
```

## 🎯 When to Use What

### Use 7-1 Global Styles For:
✅ Layout structure (header, footer, grid)
✅ Base styles (reset, typography)
✅ Theme system (colors, variables)
✅ Utility classes (spacing, colors, layout)
✅ Animation definitions
✅ Global components (navigation, containers)

### Use CSS Modules For:
✅ Component-specific styles
✅ Scoped class names
✅ Component variants
✅ Component states
✅ Component-specific layouts
✅ Avoiding naming conflicts

## 📋 Best Practices

### 1. Always Import Abstracts in Modules
```scss
// ✅ Good - Access to design tokens
@use '@app/styles/abstracts' as *;

.component {
  padding: map.get($spacing, md);
}
```

```scss
// ❌ Bad - Hardcoded values
.component {
  padding: 16px;
}
```

### 2. Use Theme Variables for Colors
```scss
// ✅ Good - Theme-aware
.component {
  background: var(--surface-colour);
  color: var(--text-colour);
}
```

```scss
// ❌ Bad - Hardcoded colors
.component {
  background: #ffffff;
  color: #000000;
}
```

### 3. Combine Global Utilities with Modules
```tsx
// ✅ Good - Best of both worlds
<div className={`${styles.card} flex gap-md p-lg`}>
  <span className={styles.title}>Title</span>
</div>
```

```tsx
// ❌ Bad - Reinventing the wheel
<div className={styles.cardWithFlexAndPadding}>
  <span className={styles.title}>Title</span>
</div>
```

### 4. Keep Modules Focused
```scss
// ✅ Good - Component-specific only
.button {
  // Button-specific styles
}

.buttonIcon {
  // Icon within button
}
```

```scss
// ❌ Bad - Too much global stuff
.button { }
.container { }  // Should be in layout/
.grid { }       // Should be in layout/
```

## 🔧 Configuration

### Vite Config (Already Configured)
```typescript
// vite.config.ts
export default defineConfig({
  css: {
    modules: {
      generateScopedName: isProd
        ? '[hash:base64:5]'
        : '[name]__[local]__[hash:base64:5]',
    },
  },
});
```

### TypeScript Support
```typescript
// global.d.ts
declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}
```

## 📊 Comparison

### Traditional Approach (All CSS Modules)
```
❌ Duplicated utility styles across modules
❌ No shared design tokens
❌ Inconsistent spacing/colors
❌ Larger bundle size
```

### 7-1 + CSS Modules (Hybrid)
```
✅ Shared design tokens
✅ Global utilities (no duplication)
✅ Scoped component styles
✅ Smaller bundle size
✅ Best of both worlds
```

## 🎨 Real-World Example

### Global Layout (7-1 Pattern)
```scss
// layout/_header.scss
.site-header {
  position: sticky;
  top: 0;
  background: var(--surface-colour);
  z-index: map.get($z-index, sticky);
}
```

### Component (CSS Module)
```scss
// components/UserMenu/UserMenu.module.scss
@use '@app/styles/abstracts' as *;

.menu {
  @include theme-aware-surface;
  @include border-radius(map.get($border, md));
  padding: map.get($spacing, sm);
}

.menuItem {
  padding: map.get($spacing, xs) map.get($spacing, sm);
  @include enhanced-transition(background, fast, smooth);
  
  &:hover {
    background: var(--surface-colour-hover);
  }
}
```

### Usage in Component
```tsx
// UserMenu.tsx
import styles from './UserMenu.module.scss';

export const UserMenu = () => {
  return (
    <div className={`${styles.menu} animate-fade-in`}>
      <button className={styles.menuItem}>Profile</button>
      <button className={styles.menuItem}>Settings</button>
      <button className={`${styles.menuItem} text-error`}>Logout</button>
    </div>
  );
};
```

## 🚀 Migration Strategy

### Step 1: Keep Global Styles in 7-1
- Layout (header, footer, grid)
- Base styles (reset, typography)
- Themes
- Utilities

### Step 2: Convert Components to CSS Modules
```bash
# Before
components/Button/Button.scss

# After
components/Button/Button.module.scss
```

### Step 3: Import Abstracts in Modules
```scss
// Add to every .module.scss file
@use '@app/styles/abstracts' as *;
```

### Step 4: Use Global Utilities
```tsx
// Combine module classes with global utilities
<div className={`${styles.component} flex gap-md p-lg`}>
```

## 📚 Benefits

### For Development
- ✅ Scoped styles (no conflicts)
- ✅ Shared design tokens
- ✅ Global utilities (DRY)
- ✅ Type-safe class names

### For Performance
- ✅ Smaller bundle size
- ✅ Better tree-shaking
- ✅ Optimized CSS output
- ✅ Cached global styles

### For Maintenance
- ✅ Clear separation
- ✅ Easy to find styles
- ✅ Consistent design system
- ✅ Scalable architecture

## 🆘 Common Questions

### Q: Should all component styles use CSS Modules?
**A**: Yes, for component-specific styles. Use global styles for layout and utilities.

### Q: Can I use global classes in CSS Modules?
**A**: Yes! Use `:global(.className)` or mix with module classes in JSX.

### Q: How do I share styles between modules?
**A**: Import abstracts and use mixins/functions, or use global utility classes.

### Q: What about third-party components?
**A**: Override in `vendors/` folder using global styles.

---

**Best Practice**: Use 7-1 for global architecture, CSS Modules for component isolation. Together, they create a powerful, maintainable styling system!
