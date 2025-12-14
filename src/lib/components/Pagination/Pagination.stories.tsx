import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Pagination } from './index';

/**
 * The Pagination component provides navigation controls for large datasets.
 * It intelligently displays page numbers with ellipsis and provides
 * accessible navigation for users browsing paginated content.
 *
 * ## Features
 * - **Smart Display**: Automatically shows ellipsis for large page counts
 * - **Keyboard Navigation**: Arrow keys, Home/End for navigation
 * - **Boundary Handling**: Previous/Next buttons disabled at boundaries
 * - **Customizable**: Configure sibling and boundary counts
 * - **Accessibility**: Full ARIA support with proper labels
 * - **Responsive**: Adapts to different screen sizes
 *
 * ## Usage Examples
 * ```tsx
 * // Basic pagination
 * <Pagination
 *   currentPage={currentPage}
 *   totalPages={totalPages}
 *   onPageChange={setCurrentPage}
 * />
 *
 * // Customized pagination
 * <Pagination
 *   currentPage={page}
 *   totalPages={100}
 *   onPageChange={handlePageChange}
 *   siblingCount={2}
 *   boundaryCount={2}
 *   previousLabel="← Previous"
 *   nextLabel="Next →"
 * />
 *
 * // With custom aria-label
 * <Pagination
 *   currentPage={page}
 *   totalPages={pages}
 *   onPageChange={onChange}
 *   aria-label="Search results pagination"
 * />
 * ```
 *
 * ## Keyboard Navigation
 * - **Tab**: Moves focus between pagination controls
 * - **Space/Enter**: Activates focused page button
 * - **Arrow Left**: Moves to previous page (when focused)
 * - **Arrow Right**: Moves to next page (when focused)
 * - **Home**: Moves to first page
 * - **End**: Moves to last page
 *
 * ## Accessibility Features
 * - `role="navigation"` with descriptive `aria-label`
 * - `aria-current="page"` for current page button
 * - `aria-label` for Previous/Next buttons
 * - `aria-disabled` for disabled boundary buttons
 * - Focus indicators that meet WCAG standards
 * - Screen reader friendly page announcements
 *
 * ## Algorithm Details
 * The pagination algorithm intelligently displays:
 * - First and last pages (boundary count)
 * - Pages around current page (sibling count)
 * - Ellipsis (...) for gaps between ranges
 * - Previous/Next navigation buttons
 *
 * ## Best Practices
 * - Use for datasets with more than 25-50 items
 * - Keep sibling count reasonable (1-2) for mobile
 * - Provide clear indication of current page
 * - Consider infinite scroll for better UX when appropriate
 * - Include total count information when helpful
 * - Test with screen readers for accessibility
 */
const meta: Meta<typeof Pagination> = {
  title: 'Layout/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A pagination component for navigating through large datasets with smart page number display and full keyboard support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    currentPage: {
      control: { type: 'number', min: 1 },
      description: 'Current page number (1-indexed)',
      table: {
        type: { summary: 'number' },
      },
    },
    totalPages: {
      control: { type: 'number', min: 1 },
      description: 'Total number of pages',
      table: {
        type: { summary: 'number' },
      },
    },
    siblingCount: {
      control: { type: 'number', min: 0, max: 5 },
      description: 'Number of pages to show on each side of current page',
      table: {
        defaultValue: { summary: '1' },
      },
    },
    boundaryCount: {
      control: { type: 'number', min: 0, max: 5 },
      description: 'Number of pages to show at start and end',
      table: {
        defaultValue: { summary: '1' },
      },
    },
    previousLabel: {
      control: 'text',
      description: 'Label for the previous button',
      table: {
        defaultValue: { summary: 'Previous' },
      },
    },
    nextLabel: {
      control: 'text',
      description: 'Label for the next button',
      table: {
        defaultValue: { summary: 'Next' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the pagination is disabled',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    onPageChange: {
      action: 'pageChanged',
      description: 'Callback fired when page changes',
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible label for the pagination navigation',
      table: {
        defaultValue: { summary: 'Pagination' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Basic Stories
// ============================================================================

/**
 * Default pagination with 10 pages.
 */
export const Default: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
  },
};

/**
 * Pagination in the middle of the page range.
 */
export const MiddlePage: Story = {
  args: {
    currentPage: 5,
    totalPages: 10,
  },
  parameters: {
    docs: {
      description: {
        story: 'Pagination when the current page is in the middle of the range.',
      },
    },
  },
};

/**
 * Pagination on the last page.
 */
export const LastPage: Story = {
  args: {
    currentPage: 10,
    totalPages: 10,
  },
  parameters: {
    docs: {
      description: {
        story: 'When on the last page, the Next button is disabled.',
      },
    },
  },
};

// ============================================================================
// Ellipsis Behavior
// ============================================================================

/**
 * Pagination with many pages showing ellipsis.
 */
export const WithEllipsis: Story = {
  args: {
    currentPage: 10,
    totalPages: 20,
    siblingCount: 1,
    boundaryCount: 1,
  },
  parameters: {
    docs: {
      description: {
        story:
          'When there are many pages, ellipsis are shown to indicate hidden pages. The current page is always visible along with its siblings.',
      },
    },
  },
};

/**
 * Pagination with ellipsis only at the start.
 */
export const EllipsisAtStart: Story = {
  args: {
    currentPage: 18,
    totalPages: 20,
    siblingCount: 1,
    boundaryCount: 1,
  },
  parameters: {
    docs: {
      description: {
        story: 'When near the end, only the start ellipsis is shown.',
      },
    },
  },
};

/**
 * Pagination with ellipsis only at the end.
 */
export const EllipsisAtEnd: Story = {
  args: {
    currentPage: 3,
    totalPages: 20,
    siblingCount: 1,
    boundaryCount: 1,
  },
  parameters: {
    docs: {
      description: {
        story: 'When near the start, only the end ellipsis is shown.',
      },
    },
  },
};

/**
 * Pagination with ellipsis on both sides.
 */
export const EllipsisBothSides: Story = {
  args: {
    currentPage: 50,
    totalPages: 100,
    siblingCount: 1,
    boundaryCount: 1,
  },
  parameters: {
    docs: {
      description: {
        story: 'When in the middle of a large range, ellipsis appear on both sides.',
      },
    },
  },
};

// ============================================================================
// Sibling and Boundary Counts
// ============================================================================

/**
 * Pagination with more siblings shown.
 */
export const MoreSiblings: Story = {
  args: {
    currentPage: 10,
    totalPages: 20,
    siblingCount: 2,
    boundaryCount: 1,
  },
  parameters: {
    docs: {
      description: {
        story: 'Use `siblingCount` to show more pages around the current page.',
      },
    },
  },
};

/**
 * Pagination with more boundary pages.
 */
export const MoreBoundaries: Story = {
  args: {
    currentPage: 10,
    totalPages: 20,
    siblingCount: 1,
    boundaryCount: 2,
  },
  parameters: {
    docs: {
      description: {
        story: 'Use `boundaryCount` to show more pages at the start and end.',
      },
    },
  },
};

/**
 * Pagination with no ellipsis (small page count).
 */
export const NoEllipsis: Story = {
  args: {
    currentPage: 3,
    totalPages: 5,
  },
  parameters: {
    docs: {
      description: {
        story: 'When the total pages is small enough, all pages are shown without ellipsis.',
      },
    },
  },
};

// ============================================================================
// Boundary States
// ============================================================================

/**
 * Pagination on the first page.
 */
export const FirstPage: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
  },
  parameters: {
    docs: {
      description: {
        story: 'When on the first page, the Previous button is disabled.',
      },
    },
  },
};

/**
 * Pagination with only two pages.
 */
export const TwoPages: Story = {
  args: {
    currentPage: 1,
    totalPages: 2,
  },
  parameters: {
    docs: {
      description: {
        story: 'Pagination works correctly with just two pages.',
      },
    },
  },
};

/**
 * Pagination with only three pages.
 */
export const ThreePages: Story = {
  args: {
    currentPage: 2,
    totalPages: 3,
  },
  parameters: {
    docs: {
      description: {
        story: 'Pagination with three pages shows all page numbers.',
      },
    },
  },
};

// ============================================================================
// Disabled State
// ============================================================================

/**
 * Disabled pagination.
 */
export const Disabled: Story = {
  args: {
    currentPage: 5,
    totalPages: 10,
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'All controls are disabled when the `disabled` prop is true.',
      },
    },
  },
};

// ============================================================================
// Custom Labels
// ============================================================================

/**
 * Pagination with custom labels.
 */
export const CustomLabels: Story = {
  args: {
    currentPage: 5,
    totalPages: 10,
    previousLabel: '← Prev',
    nextLabel: 'Next →',
  },
  parameters: {
    docs: {
      description: {
        story: 'Customize the Previous and Next button labels.',
      },
    },
  },
};

/**
 * Pagination with icon-style labels.
 */
export const IconLabels: Story = {
  args: {
    currentPage: 5,
    totalPages: 10,
    previousLabel: 'Back',
    nextLabel: 'Forward',
  },
  parameters: {
    docs: {
      description: {
        story: 'Use different labels for the navigation buttons.',
      },
    },
  },
};

// ============================================================================
// Interactive Example
// ============================================================================

/**
 * Interactive pagination with state management.
 */
export const Interactive: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 20;

    return (
      <div style={{ textAlign: 'center' }}>
        <p style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>
          Page {currentPage} of {totalPages}
        </p>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          aria-label="Interactive pagination"
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'A fully interactive example showing how to manage pagination state. Click page numbers or navigation buttons to change pages.',
      },
    },
  },
};

/**
 * Interactive pagination with data display.
 */
export const WithDataDisplay: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalItems = 47;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
      <div style={{ textAlign: 'center' }}>
        <p style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>
          Showing {startItem}-{endItem} of {totalItems} items
        </p>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          aria-label="Data pagination"
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Example showing pagination with item count display, commonly used in data tables.',
      },
    },
  },
};

// ============================================================================
// Keyboard Navigation Demo
// ============================================================================

/**
 * Demonstrates keyboard navigation.
 */
export const KeyboardNavigation: Story = {
  args: {
    currentPage: 5,
    totalPages: 10,
  },
  parameters: {
    docs: {
      description: {
        story: `
**Keyboard shortcuts:**
- **Tab**: Move focus between controls
- **Arrow Left/Right**: Navigate between focused controls
- **Home**: Move to first control
- **End**: Move to last control
- **Enter/Space**: Activate focused control
        `,
      },
    },
  },
};

// ============================================================================
// Large Page Count
// ============================================================================

/**
 * Pagination with a very large page count.
 */
export const LargePageCount: Story = {
  args: {
    currentPage: 500,
    totalPages: 1000,
    siblingCount: 1,
    boundaryCount: 1,
  },
  parameters: {
    docs: {
      description: {
        story: 'Pagination handles very large page counts gracefully with ellipsis.',
      },
    },
  },
};

/**
 * Pagination with large page count and more visible pages.
 */
export const LargePageCountExpanded: Story = {
  args: {
    currentPage: 500,
    totalPages: 1000,
    siblingCount: 2,
    boundaryCount: 2,
  },
  parameters: {
    docs: {
      description: {
        story: 'Increase `siblingCount` and `boundaryCount` to show more pages.',
      },
    },
  },
};
