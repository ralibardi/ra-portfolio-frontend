/**
 * Alert and Notification Component Property-Based Tests
 *
 * These tests verify the correctness properties of the Alert and Notification
 * components using fast-check for property-based testing.
 *
 * @module lib/components/Alert/Alert.property.test
 */

import '@testing-library/jest-dom';
import * as fc from 'fast-check';
import { alertSeverityArb, labelTextArb, PBT_CONFIG } from '../../testing/property-testing';
import { fireEvent, renderComponent, screen } from '../../testing/render-utils';
import { Alert } from './index';

describe('Alert Component Property Tests', () => {
  // ============================================================================
  // Property 46: Alert severity rendering
  // Feature: reusable-component-library, Property 46: Alert severity rendering
  // ============================================================================
  describe('Property 46: Alert severity rendering', () => {
    /**
     * **Validates: Requirements 7.1**
     *
     * For any Alert component with a severity prop, the alert should have
     * the corresponding severity CSS class and icon.
     */
    test('Alert severity prop should always apply corresponding CSS class', () => {
      fc.assert(
        fc.property(alertSeverityArb, (severity) => {
          const { container, unmount } = renderComponent(
            <Alert severity={severity}>Test message</Alert>,
          );
          const alert = container.querySelector('[data-testid="alert"]');

          // Alert should have the severity-specific data attribute
          expect(alert).toHaveAttribute('data-severity', severity);
          unmount();
        }),
        PBT_CONFIG,
      );
    });
  });

  // ============================================================================
  // Property 47: Alert dismissal
  // Feature: reusable-component-library, Property 47: Alert dismissal
  // ============================================================================
  describe('Property 47: Alert dismissal', () => {
    /**
     * **Validates: Requirements 7.2**
     *
     * For any Alert component with an onClose handler, clicking the close
     * button should call the onClose handler.
     */
    test('Alert close button should call onClose handler when clicked', () => {
      fc.assert(
        fc.property(alertSeverityArb, (severity) => {
          const handleClose = jest.fn();
          const { unmount } = renderComponent(
            <Alert severity={severity} onClose={handleClose}>
              Test message
            </Alert>,
          );

          const closeButton = screen.getByTestId('alert-close-button');
          fireEvent.click(closeButton);

          expect(handleClose).toHaveBeenCalledTimes(1);
          unmount();
        }),
        PBT_CONFIG,
      );
    });

    test('Alert without onClose should not render close button', () => {
      fc.assert(
        fc.property(alertSeverityArb, (severity) => {
          const { container, unmount } = renderComponent(
            <Alert severity={severity}>Test message</Alert>,
          );

          const closeButton = container.querySelector('[data-testid="alert-close-button"]');
          expect(closeButton).not.toBeInTheDocument();
          unmount();
        }),
        PBT_CONFIG,
      );
    });
  });

  // ============================================================================
  // Property 51: Alert icon rendering
  // Feature: reusable-component-library, Property 51: Alert icon rendering
  // ============================================================================
  describe('Property 51: Alert icon rendering', () => {
    /**
     * **Validates: Requirements 7.6**
     *
     * For any Alert component with a severity prop, the appropriate icon
     * for that severity should be displayed.
     */
    test('Alert should display severity-appropriate icon', () => {
      fc.assert(
        fc.property(alertSeverityArb, (severity) => {
          const { container, unmount } = renderComponent(
            <Alert severity={severity}>Test message</Alert>,
          );

          // Icon container should be present
          const iconContainer = container.querySelector('[class*="iconContainer"]');
          expect(iconContainer).toBeInTheDocument();

          // SVG icon should be present
          const icon = iconContainer?.querySelector('svg');
          expect(icon).toBeInTheDocument();
          unmount();
        }),
        PBT_CONFIG,
      );
    });

    test('Alert should allow custom icon override', () => {
      const CustomIcon = () => <span data-testid="custom-icon">Custom</span>;

      fc.assert(
        fc.property(alertSeverityArb, (severity) => {
          const { unmount } = renderComponent(
            <Alert severity={severity} icon={<CustomIcon />}>
              Test message
            </Alert>,
          );

          expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
          unmount();
        }),
        PBT_CONFIG,
      );
    });
  });

  // ============================================================================
  // Property 52: Alert title semantics
  // Feature: reusable-component-library, Property 52: Alert title semantics
  // ============================================================================
  describe('Property 52: Alert title semantics', () => {
    /**
     * **Validates: Requirements 7.7**
     *
     * For any Alert component with a title prop, the title should be
     * rendered using a heading element (h3).
     */
    test('Alert title should be rendered as heading element', () => {
      fc.assert(
        fc.property(
          fc.record({
            severity: alertSeverityArb,
            title: labelTextArb,
          }),
          ({ severity, title }) => {
            const { container, unmount } = renderComponent(
              <Alert severity={severity} title={title}>
                Test message
              </Alert>,
            );

            // Title should be rendered as h3
            const heading = container.querySelector('h3');
            expect(heading).toBeInTheDocument();
            expect(heading?.textContent).toBe(title);
            unmount();
          },
        ),
        PBT_CONFIG,
      );
    });

    test('Alert without title should not render heading element', () => {
      fc.assert(
        fc.property(alertSeverityArb, (severity) => {
          const { container, unmount } = renderComponent(
            <Alert severity={severity}>Test message</Alert>,
          );

          const heading = container.querySelector('h3');
          expect(heading).not.toBeInTheDocument();
          unmount();
        }),
        PBT_CONFIG,
      );
    });
  });

  // ============================================================================
  // Alert ARIA attributes
  // ============================================================================
  describe('Alert ARIA attributes', () => {
    test('Alert should have appropriate ARIA role based on severity', () => {
      // Error and warning should use role="alert" by default
      const alertSeverities: Array<'error' | 'warning'> = ['error', 'warning'];
      for (const severity of alertSeverities) {
        const { container, unmount } = renderComponent(
          <Alert severity={severity}>Test message</Alert>,
        );
        const alert = container.querySelector('[data-testid="alert"]');
        expect(alert).toHaveAttribute('role', 'alert');
        unmount();
      }

      // Info and success should use role="status" by default
      const statusSeverities: Array<'info' | 'success'> = ['info', 'success'];
      for (const severity of statusSeverities) {
        const { container, unmount } = renderComponent(
          <Alert severity={severity}>Test message</Alert>,
        );
        const alert = container.querySelector('[data-testid="alert"]');
        expect(alert).toHaveAttribute('role', 'status');
        unmount();
      }
    });

    test('Alert should allow custom role override', () => {
      fc.assert(
        fc.property(alertSeverityArb, (severity) => {
          const { container, unmount } = renderComponent(
            <Alert severity={severity} role="status">
              Test message
            </Alert>,
          );
          const alert = container.querySelector('[data-testid="alert"]');
          expect(alert).toHaveAttribute('role', 'status');
          unmount();
        }),
        PBT_CONFIG,
      );
    });
  });
});
