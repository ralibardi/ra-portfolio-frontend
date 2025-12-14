import cn from 'classnames';
import { memo, useCallback, useId, useMemo, useRef, useState } from 'react';
import type { AccordionProps } from '../../types';
import styles from '../assets/Accordion.module.scss';

/**
 * Accordion Component
 *
 * A collapsible content component that allows users to expand and collapse
 * sections. Supports single or multiple expansion modes, keyboard navigation,
 * and smooth animations.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Accordion
 *   items={[
 *     { id: '1', header: 'Section 1', content: <p>Content 1</p> },
 *     { id: '2', header: 'Section 2', content: <p>Content 2</p> },
 *   ]}
 * />
 *
 * // Multiple expansion
 * <Accordion items={items} allowMultiple />
 *
 * // With default expanded
 * <Accordion items={items} defaultExpanded={['1', '2']} />
 * ```
 */
const Accordion = memo(function Accordion({
  items,
  allowMultiple = false,
  defaultExpanded = [],
  onChange,
  'aria-label': ariaLabel,
}: AccordionProps) {
  const accordionId = useId();
  const [expandedIds, setExpandedIds] = useState<string[]>(defaultExpanded);
  const headerRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Check if an item is expanded
  const isExpanded = useCallback((id: string) => expandedIds.includes(id), [expandedIds]);

  // Toggle expansion state
  const toggleItem = useCallback(
    (id: string) => {
      setExpandedIds((prev) => {
        let newExpanded: string[];

        if (prev.includes(id)) {
          // Collapse the item
          newExpanded = prev.filter((itemId) => itemId !== id);
        } else if (allowMultiple) {
          // Expand the item (multiple mode)
          newExpanded = [...prev, id];
        } else {
          // Expand the item (single mode - collapse others)
          newExpanded = [id];
        }

        // Call onChange callback
        onChange?.(newExpanded);
        return newExpanded;
      });
    },
    [allowMultiple, onChange],
  );

  // Get enabled items for keyboard navigation
  const enabledItems = useMemo(() => items.filter((item) => !item.disabled), [items]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>, currentId: string) => {
      const currentIndex = enabledItems.findIndex((item) => item.id === currentId);
      if (currentIndex === -1) return;

      let nextIndex: number | null = null;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          nextIndex = (currentIndex + 1) % enabledItems.length;
          break;
        case 'ArrowUp':
          event.preventDefault();
          nextIndex = (currentIndex - 1 + enabledItems.length) % enabledItems.length;
          break;
        case 'Home':
          event.preventDefault();
          nextIndex = 0;
          break;
        case 'End':
          event.preventDefault();
          nextIndex = enabledItems.length - 1;
          break;
        default:
          return;
      }

      if (nextIndex !== null) {
        const nextItem = enabledItems[nextIndex];
        const nextButton = headerRefs.current.get(nextItem.id);
        nextButton?.focus();
      }
    },
    [enabledItems],
  );

  // Set header ref
  const setHeaderRef = useCallback((id: string, element: HTMLButtonElement | null) => {
    if (element) {
      headerRefs.current.set(id, element);
    } else {
      headerRefs.current.delete(id);
    }
  }, []);

  return (
    <section className={styles.accordion} aria-label={ariaLabel} data-testid="accordion">
      {items.map((item) => {
        const expanded = isExpanded(item.id);
        const headerId = `${accordionId}-header-${item.id}`;
        const panelId = `${accordionId}-panel-${item.id}`;

        return (
          <div
            key={item.id}
            className={cn(styles.item, {
              [styles['item--expanded']]: expanded,
              [styles['item--disabled']]: item.disabled,
            })}
            data-testid={`accordion-item-${item.id}`}
          >
            {/* Header Button */}
            <button
              ref={(el) => setHeaderRef(item.id, el)}
              id={headerId}
              type="button"
              className={cn(styles.header, {
                [styles['header--expanded']]: expanded,
                [styles['header--disabled']]: item.disabled,
              })}
              onClick={() => !item.disabled && toggleItem(item.id)}
              onKeyDown={(e) => handleKeyDown(e, item.id)}
              aria-expanded={expanded}
              aria-controls={panelId}
              aria-disabled={item.disabled}
              disabled={item.disabled}
              data-testid={`accordion-header-${item.id}`}
            >
              <span className={styles.headerContent}>{item.header}</span>
              <span
                className={cn(styles.icon, {
                  [styles['icon--expanded']]: expanded,
                })}
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  focusable="false"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </button>

            {/* Content Panel */}
            <section
              id={panelId}
              aria-labelledby={headerId}
              className={cn(styles.panel, {
                [styles['panel--expanded']]: expanded,
              })}
              hidden={!expanded}
              data-testid={`accordion-panel-${item.id}`}
            >
              <div className={styles.panelContent}>{item.content}</div>
            </section>
          </div>
        );
      })}
    </section>
  );
});

Accordion.displayName = 'Accordion';

export default Accordion;
