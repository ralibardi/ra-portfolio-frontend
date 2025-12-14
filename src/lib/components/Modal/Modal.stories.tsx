import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '../Button';
import { Modal } from './index';

/**
 * The Modal component provides a flexible overlay for displaying content
 * that requires user attention. It includes focus trapping, scroll prevention,
 * and accessibility features following WAI-ARIA dialog patterns.
 *
 * ## Features
 * - **Focus Trapping**: Tab navigation stays within the modal
 * - **Focus Restoration**: Returns focus to trigger element on close
 * - **Scroll Prevention**: Background scroll is disabled when open
 * - **Keyboard Support**: Escape key closes the modal
 * - **Accessibility**: Proper ARIA attributes and focus management
 * - **Portal Rendering**: Renders outside normal DOM hierarchy
 *
 * ## Usage Examples
 * ```tsx
 * // Basic modal
 * <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
 *   <h2>Modal Title</h2>
 *   <p>Modal content goes here.</p>
 *   <Button onClick={() => setIsOpen(false)}>Close</Button>
 * </Modal>
 *
 * // Modal with custom close behavior
 * <Modal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   closeOnOverlayClick={false}
 *   closeOnEscape={false}
 * >
 *   <ConfirmationDialog />
 * </Modal>
 * ```
 *
 * ## Keyboard Navigation
 * - **Escape**: Closes the modal (if enabled)
 * - **Tab**: Cycles through focusable elements within modal
 * - **Shift+Tab**: Cycles backwards through focusable elements
 *
 * ## Accessibility Features
 * - `role="dialog"` and `aria-modal="true"`
 * - Focus trapping within modal content
 * - Focus restoration to trigger element
 * - Proper heading structure for screen readers
 * - Background content hidden from screen readers
 * - Overlay click and escape key handling
 * - ARIA labels and descriptions support
 */
const meta: Meta<typeof Modal> = {
  title: 'Overlay/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A modal overlay component with focus trapping, scroll prevention, and accessibility features.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Whether the modal is open',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    closeOnOverlayClick: {
      control: 'boolean',
      description: 'Whether clicking the overlay closes the modal',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    closeOnEscape: {
      control: 'boolean',
      description: 'Whether pressing Escape closes the modal',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    onClose: {
      action: 'closed',
      description: 'Callback when the modal is closed',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Interactive Modal Story
// ============================================================================

/**
 * Interactive modal that can be opened and closed.
 * Click the button to open the modal.
 */
const InteractiveModalTemplate = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div style={{ padding: '2rem', maxWidth: '400px' }}>
          <h2 style={{ marginTop: 0 }}>Modal Title</h2>
          <p>This is a basic modal with custom content. You can put any content here.</p>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setIsOpen(false)}>
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveModalTemplate />,
  parameters: {
    docs: {
      description: {
        story: 'Click the button to open an interactive modal.',
      },
    },
  },
};

// ============================================================================
// Close Behavior Stories
// ============================================================================

/**
 * Modal that closes when clicking the overlay.
 */
const CloseOnOverlayTemplate = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal (Overlay Click Closes)</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} closeOnOverlayClick={true}>
        <div style={{ padding: '2rem', maxWidth: '400px' }}>
          <h2 style={{ marginTop: 0 }}>Click Outside to Close</h2>
          <p>Click anywhere outside this modal to close it.</p>
        </div>
      </Modal>
    </>
  );
};

export const CloseOnOverlayClick: Story = {
  render: () => <CloseOnOverlayTemplate />,
  parameters: {
    docs: {
      description: {
        story: 'Modal that closes when clicking the overlay background.',
      },
    },
  },
};

/**
 * Modal that does NOT close when clicking the overlay.
 */
const NoCloseOnOverlayTemplate = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal (Overlay Click Disabled)</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} closeOnOverlayClick={false}>
        <div style={{ padding: '2rem', maxWidth: '400px' }}>
          <h2 style={{ marginTop: 0 }}>Overlay Click Disabled</h2>
          <p>Clicking outside this modal will NOT close it. Use the button below.</p>
          <Button variant="primary" onClick={() => setIsOpen(false)}>
            Close Modal
          </Button>
        </div>
      </Modal>
    </>
  );
};

export const NoCloseOnOverlay: Story = {
  render: () => <NoCloseOnOverlayTemplate />,
  parameters: {
    docs: {
      description: {
        story: 'Modal that does not close when clicking the overlay.',
      },
    },
  },
};

/**
 * Modal that does NOT close on Escape key.
 */
const NoCloseOnEscapeTemplate = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal (Escape Disabled)</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} closeOnEscape={false}>
        <div style={{ padding: '2rem', maxWidth: '400px' }}>
          <h2 style={{ marginTop: 0 }}>Escape Key Disabled</h2>
          <p>Pressing Escape will NOT close this modal. Use the button below.</p>
          <Button variant="primary" onClick={() => setIsOpen(false)}>
            Close Modal
          </Button>
        </div>
      </Modal>
    </>
  );
};

export const NoCloseOnEscape: Story = {
  render: () => <NoCloseOnEscapeTemplate />,
  parameters: {
    docs: {
      description: {
        story: 'Modal that does not close when pressing the Escape key.',
      },
    },
  },
};

// ============================================================================
// Focus Management Stories
// ============================================================================

/**
 * Demonstrates focus trapping within the modal.
 */
const FocusTrappingTemplate = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal (Focus Trapping)</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div style={{ padding: '2rem', maxWidth: '400px' }}>
          <h2 style={{ marginTop: 0 }}>Focus Trapping Demo</h2>
          <p>
            Try pressing Tab to navigate through the focusable elements. Focus will stay trapped
            within this modal.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input type="text" placeholder="First input" style={{ padding: '0.5rem' }} />
            <input type="text" placeholder="Second input" style={{ padding: '0.5rem' }} />
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <Button variant="ghost" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setIsOpen(false)}>
                Submit
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export const FocusTrapping: Story = {
  render: () => <FocusTrappingTemplate />,
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates focus trapping - Tab navigation stays within the modal.',
      },
    },
  },
};
