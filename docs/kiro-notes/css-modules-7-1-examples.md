# CSS Modules + 7-1 Pattern: Practical Examples

**Created**: December 2024  
**Type**: AI-Generated Examples  
**Status**: ✅ Complete

## 🎯 Quick Answer

**Yes!** The 7-1 pattern works perfectly with CSS Modules:
- **7-1 Pattern** = Global styles (layout, base, themes, utilities)
- **CSS Modules** = Component-specific styles (scoped)

## 📋 Real-World Examples

### Example 1: Button Component

**Button.tsx**:
```tsx
import styles from './Button.module.scss';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = ({ 
  children, 
  variant = 'primary',
  size = 'md' 
}: ButtonProps) => {
  return (
    <button 
      className={styles.button}
      data-variant={variant}
      data-size={size}
    >
      {children}
    </button>
  );
};
```

**Button.module.scss**:
```scss
@use '@app/styles/abstracts' as *;

.button {
  // Base styles using 7-1 design tokens
  @include typography(md, semi-bold, none);
  @include border-radius(map.get($border, sm));
  @include enhanced-transition(all, fast, smooth);
  border: none;
  cursor: pointer;
  
  // Theme-aware colors
  background: var(--accent-colour);
  color: var(--text-colour-inverse);
  
  // Variants using data attributes
  &[data-variant="primary"] {
    background: var(--accent-colour);
  }
  
  &[data-variant="secondary"] {
    background: var(--secondary-colour);
  }
  
  &[data-variant="outline"] {
    background: transparent;
    border: map.get($border, xs) solid var(--accent-colour);
    color: var(--accent-colour);
  }
  
  // Sizes using design tokens
  &[data-size="sm"] {
    padding: map.get($spacing, xs) map.get($spacing, sm);
    font-size: map.get($font-sizes, sm);
  }
  
  &[data-size="md"] {
    padding: map.get($spacing, sm) map.get($spacing, lg);
  }
  
  &[data-size="lg"] {
    padding: map.get($spacing, md) map.get($spacing, xl);
    font-size: map.get($font-sizes, lg);
  }
  
  // States
  &:hover {
    @include transform(1.05);
  }
  
  &:active {
    @include transform(0.95);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
```

---

### Example 2: Card Component with Global Utilities

**Card.tsx**:
```tsx
import styles from './Card.module.scss';

interface CardProps {
  title: string;
  children: React.ReactNode;
  elevated?: boolean;
  interactive?: boolean;
}

export const Card = ({ 
  title, 
  children, 
  elevated = false,
  interactive = false 
}: CardProps) => {
  return (
    <div 
      className={`
        ${styles.card} 
        ${elevated ? styles.elevated : ''}
        ${interactive ? styles.interactive : ''}
        animate-fade-in
      `}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
      </div>
      <div className={`${styles.content} p-lg`}>
        {children}
      </div>
    </div>
  );
};
```

**Card.module.scss**:
```scss
@use '@app/styles/abstracts' as *;

.card {
  @include theme-aware-surface;
  @include border-radius(map.get($border, md));
  @include enhanced-transition(all, normal, smooth);
  overflow: hidden;
  
  &.elevated {
    @include theme-aware-elevation(1);
  }
  
  &.interactive {
    cursor: pointer;
    
    &:hover {
      @include theme-aware-elevation(2);
      @include transform(1.02);
    }
  }
}

.header {
  padding: map.get($spacing, lg);
  border-bottom: map.get($border, xs) solid var(--border-colour);
}

.title {
  @include typography(lg, semi-bold, tight);
  color: var(--text-colour);
  margin: 0;
}

.content {
  // Padding applied via global utility class in JSX
  @include typography(md, regular, relaxed);
  color: var(--text-colour);
}
```

---

### Example 3: Form Component

**Form.tsx**:
```tsx
import styles from './Form.module.scss';

export const ContactForm = () => {
  return (
    <form className={styles.form}>
      <div className={`${styles.field} mb-lg`}>
        <label className={styles.label}>Name</label>
        <input 
          type="text" 
          className={styles.input}
          placeholder="Your name"
        />
      </div>
      
      <div className={`${styles.field} mb-lg`}>
        <label className={styles.label}>Email</label>
        <input 
          type="email" 
          className={styles.input}
          placeholder="your@email.com"
        />
      </div>
      
      <div className={`${styles.field} mb-lg`}>
        <label className={styles.label}>Message</label>
        <textarea 
          className={styles.textarea}
          rows={5}
          placeholder="Your message"
        />
      </div>
      
      <button type="submit" className={`${styles.submit} mt-xl`}>
        Send Message
      </button>
    </form>
  );
};
```

**Form.module.scss**:
```scss
@use '@app/styles/abstracts' as *;

.form {
  max-width: 600px;
  margin: 0 auto;
}

.field {
  @include flexbox(column, flex-start, stretch);
  gap: map.get($spacing, xs);
}

.label {
  @include typography(sm, semi-bold, none);
  color: var(--text-colour);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.input,
.textarea {
  @include typography(md, regular, normal);
  padding: map.get($spacing, sm) map.get($spacing, md);
  @include border-radius(map.get($border, sm));
  border: map.get($border, xs) solid var(--border-colour);
  background: var(--surface-colour);
  color: var(--text-colour);
  @include enhanced-transition(all, fast, smooth);
  
  &:focus {
    @include theme-aware-focus;
    border-color: var(--accent-colour);
  }
  
  &::placeholder {
    color: var(--text-colour-muted);
  }
}

.textarea {
  resize: vertical;
  min-height: 120px;
}

.submit {
  @include typography(md, semi-bold, none);
  padding: map.get($spacing, md) map.get($spacing, '2xl');
  @include border-radius(map.get($border, sm));
  border: none;
  background: var(--accent-colour);
  color: var(--text-colour-inverse);
  cursor: pointer;
  width: 100%;
  @include enhanced-transition(all, fast, smooth);
  
  &:hover {
    background: var(--accent-colour-hover);
    @include transform(1.02);
  }
  
  &:active {
    @include transform(0.98);
  }
}
```

---

### Example 4: Layout with Global + Module Styles

**ProjectsPage.tsx**:
```tsx
import styles from './ProjectsPage.module.scss';

export const ProjectsPage = () => {
  return (
    <div className="container">
      <section className="section">
        <h1 className={styles.pageTitle}>My Projects</h1>
        <p className={`${styles.subtitle} text-muted`}>
          A collection of my work
        </p>
        
        {/* Using global grid + module styles */}
        <div className="grid grid-cols-1 grid-cols-md-3 gap-xl mt-2xl">
          {projects.map(project => (
            <div key={project.id} className={styles.projectCard}>
              <img 
                src={project.image} 
                alt={project.title}
                className={styles.projectImage}
              />
              <div className={`${styles.projectContent} p-lg`}>
                <h3 className={styles.projectTitle}>{project.title}</h3>
                <p className="text-muted">{project.description}</p>
                
                <div className="flex gap-sm mt-md flex-wrap">
                  {project.tags.map(tag => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
```

**ProjectsPage.module.scss**:
```scss
@use '@app/styles/abstracts' as *;

.pageTitle {
  @include responsive-typography('3xl', '5xl');
  font-weight: map.get($font-weights, bold);
  color: var(--text-colour);
  margin-bottom: map.get($spacing, md);
}

.subtitle {
  @include typography(lg, regular, relaxed);
  max-width: 600px;
}

.projectCard {
  @include theme-aware-surface;
  @include border-radius(map.get($border, md));
  overflow: hidden;
  @include enhanced-transition(transform, normal, smooth);
  
  &:hover {
    @include transform(1.03);
    @include theme-aware-elevation(2);
  }
}

.projectImage {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.projectContent {
  // Padding from global utility
}

.projectTitle {
  @include typography(xl, bold, tight);
  color: var(--text-colour);
  margin-bottom: map.get($spacing, sm);
}

.tag {
  @include typography(xs, medium, none);
  padding: map.get($spacing, '3xs') map.get($spacing, sm);
  @include border-radius(map.get($border, xs));
  background: var(--accent-colour);
  color: var(--text-colour-inverse);
}
```

---

## 🎯 Key Patterns

### Pattern 1: Import Abstracts
```scss
// Always start with this
@use '@app/styles/abstracts' as *;
```

### Pattern 2: Use Design Tokens
```scss
// ✅ Good
padding: map.get($spacing, md);
color: var(--text-colour);

// ❌ Bad
padding: 16px;
color: #000000;
```

### Pattern 3: Mix Global + Module Classes
```tsx
// ✅ Good - Best of both worlds
<div className={`${styles.card} flex gap-md p-lg animate-fade-in`}>
```

### Pattern 4: Use Data Attributes for Variants
```tsx
// ✅ Good - Clean API
<Button variant="primary" size="lg">Click</Button>

// In CSS
.button[data-variant="primary"] { }
.button[data-size="lg"] { }
```

## 📊 Benefits Summary

| Aspect | 7-1 Only | CSS Modules Only | 7-1 + Modules |
|--------|----------|------------------|---------------|
| Scoped Styles | ❌ | ✅ | ✅ |
| Design Tokens | ✅ | ❌ | ✅ |
| Global Utilities | ✅ | ❌ | ✅ |
| No Conflicts | ❌ | ✅ | ✅ |
| Bundle Size | Medium | Large | Small |
| Maintainability | Good | Medium | Excellent |

## 🚀 Quick Start

1. **Keep 7-1 for global styles** (already done)
2. **Create component with CSS Module**:
   ```bash
   components/Button/
   ├── Button.tsx
   └── Button.module.scss
   ```
3. **Import abstracts in module**:
   ```scss
   @use '@app/styles/abstracts' as *;
   ```
4. **Mix global utilities with module classes**:
   ```tsx
   <div className={`${styles.component} flex gap-md`}>
   ```

## 📚 Related Docs

- [CSS Modules with 7-1](../../architecture/CSS-MODULES-WITH-7-1.md) - Complete guide
- [7-1 Pattern](../../architecture/7-1-PATTERN.md) - Architecture overview
- [SCSS Architecture](../../architecture/SCSS_ARCHITECTURE.md) - Design system

---

**TL;DR**: Use 7-1 for global architecture, CSS Modules for component isolation. Import abstracts in modules to access design tokens. Mix global utilities with module classes for maximum efficiency!
