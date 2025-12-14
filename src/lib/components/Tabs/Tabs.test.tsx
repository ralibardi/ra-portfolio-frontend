/**
 * Tabs Component Property-Based Tests
 *
 * These tests verify the correctness properties of the Tabs component
 * using fast-check for property-based testing.
 *
 * @module lib/components/Tabs/Tabs.test
 */

import '@testing-library/jest-dom';
import * as fc from 'fast-check';
import { PBT_CONFIG, tabItemsArb, tabsOrientationArb } from '../../testing/property-testing';
import { fireEvent, renderComponent, screen } from '../../testing/render-utils';
import type { TabItem } from '../types';
import { Tabs } from './index';

// Helper to create tab items with content
const createTabItems = (
  items: Array<{ id: string; label: string; disabled: boolean }>,
): TabItem[] =>
  items.map((item) => ({
    ...item,
    content: <p data-testid={`content-${item.id}`}>Content for {item.label}</p>,
  }));

describe('Tabs Component Property Tests', () => {
  // ============================================================================
  // Property 39: Tabs rendering
  // Feature: reusable-component-library, Property 39: Tabs rendering
  // ============================================================================
  describe('Property 39: Tabs rendering', () => {
    /**
     * **Validates: Requirements 6.1**
     *
     * For any Tabs component with items array, all tab buttons and
     * corresponding panels should be rendered.
     */
    test('All tab buttons and panels should be rendered', () => {
      fc.assert(
        fc.property(tabItemsArb, (itemsData) => {
          const items = createTabItems(itemsData);
          const { unmount } = renderComponent(<Tabs items={items} />);

          // Verify all tabs are rendered
          for (const item of itemsData) {
            const tab = screen.getByTestId(`tab-${item.id}`);
            expect(tab).toBeInTheDocument();
            // Use textContent comparison to handle whitespace properly
            expect(tab.textContent).toBe(item.label);
            expect(tab).toHaveAttribute('role', 'tab');
          }

          // Verify tablist is rendered
          const tabList = screen.getByTestId('tabs-list');
          expect(tabList).toHaveAttribute('role', 'tablist');

          // Verify panels container is rendered
          const panels = screen.getByTestId('tabs-panels');
          expect(panels).toBeInTheDocument();

          unmount();
          return true;
        }),
        PBT_CONFIG,
      );
    });
  });

  // ============================================================================
  // Property 40: Tab panel visibility
  // Feature: reusable-component-library, Property 40: Tab panel visibility
  // ============================================================================
  describe('Property 40: Tab panel visibility', () => {
    /**
     * **Validates: Requirements 6.2**
     *
     * For any Tabs component, only the panel corresponding to the selected
     * tab should be visible; all other panels should be hidden.
     */
    test('Only selected tab panel should be visible', () => {
      fc.assert(
        fc.property(tabItemsArb, (itemsData) => {
          const items = createTabItems(itemsData);
          const { unmount } = renderComponent(<Tabs items={items} />);

          // First tab should be selected by default
          const firstPanel = screen.getByTestId(`panel-${itemsData[0].id}`);
          expect(firstPanel).not.toHaveAttribute('hidden');

          // All other panels should be hidden
          for (let i = 1; i < itemsData.length; i++) {
            const panel = screen.getByTestId(`panel-${itemsData[i].id}`);
            expect(panel).toHaveAttribute('hidden');
          }

          unmount();
          return true;
        }),
        PBT_CONFIG,
      );
    });

    test('Clicking a tab should show its panel and hide others', () => {
      fc.assert(
        fc.property(
          tabItemsArb.filter((items) => items.filter((i) => !i.disabled).length >= 2),
          (itemsData) => {
            const enabledItems = itemsData.filter((item) => !item.disabled);
            const items = createTabItems(itemsData);
            const { unmount } = renderComponent(<Tabs items={items} />);

            // Click second enabled tab
            const secondEnabledIndex = itemsData.findIndex((i) => i.id === enabledItems[1].id);
            const secondTab = screen.getByTestId(`tab-${enabledItems[1].id}`);
            fireEvent.click(secondTab);

            // Second tab's panel should be visible
            const secondPanel = screen.getByTestId(`panel-${enabledItems[1].id}`);
            expect(secondPanel).not.toHaveAttribute('hidden');

            // All other panels should be hidden
            for (let i = 0; i < itemsData.length; i++) {
              if (i !== secondEnabledIndex) {
                const panel = screen.getByTestId(`panel-${itemsData[i].id}`);
                expect(panel).toHaveAttribute('hidden');
              }
            }

            unmount();
            return true;
          },
        ),
        PBT_CONFIG,
      );
    });
  });

  // ============================================================================
  // Property 41: Tabs keyboard navigation
  // Feature: reusable-component-library, Property 41: Tabs keyboard navigation
  // ============================================================================
  describe('Property 41: Tabs keyboard navigation', () => {
    /**
     * **Validates: Requirements 6.3**
     *
     * For any Tabs component, pressing arrow keys should move focus
     * between tab buttons.
     */
    test('Arrow keys should navigate between tabs (horizontal)', () => {
      fc.assert(
        fc.property(
          tabItemsArb.filter((items) => items.filter((i) => !i.disabled).length >= 2),
          (itemsData) => {
            const enabledItems = itemsData.filter((item) => !item.disabled);
            const items = createTabItems(itemsData);
            const { unmount } = renderComponent(<Tabs items={items} orientation="horizontal" />);

            // Focus first enabled tab
            const firstTab = screen.getByTestId(`tab-${enabledItems[0].id}`);
            firstTab.focus();
            expect(document.activeElement).toBe(firstTab);

            // Press ArrowRight to move to next tab
            fireEvent.keyDown(firstTab, { key: 'ArrowRight' });
            const secondTab = screen.getByTestId(`tab-${enabledItems[1].id}`);
            expect(document.activeElement).toBe(secondTab);

            // Press ArrowLeft to move back to first tab
            fireEvent.keyDown(secondTab, { key: 'ArrowLeft' });
            expect(document.activeElement).toBe(firstTab);

            unmount();
            return true;
          },
        ),
        PBT_CONFIG,
      );
    });

    test('Arrow keys should navigate between tabs (vertical)', () => {
      fc.assert(
        fc.property(
          tabItemsArb.filter((items) => items.filter((i) => !i.disabled).length >= 2),
          (itemsData) => {
            const enabledItems = itemsData.filter((item) => !item.disabled);
            const items = createTabItems(itemsData);
            const { unmount } = renderComponent(<Tabs items={items} orientation="vertical" />);

            // Focus first enabled tab
            const firstTab = screen.getByTestId(`tab-${enabledItems[0].id}`);
            firstTab.focus();
            expect(document.activeElement).toBe(firstTab);

            // Press ArrowDown to move to next tab
            fireEvent.keyDown(firstTab, { key: 'ArrowDown' });
            const secondTab = screen.getByTestId(`tab-${enabledItems[1].id}`);
            expect(document.activeElement).toBe(secondTab);

            // Press ArrowUp to move back to first tab
            fireEvent.keyDown(secondTab, { key: 'ArrowUp' });
            expect(document.activeElement).toBe(firstTab);

            unmount();
            return true;
          },
        ),
        PBT_CONFIG,
      );
    });

    test('Home and End keys should navigate to first and last tabs', () => {
      fc.assert(
        fc.property(
          tabItemsArb.filter((items) => items.filter((i) => !i.disabled).length >= 2),
          (itemsData) => {
            const enabledItems = itemsData.filter((item) => !item.disabled);
            const items = createTabItems(itemsData);
            const { unmount } = renderComponent(<Tabs items={items} />);

            // Focus first enabled tab
            const firstTab = screen.getByTestId(`tab-${enabledItems[0].id}`);
            const lastTab = screen.getByTestId(`tab-${enabledItems[enabledItems.length - 1].id}`);

            firstTab.focus();

            // Press End to move to last tab
            fireEvent.keyDown(firstTab, { key: 'End' });
            expect(document.activeElement).toBe(lastTab);

            // Press Home to move to first tab
            fireEvent.keyDown(lastTab, { key: 'Home' });
            expect(document.activeElement).toBe(firstTab);

            unmount();
            return true;
          },
        ),
        PBT_CONFIG,
      );
    });
  });

  // ============================================================================
  // Property 42: Tabs default selection
  // Feature: reusable-component-library, Property 42: Tabs default selection
  // ============================================================================
  describe('Property 42: Tabs default selection', () => {
    /**
     * **Validates: Requirements 6.4**
     *
     * For any Tabs component with a defaultIndex prop, the tab at that
     * index should be selected on initial render.
     */
    test('defaultIndex prop should set initial selected tab', () => {
      fc.assert(
        fc.property(
          tabItemsArb.chain((items) =>
            fc.record({
              items: fc.constant(items),
              defaultIndex: fc.integer({ min: 0, max: items.length - 1 }),
            }),
          ),
          ({ items: itemsData, defaultIndex }) => {
            const items = createTabItems(itemsData);
            const { unmount } = renderComponent(<Tabs items={items} defaultIndex={defaultIndex} />);

            // Tab at defaultIndex should be selected
            const selectedTab = screen.getByTestId(`tab-${itemsData[defaultIndex].id}`);
            expect(selectedTab).toHaveAttribute('aria-selected', 'true');

            // Panel at defaultIndex should be visible
            const selectedPanel = screen.getByTestId(`panel-${itemsData[defaultIndex].id}`);
            expect(selectedPanel).not.toHaveAttribute('hidden');

            // Other tabs should not be selected
            for (let i = 0; i < itemsData.length; i++) {
              if (i !== defaultIndex) {
                const tab = screen.getByTestId(`tab-${itemsData[i].id}`);
                expect(tab).toHaveAttribute('aria-selected', 'false');
              }
            }

            unmount();
            return true;
          },
        ),
        PBT_CONFIG,
      );
    });
  });

  // ============================================================================
  // Property 43: Tabs ARIA updates
  // Feature: reusable-component-library, Property 43: Tabs ARIA updates
  // ============================================================================
  describe('Property 43: Tabs ARIA updates', () => {
    /**
     * **Validates: Requirements 6.5**
     *
     * For any Tabs component, the selected tab should have aria-selected="true"
     * and all other tabs should have aria-selected="false".
     */
    test('ARIA attributes should update correctly on tab selection', () => {
      fc.assert(
        fc.property(
          tabItemsArb.filter((items) => items.filter((i) => !i.disabled).length >= 2),
          (itemsData) => {
            const enabledItems = itemsData.filter((item) => !item.disabled);
            const items = createTabItems(itemsData);
            const { unmount } = renderComponent(<Tabs items={items} />);

            // First tab should be selected initially
            const firstTab = screen.getByTestId(`tab-${itemsData[0].id}`);
            expect(firstTab).toHaveAttribute('aria-selected', 'true');
            expect(firstTab).toHaveAttribute('tabindex', '0');

            // Other tabs should not be selected
            for (let i = 1; i < itemsData.length; i++) {
              const tab = screen.getByTestId(`tab-${itemsData[i].id}`);
              expect(tab).toHaveAttribute('aria-selected', 'false');
              expect(tab).toHaveAttribute('tabindex', '-1');
            }

            // Click second enabled tab
            const secondTab = screen.getByTestId(`tab-${enabledItems[1].id}`);
            fireEvent.click(secondTab);

            // Second tab should now be selected
            expect(secondTab).toHaveAttribute('aria-selected', 'true');
            expect(secondTab).toHaveAttribute('tabindex', '0');

            // First tab should no longer be selected
            expect(firstTab).toHaveAttribute('aria-selected', 'false');
            expect(firstTab).toHaveAttribute('tabindex', '-1');

            unmount();
            return true;
          },
        ),
        PBT_CONFIG,
      );
    });

    test('Tab and panel should have proper ARIA relationships', () => {
      fc.assert(
        fc.property(tabItemsArb, (itemsData) => {
          const items = createTabItems(itemsData);
          const { unmount } = renderComponent(<Tabs items={items} />);

          for (const item of itemsData) {
            const tab = screen.getByTestId(`tab-${item.id}`);
            const panel = screen.getByTestId(`panel-${item.id}`);

            // Tab should control panel
            expect(tab).toHaveAttribute('aria-controls', panel.id);

            // Panel should be labelled by tab
            expect(panel).toHaveAttribute('aria-labelledby', tab.id);

            // Panel should have tabpanel role
            expect(panel).toHaveAttribute('role', 'tabpanel');
          }

          unmount();
          return true;
        }),
        PBT_CONFIG,
      );
    });
  });

  // ============================================================================
  // Property 44: Tabs orientation styling
  // Feature: reusable-component-library, Property 44: Tabs orientation styling
  // ============================================================================
  describe('Property 44: Tabs orientation styling', () => {
    /**
     * **Validates: Requirements 6.6**
     *
     * For any Tabs component with orientation prop, the component should
     * have the corresponding orientation CSS class applied.
     */
    test('Orientation prop should apply correct styling', () => {
      fc.assert(
        fc.property(fc.tuple(tabItemsArb, tabsOrientationArb), ([itemsData, orientation]) => {
          const items = createTabItems(itemsData);
          const { unmount } = renderComponent(<Tabs items={items} orientation={orientation} />);

          const tabs = screen.getByTestId('tabs');
          expect(tabs).toHaveAttribute('data-orientation', orientation);

          const tabList = screen.getByTestId('tabs-list');
          expect(tabList).toHaveAttribute('aria-orientation', orientation);

          unmount();
          return true;
        }),
        PBT_CONFIG,
      );
    });
  });

  // ============================================================================
  // Property 45: Disabled tabs behavior
  // Feature: reusable-component-library, Property 45: Disabled tabs behavior
  // ============================================================================
  describe('Property 45: Disabled tabs behavior', () => {
    /**
     * **Validates: Requirements 6.7**
     *
     * For any Tabs component with disabled tabs, clicking a disabled tab
     * should not change the selected tab.
     */
    test('Disabled tabs should not be selectable', () => {
      // Create items with at least one disabled tab
      const items: TabItem[] = [
        { id: '1', label: 'Enabled Tab', content: <p>Content 1</p>, disabled: false },
        { id: '2', label: 'Disabled Tab', content: <p>Content 2</p>, disabled: true },
        { id: '3', label: 'Another Enabled', content: <p>Content 3</p>, disabled: false },
      ];

      const { unmount } = renderComponent(<Tabs items={items} />);

      // First tab should be selected
      const firstTab = screen.getByTestId('tab-1');
      const disabledTab = screen.getByTestId('tab-2');

      expect(firstTab).toHaveAttribute('aria-selected', 'true');

      // Disabled tab should have disabled attribute
      expect(disabledTab).toBeDisabled();
      expect(disabledTab).toHaveAttribute('aria-disabled', 'true');

      // Click disabled tab
      fireEvent.click(disabledTab);

      // First tab should still be selected
      expect(firstTab).toHaveAttribute('aria-selected', 'true');
      expect(disabledTab).toHaveAttribute('aria-selected', 'false');

      // First panel should still be visible
      const firstPanel = screen.getByTestId('panel-1');
      const disabledPanel = screen.getByTestId('panel-2');
      expect(firstPanel).not.toHaveAttribute('hidden');
      expect(disabledPanel).toHaveAttribute('hidden');

      unmount();
    });

    test('Keyboard navigation should skip disabled tabs', () => {
      const items: TabItem[] = [
        { id: '1', label: 'First', content: <p>Content 1</p>, disabled: false },
        { id: '2', label: 'Disabled', content: <p>Content 2</p>, disabled: true },
        { id: '3', label: 'Third', content: <p>Content 3</p>, disabled: false },
      ];

      const { unmount } = renderComponent(<Tabs items={items} />);

      // Focus first tab
      const firstTab = screen.getByTestId('tab-1');
      const thirdTab = screen.getByTestId('tab-3');

      firstTab.focus();
      expect(document.activeElement).toBe(firstTab);

      // Press ArrowRight - should skip disabled tab and go to third
      fireEvent.keyDown(firstTab, { key: 'ArrowRight' });
      expect(document.activeElement).toBe(thirdTab);

      // Press ArrowLeft - should skip disabled tab and go back to first
      fireEvent.keyDown(thirdTab, { key: 'ArrowLeft' });
      expect(document.activeElement).toBe(firstTab);

      unmount();
    });
  });

  // ============================================================================
  // Additional Tests: Controlled mode
  // ============================================================================
  describe('Controlled mode', () => {
    test('selectedIndex prop should control selected tab', () => {
      const items: TabItem[] = [
        { id: '1', label: 'Tab 1', content: <p>Content 1</p> },
        { id: '2', label: 'Tab 2', content: <p>Content 2</p> },
        { id: '3', label: 'Tab 3', content: <p>Content 3</p> },
      ];

      const handleChange = jest.fn();
      const { rerender, unmount } = renderComponent(
        <Tabs items={items} selectedIndex={0} onChange={handleChange} />,
      );

      // First tab should be selected
      expect(screen.getByTestId('tab-1')).toHaveAttribute('aria-selected', 'true');

      // Click second tab
      fireEvent.click(screen.getByTestId('tab-2'));

      // onChange should be called
      expect(handleChange).toHaveBeenCalledWith(1);

      // But first tab should still be selected (controlled mode)
      expect(screen.getByTestId('tab-1')).toHaveAttribute('aria-selected', 'true');

      // Rerender with new selectedIndex
      rerender(<Tabs items={items} selectedIndex={1} onChange={handleChange} />);

      // Now second tab should be selected
      expect(screen.getByTestId('tab-2')).toHaveAttribute('aria-selected', 'true');

      unmount();
    });
  });

  // ============================================================================
  // Additional Tests: onChange callback
  // ============================================================================
  describe('onChange callback', () => {
    test('onChange should be called with new index when tab is clicked', () => {
      fc.assert(
        fc.property(
          tabItemsArb.filter((items) => items.filter((i) => !i.disabled).length >= 2),
          (itemsData) => {
            const enabledItems = itemsData.filter((item) => !item.disabled);
            const items = createTabItems(itemsData);
            const handleChange = jest.fn();
            const { unmount } = renderComponent(<Tabs items={items} onChange={handleChange} />);

            // Click second enabled tab
            const secondEnabledIndex = itemsData.findIndex((i) => i.id === enabledItems[1].id);
            const secondTab = screen.getByTestId(`tab-${enabledItems[1].id}`);
            fireEvent.click(secondTab);

            expect(handleChange).toHaveBeenCalledWith(secondEnabledIndex);

            unmount();
            return true;
          },
        ),
        PBT_CONFIG,
      );
    });
  });
});
