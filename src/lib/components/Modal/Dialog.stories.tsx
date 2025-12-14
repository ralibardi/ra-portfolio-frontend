import type { Meta, StoryObj } from '@storybook/react-vite';
import { useId, useState } from 'react';
import { Button } from '../Button';
import { Dialog } from './index';

/**
 * The Dialog component is a structured modal with header, body, and footer sections.
 * It extends the Modal component with predefined layout and size variants.
 *
 * ## Features
 * - **Structured Layout**: Header with title, body for content, footer for actions
 * - **Size Variants**: small, medium, large
 * - **Close Button**: Built-in close button in the header
 * - **All Modal Features**: Focus trapping, scroll prevention, keyboard support
 */
const meta: Meta<typeof Dialog> = {
  title: 'Overlay/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A structured modal dialog with header, body, and footer sections.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Whether the dialog is open',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    title: {
      control: 'text',
      description: 'Dialog title displayed in the header',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size variant of the dialog',
      table: {
        defaultValue: { summary: 'medium' },
      },
    },
    closeOnOverlayClick: {
      control: 'boolean',
      description: 'Whether clicking the overlay closes the dialog',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    closeOnEscape: {
      control: 'boolean',
      description: 'Whether pressing Escape closes the dialog',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    onClose: {
      action: 'closed',
      description: 'Callback when the dialog is closed',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Basic Dialog Stories
// ============================================================================

/**
 * Basic dialog with title, content, and footer actions.
 */
const BasicDialogTemplate = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Dialog</Button>
      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Dialog Title"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setIsOpen(false)}>
              Confirm
            </Button>
          </>
        }
      >
        <p>
          This is a basic dialog with a title, content, and footer actions. The dialog provides a
          structured layout for common modal patterns.
        </p>
      </Dialog>
    </>
  );
};

export const Basic: Story = {
  render: () => <BasicDialogTemplate />,
  parameters: {
    docs: {
      description: {
        story: 'A basic dialog with title, content, and footer actions.',
      },
    },
  },
};

// ============================================================================
// Size Variant Stories
// ============================================================================

/**
 * Small dialog for simple confirmations or brief messages.
 */
const SmallDialogTemplate = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Small Dialog</Button>
      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Small Dialog"
        size="small"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              No
            </Button>
            <Button variant="primary" onClick={() => setIsOpen(false)}>
              Yes
            </Button>
          </>
        }
      >
        <p>Are you sure you want to proceed?</p>
      </Dialog>
    </>
  );
};

export const Small: Story = {
  render: () => <SmallDialogTemplate />,
  parameters: {
    docs: {
      description: {
        story: 'Small dialog for simple confirmations or brief messages.',
      },
    },
  },
};

/**
 * Medium dialog (default size) for standard content.
 */
const MediumDialogTemplate = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Medium Dialog</Button>
      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Medium Dialog"
        size="medium"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setIsOpen(false)}>
              Save
            </Button>
          </>
        }
      >
        <p>
          This is a medium-sized dialog, which is the default size. It's suitable for most use cases
          including forms and detailed content.
        </p>
        <p>The medium size provides a good balance between content space and visual prominence.</p>
      </Dialog>
    </>
  );
};

export const Medium: Story = {
  render: () => <MediumDialogTemplate />,
  parameters: {
    docs: {
      description: {
        story: 'Medium dialog (default size) for standard content.',
      },
    },
  },
};

/**
 * Large dialog for complex content or forms.
 */
const LargeDialogTemplate = () => {
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();
  const descriptionId = useId();

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Large Dialog</Button>
      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Large Dialog"
        size="large"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Save Draft
            </Button>
            <Button variant="primary" onClick={() => setIsOpen(false)}>
              Publish
            </Button>
          </>
        }
      >
        <p>
          This is a large dialog suitable for complex content, detailed forms, or when you need more
          space for the user to work with.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label htmlFor={titleId} style={{ display: 'block', marginBottom: '0.5rem' }}>
              Title
            </label>
            <input
              id={titleId}
              type="text"
              placeholder="Enter title"
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </div>
          <div>
            <label htmlFor={descriptionId} style={{ display: 'block', marginBottom: '0.5rem' }}>
              Description
            </label>
            <textarea
              id={descriptionId}
              placeholder="Enter description"
              rows={4}
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export const Large: Story = {
  render: () => <LargeDialogTemplate />,
  parameters: {
    docs: {
      description: {
        story: 'Large dialog for complex content or forms.',
      },
    },
  },
};

// ============================================================================
// Content Variation Stories
// ============================================================================

/**
 * Dialog without footer for informational content.
 */
const NoFooterDialogTemplate = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Info Dialog</Button>
      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)} title="Information">
        <p>
          This dialog has no footer. It's useful for displaying informational content where no
          action is required.
        </p>
        <p>Use the close button in the header or press Escape to close.</p>
      </Dialog>
    </>
  );
};

export const NoFooter: Story = {
  render: () => <NoFooterDialogTemplate />,
  parameters: {
    docs: {
      description: {
        story: 'Dialog without footer for informational content.',
      },
    },
  },
};

/**
 * Confirmation dialog for destructive actions.
 */
const ConfirmDeleteTemplate = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="danger" onClick={() => setIsOpen(true)}>
        Delete Item
      </Button>
      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirm Delete"
        size="small"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => setIsOpen(false)}>
              Delete
            </Button>
          </>
        }
      >
        <p>Are you sure you want to delete this item? This action cannot be undone.</p>
      </Dialog>
    </>
  );
};

export const ConfirmDelete: Story = {
  render: () => <ConfirmDeleteTemplate />,
  parameters: {
    docs: {
      description: {
        story: 'Confirmation dialog for destructive actions.',
      },
    },
  },
};

// ============================================================================
// All Sizes Comparison
// ============================================================================

/**
 * All dialog sizes displayed for comparison.
 */
const AllSizesTemplate = () => {
  const [openDialog, setOpenDialog] = useState<'small' | 'medium' | 'large' | null>(null);

  return (
    <>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Button onClick={() => setOpenDialog('small')}>Small</Button>
        <Button onClick={() => setOpenDialog('medium')}>Medium</Button>
        <Button onClick={() => setOpenDialog('large')}>Large</Button>
      </div>

      <Dialog
        isOpen={openDialog === 'small'}
        onClose={() => setOpenDialog(null)}
        title="Small Dialog"
        size="small"
        footer={
          <Button variant="primary" onClick={() => setOpenDialog(null)}>
            Close
          </Button>
        }
      >
        <p>This is a small dialog.</p>
      </Dialog>

      <Dialog
        isOpen={openDialog === 'medium'}
        onClose={() => setOpenDialog(null)}
        title="Medium Dialog"
        size="medium"
        footer={
          <Button variant="primary" onClick={() => setOpenDialog(null)}>
            Close
          </Button>
        }
      >
        <p>This is a medium dialog (default size).</p>
      </Dialog>

      <Dialog
        isOpen={openDialog === 'large'}
        onClose={() => setOpenDialog(null)}
        title="Large Dialog"
        size="large"
        footer={
          <Button variant="primary" onClick={() => setOpenDialog(null)}>
            Close
          </Button>
        }
      >
        <p>This is a large dialog.</p>
      </Dialog>
    </>
  );
};

export const AllSizes: Story = {
  render: () => <AllSizesTemplate />,
  parameters: {
    docs: {
      description: {
        story: 'Click each button to see the different dialog sizes.',
      },
    },
  },
};
