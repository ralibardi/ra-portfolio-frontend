import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Alert } from './index';

/**
 * The Alert component displays feedback messages with appropriate severity levels.
 * It supports dismissible alerts with close buttons and follows accessibility
 * best practices for user notifications.
 *
 * ## Features
 * - **Severity Levels**: info, success, warning, error
 * - **Dismissible**: Optional close button with onClose callback
 * - **Custom Icons**: Override default severity icons
 * - **Accessible**: Proper ARIA roles and live regions
 * - **Semantic Colors**: Color-coded by severity level
 * - **Title Support**: Optional title with proper heading structure
 *
 * ## Usage Examples
 * ```tsx
 * // Basic alert
 * <Alert severity="success">
 *   Your changes have been saved successfully.
 * </Alert>
 *
 * // Alert with title and dismiss
 * <Alert
 *   severity="warning"
 *   title="Warning"
 *   onClose={() => setShowAlert(false)}
 * >
 *   Please review your input before submitting.
 * </Alert>
 *
 * // Error alert with custom icon
 * <Alert
 *   severity="error"
 *   icon={<CustomErrorIcon />}
 * >
 *   An error occurred while processing your request.
 * </Alert>
 * ```
 *
 * ## Keyboard Navigation
 * - **Tab**: Moves focus to close button (if present)
 * - **Space/Enter**: Activates close button
 * - **Escape**: Closes dismissible alerts
 *
 * ## Accessibility Features
 * - `role="alert"` for urgent messages (error/warning)
 * - `role="status"` for informational messages (info/success)
 * - `aria-live` regions for screen reader announcements
 * - Proper heading structure when title is provided
 * - Focus management for dismissible alerts
 * - Color is not the only indicator (icons + text)
 *
 * ## Severity Guidelines
 * - **Error**: System errors, validation failures, critical issues
 * - **Warning**: Important information, potential issues
 * - **Success**: Successful operations, confirmations
 * - **Info**: General information, tips, neutral updates
 */
const meta: Meta<typeof Alert> = {
  title: 'Overlay/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A feedback message component with severity levels, dismissible option, and accessibility features.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    severity: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error'],
      description: 'The severity level of the alert',
      table: {
        defaultValue: { summary: 'info' },
      },
    },
    title: {
      control: 'text',
      description: 'Optional title for the alert',
    },
    children: {
      control: 'text',
      description: 'The alert message content',
    },
    role: {
      control: 'select',
      options: ['alert', 'status'],
      description: 'ARIA role for the alert',
      table: {
        defaultValue: { summary: 'Based on severity' },
      },
    },
    onClose: {
      action: 'closed',
      description: 'Callback when the alert is dismissed',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Severity Variants
// ============================================================================

/**
 * Info alert for general information messages.
 */
export const Info: Story = {
  args: {
    severity: 'info',
    title: 'Information',
    children: 'This is an informational message to help guide the user.',
  },
};

/**
 * Success alert for positive feedback.
 */
export const Success: Story = {
  args: {
    severity: 'success',
    title: 'Success!',
    children: 'Your changes have been saved successfully.',
  },
};

/**
 * Warning alert for cautionary messages.
 */
export const Warning: Story = {
  args: {
    severity: 'warning',
    title: 'Warning',
    children: 'Please review your input before proceeding.',
  },
};

/**
 * Error alert for error messages.
 */
export const ErrorAlert: Story = {
  args: {
    severity: 'error',
    title: 'Error',
    children: 'An error occurred while processing your request.',
  },
};

// ============================================================================
// All Severities
// ============================================================================

/**
 * All severity levels displayed together.
 */
export const AllSeverities: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}>
      <Alert severity="info" title="Information">
        This is an informational message.
      </Alert>
      <Alert severity="success" title="Success">
        Your operation completed successfully.
      </Alert>
      <Alert severity="warning" title="Warning">
        Please be careful with this action.
      </Alert>
      <Alert severity="error" title="Error">
        Something went wrong.
      </Alert>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All four severity levels displayed together for comparison.',
      },
    },
  },
};

// ============================================================================
// Dismissible Alerts
// ============================================================================

/**
 * Dismissible alert with close button.
 */
const DismissibleTemplate = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return (
      <button type="button" onClick={() => setVisible(true)}>
        Show Alert Again
      </button>
    );
  }

  return (
    <Alert severity="info" title="Dismissible Alert" onClose={() => setVisible(false)}>
      Click the close button to dismiss this alert.
    </Alert>
  );
};

export const Dismissible: Story = {
  render: () => <DismissibleTemplate />,
  parameters: {
    docs: {
      description: {
        story: 'Alert with a close button that can be dismissed by the user.',
      },
    },
  },
};

// ============================================================================
// Without Title
// ============================================================================

/**
 * Alert without a title, showing only the message.
 */
export const WithoutTitle: Story = {
  args: {
    severity: 'info',
    children: 'This alert has no title, just a message.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Alert without a title, displaying only the message content.',
      },
    },
  },
};

// ============================================================================
// Custom Icon
// ============================================================================

/**
 * Alert with a custom icon override.
 */
export const CustomIcon: Story = {
  args: {
    severity: 'info',
    title: 'Custom Icon',
    children: 'This alert uses a custom icon instead of the default.',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        style={{ width: '1.5rem', height: '1.5rem' }}
        role="img"
        aria-label="Star icon"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Alert with a custom icon that overrides the default severity icon.',
      },
    },
  },
};

// ============================================================================
// Long Content
// ============================================================================

/**
 * Alert with longer content to show text wrapping.
 */
export const LongContent: Story = {
  args: {
    severity: 'warning',
    title: 'Important Notice',
    children:
      'This is a longer alert message that demonstrates how the component handles multiple lines of text. The content should wrap properly and maintain good readability. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Alert with longer content showing proper text wrapping.',
      },
    },
  },
};

// ============================================================================
// Interactive Example
// ============================================================================

/**
 * Interactive example showing all features.
 */
const InteractiveTemplate = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      severity: 'success' as const,
      title: 'Saved',
      message: 'Your changes have been saved.',
    },
    {
      id: 2,
      severity: 'warning' as const,
      title: 'Warning',
      message: 'Session expires in 5 minutes.',
    },
    { id: 3, severity: 'error' as const, title: 'Error', message: 'Failed to load data.' },
  ]);

  const removeAlert = (id: number) => {
    setAlerts(alerts.filter((alert) => alert.id !== id));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}>
      {alerts.map((alert) => (
        <Alert
          key={alert.id}
          severity={alert.severity}
          title={alert.title}
          onClose={() => removeAlert(alert.id)}
        >
          {alert.message}
        </Alert>
      ))}
      {alerts.length === 0 && (
        <p style={{ textAlign: 'center', color: '#666' }}>All alerts dismissed!</p>
      )}
    </div>
  );
};

export const InteractiveExample: Story = {
  render: () => <InteractiveTemplate />,
  parameters: {
    docs: {
      description: {
        story: 'Interactive example with multiple dismissible alerts.',
      },
    },
  },
};
