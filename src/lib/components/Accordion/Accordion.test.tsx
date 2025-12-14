/**
 * Accordion Component Property-Based Tests
 *
 * These tests verify the correctness properties of the Accordion component
 * using fast-check for property-based testing.
 *
 * @module lib/components/Accordion/Accordion.test
 */

import '@testing-library/jest-dom';
import * as fc from 'fast-check';
import { accordionItemsArb, PBT_CONFIG } from '../../testing/property-testing';
import { fireEvent, renderComponent, screen } from '../../testing/render-utils';
import type { AccordionItem } from '../types';
import { Accordion } from './index';

// Helper to create accordion items with content
const createAccordionItems = (
  items: Array<{ id: string; header: string; disabled: boolean }>,
): AccordionItem[] =>
  items.map((item) => ({
    ...item,
    content: <p data-testid={`content-${item.id}`}>Content for {item.header}</p>,
  }));

describe('Accordion Component Property Tests', () => {
  // ============================================================================
  // Property 20: Accordion expand/collapse
  // Feature: reusable-component-library, Property 20: Accordion expand/collapse
  // ============================================================================
  describe('Property 20: Accordion expand/collapse', () => {
    /**
     * **Validates: Requirements 3.1, 3.2**
     *
     * For any Accordion component, clicking a section header should toggle
     * that section between expanded and collapsed states.
     */
    test('Clicking accordion header should toggle expanded state', () => {
      fc.assert(
        fc.property(accordionItemsArb, (itemsData) => {
          // Filter out disabled items for this test
          const enabledItems = itemsData.filter((item) => !item.disabled);
          if (enabledItems.length === 0) return true; // Skip if no enabled items

          const items = createAccordionItems(itemsData);
          const { unmount } = renderComponent(<Accordion items={items} />);

          // Pick a random enabled item to test
          const testItem = enabledItems[0];
          const header = screen.getByTestId(`accordion-header-${testItem.id}`);
          const panel = screen.getByTestId(`accordion-panel-${testItem.id}`);

          // Initially collapsed
          expect(header).toHaveAttribute('aria-expanded', 'false');
          expect(panel).toHaveAttribute('hidden');

          // Click to expand
          fireEvent.click(header);
          expect(header).toHaveAttribute('aria-expanded', 'true');
          expect(panel).not.toHaveAttribute('hidden');

          // Click to collapse
          fireEvent.click(header);
          expect(header).toHaveAttribute('aria-expanded', 'false');
          expect(panel).toHaveAttribute('hidden');

          unmount();
          return true;
        }),
        PBT_CONFIG,
      );
    });
  });

  // ============================================================================
  // Property 21: Multiple expansion mode
  // Feature: reusable-component-library, Property 21: Multiple expansion mode
  // ============================================================================
  describe('Property 21: Multiple expansion mode', () => {
    /**
     * **Validates: Requirements 3.3**
     *
     * For any Accordion component with allowMultiple=true, expanding a new
     * section should not collapse previously expanded sections.
     */
    test('Multiple expansion mode should allow multiple sections to be expanded', () => {
      fc.assert(
        fc.property(
          accordionItemsArb.filter((items) => items.filter((i) => !i.disabled).length >= 2),
          (itemsData) => {
            const enabledItems = itemsData.filter((item) => !item.disabled);
            const items = createAccordionItems(itemsData);
            const { unmount } = renderComponent(<Accordion items={items} allowMultiple />);

            // Expand first enabled item
            const firstHeader = screen.getByTestId(`accordion-header-${enabledItems[0].id}`);
            fireEvent.click(firstHeader);
            expect(firstHeader).toHaveAttribute('aria-expanded', 'true');

            // Expand second enabled item
            const secondHeader = screen.getByTestId(`accordion-header-${enabledItems[1].id}`);
            fireEvent.click(secondHeader);
            expect(secondHeader).toHaveAttribute('aria-expanded', 'true');

            // First item should still be expanded
            expect(firstHeader).toHaveAttribute('aria-expanded', 'true');

            unmount();
            return true;
          },
        ),
        PBT_CONFIG,
      );
    });
  });

  // ============================================================================
  // Property 22: Exclusive expansion mode
  // Feature: reusable-component-library, Property 22: Exclusive expansion mode
  // ============================================================================
  describe('Property 22: Exclusive expansion mode', () => {
    /**
     * **Validates: Requirements 3.4**
     *
     * For any Accordion component with allowMultiple=false, expanding a new
     * section should automatically collapse all other expanded sections.
     */
    test('Exclusive expansion mode should collapse other sections when expanding', () => {
      fc.assert(
        fc.property(
          accordionItemsArb.filter((items) => items.filter((i) => !i.disabled).length >= 2),
          (itemsData) => {
            const enabledItems = itemsData.filter((item) => !item.disabled);
            const items = createAccordionItems(itemsData);
            const { unmount } = renderComponent(<Accordion items={items} allowMultiple={false} />);

            // Expand first enabled item
            const firstHeader = screen.getByTestId(`accordion-header-${enabledItems[0].id}`);
            fireEvent.click(firstHeader);
            expect(firstHeader).toHaveAttribute('aria-expanded', 'true');

            // Expand second enabled item
            const secondHeader = screen.getByTestId(`accordion-header-${enabledItems[1].id}`);
            fireEvent.click(secondHeader);
            expect(secondHeader).toHaveAttribute('aria-expanded', 'true');

            // First item should now be collapsed
            expect(firstHeader).toHaveAttribute('aria-expanded', 'false');

            unmount();
            return true;
          },
        ),
        PBT_CONFIG,
      );
    });
  });

  // ============================================================================
  // Property 23: Accordion ARIA updates
  // Feature: reusable-component-library, Property 23: Accordion ARIA updates
  // ============================================================================
  describe('Property 23: Accordion ARIA updates', () => {
    /**
     * **Validates: Requirements 3.5**
     *
     * For any Accordion section, the aria-expanded attribute should be true
     * when expanded and false when collapsed.
     */
    test('ARIA attributes should update correctly on expansion state changes', () => {
      fc.assert(
        fc.property(accordionItemsArb, (itemsData) => {
          const enabledItems = itemsData.filter((item) => !item.disabled);
          if (enabledItems.length === 0) return true;

          const items = createAccordionItems(itemsData);
          const { unmount } = renderComponent(<Accordion items={items} />);

          const testItem = enabledItems[0];
          const header = screen.getByTestId(`accordion-header-${testItem.id}`);
          const panel = screen.getByTestId(`accordion-panel-${testItem.id}`);

          // Check initial ARIA state
          expect(header).toHaveAttribute('aria-expanded', 'false');
          expect(header).toHaveAttribute('aria-controls', panel.id);
          expect(panel).toHaveAttribute('aria-labelledby', header.id);
          // Panel is a <section> element which has implicit region role

          // Expand and check ARIA state
          fireEvent.click(header);
          expect(header).toHaveAttribute('aria-expanded', 'true');

          // Collapse and check ARIA state
          fireEvent.click(header);
          expect(header).toHaveAttribute('aria-expanded', 'false');

          unmount();
          return true;
        }),
        PBT_CONFIG,
      );
    });
  });

  // ============================================================================
  // Property 24: Accordion keyboard navigation
  // Feature: reusable-component-library, Property 24: Accordion keyboard navigation
  // ============================================================================
  describe('Property 24: Accordion keyboard navigation', () => {
    /**
     * **Validates: Requirements 3.6**
     *
     * For any Accordion component, pressing arrow keys should move focus
     * between accordion headers.
     */
    test('Arrow keys should navigate between accordion headers', () => {
      fc.assert(
        fc.property(
          accordionItemsArb.filter((items) => items.filter((i) => !i.disabled).length >= 2),
          (itemsData) => {
            const enabledItems = itemsData.filter((item) => !item.disabled);
            const items = createAccordionItems(itemsData);
            const { unmount } = renderComponent(<Accordion items={items} />);

            // Focus first enabled header
            const firstHeader = screen.getByTestId(`accordion-header-${enabledItems[0].id}`);
            firstHeader.focus();
            expect(document.activeElement).toBe(firstHeader);

            // Press ArrowDown to move to next header
            fireEvent.keyDown(firstHeader, { key: 'ArrowDown' });
            const secondHeader = screen.getByTestId(`accordion-header-${enabledItems[1].id}`);
            expect(document.activeElement).toBe(secondHeader);

            // Press ArrowUp to move back to first header
            fireEvent.keyDown(secondHeader, { key: 'ArrowUp' });
            expect(document.activeElement).toBe(firstHeader);

            unmount();
            return true;
          },
        ),
        PBT_CONFIG,
      );
    });

    test('Home and End keys should navigate to first and last headers', () => {
      fc.assert(
        fc.property(
          accordionItemsArb.filter((items) => items.filter((i) => !i.disabled).length >= 2),
          (itemsData) => {
            const enabledItems = itemsData.filter((item) => !item.disabled);
            const items = createAccordionItems(itemsData);
            const { unmount } = renderComponent(<Accordion items={items} />);

            // Focus first enabled header
            const firstHeader = screen.getByTestId(`accordion-header-${enabledItems[0].id}`);
            const lastHeader = screen.getByTestId(
              `accordion-header-${enabledItems[enabledItems.length - 1].id}`,
            );

            firstHeader.focus();

            // Press End to move to last header
            fireEvent.keyDown(firstHeader, { key: 'End' });
            expect(document.activeElement).toBe(lastHeader);

            // Press Home to move to first header
            fireEvent.keyDown(lastHeader, { key: 'Home' });
            expect(document.activeElement).toBe(firstHeader);

            unmount();
            return true;
          },
        ),
        PBT_CONFIG,
      );
    });
  });

  // ============================================================================
  // Property 25: Accordion default state
  // Feature: reusable-component-library, Property 25: Accordion default state
  // ============================================================================
  describe('Property 25: Accordion default state', () => {
    /**
     * **Validates: Requirements 3.7**
     *
     * For any Accordion component with defaultExpanded prop, the specified
     * sections should be expanded on initial render.
     */
    test('defaultExpanded prop should set initial expanded state', () => {
      fc.assert(
        fc.property(
          accordionItemsArb.filter((items) => items.length >= 2),
          (itemsData) => {
            const items = createAccordionItems(itemsData);
            // Use first item as default expanded
            const defaultExpandedId = itemsData[0].id;

            const { unmount } = renderComponent(
              <Accordion items={items} defaultExpanded={[defaultExpandedId]} />,
            );

            // First item should be expanded
            const firstHeader = screen.getByTestId(`accordion-header-${defaultExpandedId}`);
            const firstPanel = screen.getByTestId(`accordion-panel-${defaultExpandedId}`);
            expect(firstHeader).toHaveAttribute('aria-expanded', 'true');
            expect(firstPanel).not.toHaveAttribute('hidden');

            // Other items should be collapsed
            for (let i = 1; i < itemsData.length; i++) {
              const header = screen.getByTestId(`accordion-header-${itemsData[i].id}`);
              expect(header).toHaveAttribute('aria-expanded', 'false');
            }

            unmount();
            return true;
          },
        ),
        PBT_CONFIG,
      );
    });

    test('Multiple items can be default expanded with allowMultiple', () => {
      fc.assert(
        fc.property(
          accordionItemsArb.filter((items) => items.length >= 2),
          (itemsData) => {
            const items = createAccordionItems(itemsData);
            // Use first two items as default expanded
            const defaultExpandedIds = [itemsData[0].id, itemsData[1].id];

            const { unmount } = renderComponent(
              <Accordion items={items} defaultExpanded={defaultExpandedIds} allowMultiple />,
            );

            // Both items should be expanded
            for (const id of defaultExpandedIds) {
              const header = screen.getByTestId(`accordion-header-${id}`);
              expect(header).toHaveAttribute('aria-expanded', 'true');
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
  // Additional Tests: onChange callback
  // ============================================================================
  describe('onChange callback', () => {
    test('onChange should be called with updated expanded IDs', () => {
      fc.assert(
        fc.property(accordionItemsArb, (itemsData) => {
          const enabledItems = itemsData.filter((item) => !item.disabled);
          if (enabledItems.length === 0) return true;

          const items = createAccordionItems(itemsData);
          const handleChange = jest.fn();
          const { unmount } = renderComponent(<Accordion items={items} onChange={handleChange} />);

          const testItem = enabledItems[0];
          const header = screen.getByTestId(`accordion-header-${testItem.id}`);

          // Expand
          fireEvent.click(header);
          expect(handleChange).toHaveBeenLastCalledWith([testItem.id]);

          // Collapse
          fireEvent.click(header);
          expect(handleChange).toHaveBeenLastCalledWith([]);

          unmount();
          return true;
        }),
        PBT_CONFIG,
      );
    });
  });

  // ============================================================================
  // Additional Tests: Disabled items
  // ============================================================================
  describe('Disabled items', () => {
    test('Disabled items should not be expandable', () => {
      const items: AccordionItem[] = [
        { id: '1', header: 'Enabled', content: <p>Content 1</p>, disabled: false },
        { id: '2', header: 'Disabled', content: <p>Content 2</p>, disabled: true },
      ];

      const { unmount } = renderComponent(<Accordion items={items} />);

      const disabledHeader = screen.getByTestId('accordion-header-2');
      const disabledPanel = screen.getByTestId('accordion-panel-2');

      // Should have disabled attribute
      expect(disabledHeader).toBeDisabled();
      expect(disabledHeader).toHaveAttribute('aria-disabled', 'true');

      // Click should not expand
      fireEvent.click(disabledHeader);
      expect(disabledHeader).toHaveAttribute('aria-expanded', 'false');
      expect(disabledPanel).toHaveAttribute('hidden');

      unmount();
    });
  });
});
