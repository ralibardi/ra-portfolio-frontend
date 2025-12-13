import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './index';

/**
 * The Button component is a unified button with multiple variants, sizes,
 * and automatic async operation handling. It supports icons, loading states,
 * and full width mode.
 *
 * ## Features
 * - **5 Variants**: primary, secondary, tertiary, danger, ghost
 * - **3 Sizes**: small, medium, large
 * - **Icon Support**: Left or right positioned icons
 * - **Async Handling**: Automatic loading state for async onClick handlers
 * - **Accessibility**: Full keyboard navigation and ARIA support
 */
const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A unified button component with multiple variants, sizes, and automatic async operation handling.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'danger', 'ghost'],
      description: 'Visual style variant of the button',
      table: {
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size of the button',
      table: {
        defaultValue: { summary: 'medium' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the button takes full width of its container',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    isLoading: {
      control: 'boolean',
      description: 'Manual loading state control',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    iconPosition: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Position of the icon relative to the text',
      table: {
        defaultValue: { summary: 'left' },
      },
    },
    children: {
      control: 'text',
      description: 'Button content/label',
    },
    onClick: {
      action: 'clicked',
      description: 'Click handler - can return a Promise for automatic loading state',
    },
    onAsyncError: {
      action: 'async error',
      description: 'Error callback for async operations',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Mock icon for stories - aria-hidden since parent button provides accessible name
const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

// ============================================================================
// Variant Stories
// ============================================================================

/**
 * The primary variant is the default and most prominent button style.
 * Use it for primary actions like "Submit", "Save", or "Continue".
 */
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

/**
 * The secondary variant has an outlined style.
 * Use it for secondary actions that are less prominent than primary.
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

/**
 * The tertiary variant has a subtle, bordered style.
 * Use it for less important actions or in dense UIs.
 */
export const Tertiary: Story = {
  args: {
    variant: 'tertiary',
    children: 'Tertiary Button',
  },
};

/**
 * The danger variant indicates destructive actions.
 * Use it for actions like "Delete", "Remove", or "Cancel".
 */
export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Danger Button',
  },
};

/**
 * The ghost variant has no background or border.
 * Use it for subtle actions or in toolbars.
 */
export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
};

// ============================================================================
// Size Stories
// ============================================================================

/**
 * Small buttons are compact and suitable for dense UIs or inline actions.
 */
export const Small: Story = {
  args: {
    size: 'small',
    children: 'Small Button',
  },
};

/**
 * Medium is the default size, suitable for most use cases.
 */
export const Medium: Story = {
  args: {
    size: 'medium',
    children: 'Medium Button',
  },
};

/**
 * Large buttons are more prominent and suitable for important actions.
 */
export const Large: Story = {
  args: {
    size: 'large',
    children: 'Large Button',
  },
};

// ============================================================================
// Icon Stories
// ============================================================================

/**
 * Button with an icon on the left side (default position).
 */
export const WithIconLeft: Story = {
  args: {
    children: 'Add Item',
    icon: <PlusIcon />,
    iconPosition: 'left',
  },
};

/**
 * Button with an icon on the right side.
 */
export const WithIconRight: Story = {
  args: {
    children: 'Continue',
    icon: <ArrowRightIcon />,
    iconPosition: 'right',
  },
};

/**
 * Icon-only button without text. Useful for toolbars or compact UIs.
 * Always provide an aria-label for accessibility.
 */
export const IconOnly: Story = {
  args: {
    icon: <TrashIcon />,
    'aria-label': 'Delete item',
  },
};

// ============================================================================
// State Stories
// ============================================================================

/**
 * Disabled buttons cannot be interacted with.
 */
export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
  },
};

/**
 * Loading state shows a spinner and disables the button.
 * Use the `isLoading` prop for manual control.
 */
export const Loading: Story = {
  args: {
    children: 'Loading...',
    isLoading: true,
  },
};

/**
 * Loading state with different variants.
 */
export const LoadingVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Button variant="primary" isLoading>
        Primary
      </Button>
      <Button variant="secondary" isLoading>
        Secondary
      </Button>
      <Button variant="tertiary" isLoading>
        Tertiary
      </Button>
      <Button variant="danger" isLoading>
        Danger
      </Button>
      <Button variant="ghost" isLoading>
        Ghost
      </Button>
    </div>
  ),
};

/**
 * Icon-only button in loading state.
 */
export const IconOnlyLoading: Story = {
  args: {
    icon: <TrashIcon />,
    isLoading: true,
    'aria-label': 'Deleting...',
  },
};

/**
 * Full width button that spans the entire container width.
 */
export const FullWidth: Story = {
  args: {
    children: 'Full Width Button',
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
};

// ============================================================================
// Async Operation Stories
// ============================================================================

/**
 * Demonstrates automatic loading state when onClick returns a Promise.
 * Click the button to see it enter loading state automatically.
 */
export const AsyncOperation: Story = {
  args: {
    children: 'Save Changes',
    onClick: () =>
      new Promise<void>((resolve) => {
        setTimeout(resolve, 2000);
      }),
  },
  parameters: {
    docs: {
      description: {
        story:
          'When onClick returns a Promise, the button automatically enters loading state until the Promise resolves.',
      },
    },
  },
};

/**
 * Demonstrates error handling for async operations.
 * Click the button to see it handle an async error.
 */
export const AsyncError: Story = {
  args: {
    children: 'Submit (Will Fail)',
    onClick: () =>
      new Promise<void>((_, reject) => {
        setTimeout(() => reject(new Error('Network error')), 1500);
      }),
    onAsyncError: (error: Error) => {
      // In a real app, you might show a toast notification
      alert(`Error: ${error.message}`);
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'When an async operation fails, the button exits loading state and calls the onAsyncError callback.',
      },
    },
  },
};

// ============================================================================
// Combination Stories
// ============================================================================

/**
 * All button variants displayed together for comparison.
 */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="tertiary">Tertiary</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  ),
};

/**
 * All button sizes displayed together for comparison.
 */
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Button size="small">Small</Button>
      <Button size="medium">Medium</Button>
      <Button size="large">Large</Button>
    </div>
  ),
};

/**
 * Buttons with icons in different configurations.
 */
export const IconConfigurations: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <Button icon={<PlusIcon />} iconPosition="left">
        Icon Left
      </Button>
      <Button icon={<ArrowRightIcon />} iconPosition="right">
        Icon Right
      </Button>
      <Button icon={<TrashIcon />} aria-label="Delete" />
      <Button icon={<PlusIcon />} variant="secondary" iconPosition="left">
        Secondary
      </Button>
      <Button icon={<TrashIcon />} variant="danger" aria-label="Delete" />
    </div>
  ),
};

/**
 * Disabled states for all variants.
 */
export const DisabledStates: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Button variant="primary" disabled>
        Primary
      </Button>
      <Button variant="secondary" disabled>
        Secondary
      </Button>
      <Button variant="tertiary" disabled>
        Tertiary
      </Button>
      <Button variant="danger" disabled>
        Danger
      </Button>
      <Button variant="ghost" disabled>
        Ghost
      </Button>
    </div>
  ),
};
