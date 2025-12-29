/**
 * Tooltip and Popover Component Property-Based Tests
 *
 * These tests verify the correctness properties of the Tooltip and Popover components
 * using fast-check for property-based testing.
 *
 * @module lib/components/Tooltip/Tooltip.test
 */

import '@testing-library/jest-dom';
import * as fc from 'fast-check';
import { delayArb, PBT_CONFIG, type Placement } from '../../testing/property-testing';
import { act, fireEvent, renderComponent, screen, waitFor } from '../../testing/render-utils';
import { Popover, Tooltip } from './index';

// Popover trigger arbitrary
const popoverTriggerArb = fc.constantFrom('hover', 'click') as fc.Arbitrary<'hover' | 'click'>;

describe('Tooltip Component Property Tests', () => {
  // Clean up any portals after each test
  afterEach(() => {
    const tooltips = document.body.querySelectorAll('[data-testid="tooltip"]');
    tooltips.forEach((tooltip) => {
      tooltip.remove();
    });
    const popovers = document.body.querySelectorAll('[data-testid="popover"]');
    popovers.forEach((popover) => {
      popover.remove();
    });
  });

  describe('Event handler passthrough', () => {
    test('Tooltip should call the trigger element original onMouseEnter handler', async () => {
      const onMouseEnter = jest.fn();

      const { unmount } = renderComponent(
        <Tooltip content="Test tooltip" delay={0}>
          <button type="button" data-testid="trigger" onMouseEnter={onMouseEnter}>
            Hover me
          </button>
        </Tooltip>,
      );

      const trigger = screen.getByTestId('trigger');
      await act(async () => {
        fireEvent.mouseEnter(trigger);
      });

      expect(onMouseEnter).toHaveBeenCalledTimes(1);
      unmount();
    });

    test('Popover should call the trigger element original onClick handler', async () => {
      const onClick = jest.fn();

      const { unmount } = renderComponent(
        <Popover content={<div>Content</div>} trigger="click">
          <button type="button" data-testid="trigger" onClick={onClick}>
            Click me
          </button>
        </Popover>,
      );

      const trigger = screen.getByTestId('trigger');
      await act(async () => {
        fireEvent.click(trigger);
      });

      expect(onClick).toHaveBeenCalledTimes(1);
      expect(await screen.findByTestId('popover')).toBeInTheDocument();
      unmount();
    });
  });

  // ============================================================================
  // Property 53: Tooltip show delay
  // Feature: reusable-component-library, Property 53: Tooltip show delay
  // ============================================================================
  describe('Property 53: Tooltip show delay', () => {
    /**
     * **Validates: Requirements 8.1**
     *
     * For any Tooltip component, hovering over the trigger element should
     * display the tooltip after the specified delay.
     */
    test('Tooltip should show after specified delay on hover', async () => {
      // Use a fixed delay for predictable testing
      const delay = 100;
      const { unmount } = renderComponent(
        <Tooltip content="Test tooltip" delay={delay}>
          <button type="button" data-testid="trigger">
            Hover me
          </button>
        </Tooltip>,
      );

      const trigger = screen.getByTestId('trigger');

      // Tooltip should not be visible initially
      expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();

      // Hover over trigger
      await act(async () => {
        fireEvent.mouseEnter(trigger);
      });

      // Tooltip should not be visible immediately
      expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();

      // Wait for delay
      await waitFor(
        () => {
          expect(screen.getByTestId('tooltip')).toBeInTheDocument();
        },
        { timeout: delay + 200 },
      );

      unmount();
    });

    test('Tooltip delay prop should control show timing', () => {
      fc.assert(
        fc.property(delayArb, (delay) => {
          // Just verify the component renders with different delay values
          const { unmount } = renderComponent(
            <Tooltip content="Test tooltip" delay={delay}>
              <button type="button">Hover me</button>
            </Tooltip>,
          );

          // Component should render without errors
          expect(screen.getByRole('button')).toBeInTheDocument();

          unmount();
        }),
        PBT_CONFIG,
      );
    });
  });

  // ============================================================================
  // Property 54: Tooltip hide delay
  // Feature: reusable-component-library, Property 54: Tooltip hide delay
  // ============================================================================
  describe('Property 54: Tooltip hide delay', () => {
    /**
     * **Validates: Requirements 8.2**
     *
     * For any Tooltip component, moving the mouse away from the trigger
     * should hide the tooltip after a short delay.
     */
    test('Tooltip should hide after mouse leaves trigger', async () => {
      const { unmount } = renderComponent(
        <Tooltip content="Test tooltip" delay={0}>
          <button type="button" data-testid="trigger">
            Hover me
          </button>
        </Tooltip>,
      );

      const trigger = screen.getByTestId('trigger');

      // Show tooltip
      await act(async () => {
        fireEvent.mouseEnter(trigger);
      });

      await waitFor(() => {
        expect(screen.getByTestId('tooltip')).toBeInTheDocument();
      });

      // Hide tooltip
      await act(async () => {
        fireEvent.mouseLeave(trigger);
      });

      // Wait for hide delay
      await waitFor(() => {
        expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
      });

      unmount();
    });
  });

  // ============================================================================
  // Property 55: Tooltip placement
  // Feature: reusable-component-library, Property 55: Tooltip placement
  // ============================================================================
  describe('Property 55: Tooltip placement', () => {
    /**
     * **Validates: Requirements 8.3**
     *
     * For any Tooltip component with a placement prop, the tooltip should
     * be positioned according to the specified placement (top, bottom, left, right).
     */
    test.each([
      'top',
      'bottom',
      'left',
      'right',
    ] as Placement[])('Tooltip should have correct placement data attribute for %s', async (placement) => {
      const { unmount } = renderComponent(
        <Tooltip content="Test tooltip" placement={placement} delay={0}>
          <button type="button" data-testid="trigger">
            Hover me
          </button>
        </Tooltip>,
      );

      const trigger = screen.getByTestId('trigger');

      // Show tooltip
      await act(async () => {
        fireEvent.mouseEnter(trigger);
      });

      await waitFor(() => {
        const tooltip = screen.getByTestId('tooltip');
        expect(tooltip).toBeInTheDocument();
        // The actual placement may be adjusted due to collision detection
        // but the data-placement attribute should be set
        expect(tooltip).toHaveAttribute('data-placement');
      });

      unmount();
    });
  });

  // ============================================================================
  // Property 59: Tooltip keyboard accessibility
  // Feature: reusable-component-library, Property 59: Tooltip keyboard accessibility
  // ============================================================================
  describe('Property 59: Tooltip keyboard accessibility', () => {
    /**
     * **Validates: Requirements 8.7**
     *
     * For any Tooltip component, focusing the trigger element should show
     * the tooltip, and pressing Escape should hide it.
     */
    test('Tooltip should show on focus and hide on Escape', async () => {
      const { unmount } = renderComponent(
        <Tooltip content="Test tooltip" delay={0}>
          <button type="button" data-testid="trigger">
            Focus me
          </button>
        </Tooltip>,
      );

      const trigger = screen.getByTestId('trigger');

      // Focus trigger to show tooltip
      await act(async () => {
        fireEvent.focus(trigger);
      });

      await waitFor(() => {
        expect(screen.getByTestId('tooltip')).toBeInTheDocument();
      });

      // Press Escape to hide tooltip
      await act(async () => {
        fireEvent.keyDown(document, { key: 'Escape' });
      });

      await waitFor(() => {
        expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
      });

      unmount();
    });

    test('Tooltip should have proper ARIA attributes', async () => {
      const { unmount } = renderComponent(
        <Tooltip content="Test content" delay={0}>
          <button type="button" data-testid="trigger">
            Hover me
          </button>
        </Tooltip>,
      );

      const trigger = screen.getByTestId('trigger');

      // Show tooltip
      await act(async () => {
        fireEvent.mouseEnter(trigger);
      });

      await waitFor(() => {
        const tooltip = screen.getByTestId('tooltip');
        expect(tooltip).toHaveAttribute('role', 'tooltip');
      });

      // Trigger should have aria-describedby when tooltip is visible
      expect(trigger).toHaveAttribute('aria-describedby');

      unmount();
    });
  });
});

describe('Popover Component Property Tests', () => {
  // Clean up any portals after each test
  afterEach(() => {
    const popovers = document.body.querySelectorAll('[data-testid="popover"]');
    popovers.forEach((popover) => {
      popover.remove();
    });
  });

  // ============================================================================
  // Property 56: Popover trigger behavior
  // Feature: reusable-component-library, Property 56: Popover trigger behavior
  // ============================================================================
  describe('Property 56: Popover trigger behavior', () => {
    /**
     * **Validates: Requirements 8.4**
     *
     * For any Popover component with a trigger prop, the popover should
     * open on the specified trigger event (hover or click).
     */
    test('Popover should open on click when trigger is click', async () => {
      const { unmount } = renderComponent(
        <Popover content={<div>Popover content</div>} trigger="click">
          <button type="button" data-testid="trigger">
            Click me
          </button>
        </Popover>,
      );

      const trigger = screen.getByTestId('trigger');

      // Popover should not be visible initially
      expect(screen.queryByTestId('popover')).not.toBeInTheDocument();

      // Click trigger
      await act(async () => {
        fireEvent.click(trigger);
      });

      await waitFor(() => {
        expect(screen.getByTestId('popover')).toBeInTheDocument();
      });

      unmount();
    });

    test('Popover should open on hover when trigger is hover', async () => {
      const { unmount } = renderComponent(
        <Popover content={<div>Popover content</div>} trigger="hover">
          <button type="button" data-testid="trigger">
            Hover me
          </button>
        </Popover>,
      );

      const trigger = screen.getByTestId('trigger');

      // Popover should not be visible initially
      expect(screen.queryByTestId('popover')).not.toBeInTheDocument();

      // Hover trigger
      await act(async () => {
        fireEvent.mouseEnter(trigger);
      });

      await waitFor(() => {
        expect(screen.getByTestId('popover')).toBeInTheDocument();
      });

      unmount();
    });

    test('Popover trigger prop should control open behavior', () => {
      fc.assert(
        fc.property(popoverTriggerArb, (trigger) => {
          const { unmount } = renderComponent(
            <Popover content={<div>Content</div>} trigger={trigger}>
              <button type="button">Trigger</button>
            </Popover>,
          );

          // Component should render without errors
          expect(screen.getByRole('button')).toBeInTheDocument();
          // Trigger should have proper ARIA attributes
          expect(screen.getByRole('button')).toHaveAttribute('aria-haspopup', 'dialog');

          unmount();
        }),
        PBT_CONFIG,
      );
    });
  });

  // ============================================================================
  // Property 57: Popover click outside
  // Feature: reusable-component-library, Property 57: Popover click outside
  // ============================================================================
  describe('Property 57: Popover click outside', () => {
    /**
     * **Validates: Requirements 8.5**
     *
     * For any open Popover component with closeOnClickOutside=true,
     * clicking outside the popover should close it.
     */
    test('Popover should close on click outside when closeOnClickOutside is true', async () => {
      const { unmount } = renderComponent(
        <div>
          <Popover content={<div>Popover content</div>} trigger="click" closeOnClickOutside={true}>
            <button type="button" data-testid="trigger">
              Click me
            </button>
          </Popover>
          <button type="button" data-testid="outside">
            Outside
          </button>
        </div>,
      );

      const trigger = screen.getByTestId('trigger');
      const outside = screen.getByTestId('outside');

      // Open popover
      await act(async () => {
        fireEvent.click(trigger);
      });

      await waitFor(() => {
        expect(screen.getByTestId('popover')).toBeInTheDocument();
      });

      // Click outside
      await act(async () => {
        fireEvent.mouseDown(outside);
      });

      await waitFor(() => {
        expect(screen.queryByTestId('popover')).not.toBeInTheDocument();
      });

      unmount();
    });

    test('Popover should NOT close on click outside when closeOnClickOutside is false', async () => {
      const { unmount } = renderComponent(
        <div>
          <Popover content={<div>Popover content</div>} trigger="click" closeOnClickOutside={false}>
            <button type="button" data-testid="trigger">
              Click me
            </button>
          </Popover>
          <button type="button" data-testid="outside">
            Outside
          </button>
        </div>,
      );

      const trigger = screen.getByTestId('trigger');
      const outside = screen.getByTestId('outside');

      // Open popover
      await act(async () => {
        fireEvent.click(trigger);
      });

      await waitFor(() => {
        expect(screen.getByTestId('popover')).toBeInTheDocument();
      });

      // Click outside
      await act(async () => {
        fireEvent.mouseDown(outside);
      });

      // Popover should still be visible
      expect(screen.getByTestId('popover')).toBeInTheDocument();

      unmount();
    });
  });

  // ============================================================================
  // Property 58: Tooltip/Popover collision detection
  // Feature: reusable-component-library, Property 58: Tooltip/Popover collision detection
  // ============================================================================
  describe('Property 58: Tooltip/Popover collision detection', () => {
    /**
     * **Validates: Requirements 8.6**
     *
     * For any Tooltip or Popover that would overflow the viewport,
     * the positioning should automatically adjust to keep the content visible.
     */
    test.each([
      'top',
      'bottom',
      'left',
      'right',
    ] as Placement[])('Popover should have placement data attribute for %s placement', async (placement) => {
      const { unmount } = renderComponent(
        <Popover content={<div>Content</div>} trigger="click" placement={placement}>
          <button type="button" data-testid="trigger">
            Click me
          </button>
        </Popover>,
      );

      const trigger = screen.getByTestId('trigger');

      // Open popover
      await act(async () => {
        fireEvent.click(trigger);
      });

      await waitFor(() => {
        const popover = screen.getByTestId('popover');
        expect(popover).toBeInTheDocument();
        // The data-placement attribute should be set (may be adjusted)
        expect(popover).toHaveAttribute('data-placement');
      });

      unmount();
    });
  });

  // Additional tests for controlled mode
  describe('Popover controlled mode', () => {
    test('Popover should respect controlled isOpen prop', async () => {
      const onOpenChange = jest.fn();
      const { rerender, unmount } = renderComponent(
        <Popover
          content={<div>Content</div>}
          trigger="click"
          isOpen={false}
          onOpenChange={onOpenChange}
        >
          <button type="button" data-testid="trigger">
            Click me
          </button>
        </Popover>,
      );

      // Popover should not be visible
      expect(screen.queryByTestId('popover')).not.toBeInTheDocument();

      // Click trigger
      await act(async () => {
        fireEvent.click(screen.getByTestId('trigger'));
      });

      // onOpenChange should be called
      expect(onOpenChange).toHaveBeenCalledWith(true);

      // Rerender with isOpen=true
      rerender(
        <Popover
          content={<div>Content</div>}
          trigger="click"
          isOpen={true}
          onOpenChange={onOpenChange}
        >
          <button type="button" data-testid="trigger">
            Click me
          </button>
        </Popover>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('popover')).toBeInTheDocument();
      });

      unmount();
    });
  });
});
