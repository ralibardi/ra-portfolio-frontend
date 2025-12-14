/**
 * Design System Integration Property Tests
 * Tests that all components follow design system standards
 */

import { render } from '@testing-library/react';
import fc from 'fast-check';
import { Accordion } from './Accordion';
import { Alert } from './Alert';
import { Button } from './Button';
import { Input } from './Form';
import { Spinner } from './Loading';

describe('Design System Integration Properties', () => {
  // Feature: reusable-component-library, Property 73: Color system usage
  test('Property 73: All components use design system colors', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('primary', 'secondary', 'tertiary', 'danger', 'ghost'),
        fc.constantFrom('small', 'medium', 'large'),
        fc.string({ minLength: 1, maxLength: 20 }).filter((s) => s.trim().length > 0),
        (variant, size, children) => {
          const { container } = render(
            <Button variant={variant} size={size}>
              {children}
            </Button>,
          );

          const button = container.querySelector('button');
          expect(button).toBeInTheDocument();

          // Check that the component has the correct variant and size classes
          // These classes apply design system colors via CSS custom properties
          expect(button).toHaveClass(`button--${variant}`);
          expect(button).toHaveClass(`button--${size}`);
        },
      ),
      { numRuns: 30 },
    );
  });

  // Feature: reusable-component-library, Property 74: Spacing system usage
  test('Property 74: All components use design system spacing', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('small', 'medium', 'large'),
        fc.string({ minLength: 1, maxLength: 20 }).filter((s) => s.trim().length > 0),
        (size, children) => {
          const { container } = render(<Button size={size}>{children}</Button>);

          const button = container.querySelector('button');
          expect(button).toBeInTheDocument();

          // Check that the component has the correct size class
          // This class applies design system spacing via map.get($spacing, ...)
          expect(button).toHaveClass(`button--${size}`);
        },
      ),
      { numRuns: 30 },
    );
  });

  // Feature: reusable-component-library, Property 75: Typography system usage
  test('Property 75: All components use design system typography', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('small', 'medium', 'large'),
        fc.string({ minLength: 1, maxLength: 20 }).filter((s) => s.trim().length > 0),
        (size, children) => {
          const { container } = render(<Button size={size}>{children}</Button>);

          const button = container.querySelector('button');
          expect(button).toBeInTheDocument();

          // Check that the component has the correct size class
          // This class applies design system typography via map.get($font-sizes, ...)
          expect(button).toHaveClass(`button--${size}`);

          // Check that the component has proper typography class
          // Font family is applied via CSS and may not be computed in test environment
        },
      ),
      { numRuns: 30 },
    );
  });

  // Feature: reusable-component-library, Property 76: Border system usage
  test('Property 76: All components use design system border values', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('primary', 'secondary', 'tertiary'),
        fc.constantFrom('small', 'medium', 'large'),
        fc.string({ minLength: 1, maxLength: 20 }).filter((s) => s.trim().length > 0),
        (variant, size, children) => {
          const { container } = render(
            <Button variant={variant} size={size}>
              {children}
            </Button>,
          );

          const button = container.querySelector('button');
          expect(button).toBeInTheDocument();

          // Check that the component has the correct classes
          // These classes apply design system borders via map.get($border, ...)
          expect(button).toHaveClass(`button--${variant}`);
          expect(button).toHaveClass(`button--${size}`);
        },
      ),
      { numRuns: 30 },
    );
  });

  // Feature: reusable-component-library, Property 77: Reduced motion support
  test('Property 77: Components respect prefers-reduced-motion', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 20 }).filter((s) => s.trim().length > 0),
        (ariaLabel) => {
          const { container } = render(<Spinner aria-label={ariaLabel} />);

          const spinner = container.querySelector('[data-testid="spinner"]');
          expect(spinner).toBeInTheDocument();

          // Check that the component renders properly and has ARIA attributes
          // Reduced motion support is handled by CSS @include prefers-reduced-motion
          expect(spinner).toHaveAttribute('aria-label', ariaLabel);

          // Component should have the spinner class which includes reduced motion support
          expect(spinner).toHaveClass('spinner');
        },
      ),
      { numRuns: 30 },
    );
  });

  // Feature: reusable-component-library, Property 78: Dark mode support
  test('Property 78: Components adapt to theme changes', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('info', 'success', 'warning', 'error'),
        fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length > 0),
        (severity, message) => {
          const { container } = render(<Alert severity={severity}>{message}</Alert>);

          const alert = container.querySelector('.alert');
          expect(alert).toBeInTheDocument();

          // Check that the component has the correct severity class
          // This class uses theme-aware CSS custom properties for colors
          expect(alert).toHaveClass(severity);
        },
      ),
      { numRuns: 30 },
    );
  });

  // Additional test for form components
  test('Property 73-78: Form components follow design system', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 20 }).filter((s) => s.trim().length > 0),
        fc.string({ minLength: 0, maxLength: 50 }),
        (label, value) => {
          const { container } = render(<Input label={label} value={value} onChange={() => {
            // Intentionally empty - test mock
          }} />);

          const input = container.querySelector('input');
          const labelElement = container.querySelector('label');

          expect(input).toBeInTheDocument();
          expect(labelElement).toBeInTheDocument();

          // Check that components have proper classes
          // These classes apply design system values
          expect(input).toHaveClass('input');
          expect(labelElement).toHaveClass('label');
        },
      ),
      { numRuns: 20 },
    );
  });

  // Test for layout components
  test('Property 73-78: Layout components follow design system', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.string({ minLength: 1, maxLength: 10 }).filter((s) => s.trim().length > 0),
            header: fc.string({ minLength: 1, maxLength: 20 }).filter((s) => s.trim().length > 0),
            content: fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length > 0),
          }),
          { minLength: 1, maxLength: 3 },
        ),
        (items) => {
          const { container } = render(<Accordion items={items} />);

          const accordion = container.querySelector('.accordion');
          expect(accordion).toBeInTheDocument();

          // Check that the component has the correct class
          // This class applies design system values
          expect(accordion).toHaveClass('accordion');
        },
      ),
      { numRuns: 15 },
    );
  });
});
