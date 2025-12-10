# SCSS 7-1 Pattern Architecture

This project uses the **7-1 Pattern** - an industry-standard SCSS architecture.

## 📁 Structure

```
styles/
├── abstracts/      # Variables, functions, mixins (no CSS output)
├── vendors/        # Third-party CSS
├── base/           # Reset, typography, base styles
├── layout/         # Header, footer, grid, containers
├── components/     # UI component styles
├── pages/          # Page-specific styles
├── themes/         # Theme variations
├── utilities/      # Utility classes (bonus)
├── animations/     # Animation definitions (bonus)
└── main.scss       # Main import file
```

## 🚀 Quick Start

### Import in Your App
```tsx
import '@app/styles/main.scss';
```

### Use in Components
```scss
@use '@app/styles/abstracts' as *;

.my-component {
  padding: map.get($spacing, md);
  color: var(--text-colour);
}
```

## 📚 Documentation

- **[7-1 Pattern Architecture](../../docs/architecture/7-1-PATTERN.md)** - Official architecture docs
- **[Implementation Guide](../../docs/kiro-notes/2024-12-7-1-pattern-implementation.md)** - How it was implemented
- **[SCSS Architecture](../../docs/architecture/SCSS_ARCHITECTURE.md)** - Complete system guide
- **[Quick Reference](../../docs/kiro-notes/scss-quick-reference.md)** - Common patterns

## 🎯 Quick Reference

### Adding Component Styles
1. Create `components/_button.scss`
2. Add `@forward 'button';` to `components/_index.scss`
3. Styles automatically included

### Adding Page Styles
1. Create `pages/_home.scss`
2. Add `@forward 'home';` to `pages/_index.scss`
3. Styles automatically included

### Using Design Tokens
```scss
@use '../abstracts' as *;

.element {
  padding: map.get($spacing, lg);
  color: map.get($primary, base);
  @include typography(md, semi-bold);
}
```

## 📖 Learn More

See the [complete documentation](../../docs/architecture/7-1-PATTERN.md) for detailed information about the 7-1 pattern and how to use it effectively.
