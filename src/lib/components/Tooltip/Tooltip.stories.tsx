import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { Tooltip } from './index';

/**
 * The Tooltip component displays contextual information on hover or focus.
 * It supports multiple placements with automatic collision detection.
 *
 * ## Features
 * - **Multiple Placements**: Top, bottom, left, right positioning
 * - **Collision Detection**: Automatically adjusts position to stay in viewport
 * - **Keyboard Accessible**: Shows on focus, hides on Escape
 * - **Configurable Delay**: Control show/hide timing
 */
const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A tooltip component that displays contextual information on hover or focus with automatic positioning.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    content: {
      control: 'text',
      description: 'Content to display in the tooltip',
    },
    placement: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Preferred placement of the tooltip',
      table: {
        defaultValue: { summary: 'top' },
      },
    },
    delay: {
      control: { type: 'number', min: 0, max: 1000, step: 50 },
      description: 'Delay in milliseconds before showing the tooltip',
      table: {
        defaultValue: { summary: '200' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Basic Tooltip Stories
// ============================================================================

/**
 * Default tooltip with top placement.
 */
export const Default: Story = {
  args: {
    content: 'This is a helpful tooltip',
    placement: 'top',
    delay: 200,
  },
  render: (args) => (
    <Tooltip {...args}>
      <Button>Hover me</Button>
    </Tooltip>
  ),
};

/**
 * Tooltip with longer content.
 */
export const LongContent: Story = {
  args: {
    content:
      'This is a tooltip with longer content that demonstrates how the tooltip handles multiple lines of text.',
    placement: 'top',
  },
  render: (args) => (
    <Tooltip {...args}>
      <Button>Hover for more info</Button>
    </Tooltip>
  ),
};

// ============================================================================
// Placement Stories
// ============================================================================

/**
 * Tooltip positioned at the top of the trigger element.
 */
export const PlacementTop: Story = {
  args: {
    content: 'Tooltip on top',
    placement: 'top',
    delay: 0,
  },
  render: (args) => (
    <Tooltip {...args}>
      <Button>Top</Button>
    </Tooltip>
  ),
};

/**
 * Tooltip positioned at the bottom of the trigger element.
 */
export const PlacementBottom: Story = {
  args: {
    content: 'Tooltip on bottom',
    placement: 'bottom',
    delay: 0,
  },
  render: (args) => (
    <Tooltip {...args}>
      <Button>Bottom</Button>
    </Tooltip>
  ),
};

/**
 * Tooltip positioned to the left of the trigger element.
 */
export const PlacementLeft: Story = {
  args: {
    content: 'Tooltip on left',
    placement: 'left',
    delay: 0,
  },
  render: (args) => (
    <Tooltip {...args}>
      <Button>Left</Button>
    </Tooltip>
  ),
};

/**
 * Tooltip positioned to the right of the trigger element.
 */
export const PlacementRight: Story = {
  args: {
    content: 'Tooltip on right',
    placement: 'right',
    delay: 0,
  },
  render: (args) => (
    <Tooltip {...args}>
      <Button>Right</Button>
    </Tooltip>
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
      <Tooltip content="Top tooltip" placement="top" delay={0}>
        <Button fullWidth>Top</Button>
      </Tooltip>
      <div />

      <Tooltip content="Left tooltip" placement="left" delay={0}>
        <Button fullWidth>Left</Button>
      </Tooltip>
      <div />
      <Tooltip content="Right tooltip" placement="right" delay={0}>
        <Button fullWidth>Right</Button>
      </Tooltip>

      <div />
      <Tooltip content="Bottom tooltip" placement="bottom" delay={0}>
        <Button fullWidth>Bottom</Button>
      </Tooltip>
      <div />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates all four tooltip placements.',
      },
    },
  },
};

// ============================================================================
// Delay Stories
// ============================================================================

/**
 * Tooltip with no delay (instant show).
 */
export const NoDelay: Story = {
  args: {
    content: 'Instant tooltip',
    placement: 'top',
    delay: 0,
  },
  render: (args) => (
    <Tooltip {...args}>
      <Button>No delay</Button>
    </Tooltip>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Tooltip appears instantly without any delay.',
      },
    },
  },
};

/**
 * Tooltip with a longer delay.
 */
export const LongDelay: Story = {
  args: {
    content: 'Delayed tooltip',
    placement: 'top',
    delay: 500,
  },
  render: (args) => (
    <Tooltip {...args}>
      <Button>500ms delay</Button>
    </Tooltip>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Tooltip appears after a 500ms delay.',
      },
    },
  },
};

// ============================================================================
// Accessibility Stories
// ============================================================================

/**
 * Demonstrates keyboard accessibility - focus the button to see the tooltip.
 */
export const KeyboardAccessible: Story = {
  args: {
    content: 'This tooltip is keyboard accessible',
    placement: 'top',
    delay: 0,
  },
  render: (args) => (
    <div>
      <p style={{ marginBottom: '1rem' }}>
        Tab to the button to see the tooltip. Press Escape to hide it.
      </p>
      <Tooltip {...args}>
        <Button>Focus me</Button>
      </Tooltip>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Tooltip shows on focus and can be dismissed with Escape key.',
      },
    },
  },
};

// ============================================================================
// Collision Detection Stories
// ============================================================================

/**
 * Demonstrates collision detection when tooltip would overflow viewport.
 */
export const CollisionDetection: Story = {
  render: () => (
    <div style={{ padding: '1rem' }}>
      <p style={{ marginBottom: '1rem' }}>
        Tooltips automatically adjust their position when they would overflow the viewport.
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Tooltip content="This tooltip adjusts if needed" placement="left" delay={0}>
          <Button>Left edge</Button>
        </Tooltip>
        <Tooltip content="This tooltip adjusts if needed" placement="right" delay={0}>
          <Button>Right edge</Button>
        </Tooltip>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Tooltips automatically flip to the opposite side when they would overflow the viewport.',
      },
    },
  },
};
