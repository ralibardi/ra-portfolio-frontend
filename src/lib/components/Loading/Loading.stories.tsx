import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from './index';

// ============================================================================
// Skeleton Stories
// ============================================================================

/**
 * The Skeleton component displays a placeholder with pulsing animation
 * while content is loading. It supports multiple variants for different
 * content types.
 *
 * ## Features
 * - **3 Variants**: text, circle, rectangle
 * - **3 Animations**: pulse, wave, none
 * - **Custom Dimensions**: Width and height customization
 * - **Multi-line Support**: Multiple text lines for paragraphs
 * - **Accessibility**: Hidden from screen readers
 */
const skeletonMeta: Meta<typeof Skeleton> = {
  title: 'Components/Loading/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A placeholder component that displays a pulsing animation while content is loading.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['text', 'circle', 'rectangle'],
      description: 'Shape variant of the skeleton',
      table: {
        defaultValue: { summary: 'text' },
      },
    },
    animation: {
      control: 'select',
      options: ['pulse', 'wave', 'none'],
      description: 'Animation type',
      table: {
        defaultValue: { summary: 'pulse' },
      },
    },
    width: {
      control: 'text',
      description: 'Width of the skeleton (number for px, string for any unit)',
    },
    height: {
      control: 'text',
      description: 'Height of the skeleton (number for px, string for any unit)',
    },
    lines: {
      control: { type: 'number', min: 1, max: 10 },
      description: 'Number of lines (for text variant)',
      table: {
        defaultValue: { summary: '1' },
      },
    },
  },
};

export default skeletonMeta;
type SkeletonStory = StoryObj<typeof skeletonMeta>;

// ============================================================================
// Skeleton Variant Stories
// ============================================================================

/**
 * Text skeleton is the default variant, suitable for text content placeholders.
 */
export const TextSkeleton: SkeletonStory = {
  args: {
    variant: 'text',
    width: 200,
  },
};

/**
 * Circle skeleton is suitable for avatar or icon placeholders.
 */
export const CircleSkeleton: SkeletonStory = {
  args: {
    variant: 'circle',
    width: 48,
    height: 48,
  },
};

/**
 * Rectangle skeleton is suitable for image or card placeholders.
 */
export const RectangleSkeleton: SkeletonStory = {
  args: {
    variant: 'rectangle',
    width: 300,
    height: 200,
  },
};

// ============================================================================
// Skeleton Animation Stories
// ============================================================================

/**
 * Pulse animation is the default, creating a subtle fade effect.
 */
export const PulseAnimation: SkeletonStory = {
  args: {
    variant: 'rectangle',
    width: 200,
    height: 100,
    animation: 'pulse',
  },
};

/**
 * Wave animation creates a shimmer effect across the skeleton.
 */
export const WaveAnimation: SkeletonStory = {
  args: {
    variant: 'rectangle',
    width: 200,
    height: 100,
    animation: 'wave',
  },
};

/**
 * No animation for static placeholders.
 */
export const NoAnimation: SkeletonStory = {
  args: {
    variant: 'rectangle',
    width: 200,
    height: 100,
    animation: 'none',
  },
};

// ============================================================================
// Skeleton Multi-line Stories
// ============================================================================

/**
 * Multi-line text skeleton for paragraph placeholders.
 * The last line is automatically shorter for a more natural appearance.
 */
export const MultiLineText: SkeletonStory = {
  args: {
    variant: 'text',
    lines: 3,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Five lines of text skeleton for longer content.
 */
export const FiveLineText: SkeletonStory = {
  args: {
    variant: 'text',
    lines: 5,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

// ============================================================================
// Skeleton Custom Dimensions Stories
// ============================================================================

/**
 * Skeleton with percentage-based width.
 */
export const PercentageWidth: SkeletonStory = {
  args: {
    variant: 'rectangle',
    width: '100%',
    height: 150,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Skeleton with custom pixel dimensions.
 */
export const CustomDimensions: SkeletonStory = {
  args: {
    variant: 'rectangle',
    width: 250,
    height: 180,
  },
};

// ============================================================================
// Skeleton Composition Stories
// ============================================================================

/**
 * Card skeleton showing a typical card loading state.
 */
export const CardSkeleton: SkeletonStory = {
  render: () => (
    <div
      style={{
        width: '300px',
        padding: '16px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
      }}
    >
      <Skeleton variant="rectangle" width="100%" height={150} />
      <div style={{ marginTop: '16px' }}>
        <Skeleton variant="text" width="80%" />
      </div>
      <div style={{ marginTop: '8px' }}>
        <Skeleton variant="text" lines={2} />
      </div>
    </div>
  ),
};

/**
 * User profile skeleton showing avatar and text.
 */
export const ProfileSkeleton: SkeletonStory = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <Skeleton variant="circle" width={64} height={64} />
      <div style={{ flex: 1 }}>
        <Skeleton variant="text" width={150} />
        <div style={{ marginTop: '8px' }}>
          <Skeleton variant="text" width={100} />
        </div>
      </div>
    </div>
  ),
};

/**
 * List skeleton showing multiple list items.
 */
export const ListSkeleton: SkeletonStory = {
  render: () => (
    <div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {[1, 2, 3].map((i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Skeleton variant="circle" width={40} height={40} />
          <div style={{ flex: 1 }}>
            <Skeleton variant="text" width="70%" />
            <div style={{ marginTop: '4px' }}>
              <Skeleton variant="text" width="50%" />
            </div>
          </div>
        </div>
      ))}
    </div>
  ),
};

/**
 * All skeleton variants displayed together.
 */
export const AllVariants: SkeletonStory = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}>Text</p>
        <Skeleton variant="text" width={150} />
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}>Circle</p>
        <Skeleton variant="circle" width={48} height={48} />
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}>Rectangle</p>
        <Skeleton variant="rectangle" width={100} height={60} />
      </div>
    </div>
  ),
};
