import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spinner } from './index';

/**
 * The Spinner component displays a rotating loading indicator.
 * It supports multiple sizes and custom colors.
 *
 * ## Features
 * - **3 Preset Sizes**: small, medium, large
 * - **Custom Size**: Pixel-based custom sizing
 * - **Custom Color**: Any valid CSS color
 * - **Accessibility**: Proper ARIA attributes for screen readers
 * - **Reduced Motion**: Respects prefers-reduced-motion
 */
const meta: Meta<typeof Spinner> = {
  title: 'Components/Loading/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A rotating loading indicator with customizable size and color.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size of the spinner (preset or custom pixel value)',
      table: {
        defaultValue: { summary: 'medium' },
      },
    },
    color: {
      control: 'color',
      description: 'Color of the spinner',
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible label for screen readers',
      table: {
        defaultValue: { summary: 'Loading' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Size Stories
// ============================================================================

/**
 * Small spinner for compact spaces or inline loading indicators.
 */
export const Small: Story = {
  args: {
    size: 'small',
  },
};

/**
 * Medium spinner is the default size, suitable for most use cases.
 */
export const Medium: Story = {
  args: {
    size: 'medium',
  },
};

/**
 * Large spinner for prominent loading states.
 */
export const Large: Story = {
  args: {
    size: 'large',
  },
};

/**
 * Custom pixel size for specific requirements.
 */
export const CustomSize: Story = {
  args: {
    size: 48,
  },
};

// ============================================================================
// Color Stories
// ============================================================================

/**
 * Spinner with custom color.
 */
export const CustomColor: Story = {
  args: {
    size: 'medium',
    color: '#e67e22',
  },
};

/**
 * Spinner with success color.
 */
export const SuccessColor: Story = {
  args: {
    size: 'medium',
    color: '#27ae60',
  },
};

/**
 * Spinner with error color.
 */
export const ErrorColor: Story = {
  args: {
    size: 'medium',
    color: '#e74c3c',
  },
};

// ============================================================================
// Accessibility Stories
// ============================================================================

/**
 * Spinner with custom aria-label for specific context.
 */
export const CustomAriaLabel: Story = {
  args: {
    size: 'medium',
    'aria-label': 'Saving your changes...',
  },
};

/**
 * Spinner with loading data context.
 */
export const LoadingData: Story = {
  args: {
    size: 'large',
    'aria-label': 'Loading data from server',
  },
};

// ============================================================================
// Composition Stories
// ============================================================================

/**
 * All spinner sizes displayed together for comparison.
 */
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <Spinner size="small" />
        <p style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>Small</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Spinner size="medium" />
        <p style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>Medium</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Spinner size="large" />
        <p style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>Large</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Spinner size={48} />
        <p style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>Custom (48px)</p>
      </div>
    </div>
  ),
};

/**
 * Spinners with different colors.
 */
export const ColorVariations: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <Spinner size="medium" />
        <p style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>Default</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Spinner size="medium" color="#27ae60" />
        <p style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>Success</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Spinner size="medium" color="#f39c12" />
        <p style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>Warning</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Spinner size="medium" color="#e74c3c" />
        <p style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>Error</p>
      </div>
    </div>
  ),
};

/**
 * Spinner in a loading overlay context.
 */
export const LoadingOverlay: Story = {
  render: () => (
    <div
      style={{
        position: 'relative',
        width: '300px',
        height: '200px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
        }}
      >
        <Spinner size="large" aria-label="Loading content" />
      </div>
    </div>
  ),
};

/**
 * Spinner with loading text.
 */
export const WithLoadingText: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <Spinner size="large" aria-label="Loading" />
      <span style={{ fontSize: '14px', color: '#666' }}>Loading...</span>
    </div>
  ),
};

/**
 * Inline spinner with text.
 */
export const InlineWithText: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Spinner size="small" aria-label="Saving" />
      <span style={{ fontSize: '14px' }}>Saving changes...</span>
    </div>
  ),
};

/**
 * Button-like loading state using spinner.
 */
export const ButtonLoading: Story = {
  render: () => (
    <button
      type="button"
      disabled
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '8px 16px',
        backgroundColor: '#4a90e2',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'not-allowed',
        opacity: 0.7,
      }}
    >
      <Spinner size="small" color="white" aria-label="Processing" />
      <span>Processing...</span>
    </button>
  ),
};
