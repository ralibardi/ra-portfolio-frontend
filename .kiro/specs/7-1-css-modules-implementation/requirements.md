# Requirements Document: 7-1 Pattern with CSS Modules Implementation

## Introduction

Implement the 7-1 SCSS architecture pattern with CSS Modules across all components in the RA Portfolio application. This will provide a scalable, maintainable styling system that combines global design tokens with scoped component styles.

## Glossary

- **7-1 Pattern**: SCSS architecture with 7 folders (abstracts, vendors, base, layout, components, pages, themes) + 1 main file
- **CSS Modules**: Scoped CSS where class names are locally scoped by default
- **Design Tokens**: Variables for colors, spacing, typography defined in the 7-1 abstracts folder
- **Component**: Reusable UI element with its own scoped styles
- **Global Styles**: Styles applied across the entire application (layout, base, utilities)
- **Scoped Styles**: Component-specific styles that don't leak to other components

## Requirements

### Requirement 1: Global 7-1 Architecture

**User Story**: As a developer, I want a well-organized global SCSS architecture, so that I can maintain consistent design tokens and global styles across the application.

#### Acceptance Criteria

1. WHEN the application loads THEN the system SHALL import styles from the 7-1 pattern folders in the correct order (abstracts, vendors, base, layout, components, pages, themes)
2. WHEN design tokens are updated in abstracts/ THEN the system SHALL make those tokens available to all CSS Modules via @use imports
3. WHEN global layout styles are defined in layout/ THEN the system SHALL apply those styles globally without CSS Module scoping
4. WHEN theme variables are defined in themes/ THEN the system SHALL make those CSS custom properties available throughout the application
5. WHEN utility classes are defined in utilities/ THEN the system SHALL make those classes available globally for use in any component

### Requirement 2: Component CSS Modules Integration

**User Story**: As a developer, I want each component to have scoped styles using CSS Modules, so that component styles don't conflict with each other while still accessing global design tokens.

#### Acceptance Criteria

1. WHEN a component CSS Module is created THEN the system SHALL scope all class names to that component
2. WHEN a CSS Module imports abstracts THEN the system SHALL provide access to all design tokens (colors, spacing, typography, mixins)
3. WHEN a component uses both module classes and global utility classes THEN the system SHALL apply both sets of styles correctly
4. WHEN CSS Module class names are generated THEN the system SHALL use the format `[name]__[local]__[hash:base64:5]` in development and `[hash:base64:5]` in production
5. WHEN a component is deleted THEN the system SHALL not include its CSS Module styles in the final bundle

### Requirement 3: Design Token Consistency

**User Story**: As a developer, I want all components to use design tokens from the 7-1 abstracts folder, so that the design system remains consistent across all components.

#### Acceptance Criteria

1. WHEN a CSS Module needs spacing values THEN the system SHALL use `map.get($spacing, *)` from abstracts
2. WHEN a CSS Module needs colors THEN the system SHALL use CSS custom properties (var(--*-colour)) from the theme system
3. WHEN a CSS Module needs typography THEN the system SHALL use typography mixins and font-size maps from abstracts
4. WHEN a CSS Module needs responsive breakpoints THEN the system SHALL use breakpoint mixins from abstracts
5. WHEN hardcoded values are used instead of design tokens THEN the system SHALL fail linting checks

### Requirement 4: Component Migration

**User Story**: As a developer, I want to migrate existing components to use the 7-1 pattern with CSS Modules, so that all components follow the same architecture.

#### Acceptance Criteria

1. WHEN a component CSS Module is migrated THEN the system SHALL import `@use '@app/styles/abstracts' as *` at the top
2. WHEN component styles use hardcoded values THEN the system SHALL replace them with design tokens
3. WHEN component styles are migrated THEN the system SHALL maintain the same visual appearance
4. WHEN a component uses global utility classes THEN the system SHALL preserve those classes alongside module classes
5. WHEN migration is complete THEN the system SHALL have no remaining hardcoded spacing, color, or typography values

### Requirement 5: Layout Component Styles

**User Story**: As a developer, I want layout components (header, footer, navigation) to have both global and scoped styles, so that layout structure is consistent while component-specific details are scoped.

#### Acceptance Criteria

1. WHEN layout components are styled THEN the system SHALL define base layout structure in global styles (layout/ folder)
2. WHEN layout components need component-specific styles THEN the system SHALL use CSS Modules for those styles
3. WHEN layout components use design tokens THEN the system SHALL import abstracts in their CSS Modules
4. WHEN layout styles are updated THEN the system SHALL update both global layout styles and component CSS Modules as appropriate
5. WHEN layout components are rendered THEN the system SHALL apply both global layout classes and scoped module classes

### Requirement 6: Page-Specific Styles

**User Story**: As a developer, I want page components to have scoped styles using CSS Modules, so that page-specific styling doesn't affect other pages.

#### Acceptance Criteria

1. WHEN a page component is created THEN the system SHALL create a corresponding CSS Module in the page's assets folder
2. WHEN page styles use layout patterns THEN the system SHALL use global layout classes (grid, container, section) combined with page-specific module classes
3. WHEN page styles need design tokens THEN the system SHALL import abstracts in the page CSS Module
4. WHEN multiple pages use similar patterns THEN the system SHALL extract common patterns to global utilities or shared components
5. WHEN a page is rendered THEN the system SHALL apply only that page's CSS Module styles plus global styles

### Requirement 7: Utility Class Integration

**User Story**: As a developer, I want to use global utility classes alongside CSS Module classes, so that I can rapidly develop UIs without duplicating common patterns.

#### Acceptance Criteria

1. WHEN a component needs common spacing THEN the system SHALL allow using global utility classes (p-md, m-lg, gap-sm)
2. WHEN a component needs flexbox layout THEN the system SHALL allow using global utility classes (flex, flex-center, flex-between)
3. WHEN a component needs animations THEN the system SHALL allow using global animation classes (animate-fade-in, animate-slide-in-up)
4. WHEN utility classes and module classes are combined THEN the system SHALL apply both without conflicts
5. WHEN utility classes are used THEN the system SHALL not duplicate those styles in CSS Modules

### Requirement 8: Theme System Integration

**User Story**: As a developer, I want CSS Modules to work seamlessly with the light/dark theme system, so that components automatically adapt to theme changes.

#### Acceptance Criteria

1. WHEN a CSS Module uses colors THEN the system SHALL use CSS custom properties (var(--text-colour), var(--background-colour))
2. WHEN the theme is toggled THEN the system SHALL update all CSS custom properties and components SHALL reflect the new theme
3. WHEN new theme colors are added THEN the system SHALL make them available to all CSS Modules via CSS custom properties
4. WHEN a component needs theme-aware styles THEN the system SHALL use theme mixins (@include theme-aware-surface, @include theme-aware-elevation)
5. WHEN theme variables are undefined THEN the system SHALL fall back to default theme values

### Requirement 9: Build Optimization

**User Story**: As a developer, I want the build system to optimize CSS output, so that the application loads quickly and efficiently.

#### Acceptance Criteria

1. WHEN the application is built for production THEN the system SHALL generate minified CSS with hashed class names
2. WHEN CSS Modules are processed THEN the system SHALL tree-shake unused styles
3. WHEN global styles are processed THEN the system SHALL extract common styles to reduce duplication
4. WHEN the bundle is analyzed THEN the system SHALL show CSS size is optimized (< 100KB gzipped)
5. WHEN styles are loaded THEN the system SHALL load critical CSS inline and defer non-critical CSS

### Requirement 10: Developer Experience

**User Story**: As a developer, I want clear patterns and documentation for styling components, so that I can quickly and correctly style new components.

#### Acceptance Criteria

1. WHEN a developer creates a new component THEN the system SHALL provide clear examples of CSS Module usage with 7-1 pattern
2. WHEN a developer needs design tokens THEN the system SHALL provide autocomplete for spacing, colors, and typography values
3. WHEN a developer makes styling errors THEN the system SHALL provide clear error messages with suggestions
4. WHEN a developer reviews code THEN the system SHALL enforce consistent styling patterns via linting
5. WHEN a developer onboards THEN the system SHALL provide comprehensive documentation on the 7-1 + CSS Modules architecture

## Non-Functional Requirements

### Performance
- CSS bundle size SHALL be < 100KB gzipped
- First Contentful Paint SHALL be < 1.5s
- CSS parsing time SHALL be < 50ms

### Maintainability
- All components SHALL follow the same styling pattern
- Design token usage SHALL be > 95% (< 5% hardcoded values)
- Code duplication in styles SHALL be < 10%

### Scalability
- Adding new components SHALL not require changes to global styles
- Design token updates SHALL propagate to all components automatically
- The architecture SHALL support 100+ components without performance degradation

### Accessibility
- All color combinations SHALL meet WCAG AA contrast requirements
- Focus states SHALL be clearly visible in all themes
- Reduced motion preferences SHALL be respected in all animations

## Success Criteria

1. All 21 existing components migrated to use CSS Modules with 7-1 pattern
2. All 10 pages migrated to use CSS Modules with 7-1 pattern
3. Zero hardcoded spacing, color, or typography values in component styles
4. 100% design token usage across all components
5. CSS bundle size reduced by at least 20% compared to current implementation
6. All components work correctly in both light and dark themes
7. Build time remains under 30 seconds for production builds
8. Developer satisfaction score of 8/10 or higher for new styling system

## Out of Scope

- Migrating third-party component libraries to CSS Modules
- Creating new design tokens (use existing tokens from 7-1 pattern)
- Redesigning component visual appearance (maintain current designs)
- Implementing CSS-in-JS solutions (stick with SCSS + CSS Modules)
- Creating a visual design system documentation site (focus on code implementation)
