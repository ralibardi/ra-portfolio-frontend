# Implementation Plan: 7-1 Pattern with CSS Modules

## Overview

This implementation plan breaks down the 7-1 Pattern with CSS Modules feature into discrete, manageable tasks. Each task builds incrementally on previous work, with checkpoints to ensure stability. The plan follows a component-by-component migration approach to minimize risk and enable early validation.

## Task List

- [x] 1. Set up 7-1 folder structure and configuration

  - Create the 7-1 directory structure in src/assets/
  - Move existing SCSS files to appropriate 7-1 folders
  - Create abstracts index file for unified design token imports
  - Update Vite configuration for CSS Modules optimization
  - _Requirements: 1.1, 1.2, 2.4_

- [x] 1.1 Write property test for design token availability

  - **Property 2: Design Token Availability**
  - **Validates: Requirements 1.2, 2.2, 8.3**

- [x] 2. Create utility class system

  - Implement spacing utilities (padding, margin, gap)
  - Implement flexbox utilities (flex, direction, justify, align)
  - Implement text utilities (alignment, truncation)
  - Implement animation utilities (fade, slide, scale)
  - Add reduced motion support to all animations
  - _Requirements: 1.5, 7.1, 7.2, 7.3, 7.4_

- [x] 3. Implement theme system with CSS custom properties

  - Create light theme mixin with CSS custom properties
  - Create dark theme mixin with CSS custom properties
  - Create theme-aware mixins for surfaces and elevations
  - Update root element to apply themes based on data-theme attribute
  - Add system theme preference support
  - _Requirements: 1.4, 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 3.1 Write property test for theme reactivity

  - **Property 7: Theme Reactivity**
  - **Validates: Requirements 8.2**

- [x] 3.2 Write property test for theme fallback safety

  - **Property 8: Theme Fallback Safety**
  - **Validates: Requirements 8.5**

- [x] 4. Create global layout styles

  - Implement grid system with responsive variants
  - Implement container system with max-width breakpoints
  - Create global header layout styles
  - Create global footer layout styles
  - Create global navigation layout styles
  - _Requirements: 1.3, 5.1, 5.2_

- [x] 5. Migrate Card component to CSS Modules

  - Create card.module.scss with design token imports
  - Replace hardcoded values with design tokens
  - Implement elevated and interactive variants
  - Update Card component TypeScript to use CSS Modules
  - Verify visual appearance matches original
  - _Requirements: 2.1, 2.2, 2.3, 4.1, 4.2, 4.3_

- [x] 5.1 Write property test for CSS Module scoping

  - **Property 3: CSS Module Scoping**
  - **Validates: Requirements 2.1**

- [x] 5.2 Write property test for dual class application

  - **Property 4: Dual Class Application**
  - **Validates: Requirements 2.3**

- [x] 5.3 Write property test for design token usage

  - **Property 5: Design Token Usage Consistency**
  - **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 4.2, 8.1, 8.4**

- [x] 5.4 Write visual regression test for Card component

  - **Property 6: Visual Regression Preservation**
  - **Validates: Requirements 4.3**

- [x] 6. Migrate Button component to CSS Modules

  - Create button.module.scss with design token imports
  - Replace hardcoded values with design tokens
  - Implement primary, secondary, and size variants
  - Update Button component TypeScript to use CSS Modules
  - Verify visual appearance matches original
  - _Requirements: 2.1, 2.2, 2.3, 4.1, 4.2, 4.3_

- [x] 7. Migrate Loading component to CSS Modules

  - Create loading.module.scss with design token imports
  - Replace hardcoded animation values with design tokens
  - Update Loading component TypeScript to use CSS Modules
  - Verify animations work correctly in both themes
  - _Requirements: 2.1, 2.2, 4.1, 4.2, 4.3_

- [x] 8. Migrate Toast component to CSS Modules

  - Create toast.module.scss with design token imports
  - Replace hardcoded values with semantic color tokens
  - Implement success, warning, error, and info variants
  - Update Toast component TypeScript to use CSS Modules
  - Verify visual appearance matches original
  - _Requirements: 2.1, 2.2, 4.1, 4.2, 4.3_

- [x] 9. Checkpoint - Verify core components and run tests

  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Migrate Header component to CSS Modules

  - Create header.module.scss for component-specific styles
  - Use global .site-header class for layout structure
  - Replace hardcoded values with design tokens
  - Update Header component TypeScript to use CSS Modules
  - Verify responsive behavior works correctly
  - _Requirements: 2.1, 2.2, 5.1, 5.2, 5.3, 5.4_

- [x] 11. Migrate Footer component to CSS Modules

  - Create footer.module.scss for component-specific styles
  - Use global layout classes for structure
  - Replace hardcoded values with design tokens
  - Update Footer component TypeScript to use CSS Modules
  - Verify responsive behavior works correctly
  - _Requirements: 2.1, 2.2, 5.1, 5.2, 5.3, 5.4_

- [x] 12. Migrate Topbar (Navigation) component to CSS Modules

  - Create topbar.module.scss for component-specific styles
  - Use global navigation layout classes
  - Replace hardcoded values with design tokens
  - Update Topbar component TypeScript to use CSS Modules
  - Verify mobile menu functionality works correctly
  - _Requirements: 2.1, 2.2, 5.1, 5.2, 5.3, 5.4_

- [x] 13. Migrate Container component to CSS Modules

  - Create container.module.scss for component-specific styles
  - Use global .container class for base layout
  - Replace hardcoded values with design tokens
  - Update Container component TypeScript to use CSS Modules
  - _Requirements: 2.1, 2.2, 4.1, 4.2, 4.3_

- [x] 14. Migrate Section component to CSS Modules

  - Create section.module.scss with design token imports
  - Replace hardcoded values with design tokens
  - Update Section component TypeScript to use CSS Modules
  - _Requirements: 2.1, 2.2, 4.1, 4.2, 4.3_

- [x] 15. Checkpoint - Verify layout components and run tests

  - Ensure all tests pass, ask the user if questions arise.

- [x] 16. Migrate remaining UI components (Badge, Divider, Grid)

  - Create CSS Modules for Badge, Divider, and Grid components
  - Replace hardcoded values with design tokens
  - Update component TypeScript files to use CSS Modules
  - Verify visual appearance matches original for all three
  - _Requirements: 2.1, 2.2, 4.1, 4.2, 4.3_

- [ ] 17. Migrate form components (TextInput, TextArea, Toggle)

  - Create CSS Modules for TextInput, TextArea, and Toggle
  - Replace hardcoded values with design tokens
  - Implement focus states using theme-aware-focus mixin
  - Update component TypeScript files to use CSS Modules
  - Verify form validation styles work correctly
  - _Requirements: 2.1, 2.2, 4.1, 4.2, 4.3_

- [ ] 18. Migrate utility components (ThemeToggle, IconLink, CompanyInfo)

  - Create CSS Modules for ThemeToggle, IconLink, and CompanyInfo
  - Replace hardcoded values with design tokens
  - Update component TypeScript files to use CSS Modules
  - Verify theme toggle animation works correctly
  - _Requirements: 2.1, 2.2, 4.1, 4.2, 4.3_

- [ ] 19. Migrate special components (EnhancedDemo, ErrorBoundary)

  - Create CSS Modules for EnhancedDemo and ErrorBoundary
  - Replace hardcoded values with design tokens
  - Update component TypeScript files to use CSS Modules
  - Verify error boundary styling works correctly
  - _Requirements: 2.1, 2.2, 4.1, 4.2, 4.3_

- [ ] 20. Migrate page components to CSS Modules

  - Create CSS Modules for all page components (Home, About, Projects, etc.)
  - Use global layout classes combined with page-specific modules
  - Replace hardcoded values with design tokens
  - Update page component TypeScript files to use CSS Modules
  - Verify responsive layouts work correctly on all pages
  - _Requirements: 2.1, 2.2, 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 20.1 Write property test for tree-shaking effectiveness

  - **Property 9: Tree-Shaking Effectiveness**
  - **Validates: Requirements 2.5, 9.2**

- [ ] 21. Checkpoint - Verify all components migrated and run full test suite

  - Ensure all tests pass, ask the user if questions arise.

- [ ] 22. Implement build optimizations

  - Configure Lightning CSS for faster builds
  - Set up CSS code splitting by route
  - Configure production CSS minification
  - Set up bundle size monitoring and warnings
  - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [ ] 22.1 Write property test for CSS optimization

  - **Property 10: CSS Optimization**
  - **Validates: Requirements 9.3, 9.4**

- [ ] 23. Create developer documentation

  - Document 7-1 folder structure and purpose of each folder
  - Create component CSS Module template with examples
  - Document design token usage patterns
  - Create migration guide for future components
  - Document utility class system and usage
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ] 24. Set up linting for design token enforcement

  - Configure stylelint to detect hardcoded values
  - Add rules to enforce design token usage
  - Add rules to enforce CSS Module naming conventions
  - Configure pre-commit hooks for style linting
  - _Requirements: 3.5, 10.4_

- [ ] 25. Final verification and cleanup

  - Run full test suite including property-based tests
  - Verify bundle size is under 100KB gzipped
  - Run visual regression tests on all components
  - Remove old SCSS files that are no longer used
  - Update build scripts and documentation
  - _Requirements: 4.5, 9.4_

- [ ] 26. Final Checkpoint - Production readiness verification
  - Ensure all tests pass, ask the user if questions arise.
