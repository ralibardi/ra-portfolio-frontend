/**
 * Notification Component Property-Based Tests
 *
 * These tests verify the correctness properties of the Notification and
 * NotificationContainer components using fast-check for property-based testing.
 *
 * @module lib/components/Alert/Notification.property.test
 */

import '@testing-library/jest-dom';
import * as fc from 'fast-check';
import { alertSeverityArb, labelTextArb, PBT_CONFIG } from '../../testing/property-testing';
import { act, fireEvent, renderComponent, screen, waitFor } from '../../testing/render-utils';
import {
  Notification,
  NotificationContainer,
  NotificationProvider,
  useNotifications,
} from './index';

// Test component that uses the notification context
const TestNotificationTrigger = ({
  severity,
  title,
  message,
  duration,
}: {
  severity: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  duration?: number;
}) => {
  const { addNotification, notifications } = useNotifications();

  return (
    <div>
      <button
        type="button"
        data-testid="add-notification"
        onClick={() => addNotification({ severity, title, message, duration })}
      >
        Add Notification
      </button>
      <span data-testid="notification-count">{notifications.length}</span>
    </div>
  );
};

describe('Notification Component Property Tests', () => {
  // ============================================================================
  // Property 48: Notification auto-dismiss
  // Feature: reusable-component-library, Property 48: Notification auto-dismiss
  // ============================================================================
  describe('Property 48: Notification auto-dismiss', () => {
    /**
     * **Validates: Requirements 7.3**
     *
     * For any Notification component with a duration prop, the notification
     * should automatically enter exiting state after the specified duration.
     */
    test('Notification should enter exiting state after specified duration', async () => {
      jest.useFakeTimers();

      const handleClose = jest.fn();
      const duration = 3000;

      renderComponent(
        <Notification
          severity="info"
          message="Test message"
          duration={duration}
          onClose={handleClose}
        />,
      );

      // Notification should be visible initially
      const notification = screen.getByTestId('notification');
      expect(notification).toBeInTheDocument();
      expect(notification).not.toHaveClass('exiting');

      // Fast-forward time
      act(() => {
        jest.advanceTimersByTime(duration);
      });

      // Notification should be in exiting state
      await waitFor(() => {
        expect(notification).toHaveClass('exiting');
      });

      // Simulate animation end to trigger onClose
      fireEvent.animationEnd(notification);

      await waitFor(() => {
        expect(handleClose).toHaveBeenCalledTimes(1);
      });

      jest.useRealTimers();
    });

    test('Notification should pause auto-dismiss on hover', async () => {
      jest.useFakeTimers();

      const handleClose = jest.fn();
      const duration = 3000;

      renderComponent(
        <Notification
          severity="info"
          message="Test message"
          duration={duration}
          onClose={handleClose}
        />,
      );

      const notification = screen.getByTestId('notification');

      // Hover over notification
      fireEvent.mouseEnter(notification);

      // Fast-forward time past duration
      act(() => {
        jest.advanceTimersByTime(duration + 1000);
      });

      // Notification should not be in exiting state due to hover
      expect(notification).not.toHaveClass('exiting');

      // Mouse leave should restart timer
      fireEvent.mouseLeave(notification);

      act(() => {
        jest.advanceTimersByTime(duration);
      });

      // Now it should be exiting
      await waitFor(() => {
        expect(notification).toHaveClass('exiting');
      });

      jest.useRealTimers();
    });
  });

  // ============================================================================
  // Property 49: Notification stacking
  // Feature: reusable-component-library, Property 49: Notification stacking
  // ============================================================================
  describe('Property 49: Notification stacking', () => {
    /**
     * **Validates: Requirements 7.4**
     *
     * For any NotificationContainer with multiple notifications, all
     * notifications should be rendered and positioned in a stack.
     */
    test('NotificationContainer should stack multiple notifications', async () => {
      const { unmount } = renderComponent(
        <NotificationProvider maxNotifications={5}>
          <TestNotificationTrigger severity="info" message="Test message" />
          <NotificationContainer />
        </NotificationProvider>,
      );

      const addButton = screen.getByTestId('add-notification');

      // Add multiple notifications
      await act(async () => {
        fireEvent.click(addButton);
        fireEvent.click(addButton);
        fireEvent.click(addButton);
      });

      // All notifications should be rendered
      const notifications = screen.getAllByTestId('notification');
      expect(notifications.length).toBe(3);

      unmount();
    });

    test('NotificationContainer should respect maxNotifications limit', async () => {
      const maxNotifications = 3;

      const { unmount } = renderComponent(
        <NotificationProvider maxNotifications={maxNotifications}>
          <TestNotificationTrigger severity="info" message="Test message" />
          <NotificationContainer />
        </NotificationProvider>,
      );

      const addButton = screen.getByTestId('add-notification');

      // Add more notifications than the limit
      await act(async () => {
        for (let i = 0; i < 5; i++) {
          fireEvent.click(addButton);
        }
      });

      // Only maxNotifications should be rendered
      const notifications = screen.getAllByTestId('notification');
      expect(notifications.length).toBe(maxNotifications);

      unmount();
    });
  });

  // ============================================================================
  // Property 50: Notification removal
  // Feature: reusable-component-library, Property 50: Notification removal
  // ============================================================================
  describe('Property 50: Notification removal', () => {
    /**
     * **Validates: Requirements 7.5**
     *
     * For any Notification that is dismissed, the notification should be
     * removed from the DOM after the exit animation completes.
     */
    test('Notification should enter exiting state when close button is clicked', async () => {
      const handleClose = jest.fn();

      renderComponent(
        <Notification severity="info" message="Test message" onClose={handleClose} />,
      );

      const notification = screen.getByTestId('notification');
      const closeButton = screen.getByTestId('notification-close-button');

      // Click close button
      fireEvent.click(closeButton);

      // Notification should be in exiting state
      await waitFor(() => {
        expect(notification).toHaveClass('exiting');
      });

      // Simulate animation end to trigger onClose
      fireEvent.animationEnd(notification);

      await waitFor(() => {
        expect(handleClose).toHaveBeenCalledTimes(1);
      });
    });

    test('Notification in container should be removed when dismissed', async () => {
      const { unmount } = renderComponent(
        <NotificationProvider>
          <TestNotificationTrigger severity="info" message="Test message" />
          <NotificationContainer />
        </NotificationProvider>,
      );

      const addButton = screen.getByTestId('add-notification');

      // Add a notification
      await act(async () => {
        fireEvent.click(addButton);
      });

      // Notification should be visible
      const notification = screen.getByTestId('notification');
      expect(notification).toBeInTheDocument();

      // Click close button
      const closeButton = screen.getByTestId('notification-close-button');
      fireEvent.click(closeButton);

      // Notification should be in exiting state
      await waitFor(() => {
        expect(notification).toHaveClass('exiting');
      });

      // Simulate animation end to trigger removal
      fireEvent.animationEnd(notification);

      // Wait for notification to be removed
      await waitFor(() => {
        expect(screen.queryByTestId('notification')).not.toBeInTheDocument();
      });

      unmount();
    });
  });

  // ============================================================================
  // Notification severity rendering
  // ============================================================================
  describe('Notification severity rendering', () => {
    test('Notification should display severity-appropriate styling', () => {
      fc.assert(
        fc.property(alertSeverityArb, (severity) => {
          const { container, unmount } = renderComponent(
            <Notification severity={severity} message="Test message" />,
          );

          const notification = container.querySelector('[data-testid="notification"]');
          expect(notification).toHaveAttribute('data-severity', severity);
          unmount();
        }),
        PBT_CONFIG,
      );
    });
  });

  // ============================================================================
  // Notification title rendering
  // ============================================================================
  describe('Notification title rendering', () => {
    test('Notification should render title when provided', () => {
      fc.assert(
        fc.property(
          fc.record({
            severity: alertSeverityArb,
            title: labelTextArb,
          }),
          ({ severity, title }) => {
            const { container, unmount } = renderComponent(
              <Notification severity={severity} title={title} message="Test message" />,
            );

            const heading = container.querySelector('h4');
            expect(heading).toBeInTheDocument();
            expect(heading?.textContent).toBe(title);
            unmount();
          },
        ),
        PBT_CONFIG,
      );
    });

    test('Notification without title should not render heading', () => {
      fc.assert(
        fc.property(alertSeverityArb, (severity) => {
          const { container, unmount } = renderComponent(
            <Notification severity={severity} message="Test message" />,
          );

          const heading = container.querySelector('h4');
          expect(heading).not.toBeInTheDocument();
          unmount();
        }),
        PBT_CONFIG,
      );
    });
  });

  // ============================================================================
  // NotificationContainer positioning
  // ============================================================================
  describe('NotificationContainer positioning', () => {
    const positions: Array<'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'> = [
      'top-right',
      'top-left',
      'bottom-right',
      'bottom-left',
    ];

    test('NotificationContainer should apply position data attribute', async () => {
      for (const position of positions) {
        const { unmount } = renderComponent(
          <NotificationProvider position={position}>
            <TestNotificationTrigger severity="info" message="Test message" />
            <NotificationContainer />
          </NotificationProvider>,
        );

        const addButton = screen.getByTestId('add-notification');

        await act(async () => {
          fireEvent.click(addButton);
        });

        const container = screen.getByTestId('notification-container');
        expect(container).toHaveAttribute('data-position', position);

        unmount();
      }
    });
  });
});
