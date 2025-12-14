import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '../Button';
import { Popover } from './index';

/**
 * The Popover component displays rich content on hover or click.
 * It supports controlled and uncontrolled modes with automatic collision detection.
 *
 * ## Features
 * - **Multiple Triggers**: Click or hover to open
 * - **Controlled Mode**: Manage open state externally
 * - **Collision Detection**: Automatically adjusts position to stay in viewport
 * - **Click Outside**: Optionally close when clicking outside
 */
const meta: Meta<typeof Popover> = {
  title: 'Components/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A popover component that displays rich content on hover or click with automatic positioning.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    placement: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Preferred placement of the popover',
      table: {
        defaultValue: { summary: 'bottom' },
      },
    },
    trigger: {
      control: 'select',
      options: ['click', 'hover'],
      description: 'How the popover is triggered',
      table: {
        defaultValue: { summary: 'click' },
      },
    },
    closeOnClickOutside: {
      control: 'boolean',
      description: 'Whether clicking outside closes the popover',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Type for story args
type PopoverStoryArgs = React.ComponentProps<typeof Popover>;

// Sample popover content
const PopoverContent = () => (
  <div style={{ minWidth: '200px' }}>
    <h4 style={{ margin: '0 0 0.5rem 0' }}>Popover Title</h4>
    <p style={{ margin: '0 0 1rem 0', fontSize: '0.875rem' }}>
      This is some helpful content inside the popover.
    </p>
    <Button size="small" variant="primary">
      Action
    </Button>
  </div>
);

// ============================================================================
// Basic Popover Stories
// ============================================================================

/**
 * Default popover with click trigger.
 */
export const Default: Story = {
  args: {
    placement: 'bottom',
    trigger: 'click',
    closeOnClickOutside: true,
  },
  render: (args: PopoverStoryArgs) => (
    <Popover {...args} content={<PopoverContent />}>
      <Button>Click me</Button>
    </Popover>
  ),
};

// ============================================================================
// Trigger Stories
// ============================================================================

/**
 * Popover that opens on click.
 */
export const ClickTrigger: Story = {
  args: {
    placement: 'bottom',
    trigger: 'click',
    closeOnClickOutside: true,
  },
  render: (args: PopoverStoryArgs) => (
    <Popover {...args} content={<PopoverContent />}>
      <Button>Click to open</Button>
    </Popover>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Popover opens when the trigger element is clicked.',
      },
    },
  },
};

/**
 * Popover that opens on hover.
 */
export const HoverTrigger: Story = {
  args: {
    placement: 'bottom',
    trigger: 'hover',
  },
  render: (args: PopoverStoryArgs) => (
    <Popover {...args} content={<PopoverContent />}>
      <Button>Hover to open</Button>
    </Popover>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Popover opens when hovering over the trigger element.',
      },
    },
  },
};

// ============================================================================
// Placement Stories
// ============================================================================

/**
 * Popover positioned at the top.
 */
export const PlacementTop: Story = {
  args: {
    placement: 'top',
    trigger: 'click',
  },
  render: (args: PopoverStoryArgs) => (
    <Popover {...args} content={<PopoverContent />}>
      <Button>Top</Button>
    </Popover>
  ),
};

/**
 * Popover positioned at the bottom.
 */
export const PlacementBottom: Story = {
  args: {
    placement: 'bottom',
    trigger: 'click',
  },
  render: (args: PopoverStoryArgs) => (
    <Popover {...args} content={<PopoverContent />}>
      <Button>Bottom</Button>
    </Popover>
  ),
};

/**
 * Popover positioned to the left.
 */
export const PlacementLeft: Story = {
  args: {
    placement: 'left',
    trigger: 'click',
  },
  render: (args: PopoverStoryArgs) => (
    <Popover {...args} content={<PopoverContent />}>
      <Button>Left</Button>
    </Popover>
  ),
};

/**
 * Popover positioned to the right.
 */
export const PlacementRight: Story = {
  args: {
    placement: 'right',
    trigger: 'click',
  },
  render: (args: PopoverStoryArgs) => (
    <Popover {...args} content={<PopoverContent />}>
      <Button>Right</Button>
    </Popover>
  ),
};

/**
 * All placements displayed together.
 */
export const AllPlacements: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '2rem',
        padding: '4rem',
      }}
    >
      <div />
      <Popover content={<PopoverContent />} placement="top" trigger="click">
        <Button fullWidth>Top</Button>
      </Popover>
      <div />

      <Popover content={<PopoverContent />} placement="left" trigger="click">
        <Button fullWidth>Left</Button>
      </Popover>
      <div />
      <Popover content={<PopoverContent />} placement="right" trigger="click">
        <Button fullWidth>Right</Button>
      </Popover>

      <div />
      <Popover content={<PopoverContent />} placement="bottom" trigger="click">
        <Button fullWidth>Bottom</Button>
      </Popover>
      <div />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates all four popover placements.',
      },
    },
  },
};

// ============================================================================
// Close Behavior Stories
// ============================================================================

/**
 * Popover that closes when clicking outside.
 */
export const CloseOnClickOutside: Story = {
  args: {
    placement: 'bottom',
    trigger: 'click',
    closeOnClickOutside: true,
  },
  render: (args: PopoverStoryArgs) => (
    <div>
      <p style={{ marginBottom: '1rem' }}>Click outside the popover to close it.</p>
      <Popover {...args} content={<PopoverContent />}>
        <Button>Click me</Button>
      </Popover>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Popover closes when clicking anywhere outside of it.',
      },
    },
  },
};

/**
 * Popover that does NOT close when clicking outside.
 */
export const NoCloseOnClickOutside: Story = {
  args: {
    placement: 'bottom',
    trigger: 'click',
    closeOnClickOutside: false,
  },
  render: (args: PopoverStoryArgs) => (
    <div>
      <p style={{ marginBottom: '1rem' }}>
        This popover will NOT close when clicking outside. Click the button again to close.
      </p>
      <Popover {...args} content={<PopoverContent />}>
        <Button>Click me</Button>
      </Popover>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Popover stays open when clicking outside.',
      },
    },
  },
};

// ============================================================================
// Controlled Mode Stories
// ============================================================================

/**
 * Demonstrates controlled mode where the parent manages the open state.
 */
const ControlledTemplate = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <p style={{ marginBottom: '1rem' }}>
        Open state: <strong>{isOpen ? 'Open' : 'Closed'}</strong>
      </p>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <Button variant="secondary" onClick={() => setIsOpen(true)}>
          Open Popover
        </Button>
        <Button variant="secondary" onClick={() => setIsOpen(false)}>
          Close Popover
        </Button>
      </div>
      <Popover
        content={<PopoverContent />}
        placement="bottom"
        trigger="click"
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      >
        <Button>Controlled Popover</Button>
      </Popover>
    </div>
  );
};

export const ControlledMode: Story = {
  render: () => <ControlledTemplate />,
  parameters: {
    docs: {
      description: {
        story: 'Popover with externally controlled open state.',
      },
    },
  },
};

// ============================================================================
// Rich Content Stories
// ============================================================================

/**
 * Popover with a form inside.
 */
const FormContent = () => (
  <div style={{ minWidth: '250px' }}>
    <h4 style={{ margin: '0 0 1rem 0' }}>Quick Feedback</h4>
    <div style={{ marginBottom: '0.75rem' }}>
      <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
        Your feedback
        <textarea
          style={{
            display: 'block',
            width: '100%',
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #ccc',
            resize: 'vertical',
            minHeight: '60px',
            marginTop: '0.25rem',
          }}
          placeholder="Enter your feedback..."
        />
      </label>
    </div>
    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
      <Button size="small" variant="ghost">
        Cancel
      </Button>
      <Button size="small" variant="primary">
        Submit
      </Button>
    </div>
  </div>
);

export const WithForm: Story = {
  args: {
    placement: 'bottom',
    trigger: 'click',
    closeOnClickOutside: false,
  },
  render: (args: PopoverStoryArgs) => (
    <Popover {...args} content={<FormContent />}>
      <Button>Give Feedback</Button>
    </Popover>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Popover containing a form for user input.',
      },
    },
  },
};

/**
 * Popover with a menu-like content.
 */
const MenuContent = () => (
  <div style={{ minWidth: '150px' }}>
    {['Profile', 'Settings', 'Help', 'Sign out'].map((item) => (
      <button
        key={item}
        type="button"
        style={{
          display: 'block',
          width: '100%',
          padding: '0.5rem 0.75rem',
          textAlign: 'left',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          borderRadius: '4px',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        {item}
      </button>
    ))}
  </div>
);

export const WithMenu: Story = {
  args: {
    placement: 'bottom',
    trigger: 'click',
  },
  render: (args: PopoverStoryArgs) => (
    <Popover {...args} content={<MenuContent />}>
      <Button>Menu</Button>
    </Popover>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Popover used as a dropdown menu.',
      },
    },
  },
};

// ============================================================================
// Collision Detection Stories
// ============================================================================

/**
 * Demonstrates collision detection when popover would overflow viewport.
 */
export const CollisionDetection: Story = {
  render: () => (
    <div style={{ padding: '1rem' }}>
      <p style={{ marginBottom: '1rem' }}>
        Popovers automatically adjust their position when they would overflow the viewport.
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Popover content={<PopoverContent />} placement="left" trigger="click">
          <Button>Left edge</Button>
        </Popover>
        <Popover content={<PopoverContent />} placement="right" trigger="click">
          <Button>Right edge</Button>
        </Popover>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Popovers automatically flip to the opposite side when they would overflow the viewport.',
      },
    },
  },
};
