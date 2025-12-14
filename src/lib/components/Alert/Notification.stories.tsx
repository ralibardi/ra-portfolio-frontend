import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '../Button';
import {
  Notification,
  NotificationContainer,
  NotificationProvider,
  useNotifications,
} from './index';

/**
 * The Notification component displays toast-style notifications with auto-dismiss
 * functionality. Use with NotificationProvider and NotificationContainer for
 * global notification management.
 *
 * ## Features
 * - **Auto-dismiss**: Configurable duration for automatic dismissal
 * - **Pause on Hover**: Timer pauses when hovering over notification
 * - **Stacking**: Multiple notifications stack in a container
 * - **Animations**: Smooth enter/exit animations
 * - **Positioning**: Four corner positions available
 */
const meta: Meta<typeof Notification> = {
  title: 'Overlay/Notification',
  component: Notification,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A toast-style notification component with auto-dismiss, animations, and stacking support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    severity: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error'],
      description: 'The severity level of the notification',
    },
    title: {
      control: 'text',
      description: 'Optional title for the notification',
    },
    message: {
      control: 'text',
      description: 'The notification message',
    },
    duration: {
      control: 'number',
      description: 'Auto-dismiss duration in milliseconds (0 to disable)',
      table: {
        defaultValue: { summary: '5000' },
      },
    },
    onClose: {
      action: 'closed',
      description: 'Callback when the notification is dismissed',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Basic Notifications
// ============================================================================

/**
 * Info notification for general information.
 */
export const Info: Story = {
  args: {
    severity: 'info',
    title: 'Information',
    message: 'This is an informational notification.',
    duration: 0, // Disable auto-dismiss for demo
  },
};

/**
 * Success notification for positive feedback.
 */
export const Success: Story = {
  args: {
    severity: 'success',
    title: 'Success!',
    message: 'Your changes have been saved.',
    duration: 0,
  },
};

/**
 * Warning notification for cautionary messages.
 */
export const Warning: Story = {
  args: {
    severity: 'warning',
    title: 'Warning',
    message: 'Please review your input.',
    duration: 0,
  },
};

/**
 * Error notification for error messages.
 */
export const ErrorNotification: Story = {
  args: {
    severity: 'error',
    title: 'Error',
    message: 'An error occurred.',
    duration: 0,
  },
};

// ============================================================================
// Auto-dismiss Demo
// ============================================================================

/**
 * Notification with auto-dismiss functionality.
 */
const AutoDismissTemplate = () => {
  const [visible, setVisible] = useState(true);
  const [key, setKey] = useState(0);

  const showNotification = () => {
    setKey((k) => k + 1);
    setVisible(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
      <Button onClick={showNotification}>Show Notification (3s auto-dismiss)</Button>
      {visible && (
        <Notification
          key={key}
          severity="success"
          title="Auto-dismiss"
          message="This notification will disappear in 3 seconds. Hover to pause."
          duration={3000}
          onClose={() => setVisible(false)}
        />
      )}
    </div>
  );
};

export const AutoDismiss: Story = {
  render: () => <AutoDismissTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          'Notification that automatically dismisses after 3 seconds. Hover over it to pause the timer.',
      },
    },
  },
};

// ============================================================================
// Notification Stacking
// ============================================================================

/**
 * Helper component to trigger notifications.
 */
const NotificationTrigger = () => {
  const { addNotification } = useNotifications();
  const [count, setCount] = useState(0);

  const severities: Array<'info' | 'success' | 'warning' | 'error'> = [
    'info',
    'success',
    'warning',
    'error',
  ];

  const addRandomNotification = () => {
    const severity = severities[count % severities.length];
    setCount((c) => c + 1);
    addNotification({
      severity,
      title: `${severity.charAt(0).toUpperCase() + severity.slice(1)} #${count + 1}`,
      message: `This is notification number ${count + 1}.`,
      duration: 5000,
    });
  };

  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <Button onClick={addRandomNotification}>Add Notification</Button>
      <Button
        variant="secondary"
        onClick={() => {
          addNotification({
            severity: 'success',
            title: 'Success',
            message: 'Operation completed!',
            duration: 5000,
          });
        }}
      >
        Success
      </Button>
      <Button
        variant="danger"
        onClick={() => {
          addNotification({
            severity: 'error',
            title: 'Error',
            message: 'Something went wrong!',
            duration: 5000,
          });
        }}
      >
        Error
      </Button>
    </div>
  );
};

/**
 * Demonstrates notification stacking with NotificationProvider.
 */
const StackingTemplate = () => {
  return (
    <NotificationProvider position="top-right" maxNotifications={5}>
      <div style={{ padding: '2rem' }}>
        <h3 style={{ marginTop: 0 }}>Notification Stacking Demo</h3>
        <p>Click the buttons to add notifications. Maximum 5 notifications will be shown.</p>
        <NotificationTrigger />
      </div>
      <NotificationContainer />
    </NotificationProvider>
  );
};

export const Stacking: Story = {
  render: () => <StackingTemplate />,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'Demonstrates notification stacking with a maximum of 5 notifications. Older notifications are removed when the limit is reached.',
      },
    },
  },
};

// ============================================================================
// Position Variants
// ============================================================================

/**
 * Helper component for position demo.
 */
const PositionTrigger = ({
  position,
}: {
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}) => {
  const { addNotification } = useNotifications();

  return (
    <Button
      onClick={() => {
        addNotification({
          severity: 'info',
          title: `Position: ${position}`,
          message: 'Notification appears in the specified corner.',
          duration: 3000,
        });
      }}
    >
      Show at {position}
    </Button>
  );
};

/**
 * Demonstrates different notification positions.
 */
const PositionsTemplate = () => {
  const [position, setPosition] = useState<
    'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  >('top-right');

  return (
    <NotificationProvider position={position} maxNotifications={3}>
      <div style={{ padding: '2rem', minHeight: '300px' }}>
        <h3 style={{ marginTop: 0 }}>Position Demo</h3>
        <p>Select a position and click the button to show a notification.</p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <Button
            variant={position === 'top-right' ? 'primary' : 'ghost'}
            onClick={() => setPosition('top-right')}
          >
            Top Right
          </Button>
          <Button
            variant={position === 'top-left' ? 'primary' : 'ghost'}
            onClick={() => setPosition('top-left')}
          >
            Top Left
          </Button>
          <Button
            variant={position === 'bottom-right' ? 'primary' : 'ghost'}
            onClick={() => setPosition('bottom-right')}
          >
            Bottom Right
          </Button>
          <Button
            variant={position === 'bottom-left' ? 'primary' : 'ghost'}
            onClick={() => setPosition('bottom-left')}
          >
            Bottom Left
          </Button>
        </div>
        <PositionTrigger position={position} />
      </div>
      <NotificationContainer />
    </NotificationProvider>
  );
};

export const Positions: Story = {
  render: () => <PositionsTemplate />,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Demonstrates the four available notification positions.',
      },
    },
  },
};

// ============================================================================
// Without Title
// ============================================================================

/**
 * Notification without a title.
 */
export const WithoutTitle: Story = {
  args: {
    severity: 'info',
    message: 'This notification has no title, just a message.',
    duration: 0,
  },
  parameters: {
    docs: {
      description: {
        story: 'Notification without a title, displaying only the message.',
      },
    },
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Notification severity="info" title="Info" message="Informational notification." />
      <Notification severity="success" title="Success" message="Success notification." />
      <Notification severity="warning" title="Warning" message="Warning notification." />
      <Notification severity="error" title="Error" message="Error notification." />
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
