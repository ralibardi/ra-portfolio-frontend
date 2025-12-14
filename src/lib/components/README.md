# RA Portfolio Component Library

A comprehensive collection of reusable UI components built with React 19, TypeScript, and SCSS. The library follows modern accessibility standards (WCAG 2.1 AA), supports theming, and includes comprehensive testing with property-based testing.

## 🚀 Quick Start

### Prerequisites

- Node.js >=18.0.0
- pnpm >=9.15.2 (recommended) or npm/yarn
- React >=19.0.0
- TypeScript (recommended)

### Installation

This component library is part of the RA Portfolio project. To use these components in your project:

1. **Clone or copy the component library**:

   ```bash
   # Copy the entire lib/components directory to your project
   cp -r src/lib/components your-project/src/lib/components
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up TypeScript paths** (add to your `tsconfig.json`):

   ```json
   {
     "compilerOptions": {
       "paths": {
         "@lib/components": ["./src/lib/components"],
         "@lib/components/*": ["./src/lib/components/*"],
         "@assets/*": ["./src/assets/*"]
       }
     }
   }
   ```

4. **Set up Vite paths** (add to your `vite.config.ts`):

   ```typescript
   import { defineConfig } from 'vite';
   import tsconfigPaths from 'vite-tsconfig-paths';

   export default defineConfig({
     plugins: [tsconfigPaths()],
   });
   ```

### Basic Usage

```tsx
import React from 'react';
import { Button, Input, Modal, type ButtonProps } from '@lib/components';

function App() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <div>
      <Button variant="primary" onClick={() => setIsModalOpen(true)}>
        Open Modal
      </Button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Hello World!</h2>
        <Input label="Your name" placeholder="Enter your name" />
      </Modal>
    </div>
  );
}
```

## 📦 Import Patterns

### Tree-shakeable Imports (Recommended)

```tsx
// Import only what you need - reduces bundle size
import { Button, Input, Modal, type ButtonProps } from '@lib/components';

// Basic usage
<Button variant="primary" onClick={handleClick}>
  Click me
</Button>;
```

### Category-specific Imports

```tsx
// Import from specific categories (also tree-shakeable)
import { Button } from '@lib/components/Button';
import { Input, Select, Checkbox } from '@lib/components/Form';
import { Modal, Dialog } from '@lib/components/Modal';
import { Skeleton, Spinner } from '@lib/components/Loading';
```

### Utility Imports

```tsx
// Import utilities and constants
import {
  BUTTON_VARIANTS,
  COMPONENT_SIZES,
  validators,
  generateId,
  combineClassNames,
} from '@lib/components';

// Use validation utilities
const emailValidator = combineValidators(validators.required, validators.email);
```

## Components

### Foundation Components

- **Button**: Unified button with variants, sizes, and async handling
- **Loading**: Skeleton and Spinner components for loading states

### Form Components

- **Input**: Text input with validation and error handling
- **Select**: Dropdown with keyboard navigation
- **Checkbox**: Checkbox with indeterminate state support
- **Radio/RadioGroup**: Radio buttons with group management

### Layout Components

- **Accordion**: Collapsible content sections
- **Breadcrumb**: Navigation hierarchy display
- **Tabs**: Switchable content panels
- **Pagination**: Dataset navigation controls

### Overlay Components

- **Modal/Dialog**: Overlay content with focus management
- **Alert/Notification**: Feedback messages with severity levels
- **Tooltip/Popover**: Contextual information display

## TypeScript Support

### Component Props

All component props are fully typed and exported:

```tsx
import type {
  ButtonProps,
  InputProps,
  ModalProps,
  // ... all component props
} from '@lib/components';

// Extend component props
interface CustomButtonProps extends ButtonProps {
  customProp?: string;
}
```

### Utility Types

```tsx
import type {
  // Generic utilities
  ComponentProps,
  PartialBy,
  RequiredBy,

  // Event handlers
  ClickHandler,
  AsyncClickHandler,
  ChangeHandler,

  // Form utilities
  FormFieldValue,
  ValidationResult,
  FieldValidator,

  // Component states
  LoadingState,
  ExpandableState,
  SelectableState,
} from '@lib/components';

// Use utility types
type OptionalButton = PartialBy<ButtonProps, 'variant' | 'size'>;
```

### Constants and Enums

```tsx
import {
  COMPONENT_SIZES,
  BUTTON_VARIANTS,
  SEVERITY_LEVELS,
  PLACEMENT_OPTIONS,
  NOTIFICATION_POSITIONS,
} from '@lib/components';

// Type-safe constants
const validSizes = COMPONENT_SIZES; // ['small', 'medium', 'large']
const validVariants = BUTTON_VARIANTS; // ['primary', 'secondary', ...]
```

## Validation Utilities

```tsx
import { validators, combineValidators } from '@lib/components';

// Individual validators
const result = validators.email('user@example.com');
// { isValid: true }

// Combined validators
const passwordValidator = combineValidators(
  validators.required,
  validators.minLength(8),
);

// Custom validator
const customValidator: FieldValidator = (value) => ({
  isValid: value.includes('@'),
  error: !value.includes('@') ? 'Must contain @' : undefined,
});
```

## Helper Functions

```tsx
import {
  generateId,
  combineClassNames,
  debounce,
  throttle,
  isValidSize,
  isValidButtonVariant,
} from '@lib/components';

// Generate unique IDs
const id = generateId('my-component'); // 'my-component-abc123def'

// Combine class names
const className = combineClassNames(
  'base-class',
  isActive && 'active',
  error && 'error',
);

// Performance utilities
const debouncedSearch = debounce(handleSearch, 300);
const throttledScroll = throttle(handleScroll, 100);

// Type guards
if (isValidSize(userInput)) {
  // userInput is now typed as 'small' | 'medium' | 'large'
}
```

## Features

- 🎨 **Design System Integration**: Consistent theming and styling
- ♿ **Accessibility First**: WCAG 2.1 AA compliant
- 🧪 **Fully Tested**: Unit tests and property-based testing
- 📚 **Storybook Documentation**: Interactive component examples
- 🌳 **Tree Shakeable**: Import only what you need
- 🎯 **TypeScript**: Full type safety and IntelliSense support
- 🛠️ **Utility Functions**: Helpful functions for common tasks
- 📝 **Form Validation**: Built-in validation utilities
- 🎛️ **Type Guards**: Runtime type checking utilities

## Testing

All components include comprehensive test coverage:

- Unit tests for functionality
- Property-based tests for correctness
- Accessibility tests for compliance
- Visual regression tests via Storybook

## 🛠️ Development

### Running the Development Environment

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Run Storybook for component development
pnpm run storybook

# Run tests
pnpm run test

# Run tests with coverage
pnpm run test:coverage

# Run tests in watch mode
pnpm run test:watch

# Build for production
pnpm run build

# Lint and format code
pnpm run lint:fix
pnpm run format
```

### Project Structure

```
src/lib/components/
├── index.ts                 # Main exports
├── types/                   # Shared TypeScript types
├── utils/                   # Utility functions and constants
├── Button/                  # Button component
│   ├── components/
│   │   └── Button.tsx
│   ├── assets/
│   │   └── Button.module.scss
│   ├── Button.test.tsx
│   └── Button.stories.tsx
├── Form/                    # Form components
│   ├── components/
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Checkbox.tsx
│   │   └── Radio.tsx
│   ├── assets/
│   │   └── Form.module.scss
│   ├── Form.test.tsx
│   └── Form.stories.tsx
└── [Other Components]/
```

### Testing

The library includes comprehensive testing:

- **Unit Tests**: Jest + React Testing Library
- **Property-Based Tests**: fast-check for correctness verification
- **Accessibility Tests**: jest-axe for WCAG compliance
- **Visual Tests**: Storybook + Chromatic

```bash
# Run specific test suites
pnpm run test Button          # Test specific component
pnpm run test --coverage      # Generate coverage report
pnpm run test --watch         # Watch mode for development
```

### Storybook

Interactive component documentation and testing:

```bash
# Start Storybook
pnpm run storybook

# Build Storybook
pnpm run build-storybook
```

Visit `http://localhost:6006` to see all components with interactive controls.

## Migration Guide

### From Individual Components

```tsx
// Before
import Button from '@components/buttons';
import TextInput from '@components/text-input';

// After
import { Button, Input } from '@lib/components';
```

### Type Imports

```tsx
// Before
import type { ButtonProps } from '@components/buttons/types';

// After
import type { ButtonProps } from '@lib/components';
```

### Utilities

```tsx
// Before
import { validateEmail } from '@utils/validation';

// After
import { validators } from '@lib/components';
const result = validators.email(value);
```

## Structure

```
lib/
├── components/           # Reusable UI components
│   ├── types/           # Shared TypeScript interfaces
│   ├── utils/           # Utility functions and constants
│   └── [Component]/     # Individual component directories
│       ├── components/  # Component implementation
│       ├── assets/      # Component styles (SCSS modules)
│       ├── [Component].test.tsx
│       └── [Component].stories.tsx
└── testing/             # Testing utilities
    ├── render-utils.tsx      # Component render helpers
    ├── property-testing.ts   # Property-based testing utilities
    └── accessibility-utils.ts # Accessibility testing helpers
```

## 🎨 Design System Integration

The component library is built on a comprehensive design system that ensures visual consistency and maintainability.

### Setting Up the Design System

1. **Copy the design system assets**:

   ```bash
   # Copy the entire assets directory
   cp -r src/assets your-project/src/assets
   ```

2. **Import global styles** in your main CSS/SCSS file:

   ```scss
   // Import the design system
   @use 'sass:map';
   @use '@assets/global' as *;
   ```

3. **Set up CSS custom properties** for theming:
   ```scss
   // Your main stylesheet
   :root {
     // Theme variables are automatically set up by the design system
     // Components will use these for consistent theming
   }
   ```

### Design Tokens

All components use standardized design tokens:

#### Colors

```scss
// Primary colors
background: map.get($primary, base); // #4a90e2
color: map.get($primary, light); // #357abd
border: 1px solid map.get($primary, dark); // #2a5d9e

// Semantic colors
background: map.get($success, base); // #10b981
color: map.get($error, dark); // #dc2626
```

#### Spacing

```scss
// Consistent spacing scale
padding: map.get($spacing, md); // 1rem (16px)
margin: map.get($spacing, lg); // 1.25rem (20px)
gap: map.get($spacing, sm); // 0.75rem (12px)
```

#### Typography

```scss
// Typography system
font-size: map.get($font-sizes, lg); // 1.125rem (18px)
font-weight: map.get($font-weights, semi-bold); // 600
line-height: map.get($font-heights, normal); // 1.5
```

#### Borders & Radius

```scss
// Border system
border-radius: map.get($border, md); // 0.25rem (4px)
border-width: map.get($border, xs); // 0.0625rem (1px)
```

### Theme Support

Components automatically support light/dark themes:

```tsx
// Components automatically adapt to theme changes
<Button variant="primary">
  Themed Button
</Button>

// Use theme-aware CSS custom properties
.custom-component {
  background: var(--surface-colour);
  color: var(--text-colour);
  border: 1px solid var(--border-colour);
}
```

### Responsive Design

Components use a mobile-first responsive approach:

```scss
// Breakpoint system
@include breakpoint('tablet') {
  // Styles for tablet and up (768px+)
}

@include breakpoint('desktop') {
  // Styles for desktop and up (1200px+)
}
```

### Customization

#### Component-level Customization

```tsx
// Use className for custom styling
<Button className="my-custom-button" variant="primary">
  Custom Button
</Button>
```

```scss
// Custom styles that respect the design system
.my-custom-button {
  // Use design tokens for consistency
  padding: map.get($spacing, lg) map.get($spacing, xl);
  border-radius: map.get($border, lg);

  // Custom properties
  background: linear-gradient(
    45deg,
    map.get($primary, base),
    map.get($secondary, base)
  );
}
```

#### Global Theme Customization

```scss
// Override design tokens
$primary: (
  base: #your-brand-color,
  light: #your-light-color,
  dark: #your-dark-color,
  alpha-08: rgba(your-brand-color, 0.08),
);

// Import the design system after overrides
@use '@assets/global' as *;
```

## ♿ Accessibility

All components are built with accessibility as a first-class citizen:

### WCAG 2.1 AA Compliance

- ✅ **Keyboard Navigation**: All interactive elements are keyboard accessible
- ✅ **Screen Reader Support**: Proper ARIA attributes and semantic HTML
- ✅ **Focus Management**: Visible focus indicators and logical focus flow
- ✅ **Color Contrast**: Meets 4.5:1 contrast ratio requirements
- ✅ **Motion Sensitivity**: Respects `prefers-reduced-motion` preferences

### Accessibility Features

```tsx
// Components include built-in accessibility features
<Button
  aria-label="Close dialog"  // Screen reader support
  onClick={handleClose}
>
  ×
</Button>

<Input
  label="Email address"      // Proper labeling
  required                   // Required field indication
  error="Please enter a valid email"  // Error announcements
/>

<Modal
  isOpen={isOpen}
  onClose={onClose}
  aria-labelledby="modal-title"  // Modal labeling
>
  <h2 id="modal-title">Settings</h2>
  {/* Focus is automatically trapped within modal */}
</Modal>
```

### Testing Accessibility

```bash
# Run accessibility tests
pnpm run test -- --testNamePattern="accessibility"

# Manual testing checklist:
# 1. Navigate using only keyboard (Tab, Enter, Escape, Arrow keys)
# 2. Test with screen reader (VoiceOver, NVDA, JAWS)
# 3. Verify color contrast in both light and dark themes
# 4. Test with reduced motion preferences enabled
```

## 🚨 Troubleshooting

### Common Issues

#### TypeScript Path Resolution

```bash
# Error: Cannot resolve '@lib/components'
# Solution: Add to tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@lib/components": ["./src/lib/components"],
      "@lib/components/*": ["./src/lib/components/*"]
    }
  }
}
```

#### SCSS Import Issues

```bash
# Error: Cannot resolve '@assets'
# Solution: Ensure assets are copied and paths are configured
# 1. Copy src/assets to your project
# 2. Configure Vite/Webpack to resolve @assets path
```

#### Missing Dependencies

```bash
# Error: Module not found
# Solution: Install required peer dependencies
pnpm add react@^19.0.0 react-dom@^19.0.0
pnpm add -D @types/react @types/react-dom
```

#### Component Styling Issues

```scss
// Issue: Components not styled correctly
// Solution: Import global styles
@use 'sass:map';
@use '@assets/global' as *;

// Ensure CSS Modules are configured in your build tool
```

### Performance Optimization

```tsx
// Use tree-shaking imports to reduce bundle size
import { Button } from '@lib/components/Button'; // ✅ Good
import { Button } from '@lib/components'; // ✅ Also good (tree-shakeable)
import * as Components from '@lib/components'; // ❌ Imports everything

// Lazy load heavy components
const Modal = React.lazy(() => import('@lib/components/Modal'));
```

### Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Android 90+
- **Features**: ES2020, CSS Grid, CSS Custom Properties, CSS Modules

## 📚 Additional Resources

- **Storybook**: Interactive component documentation
- **Design System**: Complete design token reference
- **Accessibility Guide**: WCAG 2.1 compliance details
- **Testing Guide**: Unit and property-based testing examples
- **Migration Guide**: Upgrading from existing components

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on:

- Adding new components
- Testing requirements
- Code style and conventions
- Submitting pull requests

## 📄 License

This component library is part of the RA Portfolio project and is licensed under the same terms.
