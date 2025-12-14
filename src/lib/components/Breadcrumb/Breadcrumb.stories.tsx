import type { Meta, StoryObj } from '@storybook/react-vite';
import type { BreadcrumbItem } from '../types';
import { Breadcrumb } from './index';

/**
 * The Breadcrumb component displays the current page location within a
 * hierarchical structure. It supports custom separators, responsive truncation,
 * and keyboard navigation.
 *
 * ## Features
 * - **Navigation Hierarchy**: Shows the path from root to current page
 * - **Custom Separators**: Use any character or component as separator
 * - **Responsive Truncation**: Collapse middle items when space is limited
 * - **Keyboard Navigation**: Tab through breadcrumb links
 * - **Accessibility**: Wrapped in nav element with proper ARIA attributes
 */
const meta: Meta<typeof Breadcrumb> = {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A navigation component that displays the current page location within a hierarchical structure with support for custom separators and responsive truncation.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    items: {
      description: 'Array of breadcrumb items with label, optional href, and optional onClick',
      table: {
        type: { summary: 'BreadcrumbItem[]' },
      },
    },
    separator: {
      control: 'text',
      description: 'Custom separator between breadcrumb items',
      table: {
        defaultValue: { summary: '/' },
      },
    },
    maxItems: {
      control: 'number',
      description: 'Maximum items to display before truncation',
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible label for the breadcrumb navigation',
      table: {
        defaultValue: { summary: 'Breadcrumb' },
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '600px', maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample breadcrumb items
const sampleItems: BreadcrumbItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Electronics', href: '/products/electronics' },
  { label: 'Smartphones' },
];

// ============================================================================
// Basic Stories
// ============================================================================

/**
 * The default breadcrumb with standard navigation items.
 * The last item represents the current page and is not clickable.
 */
export const Default: Story = {
  args: {
    items: sampleItems,
    'aria-label': 'Page navigation',
  },
};

/**
 * Breadcrumb with only two items - a simple parent/child relationship.
 */
export const TwoItems: Story = {
  args: {
    items: [{ label: 'Home', href: '/' }, { label: 'About Us' }],
    'aria-label': 'Page navigation',
  },
  parameters: {
    docs: {
      description: {
        story: 'A simple breadcrumb with just two levels of navigation.',
      },
    },
  },
};

/**
 * Breadcrumb with a single item (current page only).
 */
export const SingleItem: Story = {
  args: {
    items: [{ label: 'Home' }],
    'aria-label': 'Page navigation',
  },
  parameters: {
    docs: {
      description: {
        story:
          'When only one item is provided, it displays as the current page without separators.',
      },
    },
  },
};

// ============================================================================
// Custom Separator Stories
// ============================================================================

/**
 * Breadcrumb with a chevron separator.
 */
export const ChevronSeparator: Story = {
  args: {
    items: sampleItems,
    separator: '›',
    'aria-label': 'Page navigation',
  },
  parameters: {
    docs: {
      description: {
        story: 'Use a chevron character as the separator for a more modern look.',
      },
    },
  },
};

/**
 * Breadcrumb with an arrow separator.
 */
export const ArrowSeparator: Story = {
  args: {
    items: sampleItems,
    separator: '→',
    'aria-label': 'Page navigation',
  },
  parameters: {
    docs: {
      description: {
        story: 'Use an arrow character as the separator.',
      },
    },
  },
};

/**
 * Breadcrumb with a pipe separator.
 */
export const PipeSeparator: Story = {
  args: {
    items: sampleItems,
    separator: '|',
    'aria-label': 'Page navigation',
  },
  parameters: {
    docs: {
      description: {
        story: 'Use a pipe character as the separator for a clean, minimal look.',
      },
    },
  },
};

// ============================================================================
// Truncation Stories
// ============================================================================

const longPathItems: BreadcrumbItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Electronics', href: '/products/electronics' },
  { label: 'Computers', href: '/products/electronics/computers' },
  { label: 'Laptops', href: '/products/electronics/computers/laptops' },
  { label: 'Gaming Laptops', href: '/products/electronics/computers/laptops/gaming' },
  { label: 'ASUS ROG Strix G15' },
];

/**
 * Breadcrumb with truncation enabled.
 * Shows first item, ellipsis, and last few items.
 */
export const WithTruncation: Story = {
  args: {
    items: longPathItems,
    maxItems: 4,
    'aria-label': 'Page navigation',
  },
  parameters: {
    docs: {
      description: {
        story:
          'When `maxItems` is set and the path is longer, middle items are collapsed with an ellipsis.',
      },
    },
  },
};

/**
 * Long path without truncation for comparison.
 */
export const LongPathNoTruncation: Story = {
  args: {
    items: longPathItems,
    'aria-label': 'Page navigation',
  },
  parameters: {
    docs: {
      description: {
        story: 'A long navigation path without truncation. Compare with the truncated version.',
      },
    },
  },
};

// ============================================================================
// Interactive Stories
// ============================================================================

/**
 * Breadcrumb with onClick handlers instead of hrefs.
 * Useful for SPA navigation or custom actions.
 */
export const WithClickHandlers: Story = {
  args: {
    items: [
      { label: 'Home', onClick: () => alert('Navigate to Home') },
      { label: 'Products', onClick: () => alert('Navigate to Products') },
      { label: 'Current Page' },
    ],
    'aria-label': 'Page navigation',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Items can use `onClick` handlers instead of `href` for SPA navigation or custom actions.',
      },
    },
  },
};

/**
 * Breadcrumb with mixed navigation (href and onClick).
 */
export const MixedNavigation: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Products', href: '/products', onClick: () => alert('Custom action on Products') },
      { label: 'Category', onClick: () => alert('Navigate to Category') },
      { label: 'Current Page' },
    ],
    'aria-label': 'Page navigation',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Items can have both `href` and `onClick`. When both are present, `onClick` is called and default navigation is prevented.',
      },
    },
  },
};

// ============================================================================
// Accessibility Stories
// ============================================================================

/**
 * Breadcrumb with custom aria-label.
 */
export const CustomAriaLabel: Story = {
  args: {
    items: sampleItems,
    'aria-label': 'Product category navigation',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Provide a descriptive `aria-label` to help screen reader users understand the navigation context.',
      },
    },
  },
};
