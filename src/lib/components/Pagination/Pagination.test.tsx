/**
 * Pagination Component Property-Based Tests
 *
 * These tests verify the correctness properties of the Pagination component
 * using fast-check for property-based testing.
 *
 * @module lib/components/Pagination/Pagination.test
 */

import '@testing-library/jest-dom';
import * as fc from 'fast-check';
import { PBT_CONFIG, paginationStateArb } from '../../testing/property-testing';
import { fireEvent, renderComponent, screen } from '../../testing/render-utils';
import { Pagination } from './index';

describe('Pagination Component Property Tests', () => {
  // ============================================================================
  // Property 66: Pagination controls rendering
  // Feature: reusable-component-library, Property 66: Pagination controls rendering
  // ============================================================================
  describe('Property 66: Pagination controls rendering', () => {
    /**
     * **Validates: Requirements 10.1**
     *
     * For any Pagination component with currentPage and totalPages props,
     * previous button, page numbers, and next button should all be rendered.
     */
    test('Previous button, page numbers, and next button should be rendered', () => {
      fc.assert(
        fc.property(
          paginationStateArb.filter(({ totalPages }) => totalPages >= 2),
          ({ currentPage, totalPages }) => {
            const handlePageChange = jest.fn();
            const { unmount } = renderComponent(
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />,
            );

            // Verify pagination container is rendered (nav element has implicit navigation role)
            const pagination = screen.getByTestId('pagination');
            expect(pagination).toBeInTheDocument();
            expect(pagination.tagName.toLowerCase()).toBe('nav');

            // Verify previous button is rendered
            const prevButton = screen.getByTestId('pagination-prev');
            expect(prevButton).toBeInTheDocument();
            expect(prevButton).toHaveAttribute('type', 'button');

            // Verify next button is rendered
            const nextButton = screen.getByTestId('pagination-next');
            expect(nextButton).toBeInTheDocument();
            expect(nextButton).toHaveAttribute('type', 'button');

            // Verify pages container is rendered
            const pages = screen.getByTestId('pagination-pages');
            expect(pages).toBeInTheDocument();

            // Verify at least one page number is rendered
            const pageButtons = pages.querySelectorAll('button');
            expect(pageButtons.length).toBeGreaterThan(0);

            unmount();
            return true;
          },
        ),
        PBT_CONFIG,
      );
    });
  });

  // ============================================================================
  // Property 67: Page number click behavior
  // Feature: reusable-component-library, Property 67: Page number click behavior
  // ============================================================================
  describe('Property 67: Page number click behavior', () => {
    /**
     * **Validates: Requirements 10.2**
     *
     * For any Pagination component, clicking a page number should call
     * onPageChange with that page number.
     */
    test('Clicking a page number should call onPageChange with that page number', () => {
      fc.assert(
        fc.property(
          paginationStateArb.filter(({ totalPages }) => totalPages >= 3),
          ({ currentPage, totalPages }) => {
            const handlePageChange = jest.fn();
            const { unmount } = renderComponent(
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />,
            );

            // Find a page number that is not the current page
            const targetPage = currentPage === 1 ? 2 : 1;
            const pageButton = screen.queryByTestId(`pagination-page-${targetPage}`);

            if (pageButton) {
              fireEvent.click(pageButton);
              expect(handlePageChange).toHaveBeenCalledWith(targetPage);
            }

            unmount();
            return true;
          },
        ),
        PBT_CONFIG,
      );
    });

    test('Clicking current page should not call onPageChange', () => {
      fc.assert(
        fc.property(
          paginationStateArb.filter(({ totalPages }) => totalPages >= 2),
          ({ currentPage, totalPages }) => {
            const handlePageChange = jest.fn();
            const { unmount } = renderComponent(
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />,
            );

            // Click the current page button
            const currentPageButton = screen.queryByTestId(`pagination-page-${currentPage}`);

            if (currentPageButton) {
              fireEvent.click(currentPageButton);
              expect(handlePageChange).not.toHaveBeenCalled();
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
  // Property 68: Previous/next navigation
  // Feature: reusable-component-library, Property 68: Previous/next navigation
  // ============================================================================
  describe('Property 68: Previous/next navigation', () => {
    /**
     * **Validates: Requirements 10.3**
     *
     * For any Pagination component, clicking the previous button should call
     * onPageChange with currentPage - 1, and clicking next should call
     * onPageChange with currentPage + 1.
     */
    test('Previous button should call onPageChange with currentPage - 1', () => {
      fc.assert(
        fc.property(
          paginationStateArb.filter(({ currentPage }) => currentPage > 1),
          ({ currentPage, totalPages }) => {
            const handlePageChange = jest.fn();
            const { unmount } = renderComponent(
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />,
            );

            const prevButton = screen.getByTestId('pagination-prev');
            fireEvent.click(prevButton);

            expect(handlePageChange).toHaveBeenCalledWith(currentPage - 1);

            unmount();
            return true;
          },
        ),
        PBT_CONFIG,
      );
    });

    test('Next button should call onPageChange with currentPage + 1', () => {
      fc.assert(
        fc.property(
          paginationStateArb.filter(({ currentPage, totalPages }) => currentPage < totalPages),
          ({ currentPage, totalPages }) => {
            const handlePageChange = jest.fn();
            const { unmount } = renderComponent(
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />,
            );

            const nextButton = screen.getByTestId('pagination-next');
            fireEvent.click(nextButton);

            expect(handlePageChange).toHaveBeenCalledWith(currentPage + 1);

            unmount();
            return true;
          },
        ),
        PBT_CONFIG,
      );
    });
  });

  // ============================================================================
  // Property 69: First page boundary
  // Feature: reusable-component-library, Property 69: First page boundary
  // ============================================================================
  describe('Property 69: First page boundary', () => {
    /**
     * **Validates: Requirements 10.4**
     *
     * For any Pagination component with currentPage=1, the previous button
     * should be disabled.
     */
    test('Previous button should be disabled on first page', () => {
      fc.assert(
        fc.property(fc.integer({ min: 2, max: 100 }), (totalPages) => {
          const handlePageChange = jest.fn();
          const { unmount } = renderComponent(
            <Pagination currentPage={1} totalPages={totalPages} onPageChange={handlePageChange} />,
          );

          const prevButton = screen.getByTestId('pagination-prev');
          expect(prevButton).toBeDisabled();

          // Clicking disabled button should not call onPageChange
          fireEvent.click(prevButton);
          expect(handlePageChange).not.toHaveBeenCalled();

          unmount();
          return true;
        }),
        PBT_CONFIG,
      );
    });
  });

  // ============================================================================
  // Property 70: Last page boundary
  // Feature: reusable-component-library, Property 70: Last page boundary
  // ============================================================================
  describe('Property 70: Last page boundary', () => {
    /**
     * **Validates: Requirements 10.5**
     *
     * For any Pagination component with currentPage=totalPages, the next
     * button should be disabled.
     */
    test('Next button should be disabled on last page', () => {
      fc.assert(
        fc.property(fc.integer({ min: 2, max: 100 }), (totalPages) => {
          const handlePageChange = jest.fn();
          const { unmount } = renderComponent(
            <Pagination
              currentPage={totalPages}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />,
          );

          const nextButton = screen.getByTestId('pagination-next');
          expect(nextButton).toBeDisabled();

          // Clicking disabled button should not call onPageChange
          fireEvent.click(nextButton);
          expect(handlePageChange).not.toHaveBeenCalled();

          unmount();
          return true;
        }),
        PBT_CONFIG,
      );
    });
  });

  // ============================================================================
  // Property 71: Pagination ellipsis display
  // Feature: reusable-component-library, Property 71: Pagination ellipsis display
  // ============================================================================
  describe('Property 71: Pagination ellipsis display', () => {
    /**
     * **Validates: Requirements 10.6**
     *
     * For any Pagination component where totalPages exceeds the display limit,
     * ellipsis should be shown and only a subset of page numbers should be rendered.
     */
    test('Ellipsis should be shown when totalPages exceeds display limit', () => {
      // Test with a large number of pages where ellipsis should appear
      fc.assert(
        fc.property(
          fc.integer({ min: 10, max: 100 }).chain((totalPages) =>
            fc.record({
              totalPages: fc.constant(totalPages),
              // Current page in the middle to ensure ellipsis on both sides
              currentPage: fc.integer({ min: 5, max: totalPages - 4 }),
            }),
          ),
          ({ currentPage, totalPages }) => {
            const handlePageChange = jest.fn();
            const { unmount } = renderComponent(
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                siblingCount={1}
                boundaryCount={1}
              />,
            );

            const pages = screen.getByTestId('pagination-pages');

            // Count page buttons (excluding ellipsis)
            const pageButtons = pages.querySelectorAll('button');
            const ellipsisElements = pages.querySelectorAll('span');

            // Should have fewer page buttons than total pages
            expect(pageButtons.length).toBeLessThan(totalPages);

            // Should have at least one ellipsis
            expect(ellipsisElements.length).toBeGreaterThan(0);

            unmount();
            return true;
          },
        ),
        PBT_CONFIG,
      );
    });

    test('No ellipsis should be shown when totalPages is small', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 2, max: 5 }).chain((totalPages) =>
            fc.record({
              totalPages: fc.constant(totalPages),
              currentPage: fc.integer({ min: 1, max: totalPages }),
            }),
          ),
          ({ currentPage, totalPages }) => {
            const handlePageChange = jest.fn();
            const { unmount } = renderComponent(
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />,
            );

            // Should not have ellipsis for small page counts
            const startEllipsis = screen.queryByTestId('pagination-ellipsis-start');
            const endEllipsis = screen.queryByTestId('pagination-ellipsis-end');

            expect(startEllipsis).not.toBeInTheDocument();
            expect(endEllipsis).not.toBeInTheDocument();

            unmount();
            return true;
          },
        ),
        PBT_CONFIG,
      );
    });
  });

  // ============================================================================
  // Property 72: Pagination keyboard navigation
  // Feature: reusable-component-library, Property 72: Pagination keyboard navigation
  // ============================================================================
  describe('Property 72: Pagination keyboard navigation', () => {
    /**
     * **Validates: Requirements 10.7**
     *
     * For any Pagination component, all page controls should be focusable
     * and navigable with the Tab key.
     */
    test('All page controls should be focusable', () => {
      fc.assert(
        fc.property(
          paginationStateArb.filter(({ totalPages }) => totalPages >= 2 && totalPages <= 10),
          ({ currentPage, totalPages }) => {
            const handlePageChange = jest.fn();
            const { unmount } = renderComponent(
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />,
            );

            // Previous button should be focusable (unless disabled)
            const prevButton = screen.getByTestId('pagination-prev');
            if (!prevButton.hasAttribute('disabled')) {
              prevButton.focus();
              expect(document.activeElement).toBe(prevButton);
            }

            // Next button should be focusable (unless disabled)
            const nextButton = screen.getByTestId('pagination-next');
            if (!nextButton.hasAttribute('disabled')) {
              nextButton.focus();
              expect(document.activeElement).toBe(nextButton);
            }

            // Page buttons should be focusable
            const pages = screen.getByTestId('pagination-pages');
            const pageButtons = pages.querySelectorAll('button');
            for (const button of pageButtons) {
              button.focus();
              expect(document.activeElement).toBe(button);
            }

            unmount();
            return true;
          },
        ),
        PBT_CONFIG,
      );
    });

    test('Arrow keys should navigate between page controls', () => {
      const handlePageChange = jest.fn();
      const { unmount } = renderComponent(
        <Pagination currentPage={3} totalPages={5} onPageChange={handlePageChange} />,
      );

      // Focus on a page button
      const page2Button = screen.getByTestId('pagination-page-2');
      page2Button.focus();
      expect(document.activeElement).toBe(page2Button);

      // Press ArrowRight to move to next button
      fireEvent.keyDown(page2Button, { key: 'ArrowRight' });
      const page3Button = screen.getByTestId('pagination-page-3');
      expect(document.activeElement).toBe(page3Button);

      // Press ArrowLeft to move back
      fireEvent.keyDown(page3Button, { key: 'ArrowLeft' });
      expect(document.activeElement).toBe(page2Button);

      unmount();
    });

    test('Home and End keys should navigate to first and last controls', () => {
      const handlePageChange = jest.fn();
      const { unmount } = renderComponent(
        <Pagination currentPage={3} totalPages={5} onPageChange={handlePageChange} />,
      );

      // Focus on a middle page button
      const page3Button = screen.getByTestId('pagination-page-3');
      page3Button.focus();

      // Press Home to go to first focusable element
      fireEvent.keyDown(page3Button, { key: 'Home' });
      const prevButton = screen.getByTestId('pagination-prev');
      expect(document.activeElement).toBe(prevButton);

      // Press End to go to last focusable element
      fireEvent.keyDown(prevButton, { key: 'End' });
      const nextButton = screen.getByTestId('pagination-next');
      expect(document.activeElement).toBe(nextButton);

      unmount();
    });
  });

  // ============================================================================
  // Additional Tests: Disabled state
  // ============================================================================
  describe('Disabled state', () => {
    test('All controls should be disabled when disabled prop is true', () => {
      fc.assert(
        fc.property(
          paginationStateArb.filter(({ totalPages }) => totalPages >= 2),
          ({ currentPage, totalPages }) => {
            const handlePageChange = jest.fn();
            const { unmount } = renderComponent(
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                disabled
              />,
            );

            // Previous button should be disabled
            const prevButton = screen.getByTestId('pagination-prev');
            expect(prevButton).toBeDisabled();

            // Next button should be disabled
            const nextButton = screen.getByTestId('pagination-next');
            expect(nextButton).toBeDisabled();

            // All page buttons should be disabled
            const pages = screen.getByTestId('pagination-pages');
            const pageButtons = pages.querySelectorAll('button');
            for (const button of pageButtons) {
              expect(button).toBeDisabled();
            }

            // Clicking should not call onPageChange
            fireEvent.click(prevButton);
            fireEvent.click(nextButton);
            expect(handlePageChange).not.toHaveBeenCalled();

            unmount();
            return true;
          },
        ),
        PBT_CONFIG,
      );
    });
  });

  // ============================================================================
  // Additional Tests: Single page
  // ============================================================================
  describe('Single page', () => {
    test('Pagination should not render when totalPages is 1', () => {
      const handlePageChange = jest.fn();
      const { container, unmount } = renderComponent(
        <Pagination currentPage={1} totalPages={1} onPageChange={handlePageChange} />,
      );

      // Pagination should not be rendered
      const pagination = screen.queryByTestId('pagination');
      expect(pagination).not.toBeInTheDocument();
      expect(container.firstChild).toBeNull();

      unmount();
    });
  });

  // ============================================================================
  // Additional Tests: ARIA attributes
  // ============================================================================
  describe('ARIA attributes', () => {
    test('Current page button should have aria-current="page"', () => {
      fc.assert(
        fc.property(
          paginationStateArb.filter(({ totalPages }) => totalPages >= 2),
          ({ currentPage, totalPages }) => {
            const handlePageChange = jest.fn();
            const { unmount } = renderComponent(
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />,
            );

            const currentPageButton = screen.queryByTestId(`pagination-page-${currentPage}`);
            if (currentPageButton) {
              expect(currentPageButton).toHaveAttribute('aria-current', 'page');
            }

            unmount();
            return true;
          },
        ),
        PBT_CONFIG,
      );
    });

    test('Navigation buttons should have proper aria-labels', () => {
      const handlePageChange = jest.fn();
      const { unmount } = renderComponent(
        <Pagination currentPage={3} totalPages={5} onPageChange={handlePageChange} />,
      );

      const prevButton = screen.getByTestId('pagination-prev');
      const nextButton = screen.getByTestId('pagination-next');

      expect(prevButton).toHaveAttribute('aria-label', 'Go to previous page');
      expect(nextButton).toHaveAttribute('aria-label', 'Go to next page');

      unmount();
    });
  });
});
