/**
 * Button Component Property-Based Tests
 *
 * These tests verify the correctness properties of the Button component
 * using fast-check for property-based testing.
 *
 * @module lib/components/Button/Button.property.test
 */

import '@testing-library/jest-dom';
import * as fc from 'fast-check';
import {
  buttonSizeArb,
  buttonTextArb,
  buttonVariantArb,
  iconPositionArb,
  PBT_CONFIG,
} from '../../testing/property-testing';
import { act, fireEvent, renderComponent, screen, waitFor } from '../../testing/render-utils';
import { Button } from './index';

// Mock icon component for testing
const MockIcon = () => <svg data-testid="mock-icon" />;

describe('Button Component Property Tests', () => {
  // ============================================================================
  // Property 1: Variant styling consistency
  // Feature: reusable-component-library, Property 1: Variant styling consistency
  // ============================================================================
  describe('Property 1: Variant styling consistency', () => {
    /**
     * **Validates: Requirements 1.1**
     *
     * For any Button component with a specified variant prop, the rendered
     * button should have the corresponding variant CSS class applied.
     */
    test('Button variant prop should always apply corresponding CSS class', () => {
      fc.assert(
        fc.property(buttonVariantArb, (variant) => {
          const { container, unmount } = renderComponent(
            <Button variant={variant}>Test Button</Button>,
          );
          const button = container.querySelector('button');

          // Button should have the variant-specific class
          expect(button).toHaveClass(`button--${variant}`);
          unmount();
        }),
        PBT_CONFIG,
      );
    });
  });

  // ============================================================================
  // Property 2: Size styling consistency
  // Feature: reusable-component-library, Property 2: Size styling consistency
  // ============================================================================
  describe('Property 2: Size styling consistency', () => {
    /**
     * **Validates: Requirements 1.2**
     *
     * For any Button component with a specified size prop, the rendered
     * button should have the corresponding size CSS class applied.
     */
    test('Button size prop should always apply corresponding CSS class', () => {
      fc.assert(
        fc.property(buttonSizeArb, (size) => {
          const { container, unmount } = renderComponent(<Button size={size}>Test Button</Button>);
          const button = container.querySelector('button');

          // Button should have the size-specific class
          expect(button).toHaveClass(`button--${size}`);
          unmount();
        }),
        PBT_CONFIG,
      );
    });
  });

  // ============================================================================
  // Property 3: Disabled state behavior
  // Feature: reusable-component-library, Property 3: Disabled state behavior
  // ============================================================================
  describe('Property 3: Disabled state behavior', () => {
    /**
     * **Validates: Requirements 1.3**
     *
     * For any Button component with disabled=true, the button should have
     * the disabled attribute, disabled styling, and onClick handlers should
     * not be triggered when clicked.
     */
    test('Disabled button should have disabled attribute and not trigger onClick', () => {
      fc.assert(
        fc.property(
          fc.record({
            variant: buttonVariantArb,
            size: buttonSizeArb,
            children: buttonTextArb,
          }),
          (props) => {
            const handleClick = jest.fn();
            const { container, unmount } = renderComponent(
              <Button {...props} disabled onClick={handleClick}>
                {props.children}
              </Button>,
            );
            const button = container.querySelector('button');

            // Button should be disabled
            expect(button).toBeDisabled();
            expect(button).toHaveClass('button--disabled');

            // Click should not trigger handler
            fireEvent.click(button!);
            expect(handleClick).not.toHaveBeenCalled();
            unmount();
          },
        ),
        PBT_CONFIG,
      );
    });
  });

  // ============================================================================
  // Property 4: Icon rendering with text
  // Feature: reusable-component-library, Property 4: Icon rendering with text
  // ============================================================================
  describe('Property 4: Icon rendering with text', () => {
    /**
     * **Validates: Requirements 1.4**
     *
     * For any Button component with both icon and children props, both the
     * icon and text should be rendered in the DOM with proper spacing.
     */
    test('Button with icon and text should render both elements', () => {
      fc.assert(
        fc.property(buttonTextArb, (text) => {
          const { container, unmount } = renderComponent(
            <Button icon={<MockIcon />}>{text}</Button>,
          );

          // Both icon and text should be present
          expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
          // Use container query to find the label span with the text content
          const labelSpan = container.querySelector('.label');
          expect(labelSpan).toBeInTheDocument();
          expect(labelSpan?.textContent).toBe(text);
          unmount();
        }),
        PBT_CONFIG,
      );
    });
  });

  // ============================================================================
  // Property 5: Icon position control
  // Feature: reusable-component-library, Property 5: Icon position control
  // ============================================================================
  describe('Property 5: Icon position control', () => {
    /**
     * **Validates: Requirements 1.5**
     *
     * For any Button component with an icon and iconPosition prop, the icon
     * should appear before the text when iconPosition="left" and after the
     * text when iconPosition="right".
     */
    test('Icon position should be controlled by iconPosition prop', () => {
      fc.assert(
        fc.property(
          fc.record({
            iconPosition: iconPositionArb,
            text: buttonTextArb,
          }),
          ({ iconPosition, text }) => {
            const { container, unmount } = renderComponent(
              <Button icon={<MockIcon />} iconPosition={iconPosition}>
                {text}
              </Button>,
            );

            const iconWrapper = container.querySelector('[class*="icon"]');

            if (iconPosition === 'left') {
              expect(iconWrapper).toHaveClass('icon--left');
            } else {
              expect(iconWrapper).toHaveClass('icon--right');
            }
            unmount();
          },
        ),
        PBT_CONFIG,
      );
    });
  });

  // ============================================================================
  // Property 6: Full width styling
  // Feature: reusable-component-library, Property 6: Full width styling
  // ============================================================================
  describe('Property 6: Full width styling', () => {
    /**
     * **Validates: Requirements 1.6**
     *
     * For any Button component with fullWidth=true, the button should have
     * the fullWidth CSS class applied.
     */
    test('Button with fullWidth should have fullWidth class', () => {
      fc.assert(
        fc.property(
          fc.record({
            variant: buttonVariantArb,
            size: buttonSizeArb,
          }),
          (props) => {
            const { container, unmount } = renderComponent(
              <Button {...props} fullWidth>
                Test Button
              </Button>,
            );
            const button = container.querySelector('button');

            expect(button).toHaveClass('button--fullWidth');
            unmount();
          },
        ),
        PBT_CONFIG,
      );
    });
  });

  // ============================================================================
  // Property 7: Async operation detection
  // Feature: reusable-component-library, Property 7: Async operation detection
  // ============================================================================
  describe('Property 7: Async operation detection', () => {
    /**
     * **Validates: Requirements 1.8**
     *
     * For any Button component with an onClick handler that returns a Promise,
     * the button should automatically enter loading state when clicked.
     */
    test('Button should enter loading state when onClick returns Promise', async () => {
      const variants: Array<'primary' | 'secondary' | 'tertiary' | 'danger' | 'ghost'> = [
        'primary',
        'secondary',
        'tertiary',
        'danger',
        'ghost',
      ];

      for (const variant of variants) {
        let resolvePromise: () => void;
        const asyncHandler = jest.fn(
          () =>
            new Promise<void>((resolve) => {
              resolvePromise = resolve;
            }),
        );

        const { container, unmount } = renderComponent(
          <Button variant={variant} onClick={asyncHandler}>
            Test Button
          </Button>,
        );
        const button = container.querySelector('button');

        // Click the button
        await act(async () => {
          fireEvent.click(button!);
        });

        // Button should be in loading state
        await waitFor(() => {
          expect(button).toHaveClass('button--loading');
          expect(button).toBeDisabled();
        });

        // Resolve the promise
        await act(async () => {
          resolvePromise!();
        });

        // Button should exit loading state
        await waitFor(() => {
          expect(button).not.toHaveClass('button--loading');
        });

        unmount();
      }
    });
  });

  // ============================================================================
  // Property 8: Loading state behavior
  // Feature: reusable-component-library, Property 8: Loading state behavior
  // ============================================================================
  describe('Property 8: Loading state behavior', () => {
    /**
     * **Validates: Requirements 1.9**
     *
     * For any Button component in loading state, the button should display
     * a spinner, be disabled, and prevent additional click events.
     */
    test('Button in loading state should be disabled and show spinner', () => {
      fc.assert(
        fc.property(
          fc.record({
            variant: buttonVariantArb,
            size: buttonSizeArb,
            children: buttonTextArb,
          }),
          (props) => {
            const handleClick = jest.fn();
            const { container, unmount } = renderComponent(
              <Button {...props} isLoading onClick={handleClick}>
                {props.children}
              </Button>,
            );
            const button = container.querySelector('button');
            const spinner = container.querySelector('[class*="spinner"]');

            // Button should be disabled and show spinner
            expect(button).toBeDisabled();
            expect(button).toHaveClass('button--loading');
            expect(spinner).toBeInTheDocument();

            // Click should not trigger handler
            fireEvent.click(button!);
            expect(handleClick).not.toHaveBeenCalled();
            unmount();
          },
        ),
        PBT_CONFIG,
      );
    });
  });

  // ============================================================================
  // Property 9: Async success handling
  // Feature: reusable-component-library, Property 9: Async success handling
  // ============================================================================
  describe('Property 9: Async success handling', () => {
    /**
     * **Validates: Requirements 1.10**
     *
     * For any Button component with an async onClick that resolves successfully,
     * the button should exit loading state and become enabled again.
     */
    test('Button should exit loading state after async success', async () => {
      const variants: Array<'primary' | 'secondary' | 'tertiary' | 'danger' | 'ghost'> = [
        'primary',
        'secondary',
        'tertiary',
        'danger',
        'ghost',
      ];

      for (const variant of variants) {
        const asyncHandler = jest.fn(() => Promise.resolve());

        const { container, unmount } = renderComponent(
          <Button variant={variant} onClick={asyncHandler}>
            Test Button
          </Button>,
        );
        const button = container.querySelector('button');

        // Click the button
        await act(async () => {
          fireEvent.click(button!);
        });

        // Wait for async operation to complete
        await waitFor(() => {
          expect(button).not.toHaveClass('button--loading');
          expect(button).not.toBeDisabled();
        });

        expect(asyncHandler).toHaveBeenCalledTimes(1);
        unmount();
      }
    });
  });

  // ============================================================================
  // Property 10: Async error handling
  // Feature: reusable-component-library, Property 10: Async error handling
  // ============================================================================
  describe('Property 10: Async error handling', () => {
    /**
     * **Validates: Requirements 1.11**
     *
     * For any Button component with an async onClick that rejects, the button
     * should exit loading state, become enabled again, and call the onAsyncError
     * callback if provided.
     */
    test('Button should exit loading state and call onAsyncError after async failure', async () => {
      const variants: Array<'primary' | 'secondary' | 'tertiary' | 'danger' | 'ghost'> = [
        'primary',
        'secondary',
        'tertiary',
        'danger',
        'ghost',
      ];

      for (const variant of variants) {
        const testError = new Error('Test error');
        const asyncHandler = jest.fn(() => Promise.reject(testError));
        const errorHandler = jest.fn();

        const { container, unmount } = renderComponent(
          <Button variant={variant} onClick={asyncHandler} onAsyncError={errorHandler}>
            Test Button
          </Button>,
        );
        const button = container.querySelector('button');

        // Click the button
        await act(async () => {
          fireEvent.click(button!);
        });

        // Wait for async operation to complete
        await waitFor(() => {
          expect(button).not.toHaveClass('button--loading');
          expect(button).not.toBeDisabled();
        });

        expect(errorHandler).toHaveBeenCalledWith(testError);
        unmount();
      }
    });
  });

  // ============================================================================
  // Property 11: Manual loading control
  // Feature: reusable-component-library, Property 11: Manual loading control
  // ============================================================================
  describe('Property 11: Manual loading control', () => {
    /**
     * **Validates: Requirements 1.12**
     *
     * For any Button component with an isLoading prop provided, the manual
     * isLoading value should control the loading state instead of automatic
     * detection.
     */
    test('Manual isLoading prop should override automatic loading detection', () => {
      fc.assert(
        fc.property(
          fc.record({
            variant: buttonVariantArb,
            isLoading: fc.boolean(),
          }),
          ({ variant, isLoading }) => {
            const { container, unmount } = renderComponent(
              <Button variant={variant} isLoading={isLoading}>
                Test Button
              </Button>,
            );
            const button = container.querySelector('button');

            if (isLoading) {
              expect(button).toHaveClass('button--loading');
              expect(button).toBeDisabled();
            } else {
              expect(button).not.toHaveClass('button--loading');
              expect(button).not.toBeDisabled();
            }
            unmount();
          },
        ),
        PBT_CONFIG,
      );
    });
  });

  // ============================================================================
  // Property 12: Dimension preservation during loading
  // Feature: reusable-component-library, Property 12: Dimension preservation during loading
  // ============================================================================
  describe('Property 12: Dimension preservation during loading', () => {
    /**
     * **Validates: Requirements 1.13**
     *
     * For any Button component with text, the button dimensions should remain
     * constant when transitioning between normal and loading states.
     */
    test('Button dimensions should be preserved during loading state', async () => {
      const sizes: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large'];

      for (const size of sizes) {
        let resolvePromise: () => void;
        const asyncHandler = jest.fn(
          () =>
            new Promise<void>((resolve) => {
              resolvePromise = resolve;
            }),
        );

        const { container, unmount } = renderComponent(
          <Button size={size} onClick={asyncHandler}>
            Test Button Content
          </Button>,
        );
        const button = container.querySelector('button') as HTMLButtonElement;

        // Mock offsetWidth and offsetHeight
        Object.defineProperty(button, 'offsetWidth', { value: 100, configurable: true });
        Object.defineProperty(button, 'offsetHeight', { value: 40, configurable: true });

        // Click to trigger loading
        await act(async () => {
          fireEvent.click(button);
        });

        // Wait for loading state
        await waitFor(() => {
          expect(button).toHaveClass('button--loading');
        });

        // Check that minWidth and minHeight styles are applied
        const style = button.style;
        expect(style.minWidth).toBe('100px');
        expect(style.minHeight).toBe('40px');

        // Cleanup
        await act(async () => {
          resolvePromise!();
        });

        unmount();
      }
    });
  });

  // ============================================================================
  // Property 13: Icon-only loading state
  // Feature: reusable-component-library, Property 13: Icon-only loading state
  // ============================================================================
  describe('Property 13: Icon-only loading state', () => {
    /**
     * **Validates: Requirements 1.14**
     *
     * For any Button component with only an icon (no text), the spinner in
     * loading state should match the size of the original icon.
     */
    test('Icon-only button should show appropriately sized spinner when loading', () => {
      fc.assert(
        fc.property(
          fc.record({
            variant: buttonVariantArb,
            size: buttonSizeArb,
          }),
          (props) => {
            const { container, unmount } = renderComponent(
              <Button {...props} icon={<MockIcon />} isLoading />,
            );
            const button = container.querySelector('button');
            const spinner = container.querySelector('[class*="spinner"]');

            // Button should be icon-only and loading
            expect(button).toHaveClass('button--iconOnly');
            expect(button).toHaveClass('button--loading');

            // Spinner should have iconSize class for icon-only buttons
            expect(spinner).toHaveClass('spinner--iconSize');
            unmount();
          },
        ),
        PBT_CONFIG,
      );
    });
  });
});
