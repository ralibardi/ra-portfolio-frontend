# CSS Module Template

Use this template when creating new component styles with CSS Modules.

## Basic Template

```scss
// component-name.module.scss
// Component: ComponentName
// Purpose: Brief description of the component
// Requirements: List any relevant requirement numbers

@use 'sass:map';
@use '@assets/abstracts' as *;

// =============================================================================
// Base Component Styles
// =============================================================================

.container {
  // Layout
  @include theme-aware-surface;
  @include border-radius(map.get($border, md));

  // Spacing
  padding: map.get($spacing, lg);

  // Transitions
  @include transition(transform, box-shadow);
}

// =============================================================================
// Component Elements
// =============================================================================

.header {
  @include font-style(
    map.get($font-sizes, lg),
    map.get($font-weights, semi-bold)
  );
  margin-bottom: map.get($spacing, md);
  color: var(--text-colour);
}

.content {
  @include font-style(
    map.get($font-sizes, md),
    map.get($font-weights, regular)
  );
  color: var(--text-colour);
}

.footer {
  margin-top: map.get($spacing, md);
  padding-top: map.get($spacing, md);
  border-top: map.get($border, xs) solid var(--border-colour);
}

// =============================================================================
// Variants
// =============================================================================

.elevated {
  @include theme-aware-elevation(2);
}

.compact {
  padding: map.get($spacing, md);

  .header {
    margin-bottom: map.get($spacing, sm);
  }
}

// =============================================================================
// Interactive States
// =============================================================================

.interactive {
  cursor: pointer;

  &:hover {
    background-color: var(--surface-colour-hover);
    @include transform(1.01);
    @include theme-aware-elevation(2);
  }

  &:active {
    background-color: var(--surface-colour-active);
    @include transform(0.99);
  }

  &:focus-visible {
    @include theme-aware-focus;
  }
}

// =============================================================================
// Disabled State
// =============================================================================

.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}
```

---

## Component TypeScript Template

```tsx
// component-name.tsx
import classNames from 'classnames';
import React, { type FunctionComponent, type PropsWithChildren } from 'react';
import styles from '../assets/component-name.module.scss';

export type ComponentNameProps = PropsWithChildren<{
  /** Additional CSS class names */
  className?: string;
  /** Elevated variant with shadow */
  elevated?: boolean;
  /** Compact variant with less padding */
  compact?: boolean;
  /** Interactive variant with hover effects */
  interactive?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Click handler (for interactive variant) */
  onClick?: () => void;
}>;

export const ComponentName: FunctionComponent<ComponentNameProps> = ({
  children,
  className,
  elevated = false,
  compact = false,
  interactive = false,
  disabled = false,
  onClick,
}) => {
  const containerClasses = classNames(
    styles.container,
    {
      [styles.elevated]: elevated,
      [styles.compact]: compact,
      [styles.interactive]: interactive,
      [styles.disabled]: disabled,
    },
    className,
  );

  return (
    <div
      className={containerClasses}
      onClick={interactive && !disabled ? onClick : undefined}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive && !disabled ? 0 : undefined}
    >
      {children}
    </div>
  );
};

export default ComponentName;
```

---

## Specialized Templates

### Card Component

```scss
// card.module.scss
@use 'sass:map';
@use '@assets/abstracts' as *;

.card {
  @include theme-aware-surface;
  @include border-radius(map.get($border, md));
  @include theme-aware-elevation(1);
  padding: map.get($spacing, lg);
  @include transition(transform, box-shadow);
}

.elevated {
  @include theme-aware-elevation(2);
}

.interactive {
  cursor: pointer;

  &:hover {
    background-color: var(--surface-colour-hover);
    @include transform(1.01);
    @include theme-aware-elevation(2);
  }

  &:active {
    background-color: var(--surface-colour-active);
    @include transform(0.99);
  }

  &:focus-visible {
    @include theme-aware-focus;
  }
}

.header {
  margin-bottom: map.get($spacing, md);
}

.footer {
  margin-top: map.get($spacing, md);
}
```

### Button Component

```scss
// button.module.scss
@use 'sass:map';
@use '@assets/abstracts' as *;

// Size calculations
$button-height-sm: calc(map.get($spacing, lg) + map.get($spacing, '3xs'));
$button-height-md: calc(map.get($spacing, xl) + map.get($spacing, '3xs'));
$button-height-lg: calc(map.get($spacing, '2xl') + map.get($spacing, '3xs'));

.button {
  @include size(auto, $button-height-md);
  min-width: map.get($spacing, '3xl');
  line-height: $button-height-md;
  padding: map.get($spacing, xs) map.get($spacing, md);
  background-color: var(--background-colour);
  border: map.get($border, xs) solid var(--border-colour);
  cursor: pointer;
  @include transition(border-color, box-shadow, background-color, transform);
  @include border-radius(map.get($border, '3xl'));

  &:hover:not(:disabled) {
    border-color: var(--accent-colour);
    @include box-shadow(
      map.get($spacing, 0),
      map.get($spacing, 0),
      map.get($spacing, lg),
      map.get($spacing, 0),
      var(--accent-colour)
    );
  }

  &:active:not(:disabled) {
    @include transform(0.98);
  }

  &:focus-visible {
    @include theme-aware-focus;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
}

// Size variants
.small {
  @include size(auto, $button-height-sm);
  min-width: map.get($spacing, '2xl');
  padding: map.get($spacing, '2xs') map.get($spacing, sm);
}

.large {
  @include size(auto, $button-height-lg);
  min-width: map.get($spacing, '4xl');
  padding: map.get($spacing, sm) map.get($spacing, lg);
}

.label {
  @include font-style(
    map.get($font-sizes, md),
    map.get($font-weights, semi-bold),
    var(--accent-colour)
  );
  font-family: $font-family;
}
```

### Form Input Component

```scss
// input.module.scss
@use 'sass:map';
@use '@assets/abstracts' as *;

.wrapper {
  display: flex;
  flex-direction: column;
  gap: map.get($spacing, xs);
}

.label {
  @include font-style(map.get($font-sizes, sm), map.get($font-weights, medium));
  color: var(--text-colour);
}

.input {
  @include size(map.get($percentage, 100), auto);
  padding: map.get($spacing, sm) map.get($spacing, md);
  background-color: var(--surface-colour);
  border: map.get($border, xs) solid var(--border-colour);
  @include border-radius(map.get($border, sm));
  @include font-style(
    map.get($font-sizes, md),
    map.get($font-weights, regular)
  );
  color: var(--text-colour);
  @include transition(border-color, box-shadow);

  &::placeholder {
    color: var(--text-colour-muted);
  }

  &:hover:not(:disabled) {
    border-color: var(--accent-colour);
  }

  &:focus {
    outline: none;
    @include theme-aware-focus;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.error {
  .input {
    border-color: var(--error-colour);
  }
}

.errorMessage {
  @include font-style(
    map.get($font-sizes, sm),
    map.get($font-weights, regular)
  );
  color: var(--error-colour);
}
```

### Toast/Notification Component

```scss
// toast.module.scss
@use 'sass:map';
@use '@assets/abstracts' as *;

.container {
  position: fixed;
  right: map.get($spacing, xl);
  bottom: map.get($spacing, xl);
  display: grid;
  gap: map.get($spacing, md);
  z-index: map.get($z-index, toast);
}

.toast {
  @include border-radius(map.get($border, md));
  padding: map.get($spacing, md) map.get($spacing, lg);
  background: var(--foreground-colour);
  color: var(--text-colour);
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  @include box-shadow(
    map.get($spacing, 0),
    map.get($spacing, '3xs'),
    map.get($spacing, xs),
    map.get($spacing, 0),
    var(--shadow-colour)
  );
}

// Semantic variants using data attributes
.toast[data-type='success'] {
  border-left: map.get($border, lg) solid var(--success-colour);
}

.toast[data-type='warning'] {
  border-left: map.get($border, lg) solid var(--warning-colour);
}

.toast[data-type='error'] {
  border-left: map.get($border, lg) solid var(--error-colour);
}

.toast[data-type='info'] {
  border-left: map.get($border, lg) solid var(--info-colour);
}

.message {
  @include font-style(map.get($font-sizes, md), map.get($font-weights, medium));
}

.close {
  appearance: none;
  background: transparent;
  border: none;
  color: var(--text-colour);
  cursor: pointer;
  @include transition(color map.get($transition, fast) map.get($easing, ease));

  &:hover {
    color: var(--text-colour-muted);
  }

  &:focus-visible {
    @include theme-aware-focus;
  }
}
```

---

## Page Component Template

```scss
// page-name.module.scss
@use 'sass:map';
@use '@assets/abstracts' as *;

.page {
  min-height: map.get($viewport, full-dvh);
  padding: map.get($spacing, xl) 0;
}

.header {
  text-align: center;
  margin-bottom: map.get($spacing, '2xl');
}

.title {
  @include font-style(
    map.get($font-sizes, '4xl'),
    map.get($font-weights, bold)
  );
  color: var(--text-colour);
  margin-bottom: map.get($spacing, md);
}

.subtitle {
  @include font-style(
    map.get($font-sizes, lg),
    map.get($font-weights, regular)
  );
  color: var(--text-colour-muted);
}

.content {
  display: grid;
  gap: map.get($spacing, xl);
}

.section {
  @include theme-aware-surface;
  @include border-radius(map.get($border, md));
  padding: map.get($spacing, xl);
}

// Responsive adjustments
@include breakpoint('tablet') {
  .title {
    font-size: map.get($font-sizes, '5xl');
  }

  .content {
    grid-template-columns: repeat(2, 1fr);
  }
}

@include breakpoint('desktop') {
  .content {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

## Checklist for New Components

- [ ] File named `component-name.module.scss`
- [ ] Located in component's `assets/` folder
- [ ] Imports `@use 'sass:map';` and `@use '@assets/abstracts' as *;`
- [ ] Uses `map.get($spacing, ...)` for all spacing
- [ ] Uses `map.get($border, ...)` for borders and radii
- [ ] Uses CSS custom properties for colors (`var(--...)`)
- [ ] Uses theme-aware mixins for surfaces and elevations
- [ ] Includes hover, active, and focus states for interactive elements
- [ ] Includes disabled state if applicable
- [ ] Respects reduced motion preferences for animations
- [ ] Works in both light and dark themes

---

**Last Updated**: December 2024
