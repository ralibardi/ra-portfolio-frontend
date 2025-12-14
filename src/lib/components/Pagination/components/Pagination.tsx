import cn from 'classnames';
import { memo, useCallback, useMemo, useRef } from 'react';
import type { PaginationProps } from '../../types';
import styles from '../assets/Pagination.module.scss';

type PageItem = number | 'ellipsis-start' | 'ellipsis-end';

/** Creates an array of sequential page numbers */
function createPageSequence(start: number, end: number): number[] {
  const length = Math.max(0, end - start + 1);
  return Array.from({ length }, (_, i) => start + i);
}

/** Adds start boundary pages to the result array */
function addStartBoundary(result: PageItem[], boundaryCount: number, totalPages: number): void {
  const endPage = Math.min(boundaryCount, totalPages);
  result.push(...createPageSequence(1, endPage));
}

/** Adds end boundary pages to the result array */
function addEndBoundary(result: PageItem[], boundaryCount: number, totalPages: number): void {
  const startPage = Math.max(totalPages - boundaryCount + 1, boundaryCount + 1);
  result.push(...createPageSequence(startPage, totalPages));
}

/** Adds sibling pages around the current page */
function addSiblingPages(
  result: PageItem[],
  leftIndex: number,
  rightIndex: number,
  boundaryCount: number,
  totalPages: number,
): void {
  const start = Math.max(leftIndex, boundaryCount + 1);
  const end = Math.min(rightIndex, totalPages - boundaryCount);
  result.push(...createPageSequence(start, end));
}

/**
 * Generates an array of page numbers and ellipsis markers for pagination display.
 * Uses sibling and boundary counts to determine which pages to show.
 */
function generatePageRange(
  currentPage: number,
  totalPages: number,
  siblingCount: number,
  boundaryCount: number,
): PageItem[] {
  const totalPageNumbers = siblingCount * 2 + 1 + boundaryCount * 2 + 2;

  // Show all pages if total is small enough
  if (totalPages <= totalPageNumbers - 2) {
    return createPageSequence(1, totalPages);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, boundaryCount + 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages - boundaryCount);
  const showLeftEllipsis = leftSiblingIndex > boundaryCount + 2;
  const showRightEllipsis = rightSiblingIndex < totalPages - boundaryCount - 1;

  const result: PageItem[] = [];

  // Add start boundary
  addStartBoundary(result, boundaryCount, totalPages);

  // Add left ellipsis or connecting pages
  if (showLeftEllipsis) {
    result.push('ellipsis-start');
  } else {
    result.push(...createPageSequence(boundaryCount + 1, leftSiblingIndex - 1));
  }

  // Add sibling pages
  addSiblingPages(result, leftSiblingIndex, rightSiblingIndex, boundaryCount, totalPages);

  // Add right ellipsis or connecting pages
  if (showRightEllipsis) {
    result.push('ellipsis-end');
  } else {
    result.push(...createPageSequence(rightSiblingIndex + 1, totalPages - boundaryCount));
  }

  // Add end boundary
  addEndBoundary(result, boundaryCount, totalPages);

  return result;
}

/**
 * Pagination Component
 *
 * A component for navigating through large datasets with consistent controls.
 * Supports smart page number display with ellipsis, keyboard navigation,
 * and configurable sibling/boundary counts.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Pagination
 *   currentPage={1}
 *   totalPages={10}
 *   onPageChange={(page) => setCurrentPage(page)}
 * />
 *
 * // With custom labels
 * <Pagination
 *   currentPage={5}
 *   totalPages={20}
 *   onPageChange={handlePageChange}
 *   previousLabel="← Prev"
 *   nextLabel="Next →"
 * />
 *
 * // With custom sibling and boundary counts
 * <Pagination
 *   currentPage={10}
 *   totalPages={50}
 *   onPageChange={handlePageChange}
 *   siblingCount={2}
 *   boundaryCount={2}
 * />
 * ```
 */
const Pagination = memo(function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  boundaryCount = 1,
  previousLabel = 'Previous',
  nextLabel = 'Next',
  disabled = false,
  'aria-label': ariaLabel = 'Pagination',
}: PaginationProps) {
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Generate page range with ellipsis
  const pageRange = useMemo(
    () => generatePageRange(currentPage, totalPages, siblingCount, boundaryCount),
    [currentPage, totalPages, siblingCount, boundaryCount],
  );

  // Check boundary states
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  // Handle page change
  const handlePageChange = useCallback(
    (page: number) => {
      if (disabled || page < 1 || page > totalPages || page === currentPage) {
        return;
      }
      onPageChange(page);
    },
    [disabled, totalPages, currentPage, onPageChange],
  );

  // Handle previous button click
  const handlePrevious = useCallback(() => {
    if (!isFirstPage && !disabled) {
      handlePageChange(currentPage - 1);
    }
  }, [isFirstPage, disabled, handlePageChange, currentPage]);

  // Handle next button click
  const handleNext = useCallback(() => {
    if (!isLastPage && !disabled) {
      handlePageChange(currentPage + 1);
    }
  }, [isLastPage, disabled, handlePageChange, currentPage]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>, _type: 'prev' | 'next' | number) => {
      const focusableButtons = Array.from(buttonRefs.current.values()).filter(
        (btn) => !btn.disabled,
      );
      const currentIndex = focusableButtons.indexOf(event.currentTarget);

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          if (currentIndex > 0) {
            focusableButtons[currentIndex - 1]?.focus();
          }
          break;
        case 'ArrowRight':
          event.preventDefault();
          if (currentIndex < focusableButtons.length - 1) {
            focusableButtons[currentIndex + 1]?.focus();
          }
          break;
        case 'Home':
          event.preventDefault();
          focusableButtons[0]?.focus();
          break;
        case 'End':
          event.preventDefault();
          focusableButtons[focusableButtons.length - 1]?.focus();
          break;
        default:
          break;
      }
    },
    [],
  );

  // Set button ref
  const setButtonRef = useCallback((key: string, element: HTMLButtonElement | null) => {
    if (element) {
      buttonRefs.current.set(key, element);
    } else {
      buttonRefs.current.delete(key);
    }
  }, []);

  // Don't render if there's only one page or no pages
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      className={cn(styles.pagination, {
        [styles['pagination--disabled']]: disabled,
      })}
      aria-label={ariaLabel}
      data-testid="pagination"
    >
      {/* Previous Button */}
      <button
        ref={(el) => setButtonRef('prev', el)}
        type="button"
        className={cn(styles.button, styles['button--nav'])}
        onClick={handlePrevious}
        onKeyDown={(e) => handleKeyDown(e, 'prev')}
        disabled={isFirstPage || disabled}
        aria-label="Go to previous page"
        data-testid="pagination-prev"
      >
        <span className={styles.navIcon} aria-hidden="true">
          ‹
        </span>
        <span className={styles.navLabel}>{previousLabel}</span>
      </button>

      {/* Page Numbers */}
      <div className={styles.pages} data-testid="pagination-pages">
        {pageRange.map((item) => {
          if (item === 'ellipsis-start' || item === 'ellipsis-end') {
            return (
              <span
                key={item}
                className={styles.ellipsis}
                aria-hidden="true"
                data-testid={`pagination-${item}`}
              >
                …
              </span>
            );
          }

          const isCurrentPage = item === currentPage;
          return (
            <button
              key={item}
              ref={(el) => setButtonRef(`page-${item}`, el)}
              type="button"
              className={cn(styles.button, styles['button--page'], {
                [styles['button--current']]: isCurrentPage,
              })}
              onClick={() => handlePageChange(item)}
              onKeyDown={(e) => handleKeyDown(e, item)}
              disabled={disabled}
              aria-label={isCurrentPage ? `Page ${item}, current page` : `Go to page ${item}`}
              aria-current={isCurrentPage ? 'page' : undefined}
              data-testid={`pagination-page-${item}`}
            >
              {item}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        ref={(el) => setButtonRef('next', el)}
        type="button"
        className={cn(styles.button, styles['button--nav'])}
        onClick={handleNext}
        onKeyDown={(e) => handleKeyDown(e, 'next')}
        disabled={isLastPage || disabled}
        aria-label="Go to next page"
        data-testid="pagination-next"
      >
        <span className={styles.navLabel}>{nextLabel}</span>
        <span className={styles.navIcon} aria-hidden="true">
          ›
        </span>
      </button>
    </nav>
  );
});

Pagination.displayName = 'Pagination';

export default Pagination;
