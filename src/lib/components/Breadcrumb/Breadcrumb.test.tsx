/**
 * Breadcrumb Component Property-Based Tests
 *
 * These tests verify the correctness properties of the Breadcrumb component
 * using fast-check for property-based testing.
 *
 * @module lib/components/Breadcrumb/Breadcrumb.test
 */

import '@testing-library/jest-dom';
import * as fc from 'fast-check';
import { breadcrumbItemsArb, PBT_CONFIG } from '../../testing/property-testing';
import { fireEvent, renderComponent, screen } from '../../testing/render-utils';
import type { BreadcrumbItem } from '../types';
import { Breadcrumb } from './index';

// Helper to create breadcrumb items with optional onClick
const createBreadcrumbItems = (items: Array<{ label: string; href?: string }>): BreadcrumbItem[] =>
  items.map((item) => ({
    label: item.label,
    href: item.href,
  }));

describe('Breadcrumb Component Property Tests', () => {
  // ============================================================================
  // Property 26: Breadcrumb rendering
  // Feature: reusable-component-library, Property 26: Breadcrumb rendering
  // ============================================================================
  describe('Property 26: Breadcrumb rendering', () => {
    /**
     * **Validates: Requirements 4.1**
     *
     * For any Breadcrumb component with items array, all items should be
     * rendered with separators between them (except after the last item).
     */
    test('All breadcrumb items should be rendered with separators between them', () => {
      fc.assert(
        fc.property(breadcrumbItemsArb, (itemsData) => {
          const items = createBreadcrumbItems(itemsData);
          const { unmount } = renderComponent(<Breadcrumb items={items} />);

          // Check that all items are rendered
          for (let i = 0; i < items.length; i++) {
            const item = screen.getByTestId(`breadcrumb-item-${i}`);
            expect(item).toBeInTheDocument();
            // Use textContent directly to handle whitespace properly
            expect(item.textContent).toContain(items[i].label.trim());
          }

          // Check that separators exist between items (not after last)
          // When there's only 1 item, there should be no separators
          const expectedSeparatorCount = items.length - 1;
          if (expectedSeparatorCount > 0) {
            // Look for separators by their CSS class to avoid counting "/" in labels
            const container = screen.getByTestId('breadcrumb');
            const separators = container.querySelectorAll('.separatorItem');
            expect(separators.length).toBe(expectedSeparatorCount);
          } else {
            // No separators expected for single item
            const container = screen.getByTestId('breadcrumb');
            const separators = container.querySelectorAll('.separatorItem');
            expect(separators).toHaveLength(0);
          }

          unmount();
          return true;
        }),
        PBT_CONFIG,
      );
    });
  });

  // ============================================================================
  // Property 27: Breadcrumb navigation
  // Feature: reusable-component-library, Property 27: Breadcrumb navigation
  // ============================================================================
  describe('Property 27: Breadcrumb navigation', () => {
    /**
     * **Validates: Requirements 4.2**
     *
     * For any Breadcrumb item with an onClick handler, clicking the item
     * should trigger the onClick handler.
     */
    test('Clicking breadcrumb item with onClick should trigger the handler', () => {
      fc.assert(
        fc.property(
          breadcrumbItemsArb.filter((items) => items.length >= 2),
          (itemsData) => {
            const handleClick = jest.fn();
            // Ensure first item has href so it renders as a link
            const items: BreadcrumbItem[] = itemsData.map((item, index) => ({
              label: item.label,
              href: index < itemsData.length - 1 ? item.href || '/test-path' : undefined,
              // Add onClick to non-last items
              onClick: index < itemsData.length - 1 ? handleClick : undefined,
            }));

            const { unmount } = renderComponent(<Breadcrumb items={items} />);

            // Click the first item (which has onClick and href, so it's a link)
            const firstLink = screen.getByTestId('breadcrumb-link-0');
            fireEvent.click(firstLink);

            expect(handleClick).toHaveBeenCalledTimes(1);

            unmount();
            return true;
          },
        ),
        PBT_CONFIG,
      );
    });
  });

  // ============================================================================
  // Property 28: Current page styling
  // Feature: reusable-component-library, Property 28: Current page styling
  // ============================================================================
  describe('Property 28: Current page styling', () => {
    /**
     * **Validates: Requirements 4.3**
     *
     * For any Breadcrumb component, the last item should not be rendered
     * as a link and should have distinct current-page styling.
     */
    test('Last breadcrumb item should have current page styling and aria-current', () => {
      fc.assert(
        fc.property(breadcrumbItemsArb, (itemsData) => {
          const items = createBreadcrumbItems(itemsData);
          const { unmount } = renderComponent(<Breadcrumb items={items} />);

          const lastIndex = items.length - 1;
          const lastItem = screen.getByTestId(`breadcrumb-current-${lastIndex}`);

          // Last item should have aria-current="page"
          expect(lastItem).toHaveAttribute('aria-current', 'page');

          // Last item should not be a link (should be a span)
          expect(lastItem.tagName.toLowerCase()).toBe('span');

          unmount();
          return true;
        }),
        PBT_CONFIG,
      );
    });
  });

  // ============================================================================
  // Property 29: Custom separator rendering
  // Feature: reusable-component-library, Property 29: Custom separator rendering
  // ============================================================================
  describe('Property 29: Custom separator rendering', () => {
    /**
     * **Validates: Requirements 4.4**
     *
     * For any Breadcrumb component with a custom separator prop, the custom
     * separator should appear between all breadcrumb items.
     */
    test('Custom separator should be rendered between all items', () => {
      fc.assert(
        fc.property(
          breadcrumbItemsArb.filter((items) => items.length >= 2),
          (itemsData) => {
            const items = createBreadcrumbItems(itemsData);
            const customSeparator = '›';

            const { unmount } = renderComponent(
              <Breadcrumb items={items} separator={customSeparator} />,
            );

            // Check that custom separators exist
            const separators = screen.getAllByText(customSeparator);
            expect(separators.length).toBe(items.length - 1);

            unmount();
            return true;
          },
        ),
        PBT_CONFIG,
      );
    });
  });

  // ============================================================================
  // Property 30: Breadcrumb keyboard navigation
  // Feature: reusable-component-library, Property 30: Breadcrumb keyboard navigation
  // ============================================================================
  describe('Property 30: Breadcrumb keyboard navigation', () => {
    /**
     * **Validates: Requirements 4.6**
     *
     * For any Breadcrumb component, all breadcrumb links should be focusable
     * and navigable with the Tab key.
     */
    test('Breadcrumb links should be focusable with Tab key', () => {
      fc.assert(
        fc.property(
          breadcrumbItemsArb.filter((items) => items.length >= 2),
          (itemsData) => {
            // Ensure all items have href for this test
            const items: BreadcrumbItem[] = itemsData.map((item, index) => ({
              label: item.label,
              href: index < itemsData.length - 1 ? item.href || '/test' : undefined,
            }));

            const { unmount } = renderComponent(<Breadcrumb items={items} />);

            // Get all focusable links (excluding last item which is not a link)
            const links = items.slice(0, -1).map((_, index) => {
              return screen.getByTestId(`breadcrumb-link-${index}`);
            });

            // Verify all links are focusable (have tabIndex >= 0 or are naturally focusable)
            for (const link of links) {
              expect(link.tagName.toLowerCase()).toBe('a');
              // Links are naturally focusable
              link.focus();
              expect(document.activeElement).toBe(link);
            }

            unmount();
            return true;
          },
        ),
        PBT_CONFIG,
      );
    });
  });

  // ============================================================================
  // Property 31: Breadcrumb ARIA attributes
  // Feature: reusable-component-library, Property 31: Breadcrumb ARIA attributes
  // ============================================================================
  describe('Property 31: Breadcrumb ARIA attributes', () => {
    /**
     * **Validates: Requirements 4.7**
     *
     * For any Breadcrumb component, the component should be wrapped in a
     * nav element with appropriate aria-label.
     */
    test('Breadcrumb should be wrapped in nav element with aria-label', () => {
      fc.assert(
        fc.property(breadcrumbItemsArb, (itemsData) => {
          const items = createBreadcrumbItems(itemsData);
          const ariaLabel = 'Test Breadcrumb Navigation';

          const { unmount } = renderComponent(<Breadcrumb items={items} aria-label={ariaLabel} />);

          const nav = screen.getByTestId('breadcrumb');

          // Should be a nav element
          expect(nav.tagName.toLowerCase()).toBe('nav');

          // Should have aria-label
          expect(nav).toHaveAttribute('aria-label', ariaLabel);

          unmount();
          return true;
        }),
        PBT_CONFIG,
      );
    });

    test('Breadcrumb should have default aria-label when not provided', () => {
      const items: BreadcrumbItem[] = [{ label: 'Home', href: '/' }, { label: 'Current' }];

      const { unmount } = renderComponent(<Breadcrumb items={items} />);

      const nav = screen.getByTestId('breadcrumb');
      expect(nav).toHaveAttribute('aria-label', 'Breadcrumb');

      unmount();
    });
  });

  // ============================================================================
  // Additional Tests: Truncation (maxItems)
  // ============================================================================
  describe('Truncation with maxItems', () => {
    test('Should truncate items when exceeding maxItems', () => {
      const items: BreadcrumbItem[] = [
        { label: 'Home', href: '/' },
        { label: 'Category', href: '/category' },
        { label: 'Subcategory', href: '/category/sub' },
        { label: 'Product', href: '/category/sub/product' },
        { label: 'Current Page' },
      ];

      const { unmount } = renderComponent(<Breadcrumb items={items} maxItems={3} />);

      // Should show first item, ellipsis, and last 2 items
      expect(screen.getByTestId('breadcrumb-item-0')).toHaveTextContent('Home');
      expect(screen.getByText('…')).toBeInTheDocument();
      expect(screen.getByTestId('breadcrumb-item-3')).toHaveTextContent('Product');
      expect(screen.getByTestId('breadcrumb-item-4')).toHaveTextContent('Current Page');

      unmount();
    });

    test('Should not truncate when items count is less than or equal to maxItems', () => {
      const items: BreadcrumbItem[] = [
        { label: 'Home', href: '/' },
        { label: 'Category', href: '/category' },
        { label: 'Current Page' },
      ];

      const { unmount } = renderComponent(<Breadcrumb items={items} maxItems={5} />);

      // All items should be visible
      expect(screen.getByTestId('breadcrumb-item-0')).toHaveTextContent('Home');
      expect(screen.getByTestId('breadcrumb-item-1')).toHaveTextContent('Category');
      expect(screen.getByTestId('breadcrumb-item-2')).toHaveTextContent('Current Page');

      // No ellipsis
      expect(screen.queryByText('…')).not.toBeInTheDocument();

      unmount();
    });
  });

  // ============================================================================
  // Additional Tests: Button items (onClick without href)
  // ============================================================================
  describe('Button items', () => {
    test('Items with onClick but no href should render as buttons', () => {
      const handleClick = jest.fn();
      const items: BreadcrumbItem[] = [
        { label: 'Home', onClick: handleClick },
        { label: 'Current Page' },
      ];

      const { unmount } = renderComponent(<Breadcrumb items={items} />);

      const button = screen.getByTestId('breadcrumb-button-0');
      expect(button.tagName.toLowerCase()).toBe('button');
      expect(button).toHaveAttribute('type', 'button');

      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);

      unmount();
    });
  });
});
