# Component Library

This directory contains the reusable component library for the RA Portfolio application.

## Structure

```
lib/
├── components/           # Reusable UI components
│   ├── types/           # Shared TypeScript interfaces
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

## Component Template

Each component follows this structure:

```
ComponentName/
├── components/
│   └── ComponentName.tsx
├── assets/
│   └── ComponentName.module.scss
├── ComponentName.test.tsx
├── ComponentName.stories.tsx
└── index.ts
```

## Testing

### Unit Tests

Use the testing utilities from `@lib/testing`:

```tsx
import { renderComponent, screen } from '@lib/testing';
import { Button } from './Button';

describe('Button', () => {
  it('renders correctly', () => {
    renderComponent(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
```

### Property-Based Tests

Use fast-check arbitraries from `@lib/testing`:

```tsx
import { fc, buttonVariantArb, runProperty } from '@lib/testing';
import { renderComponent, screen } from '@lib/testing';
import { Button } from './Button';

describe('Button Properties', () => {
  it('should apply variant class for any variant', () => {
    runProperty(
      fc.property(buttonVariantArb, (variant) => {
        const { container } = renderComponent(
          <Button variant={variant}>Test</Button>,
        );
        expect(container.querySelector(`.${variant}`)).toBeInTheDocument();
      }),
    );
  });
});
```

### Accessibility Tests

Use accessibility utilities from `@lib/testing`:

```tsx
import { ARIA_ROLES, pressEnter, hasAriaAttribute } from '@lib/testing';

describe('Button Accessibility', () => {
  it('should have correct ARIA attributes', () => {
    const { getByRole } = renderComponent(<Button>Click</Button>);
    const button = getByRole(ARIA_ROLES.button);
    expect(button).toBeInTheDocument();
  });
});
```

## Storybook

Each component should have a stories file:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './components/Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'danger', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
  },
};
```

## Design System Integration

All components use the design system tokens from `@assets/`:

- Colors: Use `map.get($primary, base)`, `var(--text-colour)`, etc.
- Spacing: Use `map.get($spacing, md)`, etc.
- Typography: Use `map.get($font-sizes, md)`, etc.
- Borders: Use `map.get($border, md)`, etc.

## Accessibility

All components must:

1. Support keyboard navigation
2. Include proper ARIA attributes
3. Respect `prefers-reduced-motion`
4. Meet WCAG 2.1 AA contrast requirements
5. Have visible focus indicators
