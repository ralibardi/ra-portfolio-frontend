# Migration Guide

This guide helps you migrate from existing components to the new RA Portfolio Component Library. The new library provides improved accessibility, consistency, and maintainability.

## 📋 Migration Overview

### Benefits of Migration

- ✅ **Unified API**: Consistent props and behavior across all components
- ✅ **Better Accessibility**: WCAG 2.1 AA compliant with comprehensive keyboard navigation
- ✅ **Enhanced TypeScript**: Full type safety with better IntelliSense support
- ✅ **Property-Based Testing**: Correctness verified across wide input ranges
- ✅ **Design System Integration**: Consistent theming and styling
- ✅ **Tree Shaking**: Smaller bundle sizes with optimized imports
- ✅ **Async Handling**: Built-in loading states and error handling

### Migration Strategy

1. **Gradual Migration**: Migrate components one at a time
2. **Side-by-Side**: Run old and new components in parallel during transition
3. **Testing**: Thoroughly test each migrated component
4. **Cleanup**: Remove old components after successful migration

## 🔄 Component Migration Map

| Old Component     | New Component                  | Status   | Breaking Changes          |
| ----------------- | ------------------------------ | -------- | ------------------------- |
| `PrimaryButton`   | `Button` (variant="primary")   | ✅ Ready | Props restructured        |
| `SecondaryButton` | `Button` (variant="secondary") | ✅ Ready | Props restructured        |
| `ButtonWithIcon`  | `Button` (with icon prop)      | ✅ Ready | Icon handling changed     |
| `TextInput`       | `Input`                        | ✅ Ready | Minor prop changes        |
| `Loading`         | `Spinner` / `Skeleton`         | ✅ Ready | Split into two components |
| `Toast`           | `Notification`                 | ✅ Ready | API restructured          |

## 🚀 Step-by-Step Migration

### 1. Button Components

#### Before (Old Components)

```tsx
import { PrimaryButton, SecondaryButton, ButtonWithIcon } from '@components/buttons';

// Old primary button
<PrimaryButton
  label="Click me"
  onClick={handleClick}
  isLoading={loading}
  size="medium"
/>

// Old secondary button
<SecondaryButton
  label="Cancel"
  onClick={handleCancel}
  size="small"
/>

// Old button with icon
<ButtonWithIcon
  label="Download"
  icon={<DownloadIcon />}
  onClick={handleDownload}
/>
```

#### After (New Component Library)

```tsx
import { Button } from '@lib/components';

// New unified button - primary variant
<Button
  variant="primary"
  onClick={handleClick}
  isLoading={loading}
  size="medium"
>
  Click me
</Button>

// New unified button - secondary variant
<Button
  variant="secondary"
  onClick={handleCancel}
  size="small"
>
  Cancel
</Button>

// New button with icon
<Button
  variant="primary"
  icon={<DownloadIcon />}
  onClick={handleDownload}
>
  Download
</Button>
```

#### Migration Steps

1. **Replace imports**:

   ```tsx
   // Remove old imports
   - import { PrimaryButton, SecondaryButton } from '@components/buttons';

   // Add new import
   + import { Button } from '@lib/components';
   ```

2. **Update component usage**:

   ```tsx
   // Replace PrimaryButton
   -(<PrimaryButton label="Text" onClick={handler} />) +
     (
       <Button variant="primary" onClick={handler}>
         Text
       </Button>
     ) -
     (
       // Replace SecondaryButton
       <SecondaryButton label="Text" onClick={handler} />
     ) +
     (
       <Button variant="secondary" onClick={handler}>
         Text
       </Button>
     );
   ```

3. **Handle breaking changes**:
   - `label` prop → `children` content
   - Component variants now use `variant` prop
   - Icon handling unified in single `icon` prop

### 2. Input Components

#### Before (Old TextInput)

```tsx
import TextInput from '@components/text-input';

<TextInput
  label="Email"
  placeholder="Enter your email"
  error="Invalid email"
  helperText="We'll never share your email"
  fullWidth={true}
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>;
```

#### After (New Input)

```tsx
import { Input } from '@lib/components';

<Input
  label="Email"
  placeholder="Enter your email"
  error="Invalid email"
  helperText="We'll never share your email"
  value={email}
  onChange={setEmail} // Simplified handler
/>;
```

#### Migration Steps

1. **Replace imports**:

   ```tsx
   - import TextInput from '@components/text-input';
   + import { Input } from '@lib/components';
   ```

2. **Update component usage**:

   ```tsx
   -(<TextInput />) + <Input />;
   ```

3. **Handle breaking changes**:
   - `fullWidth` prop removed (now default behavior)
   - `onChange` handler simplified: `(value: string) => void`
   - Enhanced validation support with built-in validators

### 3. Loading Components

#### Before (Old Loading)

```tsx
import Loading from '@components/loading';

<Loading />; // Generic loading spinner
```

#### After (New Loading Components)

```tsx
import { Spinner, Skeleton } from '@lib/components';

// For loading states
<Spinner size="medium" />

// For content placeholders
<Skeleton variant="text" lines={3} />
<Skeleton variant="circle" width={40} height={40} />
<Skeleton variant="rectangle" width="100%" height={200} />
```

#### Migration Steps

1. **Analyze usage context**:

   - Use `Spinner` for loading states (buttons, forms)
   - Use `Skeleton` for content placeholders

2. **Replace imports**:

   ```tsx
   - import Loading from '@components/loading';
   + import { Spinner, Skeleton } from '@lib/components';
   ```

3. **Update based on context**:

   ```tsx
   // For loading states
   -(<Loading />) + <Spinner /> +
   (
     // For content placeholders
     <Skeleton variant="text" lines={2} />
   );
   ```

## 🔧 Advanced Migration Patterns

### Custom Component Wrappers

Create wrapper components for complex migrations:

```tsx
// components/legacy/LegacyButton.tsx
import { Button, type ButtonProps } from '@lib/components';

interface LegacyButtonProps {
  label: string;
  variant?: 'primary' | 'secondary';
  // ... other legacy props
}

// Wrapper component for gradual migration
export const LegacyButton: React.FC<LegacyButtonProps> = ({
  label,
  variant = 'primary',
  ...props
}) => {
  return (
    <Button variant={variant} {...props}>
      {label}
    </Button>
  );
};
```

### Batch Migration Script

Create a script to help with bulk replacements:

```bash
#!/bin/bash
# migrate-components.sh

# Replace import statements
find src -name "*.tsx" -type f -exec sed -i '' \
  's/import.*PrimaryButton.*from.*@components\/buttons.*/import { Button } from "@lib\/components";/g' {} \;

# Replace component usage (basic cases)
find src -name "*.tsx" -type f -exec sed -i '' \
  's/<PrimaryButton/<Button variant="primary"/g' {} \;

echo "Basic migration complete. Manual review required for complex cases."
```

### Type Migration

Update TypeScript types:

```tsx
// Before
import type { IPrimaryButtonProps } from '@components/buttons/types';

interface MyComponentProps {
  buttonProps: IPrimaryButtonProps;
}

// After
import type { ButtonProps } from '@lib/components';

interface MyComponentProps {
  buttonProps: ButtonProps;
}
```

## 🧪 Testing Migration

### Test Strategy

1. **Component Tests**: Update existing tests for new component API
2. **Integration Tests**: Test component interactions
3. **Visual Tests**: Compare old vs new component appearance
4. **Accessibility Tests**: Verify improved accessibility

### Example Test Migration

```tsx
// Before
import { render, screen } from '@testing-library/react';
import { PrimaryButton } from '@components/buttons';

test('renders primary button', () => {
  render(<PrimaryButton label="Click me" onClick={jest.fn()} />);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});

// After
import { render, screen } from '@testing-library/react';
import { Button } from '@lib/components';

test('renders primary button', () => {
  render(
    <Button variant="primary" onClick={jest.fn()}>
      Click me
    </Button>,
  );
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

## 🎨 Styling Migration

### CSS Module Updates

```scss
// Before - component-specific styles
.myComponent {
  .primaryButton {
    margin: 16px;
    // Custom button styles
  }
}

// After - use design system tokens
.myComponent {
  .button {
    margin: map.get($spacing, md); // Use design system spacing
    // Let component library handle button styles
  }
}
```

### Theme Integration

```tsx
// Before - hardcoded colors
const customStyles = {
  backgroundColor: '#4a90e2',
  color: '#ffffff',
};

// After - use design system
const customStyles = {
  backgroundColor: 'var(--primary-colour)',
  color: 'var(--text-colour-inverse)',
};
```

## 🚨 Breaking Changes & Solutions

### Major Breaking Changes

1. **Button Label Prop**

   ```tsx
   // Before
   <PrimaryButton label="Text" />

   // After
   <Button>Text</Button>
   ```

2. **Input onChange Handler**

   ```tsx
   // Before
   onChange={(e) => setValue(e.target.value)}

   // After
   onChange={setValue}  // Direct value, not event
   ```

3. **Loading Component Split**

   ```tsx
   // Before
   <Loading />

   // After - choose appropriate component
   <Spinner />     // For loading states
   <Skeleton />    // For content placeholders
   ```

### Compatibility Helpers

Create helper functions for smooth migration:

```tsx
// utils/migration-helpers.ts
export const adaptLegacyButtonProps = (
  legacyProps: LegacyButtonProps,
): ButtonProps => {
  const { label, ...rest } = legacyProps;
  return {
    children: label,
    ...rest,
  };
};

// Usage
<Button {...adaptLegacyButtonProps(legacyProps)} />;
```

## 📊 Migration Checklist

### Pre-Migration

- [ ] Audit existing component usage
- [ ] Identify breaking changes
- [ ] Plan migration order (least to most complex)
- [ ] Set up new component library
- [ ] Create migration branch

### During Migration

- [ ] Update imports
- [ ] Migrate component props
- [ ] Update tests
- [ ] Verify styling
- [ ] Test accessibility
- [ ] Update documentation

### Post-Migration

- [ ] Remove old component imports
- [ ] Clean up unused files
- [ ] Update build configuration
- [ ] Performance testing
- [ ] User acceptance testing
- [ ] Deploy and monitor

## 🔍 Validation & Testing

### Automated Validation

```bash
# Check for old component usage
grep -r "PrimaryButton\|SecondaryButton" src/ --include="*.tsx"

# Verify new imports
grep -r "@lib/components" src/ --include="*.tsx"

# Run tests
pnpm run test

# Check bundle size impact
pnpm run build:analyze
```

### Manual Testing Checklist

- [ ] Visual appearance matches expectations
- [ ] All interactive states work (hover, focus, active)
- [ ] Keyboard navigation functions correctly
- [ ] Screen reader announcements are appropriate
- [ ] Loading states display correctly
- [ ] Error states are handled properly
- [ ] Responsive behavior is maintained

## 🆘 Troubleshooting

### Common Issues

#### Import Resolution Errors

```bash
# Error: Cannot resolve '@lib/components'
# Solution: Check tsconfig.json paths configuration
{
  "compilerOptions": {
    "paths": {
      "@lib/components": ["./src/lib/components"]
    }
  }
}
```

#### Styling Issues

```scss
// Issue: Components not styled
// Solution: Import design system
@use 'sass:map';
@use '@assets/global' as *;
```

#### Type Errors

```tsx
// Issue: Type mismatch
// Solution: Update prop types
- onClick: (e: React.MouseEvent) => void
+ onClick: () => void | Promise<void>
```

### Getting Help

1. **Check Documentation**: Review component Storybook stories
2. **Search Issues**: Look for similar migration issues
3. **Test Incrementally**: Migrate one component at a time
4. **Rollback Plan**: Keep old components until migration is complete

## 📈 Migration Timeline

### Recommended Phases

**Phase 1 (Week 1)**: Foundation Components

- Migrate Button components
- Update basic form inputs
- Test core functionality

**Phase 2 (Week 2)**: Layout Components

- Migrate navigation components
- Update layout containers
- Verify responsive behavior

**Phase 3 (Week 3)**: Complex Components

- Migrate modal/dialog components
- Update notification systems
- Test accessibility improvements

**Phase 4 (Week 4)**: Cleanup & Optimization

- Remove old components
- Optimize bundle size
- Performance testing
- Documentation updates

## 🎯 Success Metrics

Track these metrics to measure migration success:

- **Bundle Size**: Should decrease due to tree shaking
- **Accessibility Score**: Should improve with WCAG compliance
- **Test Coverage**: Should maintain or improve
- **Performance**: Should maintain or improve loading times
- **Developer Experience**: Faster development with consistent APIs

## 📚 Additional Resources

- [Component Library README](./README.md) - Complete usage guide
- [Storybook Documentation](http://localhost:6006) - Interactive examples
- [Design System Guide](./DesignSystem.stories.mdx) - Design token reference
- [Accessibility Guidelines](./AccessibilityGuidelines.stories.mdx) - WCAG compliance details
- [Testing Guide](./testing/) - Testing utilities and examples

---

**Need Help?** If you encounter issues during migration, refer to the troubleshooting section or check the component Storybook documentation for detailed examples.
