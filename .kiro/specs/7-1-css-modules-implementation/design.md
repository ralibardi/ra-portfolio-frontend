# Design Document: 7-1 Pattern with CSS Modules Implementation

## Overview

This design implements a hybrid architecture combining the 7-1 SCSS pattern for global design tokens with CSS Modules for component-scoped styles. The approach provides scalability, maintainability, and prevents style conflicts while maintaining a consistent design system across the RA Portfolio application.

### Design Philosophy

- **Global Design Tokens**: Centralized design system using 7-1 pattern for colors, spacing, typography, and mixins
- **Component Scoping**: CSS Modules for component-specific styles to prevent naming conflicts
- **Progressive Enhancement**: Gradual migration path from current architecture to full 7-1 + CSS Modules
- **Performance First**: Optimized bundle sizes with tree-shaking and code splitting
- **Developer Experience**: Clear patterns, autocomplete support, and comprehensive documentation

### Current State Analysis

The application currently has:
- ✅ Global SCSS architecture with design tokens (`_variables.scss`, `_colours.scss`, `_mixins.scss`)
- ✅ Some components using CSS Modules (e.g., `PWAUpdate.module.scss`, `card.module.scss`)
- ✅ Vite configured with CSS Modules support
- ✅ Enhanced design token system with semantic colors, spacing, and easing curves
- ⚠️ Inconsistent styling patterns across components (some use modules, some don't)
- ⚠️ No formal 7-1 folder structure for global styles
- ⚠️ Missing utility classes for rapid development

## Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Application Entry                        │
│                      (main.tsx)                              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Global Styles (index.scss)                      │
│  Imports 7-1 pattern in correct order                       │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   7-1 Global │  │  Components  │  │    Pages     │
│    Styles    │  │ CSS Modules  │  │ CSS Modules  │
└──────────────┘  └──────────────┘  └──────────────┘
        │                │                │
        │                └────────┬───────┘
        │                         │
        ▼                         ▼
┌──────────────────────────────────────────┐
│        Design Tokens (abstracts/)        │
│  - Colors, Spacing, Typography           │
│  - Mixins, Functions, Breakpoints        │
│  Imported via @use in CSS Modules        │
└──────────────────────────────────────────┘
```

### 7-1 Pattern Structure


```
src/assets/
├── index.scss                 # Main entry point (imports all 7-1 folders)
├── abstracts/                 # Design tokens and tools (no CSS output)
│   ├── _index.scss           # Forwards all abstracts
│   ├── _variables.scss       # Spacing, borders, z-index, transitions
│   ├── _colours.scss         # Color families and palettes
│   ├── _typography.scss      # Font sizes, weights, line heights
│   ├── _mixins.scss          # Reusable SCSS mixins
│   ├── _functions.scss       # SCSS functions for calculations
│   └── _breakpoints.scss     # Responsive breakpoint definitions
├── vendors/                   # Third-party CSS (if needed)
│   └── _normalize.scss       # CSS reset/normalize
├── base/                      # Base HTML element styles
│   ├── _reset.scss           # Custom reset rules
│   ├── _typography.scss      # Base typography styles
│   └── _animations.scss      # Global animation definitions
├── layout/                    # Layout-level styles
│   ├── _grid.scss            # Grid system
│   ├── _container.scss       # Container styles
│   ├── _header.scss          # Global header layout
│   ├── _footer.scss          # Global footer layout
│   └── _navigation.scss      # Navigation layout
├── components/                # Global component styles (minimal)
│   └── _buttons.scss         # Global button utilities
├── pages/                     # Page-specific global styles (minimal)
│   └── _home.scss            # Home page specific globals
├── themes/                    # Theme definitions
│   ├── _light.scss           # Light theme variables
│   ├── _dark.scss            # Dark theme variables
│   └── _theme-mixins.scss    # Theme-aware mixins
└── utilities/                 # Utility classes
    ├── _spacing.scss         # Margin/padding utilities
    ├── _flexbox.scss         # Flexbox utilities
    ├── _text.scss            # Text utilities
    └── _animations.scss      # Animation utilities
```

### Component CSS Modules Structure

```
src/components/component-name/
├── components/
│   └── component-name.tsx
├── assets/
│   └── component-name.module.scss    # Scoped component styles
└── types/
    └── component-name.types.ts
```

### Import Order and Cascade

The 7-1 pattern requires specific import order to ensure proper CSS cascade:

1. **abstracts/** - Variables, mixins, functions (no CSS output)
2. **vendors/** - Third-party CSS
3. **base/** - HTML element defaults
4. **layout/** - Layout structures
5. **components/** - Global component patterns
6. **pages/** - Page-specific globals
7. **themes/** - Theme definitions
8. **utilities/** - Utility classes (highest specificity)

## Components and Interfaces

### Global Styles Entry Point

**File**: `src/assets/index.scss`

```scss
// 1. Abstracts - Design tokens (no CSS output)
@use 'abstracts' as *;

// 2. Vendors - Third-party CSS
@use 'vendors/normalize';

// 3. Base - HTML element styles
@use 'base/reset';
@use 'base/typography';
@use 'base/animations';

// 4. Layout - Layout structures
@use 'layout/grid';
@use 'layout/container';
@use 'layout/header';
@use 'layout/footer';
@use 'layout/navigation';

// 5. Components - Global component patterns
@use 'components/buttons';

// 6. Pages - Page-specific globals
@use 'pages/home';

// 7. Themes - Theme system
@use 'themes/light';
@use 'themes/dark';
@use 'themes/theme-mixins';

// 8. Utilities - Utility classes
@use 'utilities/spacing';
@use 'utilities/flexbox';
@use 'utilities/text';
@use 'utilities/animations';

// Root element configuration
:root {
  @include font-style(
    map.get($font-sizes, md),
    map.get($font-weights, regular)
  );
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  min-height: 100dvh;
  overflow-x: hidden;

  // Default light theme
  @include theme(light);

  // System theme support
  @media (prefers-color-scheme: dark) {
    &:not([data-theme="light"]) {
      @include theme(dark);
    }
  }

  // Explicit theme overrides
  &[data-theme="light"] {
    @include theme(light);
  }

  &[data-theme="dark"] {
    @include theme(dark);
  }
}
```

### Abstracts Index (Design Token Hub)

**File**: `src/assets/abstracts/_index.scss`

```scss
// Forward all abstracts for easy importing
@forward 'variables';
@forward 'colours';
@forward 'typography';
@forward 'mixins';
@forward 'functions';
@forward 'breakpoints';
```

### Component CSS Module Pattern

**File**: `src/components/card/assets/card.module.scss`

```scss
// Import design tokens from abstracts
@use 'sass:map';
@use '@assets/abstracts' as *;

// Component-scoped styles
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

### Component TypeScript Integration

**File**: `src/components/card/components/card.tsx`

```typescript
import React from 'react';
import styles from '../assets/card.module.scss';

interface CardProps {
  children: React.ReactNode;
  elevated?: boolean;
  interactive?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  elevated = false,
  interactive = false,
  className = '',
  onClick,
}) => {
  const cardClasses = [
    styles.card,
    elevated && styles.elevated,
    interactive && styles.interactive,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cardClasses} onClick={onClick}>
      {children}
    </div>
  );
};
```

## Data Models

### Design Token Structure

#### Spacing Scale

```scss
$spacing: (
  0: 0,
  '3xs': 0.125rem,  // 2px
  '2xs': 0.25rem,   // 4px
  xs: 0.5rem,       // 8px
  sm: 0.75rem,      // 12px
  md: 1rem,         // 16px (base)
  lg: 1.25rem,      // 20px
  xl: 1.5rem,       // 24px
  '2xl': 2rem,      // 32px
  '3xl': 3rem,      // 48px
  '4xl': 4rem,      // 64px
  '5xl': 6rem,      // 96px
  '6xl': 8rem,      // 128px
  '7xl': 12rem,     // 192px
);
```

#### Color Families

```scss
// Primary colors
$primary: (
  base: #4a90e2,
  light: #357abd,
  dark: #2a5d9e,
  alpha-08: rgba(74, 144, 226, 0.08),
);

// Semantic colors
$success: (
  base: #10b981,
  light: #34d399,
  dark: #059669,
  alpha-08: rgba(16, 185, 129, 0.08),
);

$warning: (
  base: #f59e0b,
  light: #fbbf24,
  dark: #d97706,
  alpha-08: rgba(245, 158, 11, 0.08),
);

$error: (
  base: #ef4444,
  light: #f87171,
  dark: #dc2626,
  alpha-08: rgba(239, 68, 68, 0.08),
);

$info: (
  base: #3b82f6,
  light: #60a5fa,
  dark: #2563eb,
  alpha-08: rgba(59, 130, 246, 0.08),
);
```

#### Typography Scale

```scss
$font-sizes: (
  xs: 0.75rem,    // 12px
  sm: 0.875rem,   // 14px
  md: 1rem,       // 16px (base)
  lg: 1.125rem,   // 18px
  xl: 1.25rem,    // 20px
  '2xl': 1.5rem,  // 24px
  '3xl': 1.875rem,// 30px
  '4xl': 2.25rem, // 36px
  '5xl': 3rem,    // 48px
  '6xl': 3.75rem, // 60px
);

$font-weights: (
  thin: 100,
  extra-light: 200,
  light: 300,
  regular: 400,
  medium: 500,
  semi-bold: 600,
  bold: 700,
  extra-bold: 800,
  black: 900,
);
```

### CSS Module Naming Convention

```scss
// BEM-inspired naming within modules
.componentName { }           // Block
.componentName__element { }  // Element
.componentName--modifier { } // Modifier

// State classes
.isActive { }
.isDisabled { }
.isLoading { }

// Variant classes
.primary { }
.secondary { }
.large { }
.small { }
```

### Utility Class Naming Convention

```scss
// Spacing utilities
.p-{size}   // padding
.m-{size}   // margin
.gap-{size} // gap

// Flexbox utilities
.flex
.flex-center
.flex-between
.flex-column

// Text utilities
.text-center
.text-left
.text-truncate

// Animation utilities
.animate-fade-in
.animate-slide-in-up
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Acceptence Criteria Testing Prework

1.1 WHEN the application loads THEN the system SHALL import styles from the 7-1 pattern folders in the correct order
Thoughts: This is about the build system correctly ordering CSS imports. We can verify this by checking the generated CSS file has the correct cascade order. This is testable by examining the build output.
Testable: yes - example

1.2 WHEN design tokens are updated in abstracts/ THEN the system SHALL make those tokens available to all CSS Modules via @use imports
Thoughts: This is about the SCSS compilation system. We can test this by updating a token value and verifying it propagates to all components that use it. This is a property that should hold for all tokens.
Testable: yes - property

1.3 WHEN global layout styles are defined in layout/ THEN the system SHALL apply those styles globally without CSS Module scoping
Thoughts: This tests that global styles remain global and aren't scoped. We can verify by checking that layout classes are available globally and not hashed.
Testable: yes - example

1.4 WHEN theme variables are defined in themes/ THEN the system SHALL make those CSS custom properties available throughout the application
Thoughts: This is about CSS custom properties being available globally. We can test by checking that theme variables are accessible in any component.
Testable: yes - property

1.5 WHEN utility classes are defined in utilities/ THEN the system SHALL make those classes available globally for use in any component
Thoughts: This tests that utility classes are globally available. We can verify by using utility classes in components and checking they apply correctly.
Testable: yes - example

2.1 WHEN a component CSS Module is created THEN the system SHALL scope all class names to that component
Thoughts: This is about CSS Modules scoping behavior. For any component module, all class names should be hashed/scoped. This is a universal property.
Testable: yes - property

2.2 WHEN a CSS Module imports abstracts THEN the system SHALL provide access to all design tokens
Thoughts: This tests that the import system works correctly. For any CSS Module that imports abstracts, all tokens should be available.
Testable: yes - property

2.3 WHEN a component uses both module classes and global utility classes THEN the system SHALL apply both sets of styles correctly
Thoughts: This tests that scoped and global styles can coexist. We can test with any component that uses both.
Testable: yes - property

2.4 WHEN CSS Module class names are generated THEN the system SHALL use the correct format based on environment
Thoughts: This is about the build configuration. In dev, names should be readable; in prod, they should be hashed. This is testable by checking build output.
Testable: yes - example

2.5 WHEN a component is deleted THEN the system SHALL not include its CSS Module styles in the final bundle
Thoughts: This is about tree-shaking. If we remove a component, its styles shouldn't be in the bundle. This is a build optimization property.
Testable: yes - property

3.1 WHEN a CSS Module needs spacing values THEN the system SHALL use map.get($spacing, *) from abstracts
Thoughts: This is a code quality check. We can scan all CSS Modules to ensure they use the spacing map rather than hardcoded values.
Testable: yes - property

3.2 WHEN a CSS Module needs colors THEN the system SHALL use CSS custom properties from the theme system
Thoughts: This ensures theme-aware colors. We can verify that components use var(--*-colour) rather than direct color values.
Testable: yes - property

3.3 WHEN a CSS Module needs typography THEN the system SHALL use typography mixins and font-size maps from abstracts
Thoughts: This ensures consistent typography. We can check that components use the typography system rather than hardcoded font values.
Testable: yes - property

3.4 WHEN a CSS Module needs responsive breakpoints THEN the system SHALL use breakpoint mixins from abstracts
Thoughts: This ensures consistent responsive behavior. We can verify that media queries use the breakpoint system.
Testable: yes - property

3.5 WHEN hardcoded values are used instead of design tokens THEN the system SHALL fail linting checks
Thoughts: This is about linting configuration. We need a linter rule that detects hardcoded values. This is a tooling requirement.
Testable: no (requires linting tool configuration)

4.1 WHEN a component CSS Module is migrated THEN the system SHALL import @use '@assets/abstracts' as * at the top
Thoughts: This is a code structure requirement. We can verify the import statement exists in migrated components.
Testable: yes - example

4.2 WHEN component styles use hardcoded values THEN the system SHALL replace them with design tokens
Thoughts: This is a migration requirement. We can scan for hardcoded values and verify they're replaced with tokens.
Testable: yes - property

4.3 WHEN component styles are migrated THEN the system SHALL maintain the same visual appearance
Thoughts: This is about visual regression. We can use visual testing to ensure styles look the same before and after migration.
Testable: yes - property (visual regression)

4.4 WHEN a component uses global utility classes THEN the system SHALL preserve those classes alongside module classes
Thoughts: This ensures utility classes aren't removed during migration. We can verify utility classes remain in the component.
Testable: yes - example

4.5 WHEN migration is complete THEN the system SHALL have no remaining hardcoded spacing, color, or typography values
Thoughts: This is a completion criteria. We can scan all files to ensure no hardcoded values remain.
Testable: yes - example

8.1 WHEN a CSS Module uses colors THEN the system SHALL use CSS custom properties
Thoughts: This is the same as 3.2, ensuring theme-aware colors. This is a universal property for all components.
Testable: yes - property

8.2 WHEN the theme is toggled THEN the system SHALL update all CSS custom properties and components SHALL reflect the new theme
Thoughts: This tests the theme system. When toggling themes, all components should update. This is a property about theme reactivity.
Testable: yes - property

8.3 WHEN new theme colors are added THEN the system SHALL make them available to all CSS Modules via CSS custom properties
Thoughts: This is about extensibility. Adding new theme colors should automatically make them available everywhere.
Testable: yes - property

8.4 WHEN a component needs theme-aware styles THEN the system SHALL use theme mixins
Thoughts: This ensures components use the theme system correctly. We can verify components use theme mixins rather than direct color references.
Testable: yes - property

8.5 WHEN theme variables are undefined THEN the system SHALL fall back to default theme values
Thoughts: This is about error handling. If a theme variable is missing, there should be a fallback. This is a property about robustness.
Testable: yes - property

9.1 WHEN the application is built for production THEN the system SHALL generate minified CSS with hashed class names
Thoughts: This is about build output. We can verify the production build has minified CSS and hashed names.
Testable: yes - example

9.2 WHEN CSS Modules are processed THEN the system SHALL tree-shake unused styles
Thoughts: This is about build optimization. Unused styles shouldn't be in the final bundle. This is a property about efficiency.
Testable: yes - property

9.3 WHEN global styles are processed THEN the system SHALL extract common styles to reduce duplication
Thoughts: This is about CSS optimization. Common patterns should be extracted. This is a build optimization property.
Testable: yes - property

9.4 WHEN the bundle is analyzed THEN the system SHALL show CSS size is optimized (< 100KB gzipped)
Thoughts: This is a performance requirement. We can measure the gzipped CSS size and verify it's under the threshold.
Testable: yes - example

9.5 WHEN styles are loaded THEN the system SHALL load critical CSS inline and defer non-critical CSS
Thoughts: This is about loading strategy. Critical CSS should be inline, non-critical should be deferred. This is a performance optimization.
Testable: no (requires manual performance testing)

### Property Reflection

After reviewing all properties, I've identified the following redundancies:

- **Properties 3.2 and 8.1** are identical (both test that CSS Modules use CSS custom properties for colors) - consolidate into one property
- **Properties 1.2, 2.2, and 8.3** all test that design tokens are available to CSS Modules - can be combined into a comprehensive property about token availability
- **Properties 3.1, 3.3, and 3.4** all test that components use design tokens rather than hardcoded values - can be combined into one property about design token usage
- **Property 4.2** is redundant with the combined property above

Consolidated properties will provide better test coverage with less redundancy.

### Correctness Properties

Property 1: CSS Import Order Verification
*For the* production build, the generated CSS file should have styles in the correct cascade order: vendors → base → layout → components → pages → themes → utilities
**Validates: Requirements 1.1**

Property 2: Design Token Availability
*For any* CSS Module that imports abstracts, all design tokens (spacing, colors, typography, breakpoints, mixins) should be accessible and usable
**Validates: Requirements 1.2, 2.2, 8.3**

Property 3: CSS Module Scoping
*For any* component CSS Module, all class names should be scoped (hashed) and not conflict with other components or global styles
**Validates: Requirements 2.1**

Property 4: Dual Class Application
*For any* component that uses both CSS Module classes and global utility classes, both sets of styles should be applied correctly without conflicts
**Validates: Requirements 2.3**

Property 5: Design Token Usage Consistency
*For any* CSS Module, when it needs spacing, colors, typography, or breakpoints, it should use the design token system (map.get, CSS custom properties, mixins) rather than hardcoded values
**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 4.2, 8.1, 8.4**

Property 6: Visual Regression Preservation
*For any* component being migrated to CSS Modules, the visual appearance should remain identical before and after migration (within 1px tolerance)
**Validates: Requirements 4.3**

Property 7: Theme Reactivity
*For any* component using theme-aware colors, when the theme is toggled between light and dark, the component should update its colors to reflect the new theme
**Validates: Requirements 8.2**

Property 8: Theme Fallback Safety
*For any* CSS custom property reference, if the variable is undefined, the system should fall back to a default theme value without breaking the layout
**Validates: Requirements 8.5**

Property 9: Tree-Shaking Effectiveness
*For any* unused component or CSS Module, its styles should not appear in the production bundle
**Validates: Requirements 2.5, 9.2**

Property 10: CSS Optimization
*For any* production build, common CSS patterns should be extracted and deduplicated, and the total gzipped CSS size should be under 100KB
**Validates: Requirements 9.3, 9.4**

## Error Handling

### Build-Time Error Handling

#### Missing Design Token References

```scss
// Error: Undefined spacing token
.component {
  padding: map.get($spacing, 'invalid'); // Build error
}

// Solution: Use valid token or add to design system
.component {
  padding: map.get($spacing, md); // ✓ Valid
}
```

**Error Message**: `Error: map.get($spacing, 'invalid') returned null`
**Resolution**: Check `_variables.scss` for valid spacing tokens

#### Invalid Color References

```scss
// Error: Direct color value instead of theme variable
.component {
  color: #4a90e2; // Linting error
}

// Solution: Use theme variable
.component {
  color: var(--primary-colour); // ✓ Valid
}
```

**Error Message**: `Hardcoded color value detected. Use CSS custom properties.`
**Resolution**: Replace with appropriate theme variable

#### Circular Import Dependencies

```scss
// Error: Circular dependency
// file-a.scss
@use 'file-b';

// file-b.scss
@use 'file-a'; // Circular dependency
```

**Error Message**: `Error: Module loop: file-a imports file-b, which imports file-a`
**Resolution**: Restructure imports to avoid circular dependencies

### Runtime Error Handling

#### Missing CSS Module Styles

```typescript
// Error: CSS Module not imported
const Component = () => {
  return <div className={styles.container}>Content</div>;
  // Error: styles is undefined
};

// Solution: Import CSS Module
import styles from './component.module.scss';

const Component = () => {
  return <div className={styles.container}>Content</div>; // ✓ Valid
};
```

#### Theme Variable Fallbacks

```scss
// Defensive CSS with fallbacks
.component {
  // Primary color with fallback
  color: var(--primary-colour, #4a90e2);
  
  // Background with fallback
  background: var(--background-colour, #fdfdfd);
  
  // Spacing with fallback
  padding: var(--spacing-md, 1rem);
}
```

### Development Error Prevention

#### TypeScript Type Safety

```typescript
// Type-safe CSS Module imports
import styles from './component.module.scss';

// TypeScript will error if class doesn't exist
<div className={styles.nonExistentClass}> // Type error
  
// Autocomplete for available classes
<div className={styles.container}> // ✓ Autocomplete works
```

#### Linting Rules

```json
// stylelint configuration
{
  "rules": {
    "color-no-hex": true,
    "declaration-property-value-disallowed-list": {
      "/^(margin|padding)/": ["/^\\d+px$/"],
      "font-size": ["/^\\d+px$/"]
    },
    "scss/at-import-partial-extension": "never",
    "scss/dollar-variable-pattern": "^[a-z][a-zA-Z0-9]*$"
  }
}
```

## Testing Strategy

### Unit Testing Approach

Unit tests will focus on:
- **Component rendering** with CSS Module classes applied correctly
- **Class name generation** in different environments
- **Theme switching** functionality
- **Utility class application** alongside module classes

### Property-Based Testing Approach

Property-based testing will verify universal properties across all components using **fast-check** library for JavaScript/TypeScript.

#### Property Testing Library

**Library**: fast-check (https://github.com/dubzzz/fast-check)
**Rationale**: 
- Native TypeScript support
- Excellent React integration
- Powerful generators for complex data structures
- Active maintenance and community support

#### Property Test Configuration

```typescript
// jest.config.ts
export default {
  testMatch: ['**/*.property.test.ts', '**/*.property.test.tsx'],
  testTimeout: 30000, // Property tests may take longer
};
```

Each property-based test will run a minimum of **100 iterations** to ensure comprehensive coverage across random inputs.

#### Property Test Examples

**Property 2: Design Token Availability**

```typescript
import fc from 'fast-check';
import { renderHook } from '@testing-library/react';

/**
 * Feature: 7-1-css-modules-implementation, Property 2: Design Token Availability
 * 
 * For any CSS Module that imports abstracts, all design tokens should be accessible
 */
describe('Property 2: Design Token Availability', () => {
  it('should make all design tokens available to any CSS Module', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('spacing', 'colors', 'typography', 'breakpoints'),
        (tokenType) => {
          // Test that token type is accessible in CSS Module
          const cssModule = require(`./test-fixtures/${tokenType}-test.module.scss`);
          expect(cssModule).toBeDefined();
          expect(Object.keys(cssModule).length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

**Property 3: CSS Module Scoping**

```typescript
/**
 * Feature: 7-1-css-modules-implementation, Property 3: CSS Module Scoping
 * 
 * For any component CSS Module, all class names should be scoped and not conflict
 */
describe('Property 3: CSS Module Scoping', () => {
  it('should scope all class names in any CSS Module', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 3, maxLength: 20 }), { minLength: 1, maxLength: 10 }),
        (classNames) => {
          // Generate a test CSS Module with these class names
          const cssContent = classNames.map(name => `.${name} { color: red; }`).join('\n');
          const module = compileCSSModule(cssContent);
          
          // All class names should be hashed/scoped
          classNames.forEach(className => {
            expect(module[className]).toMatch(/^[a-zA-Z0-9_-]+__[a-zA-Z0-9_-]+__[a-zA-Z0-9]{5}$/);
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

**Property 5: Design Token Usage Consistency**

```typescript
/**
 * Feature: 7-1-css-modules-implementation, Property 5: Design Token Usage Consistency
 * 
 * For any CSS Module, it should use design tokens rather than hardcoded values
 */
describe('Property 5: Design Token Usage Consistency', () => {
  it('should not contain hardcoded spacing values in any CSS Module', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...getAllCSSModulePaths()),
        (modulePath) => {
          const content = fs.readFileSync(modulePath, 'utf-8');
          
          // Should not contain hardcoded px values for spacing
          const hardcodedSpacing = /(?:margin|padding|gap):\s*\d+px/g;
          expect(content).not.toMatch(hardcodedSpacing);
          
          // Should use map.get($spacing, *)
          if (content.includes('margin') || content.includes('padding')) {
            expect(content).toMatch(/map\.get\(\$spacing,/);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
  
  it('should not contain hardcoded color values in any CSS Module', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...getAllCSSModulePaths()),
        (modulePath) => {
          const content = fs.readFileSync(modulePath, 'utf-8');
          
          // Should not contain hex colors
          const hexColors = /#[0-9a-fA-F]{3,6}/g;
          expect(content).not.toMatch(hexColors);
          
          // Should use CSS custom properties
          if (content.includes('color') || content.includes('background')) {
            expect(content).toMatch(/var\(--[a-z-]+\)/);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

**Property 7: Theme Reactivity**

```typescript
/**
 * Feature: 7-1-css-modules-implementation, Property 7: Theme Reactivity
 * 
 * For any component using theme-aware colors, toggling theme should update colors
 */
describe('Property 7: Theme Reactivity', () => {
  it('should update colors when theme is toggled for any component', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...getAllThemeAwareComponents()),
        (ComponentClass) => {
          const { container, rerender } = render(
            <ThemeProvider theme="light">
              <ComponentClass />
            </ThemeProvider>
          );
          
          const lightColor = getComputedStyle(container.firstChild).color;
          
          rerender(
            <ThemeProvider theme="dark">
              <ComponentClass />
            </ThemeProvider>
          );
          
          const darkColor = getComputedStyle(container.firstChild).color;
          
          // Colors should be different between themes
          expect(lightColor).not.toBe(darkColor);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Unit Test Examples

**Example 1: Component CSS Module Application**

```typescript
import { render } from '@testing-library/react';
import { Card } from './card';
import styles from '../assets/card.module.scss';

describe('Card Component', () => {
  it('should apply CSS Module classes correctly', () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild;
    
    expect(card).toHaveClass(styles.card);
  });
  
  it('should apply elevated variant class', () => {
    const { container } = render(<Card elevated>Content</Card>);
    const card = container.firstChild;
    
    expect(card).toHaveClass(styles.card);
    expect(card).toHaveClass(styles.elevated);
  });
  
  it('should combine module classes with utility classes', () => {
    const { container } = render(
      <Card className="p-lg m-md">Content</Card>
    );
    const card = container.firstChild;
    
    expect(card).toHaveClass(styles.card);
    expect(card).toHaveClass('p-lg');
    expect(card).toHaveClass('m-md');
  });
});
```

**Example 2: Theme Switching**

```typescript
import { render } from '@testing-library/react';
import { ThemeProvider } from '@contexts/theme-context';
import { Card } from './card';

describe('Theme Integration', () => {
  it('should apply light theme colors', () => {
    const { container } = render(
      <ThemeProvider theme="light">
        <Card>Content</Card>
      </ThemeProvider>
    );
    
    const card = container.firstChild;
    const bgColor = getComputedStyle(card).backgroundColor;
    
    expect(bgColor).toBe('rgb(253, 253, 253)'); // Light theme background
  });
  
  it('should apply dark theme colors', () => {
    const { container } = render(
      <ThemeProvider theme="dark">
        <Card>Content</Card>
      </ThemeProvider>
    );
    
    const card = container.firstChild;
    const bgColor = getComputedStyle(card).backgroundColor;
    
    expect(bgColor).toBe('rgb(44, 62, 80)'); // Dark theme background
  });
});
```

### Visual Regression Testing

**Tool**: Chromatic (Storybook integration)

```typescript
// card.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './card';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    chromatic: { 
      viewports: [320, 768, 1200],
      diffThreshold: 0.01, // 1% difference tolerance
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    children: 'Card content',
  },
};

export const Elevated: Story = {
  args: {
    children: 'Elevated card',
    elevated: true,
  },
};

export const Interactive: Story = {
  args: {
    children: 'Interactive card',
    interactive: true,
  },
};

export const DarkTheme: Story = {
  args: {
    children: 'Dark theme card',
  },
  parameters: {
    theme: 'dark',
  },
};
```

### Integration Testing

```typescript
describe('7-1 Pattern Integration', () => {
  it('should load global styles in correct order', () => {
    const stylesheets = Array.from(document.styleSheets);
    const globalStylesheet = stylesheets.find(sheet => 
      sheet.href?.includes('index.css')
    );
    
    expect(globalStylesheet).toBeDefined();
    
    // Verify cascade order by checking rule order
    const rules = Array.from(globalStylesheet.cssRules);
    const ruleTexts = rules.map(rule => rule.cssText);
    
    // Utilities should come after base styles
    const baseIndex = ruleTexts.findIndex(text => text.includes('html'));
    const utilityIndex = ruleTexts.findIndex(text => text.includes('.p-md'));
    
    expect(utilityIndex).toBeGreaterThan(baseIndex);
  });
});
```

### Performance Testing

```typescript
describe('CSS Bundle Performance', () => {
  it('should have CSS bundle under 100KB gzipped', async () => {
    const cssPath = path.join(__dirname, '../dist/assets/index.css');
    const cssContent = fs.readFileSync(cssPath);
    const gzipped = await gzip(cssContent);
    
    const sizeKB = gzipped.length / 1024;
    expect(sizeKB).toBeLessThan(100);
  });
  
  it('should tree-shake unused component styles', () => {
    const cssContent = fs.readFileSync(
      path.join(__dirname, '../dist/assets/index.css'),
      'utf-8'
    );
    
    // Unused component styles should not be in bundle
    expect(cssContent).not.toContain('unused-component');
  });
});
```


## Implementation Strategy

### Phase 1: Foundation Setup (Week 1)

#### 1.1 Create 7-1 Folder Structure

```bash
src/assets/
├── abstracts/
│   ├── _index.scss
│   ├── _variables.scss (existing, move here)
│   ├── _colours.scss (existing, move here)
│   ├── _typography.scss (new)
│   ├── _mixins.scss (existing, move here)
│   ├── _functions.scss (new)
│   └── _breakpoints.scss (existing, move here)
├── vendors/
│   └── _normalize.scss (new)
├── base/
│   ├── _reset.scss (new)
│   ├── _typography.scss (new)
│   └── _animations.scss (existing, move here)
├── layout/
│   ├── _grid.scss (new)
│   ├── _container.scss (new)
│   ├── _header.scss (new)
│   ├── _footer.scss (new)
│   └── _navigation.scss (new)
├── components/
│   └── _buttons.scss (new)
├── pages/
│   └── _home.scss (new)
├── themes/
│   ├── _light.scss (new)
│   ├── _dark.scss (new)
│   └── _theme-mixins.scss (new)
└── utilities/
    ├── _spacing.scss (new)
    ├── _flexbox.scss (new)
    ├── _text.scss (new)
    └── _animations.scss (new)
```

**Design Decision**: Organize by function rather than by component to maintain clear separation of concerns and enable better code reuse.

#### 1.2 Update Vite Configuration

```typescript
// vite.config.ts
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        implementation: sass,
        additionalData: `@use "sass:map";`, // Make sass:map available globally
      },
    },
    modules: {
      generateScopedName: isProd
        ? '[hash:base64:5]'
        : '[name]__[local]__[hash:base64:5]',
      localsConvention: 'camelCaseOnly', // Support both kebab-case and camelCase
    },
  },
});
```

**Design Decision**: Use short hashes in production for smaller bundle sizes, but readable names in development for easier debugging.

#### 1.3 Create Abstracts Index

```scss
// src/assets/abstracts/_index.scss
@forward 'variables';
@forward 'colours';
@forward 'typography';
@forward 'mixins';
@forward 'functions';
@forward 'breakpoints';
```

**Design Decision**: Use `@forward` to create a single entry point for all design tokens, simplifying imports in CSS Modules.

### Phase 2: Utility Classes (Week 1-2)

#### 2.1 Spacing Utilities

```scss
// src/assets/utilities/_spacing.scss
@use 'sass:map';
@use '../abstracts' as *;

// Generate spacing utilities
@each $name, $value in $spacing {
  // Padding utilities
  .p-#{$name} { padding: $value !important; }
  .pt-#{$name} { padding-top: $value !important; }
  .pr-#{$name} { padding-right: $value !important; }
  .pb-#{$name} { padding-bottom: $value !important; }
  .pl-#{$name} { padding-left: $value !important; }
  .px-#{$name} { 
    padding-left: $value !important;
    padding-right: $value !important;
  }
  .py-#{$name} { 
    padding-top: $value !important;
    padding-bottom: $value !important;
  }
  
  // Margin utilities
  .m-#{$name} { margin: $value !important; }
  .mt-#{$name} { margin-top: $value !important; }
  .mr-#{$name} { margin-right: $value !important; }
  .mb-#{$name} { margin-bottom: $value !important; }
  .ml-#{$name} { margin-left: $value !important; }
  .mx-#{$name} { 
    margin-left: $value !important;
    margin-right: $value !important;
  }
  .my-#{$name} { 
    margin-top: $value !important;
    margin-bottom: $value !important;
  }
  
  // Gap utilities
  .gap-#{$name} { gap: $value !important; }
  .gap-x-#{$name} { column-gap: $value !important; }
  .gap-y-#{$name} { row-gap: $value !important; }
}
```

**Design Decision**: Use `!important` for utility classes to ensure they override component styles, following the utility-first CSS pattern.

#### 2.2 Flexbox Utilities

```scss
// src/assets/utilities/_flexbox.scss
.flex { display: flex !important; }
.inline-flex { display: inline-flex !important; }

// Direction
.flex-row { flex-direction: row !important; }
.flex-column { flex-direction: column !important; }
.flex-row-reverse { flex-direction: row-reverse !important; }
.flex-column-reverse { flex-direction: column-reverse !important; }

// Justify content
.justify-start { justify-content: flex-start !important; }
.justify-end { justify-content: flex-end !important; }
.justify-center { justify-content: center !important; }
.justify-between { justify-content: space-between !important; }
.justify-around { justify-content: space-around !important; }
.justify-evenly { justify-content: space-evenly !important; }

// Align items
.items-start { align-items: flex-start !important; }
.items-end { align-items: flex-end !important; }
.items-center { align-items: center !important; }
.items-baseline { align-items: baseline !important; }
.items-stretch { align-items: stretch !important; }

// Common combinations
.flex-center {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
}

.flex-between {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
}
```

**Design Decision**: Provide both granular utilities and common combinations to balance flexibility with convenience.

#### 2.3 Animation Utilities

```scss
// src/assets/utilities/_animations.scss
@use 'sass:map';
@use '../abstracts' as *;

// Fade animations
.animate-fade-in {
  animation: fadeIn map.get($transition, medium) map.get($easing, smooth);
}

.animate-fade-out {
  animation: fadeOut map.get($transition, medium) map.get($easing, smooth);
}

// Slide animations
.animate-slide-in-up {
  animation: slideInUp map.get($transition, medium) map.get($easing, smooth);
}

.animate-slide-in-down {
  animation: slideInDown map.get($transition, medium) map.get($easing, smooth);
}

// Scale animations
.animate-scale-in {
  animation: scaleIn map.get($transition, fast) map.get($easing, bounce);
}

// Keyframes
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(map.get($spacing, lg));
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(map.get($spacing, lg) * -1);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

// Respect reduced motion preference
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in,
  .animate-fade-out,
  .animate-slide-in-up,
  .animate-slide-in-down,
  .animate-scale-in {
    animation: none !important;
  }
}
```

**Design Decision**: Include reduced motion support by default to ensure accessibility compliance.

### Phase 3: Component Migration (Week 2-4)

#### 3.1 Migration Priority Order

1. **High Priority** (Week 2):
   - PWAUpdate (already migrated ✓)
   - Card
   - Button
   - Loading
   - Toast

2. **Medium Priority** (Week 3):
   - Header
   - Footer
   - Navigation (Topbar)
   - Container
   - Section

3. **Low Priority** (Week 4):
   - Badge
   - Divider
   - Grid
   - TextInput
   - TextArea
   - Toggle
   - ThemeToggle
   - IconLink
   - CompanyInfo
   - EnhancedDemo
   - ErrorBoundary

**Design Decision**: Prioritize frequently used and visually prominent components first to maximize impact and catch issues early.

#### 3.2 Component Migration Template

```scss
// src/components/[component]/assets/[component].module.scss
@use 'sass:map';
@use '@assets/abstracts' as *;

// Component base styles
.componentName {
  // Use design tokens
  padding: map.get($spacing, md);
  @include border-radius(map.get($border, md));
  
  // Use theme variables
  background-color: var(--surface-colour);
  color: var(--text-colour);
  
  // Use mixins
  @include transition(background-color, transform);
  @include theme-aware-elevation(1);
}

// Variants
.primary {
  background-color: var(--primary-colour);
  color: var(--background-colour);
}

.secondary {
  background-color: var(--secondary-colour);
  color: var(--background-colour);
}

// States
.isActive {
  @include theme-aware-elevation(2);
}

.isDisabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

// Responsive
@include breakpoint(tablet) {
  .componentName {
    padding: map.get($spacing, lg);
  }
}
```

#### 3.3 Component TypeScript Template

```typescript
// src/components/[component]/components/[component].tsx
import React from 'react';
import styles from '../assets/[component].module.scss';

interface ComponentProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  isActive?: boolean;
  isDisabled?: boolean;
  className?: string;
}

export const Component: React.FC<ComponentProps> = ({
  children,
  variant = 'primary',
  isActive = false,
  isDisabled = false,
  className = '',
}) => {
  const componentClasses = [
    styles.componentName,
    variant && styles[variant],
    isActive && styles.isActive,
    isDisabled && styles.isDisabled,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={componentClasses}>
      {children}
    </div>
  );
};
```

**Design Decision**: Use a consistent pattern for class name composition to ensure predictable behavior and easier maintenance.

### Phase 4: Layout Components (Week 4-5)

#### 4.1 Global Layout Styles

```scss
// src/assets/layout/_grid.scss
@use 'sass:map';
@use '../abstracts' as *;

.grid {
  display: grid;
  gap: map.get($spacing, md);
}

.grid-cols-1 { grid-template-columns: repeat(1, 1fr); }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }

@include breakpoint(tablet) {
  .grid-cols-md-2 { grid-template-columns: repeat(2, 1fr); }
  .grid-cols-md-3 { grid-template-columns: repeat(3, 1fr); }
}

@include breakpoint(desktop) {
  .grid-cols-lg-3 { grid-template-columns: repeat(3, 1fr); }
  .grid-cols-lg-4 { grid-template-columns: repeat(4, 1fr); }
}
```

```scss
// src/assets/layout/_container.scss
@use 'sass:map';
@use '../abstracts' as *;

.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: map.get($spacing, md);
  padding-right: map.get($spacing, md);
}

@include breakpoint(tablet) {
  .container {
    max-width: 48rem; // 768px
    padding-left: map.get($spacing, lg);
    padding-right: map.get($spacing, lg);
  }
}

@include breakpoint(desktop) {
  .container {
    max-width: 75rem; // 1200px
    padding-left: map.get($spacing, xl);
    padding-right: map.get($spacing, xl);
  }
}
```

**Design Decision**: Keep layout styles global to ensure consistent page structure across the application.

#### 4.2 Header Component with Hybrid Approach

```scss
// src/assets/layout/_header.scss (Global layout)
.site-header {
  position: sticky;
  top: 0;
  z-index: map.get($z-index, sticky);
  background-color: var(--background-colour);
  border-bottom: map.get($border, xs) solid var(--border-colour);
}
```

```scss
// src/components/header/assets/header.module.scss (Component-specific)
@use 'sass:map';
@use '@assets/abstracts' as *;

.headerContent {
  @include flexbox(row, space-between, center);
  padding: map.get($spacing, md) 0;
}

.logo {
  @include font-style(
    map.get($font-sizes, xl),
    map.get($font-weights, bold)
  );
  color: var(--accent-colour);
}

.nav {
  @include flexbox(row, flex-end, center);
  gap: map.get($spacing, lg);
}
```

**Design Decision**: Split layout structure (global) from component styling (scoped) to maintain flexibility while preventing conflicts.

### Phase 5: Page Components (Week 5-6)

#### 5.1 Page CSS Module Pattern

```scss
// src/pages/home-page/assets/home-page.module.scss
@use 'sass:map';
@use '@assets/abstracts' as *;

.homePage {
  min-height: 100vh;
  @include flexbox(column, flex-start, stretch);
}

.hero {
  padding: map.get($spacing, '4xl') 0;
  text-align: center;
  background: linear-gradient(
    135deg,
    var(--primary-colour-light),
    var(--primary-colour-dark)
  );
}

.heroTitle {
  @include font-style(
    map.get($font-sizes, '5xl'),
    map.get($font-weights, bold)
  );
  color: var(--background-colour);
  margin-bottom: map.get($spacing, lg);
}

.heroSubtitle {
  @include font-style(
    map.get($font-sizes, xl),
    map.get($font-weights, regular)
  );
  color: var(--background-colour);
  opacity: 0.9;
}

.section {
  padding: map.get($spacing, '3xl') 0;
}

.sectionTitle {
  @include font-style(
    map.get($font-sizes, '3xl'),
    map.get($font-weights, semi-bold)
  );
  color: var(--text-colour);
  margin-bottom: map.get($spacing, xl);
  text-align: center;
}

@include breakpoint(tablet) {
  .hero {
    padding: map.get($spacing, '5xl') 0;
  }
  
  .heroTitle {
    font-size: map.get($font-sizes, '6xl');
  }
}
```

**Design Decision**: Use page-specific CSS Modules for unique page layouts while leveraging global layout classes for common structures.

### Phase 6: Theme System Enhancement (Week 6)

#### 6.1 Theme Definitions

```scss
// src/assets/themes/_light.scss
@use 'sass:map';
@use '../abstracts/colours' as *;

@mixin light-theme {
  // Base colors
  --background-colour: #{map.get($neutral, white)};
  --text-colour: #{map.get($neutral, black)};
  --border-colour: #{map.get($grey, 200)};
  
  // Primary colors
  --primary-colour: #{map.get($primary, base)};
  --primary-colour-light: #{map.get($primary, light)};
  --primary-colour-dark: #{map.get($primary, dark)};
  
  // Secondary colors
  --secondary-colour: #{map.get($secondary, base)};
  --accent-colour: #{map.get($secondary, accent)};
  
  // Semantic colors
  --success-colour: #{map.get($success, base)};
  --warning-colour: #{map.get($warning, base)};
  --error-colour: #{map.get($error, base)};
  --info-colour: #{map.get($info, base)};
  
  // Surface colors
  --surface-colour: #{map.get($neutral, white)};
  --surface-colour-hover: #{map.get($neutral, white-alpha-95)};
  --surface-colour-active: #{map.get($neutral, white-alpha-90)};
  
  // Shadow colors
  --shadow-colour: #{map.get($neutral, black-alpha-15)};
  --shadow-colour-strong: #{map.get($neutral, black-alpha-25)};
}
```

```scss
// src/assets/themes/_dark.scss
@use 'sass:map';
@use '../abstracts/colours' as *;

@mixin dark-theme {
  // Base colors
  --background-colour: #{map.get($neutral, black)};
  --text-colour: #{map.get($neutral, white)};
  --border-colour: #{map.get($grey, 500)};
  
  // Primary colors (slightly adjusted for dark mode)
  --primary-colour: #{map.get($primary, light)};
  --primary-colour-light: #{map.get($primary, base)};
  --primary-colour-dark: #{map.get($primary, dark)};
  
  // Secondary colors
  --secondary-colour: #{map.get($secondary, base)};
  --accent-colour: #{map.get($secondary, accent)};
  
  // Semantic colors (brighter for dark mode)
  --success-colour: #{map.get($success, light)};
  --warning-colour: #{map.get($warning, light)};
  --error-colour: #{map.get($error, light)};
  --info-colour: #{map.get($info, light)};
  
  // Surface colors
  --surface-colour: #{map.get($grey, 600)};
  --surface-colour-hover: #{map.get($neutral, white-alpha-10)};
  --surface-colour-active: #{map.get($neutral, white-alpha-30)};
  
  // Shadow colors
  --shadow-colour: #{map.get($neutral, black-alpha-40)};
  --shadow-colour-strong: #{map.get($neutral, black-alpha-95)};
}
```

**Design Decision**: Use CSS custom properties for theme colors to enable runtime theme switching without recompiling SCSS.

### Phase 7: Build Optimization (Week 6-7)

#### 7.1 CSS Optimization Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    cssCodeSplit: true, // Split CSS by route
    cssMinify: 'lightningcss', // Faster CSS minification
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'assets/css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
  css: {
    devSourcemap: true,
    transformer: 'lightningcss', // Modern CSS transformer
  },
});
```

**Design Decision**: Use Lightning CSS for faster builds and better CSS optimization compared to PostCSS.

#### 7.2 Critical CSS Extraction

```typescript
// scripts/extract-critical-css.ts
import { PurgeCSS } from 'purgecss';
import fs from 'fs';
import path from 'path';

async function extractCriticalCSS() {
  const purgeCSSResults = await new PurgeCSS().purge({
    content: [
      'dist/index.html',
      'dist/assets/**/*.js',
    ],
    css: ['dist/assets/**/*.css'],
    safelist: {
      standard: [/^animate-/, /^theme-/, /^data-theme/],
      deep: [/modal$/, /toast$/],
    },
  });

  // Write critical CSS inline in HTML
  const criticalCSS = purgeCSSResults[0].css;
  const htmlPath = path.join(__dirname, '../dist/index.html');
  let html = fs.readFileSync(htmlPath, 'utf-8');
  
  html = html.replace(
    '</head>',
    `<style>${criticalCSS}</style></head>`
  );
  
  fs.writeFileSync(htmlPath, html);
}

extractCriticalCSS();
```

**Design Decision**: Extract and inline critical CSS for above-the-fold content to improve First Contentful Paint.

## Performance Considerations

### Bundle Size Targets

- **Total CSS (gzipped)**: < 100KB
- **Critical CSS (inline)**: < 14KB
- **Per-route CSS chunks**: < 20KB each
- **Utility classes**: < 10KB

### Optimization Techniques

1. **Tree-shaking**: Remove unused CSS Modules automatically
2. **Code splitting**: Split CSS by route for faster initial load
3. **Compression**: Use Brotli compression for production
4. **Caching**: Leverage content-based hashing for long-term caching
5. **Critical CSS**: Inline above-the-fold styles

### Performance Monitoring

```typescript
// Performance budget configuration
// vite.config.ts
export default defineConfig({
  build: {
    chunkSizeWarningLimit: 500, // Warn if chunk > 500KB
    reportCompressedSize: true,
  },
});
```

## Migration Checklist

### Pre-Migration

- [ ] Backup current styles
- [ ] Document current component styles
- [ ] Set up visual regression testing
- [ ] Create migration tracking spreadsheet

### During Migration

- [ ] Create 7-1 folder structure
- [ ] Move existing SCSS files to appropriate folders
- [ ] Create utility classes
- [ ] Migrate components one by one
- [ ] Run visual regression tests after each component
- [ ] Update component tests

### Post-Migration

- [ ] Remove old SCSS files
- [ ] Update documentation
- [ ] Run full test suite
- [ ] Verify bundle size targets
- [ ] Deploy to staging for QA

## Rollback Strategy

### Rollback Triggers

- Visual regressions detected
- Bundle size exceeds targets by >20%
- Build time increases by >50%
- Critical bugs in production

### Rollback Process

1. **Immediate**: Revert to previous Git commit
2. **Partial**: Keep 7-1 structure, revert specific components
3. **Full**: Restore from backup, remove all CSS Modules

### Rollback Prevention

- Gradual rollout (component by component)
- Comprehensive testing at each stage
- Feature flags for new styling system
- Parallel deployment (old and new styles coexist)

## Success Metrics

### Technical Metrics

- ✅ 100% components using CSS Modules
- ✅ 0 hardcoded spacing/color/typography values
- ✅ CSS bundle < 100KB gzipped
- ✅ Build time < 30 seconds
- ✅ All tests passing

### Quality Metrics

- ✅ 0 visual regressions
- ✅ 100% design token usage
- ✅ Lighthouse performance score > 90
- ✅ Accessibility score 100

### Developer Experience Metrics

- ✅ Autocomplete for design tokens
- ✅ Clear error messages for invalid tokens
- ✅ Comprehensive documentation
- ✅ Developer satisfaction score ≥ 8/10

