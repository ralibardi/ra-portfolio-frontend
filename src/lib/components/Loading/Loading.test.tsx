/**
 * Loading Components Property-Based Tests
 *
 * These tests verify the correctness properties of the Skeleton and Spinner
 * components using fast-check for property-based testing.
 *
 * @module lib/components/Loading/Loading.property.test
 */

import '@testing-library/jest-dom';
import * as fc from 'fast-check';
import {
  PBT_CONFIG,
  skeletonLinesArb,
  skeletonVariantArb,
  spinnerSizeArb,
} from '../../testing/property-testing';
import { renderComponent } from '../../testing/render-utils';
import { Skeleton, Spinner } from './index';

describe('Loading Components Property Tests', () => {
  // ============================================================================
  // Property 60: Skeleton rendering
  // Feature: reusable-component-library, Property 60: Skeleton rendering
  // ============================================================================
  describe('Property 60: Skeleton rendering', () => {
    /**
     * **Validates: Requirements 9.1**
     *
     * For any Skeleton component, a placeholder element with pulsing animation
     * should be rendered.
     */
    test('Skeleton should render a placeholder element with animation', () => {
      fc.assert(
        fc.property(skeletonVariantArb, (variant) => {
          const { container, unmount } = renderComponent(<Skeleton variant={variant} />);
          const skeleton = container.querySelector('[class*="skeleton"]');

          // Skeleton should be rendered
          expect(skeleton).toBeInTheDocument();

          // Skeleton should have pulse animation by default
          expect(skeleton).toHaveClass('skeleton--pulse');

          unmount();
        }),
        PBT_CONFIG,
      );
    });
  });

  // ============================================================================
  // Property 61: Skeleton variant rendering
  // Feature: reusable-component-library, Property 61: Skeleton variant rendering
  // ============================================================================
  describe('Property 61: Skeleton variant rendering', () => {
    /**
     * **Validates: Requirements 9.2**
     *
     * For any Skeleton component with a variant prop, the skeleton should have
     * the corresponding variant CSS class (text, circle, rectangle).
     */
    test('Skeleton variant prop should always apply corresponding CSS class', () => {
      fc.assert(
        fc.property(skeletonVariantArb, (variant) => {
          const { container, unmount } = renderComponent(<Skeleton variant={variant} />);
          const skeleton = container.querySelector('[class*="skeleton"]');

          // Skeleton should have the variant-specific class
          expect(skeleton).toHaveClass(`skeleton--${variant}`);

          unmount();
        }),
        PBT_CONFIG,
      );
    });
  });

  // ============================================================================
  // Property 62: Spinner rendering
  // Feature: reusable-component-library, Property 62: Spinner rendering
  // ============================================================================
  describe('Property 62: Spinner rendering', () => {
    /**
     * **Validates: Requirements 9.3**
     *
     * For any Spinner component, a rotating loading indicator should be rendered.
     */
    test('Spinner should render a rotating loading indicator', () => {
      fc.assert(
        fc.property(spinnerSizeArb, (size) => {
          const { container, unmount } = renderComponent(<Spinner size={size} />);
          const spinner = container.querySelector('[class*="spinner"]');

          // Spinner should be rendered
          expect(spinner).toBeInTheDocument();

          // Spinner should have the spinner class
          expect(spinner).toHaveClass('spinner');

          unmount();
        }),
        PBT_CONFIG,
      );
    });
  });

  // ============================================================================
  // Property 63: Spinner size customization
  // Feature: reusable-component-library, Property 63: Spinner size customization
  // ============================================================================
  describe('Property 63: Spinner size customization', () => {
    /**
     * **Validates: Requirements 9.4**
     *
     * For any Spinner component with a size prop, the spinner should have
     * the corresponding size styling applied.
     */
    test('Spinner size prop should always apply corresponding CSS class', () => {
      fc.assert(
        fc.property(spinnerSizeArb, (size) => {
          const { container, unmount } = renderComponent(<Spinner size={size} />);
          const spinner = container.querySelector('[class*="spinner"]');

          // Spinner should have the size-specific class
          expect(spinner).toHaveClass(`spinner--${size}`);

          unmount();
        }),
        PBT_CONFIG,
      );
    });

    test('Spinner with custom pixel size should apply inline styles', () => {
      fc.assert(
        fc.property(fc.integer({ min: 16, max: 100 }), (customSize) => {
          const { container, unmount } = renderComponent(<Spinner size={customSize} />);
          const spinner = container.querySelector('[class*="spinner"]') as HTMLElement;

          // Spinner should have inline width and height styles
          expect(spinner.style.width).toBe(`${customSize}px`);
          expect(spinner.style.height).toBe(`${customSize}px`);

          unmount();
        }),
        PBT_CONFIG,
      );
    });
  });

  // ============================================================================
  // Property 64: Skeleton multi-line rendering
  // Feature: reusable-component-library, Property 64: Skeleton multi-line rendering
  // ============================================================================
  describe('Property 64: Skeleton multi-line rendering', () => {
    /**
     * **Validates: Requirements 9.5**
     *
     * For any Skeleton component with variant="text" and lines prop, the
     * specified number of skeleton lines should be rendered.
     */
    test('Skeleton with lines prop should render specified number of lines', () => {
      fc.assert(
        fc.property(skeletonLinesArb, (lines) => {
          const { container, unmount } = renderComponent(<Skeleton variant="text" lines={lines} />);

          // For multi-line (lines > 1), should render multiple skeleton elements
          if (lines > 1) {
            const skeletonLines = container.querySelectorAll('[class*="skeleton--text"]');
            expect(skeletonLines).toHaveLength(lines);

            // Last line should have the lastLine class
            const lastLine = skeletonLines[skeletonLines.length - 1];
            expect(lastLine).toHaveClass('skeleton--lastLine');
          } else {
            // Single line should render one skeleton element
            const skeleton = container.querySelector('[class*="skeleton"]');
            expect(skeleton).toBeInTheDocument();
          }

          unmount();
        }),
        PBT_CONFIG,
      );
    });
  });

  // ============================================================================
  // Property 65: Spinner ARIA attributes
  // Feature: reusable-component-library, Property 65: Spinner ARIA attributes
  // ============================================================================
  describe('Property 65: Spinner ARIA attributes', () => {
    /**
     * **Validates: Requirements 9.7**
     *
     * For any Spinner component, the spinner should use semantic output element
     * and have an appropriate aria-label for screen readers.
     */
    test('Spinner should have proper ARIA attributes for accessibility', () => {
      fc.assert(
        fc.property(spinnerSizeArb, (size) => {
          const { container, unmount } = renderComponent(<Spinner size={size} />);
          const spinner = container.querySelector('output[class*="spinner"]');

          // Spinner should be an output element (semantic status element)
          expect(spinner).toBeInTheDocument();
          expect(spinner?.tagName.toLowerCase()).toBe('output');

          // Spinner should have aria-label
          expect(spinner).toHaveAttribute('aria-label');

          unmount();
        }),
        PBT_CONFIG,
      );
    });

    test('Spinner should use custom aria-label when provided', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 100 }).filter((s) => s.trim().length > 0),
          (customLabel) => {
            const { container, unmount } = renderComponent(<Spinner aria-label={customLabel} />);
            const spinner = container.querySelector('[class*="spinner"]');

            // Spinner should have the custom aria-label
            expect(spinner).toHaveAttribute('aria-label', customLabel);

            unmount();
          },
        ),
        PBT_CONFIG,
      );
    });
  });

  // ============================================================================
  // Additional Unit Tests for Edge Cases
  // ============================================================================
  describe('Skeleton additional tests', () => {
    test('Skeleton should support custom width and height', () => {
      const { container } = renderComponent(
        <Skeleton variant="rectangle" width={200} height={100} />,
      );
      const skeleton = container.querySelector('[class*="skeleton"]') as HTMLElement;

      expect(skeleton.style.width).toBe('200px');
      expect(skeleton.style.height).toBe('100px');
    });

    test('Skeleton should support string dimensions', () => {
      const { container } = renderComponent(
        <Skeleton variant="rectangle" width="100%" height="50vh" />,
      );
      const skeleton = container.querySelector('[class*="skeleton"]') as HTMLElement;

      expect(skeleton.style.width).toBe('100%');
      expect(skeleton.style.height).toBe('50vh');
    });

    test('Skeleton should support wave animation', () => {
      const { container } = renderComponent(<Skeleton variant="text" animation="wave" />);
      const skeleton = container.querySelector('[class*="skeleton"]');

      expect(skeleton).toHaveClass('skeleton--wave');
    });

    test('Skeleton should support no animation', () => {
      const { container } = renderComponent(<Skeleton variant="text" animation="none" />);
      const skeleton = container.querySelector('[class*="skeleton"]');

      expect(skeleton).toHaveClass('skeleton--none');
    });

    test('Skeleton should be hidden from screen readers', () => {
      const { container } = renderComponent(<Skeleton variant="text" />);
      const skeleton = container.querySelector('[class*="skeleton"]');

      expect(skeleton).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Spinner additional tests', () => {
    test('Spinner should support custom color', () => {
      const customColor = '#ff0000';
      const { container } = renderComponent(<Spinner color={customColor} />);
      const spinner = container.querySelector('[class*="spinner"]') as HTMLElement;

      expect(spinner.style.borderColor).toBe('rgb(255, 0, 0)');
    });

    test('Spinner should have visually hidden text for screen readers', () => {
      const { container } = renderComponent(<Spinner aria-label="Loading data" />);
      const hiddenText = container.querySelector('[class*="visuallyHidden"]');

      expect(hiddenText).toBeInTheDocument();
      expect(hiddenText?.textContent).toBe('Loading data');
    });

    test('Spinner should have default aria-label', () => {
      const { container } = renderComponent(<Spinner />);
      const spinner = container.querySelector('[class*="spinner"]');

      expect(spinner).toHaveAttribute('aria-label', 'Loading');
    });
  });
});
