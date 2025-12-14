import cn from 'classnames';
import { memo, useCallback, useId, useMemo } from 'react';
import type { BreadcrumbProps } from '../../types';
import styles from '../assets/Breadcrumb.module.scss';

/**
 * Default separator component
 */
const DefaultSeparator = () => (
  <span className={styles.separator} aria-hidden="true">
    /
  </span>
);

/**
 * Breadcrumb Component
 *
 * A navigation component that displays the current page location within
 * a hierarchical structure. Supports custom separators, responsive truncation,
 * and keyboard navigation.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Breadcrumb
 *   items={[
 *     { label: 'Home', href: '/' },
 *     { label: 'Products', href: '/products' },
 *     { label: 'Current Page' },
 *   ]}
 * />
 *
 * // With custom separator
 * <Breadcrumb items={items} separator={<span>›</span>} />
 *
 * // With truncation
 * <Breadcrumb items={items} maxItems={3} />
 * ```
 */
const Breadcrumb = memo(function Breadcrumb({
  items,
  separator,
  maxItems,
  'aria-label': ariaLabel = 'Breadcrumb',
}: BreadcrumbProps) {
  const breadcrumbId = useId();

  // Calculate visible items based on maxItems
  const visibleItems = useMemo(() => {
    if (!maxItems || items.length <= maxItems) {
      return { items, truncated: false, hiddenCount: 0 };
    }

    // Show first item, ellipsis, and last (maxItems - 1) items
    const firstItem = items[0];
    const lastItems = items.slice(-(maxItems - 1));
    const hiddenCount = items.length - maxItems;

    return {
      items: [firstItem, ...lastItems],
      truncated: true,
      hiddenCount,
    };
  }, [items, maxItems]);

  // Handle item click
  const handleItemClick = useCallback((item: (typeof items)[0], isLast: boolean) => {
    // Don't navigate for the current page (last item)
    if (isLast) return;

    if (item.onClick) {
      item.onClick();
    }
  }, []);

  // Render separator
  const renderSeparator = useCallback(
    (key: string) => {
      if (separator) {
        return (
          <li key={key} className={styles.separatorItem} aria-hidden="true">
            <span className={styles.separator}>{separator}</span>
          </li>
        );
      }
      return (
        <li key={key} className={styles.separatorItem} aria-hidden="true">
          <DefaultSeparator />
        </li>
      );
    },
    [separator],
  );

  // Render ellipsis for truncated items
  const renderEllipsis = useCallback(
    (hiddenCount: number) => (
      <li
        key={`${breadcrumbId}-ellipsis`}
        className={styles.ellipsisItem}
        aria-label={`${hiddenCount} more items`}
      >
        <span className={styles.ellipsis}>…</span>
      </li>
    ),
    [breadcrumbId],
  );

  // Render current page item (last item)
  const renderCurrentItem = useCallback(
    (item: (typeof items)[0], itemId: string, actualIndex: number) => (
      <li key={itemId} className={styles.item} data-testid={`breadcrumb-item-${actualIndex}`}>
        <span
          className={cn(styles.link, styles['link--current'])}
          aria-current="page"
          data-testid={`breadcrumb-current-${actualIndex}`}
        >
          {item.label}
        </span>
      </li>
    ),
    [],
  );

  // Render link item with href
  const renderLinkItem = useCallback(
    (item: (typeof items)[0], itemId: string, actualIndex: number) => (
      <li key={itemId} className={styles.item} data-testid={`breadcrumb-item-${actualIndex}`}>
        <a
          href={item.href}
          className={styles.link}
          onClick={(e) => {
            if (item.onClick) {
              e.preventDefault();
              item.onClick();
            }
          }}
          data-testid={`breadcrumb-link-${actualIndex}`}
        >
          {item.label}
        </a>
      </li>
    ),
    [],
  );

  // Render button item (onClick without href)
  const renderButtonItem = useCallback(
    (item: (typeof items)[0], itemId: string, actualIndex: number, isLast: boolean) => (
      <li key={itemId} className={styles.item} data-testid={`breadcrumb-item-${actualIndex}`}>
        <button
          type="button"
          className={cn(styles.link, styles['link--button'])}
          onClick={() => handleItemClick(item, isLast)}
          data-testid={`breadcrumb-button-${actualIndex}`}
        >
          {item.label}
        </button>
      </li>
    ),
    [handleItemClick],
  );

  // Render text-only item
  const renderTextItem = useCallback(
    (item: (typeof items)[0], itemId: string, actualIndex: number) => (
      <li key={itemId} className={styles.item} data-testid={`breadcrumb-item-${actualIndex}`}>
        <span className={styles.link}>{item.label}</span>
      </li>
    ),
    [],
  );

  // Render a breadcrumb item
  const renderItem = useCallback(
    (item: (typeof items)[0], isLast: boolean, actualIndex: number) => {
      const itemId = `${breadcrumbId}-item-${actualIndex}`;

      if (isLast) {
        return renderCurrentItem(item, itemId, actualIndex);
      }
      if (item.href) {
        return renderLinkItem(item, itemId, actualIndex);
      }
      if (item.onClick) {
        return renderButtonItem(item, itemId, actualIndex, isLast);
      }
      return renderTextItem(item, itemId, actualIndex);
    },
    [breadcrumbId, renderCurrentItem, renderLinkItem, renderButtonItem, renderTextItem],
  );

  // Calculate actual index for truncated items
  const getActualIndex = useCallback(
    (index: number, displayItemsLength: number, truncated: boolean) => {
      if (truncated && index > 0) {
        return items.length - (displayItemsLength - index);
      }
      return index;
    },
    [items.length],
  );

  // Add separators and ellipsis between items
  const addSeparatorsAndEllipsis = useCallback(
    (
      elements: React.ReactNode[],
      index: number,
      truncated: boolean,
      isFirst: boolean,
      hiddenCount: number,
    ) => {
      if (truncated && isFirst) {
        elements.push(renderSeparator(`${breadcrumbId}-sep-${index}`));
        elements.push(renderEllipsis(hiddenCount));
      }
      const sepKey = truncated && isFirst ? 'after-ellipsis' : String(index);
      elements.push(renderSeparator(`${breadcrumbId}-sep-${sepKey}`));
    },
    [breadcrumbId, renderSeparator, renderEllipsis],
  );

  // Build the breadcrumb list
  const breadcrumbElements = useMemo(() => {
    const elements: React.ReactNode[] = [];
    const { items: displayItems, truncated, hiddenCount } = visibleItems;

    displayItems.forEach((item, index) => {
      const isLast = index === displayItems.length - 1;
      const isFirst = index === 0;
      const actualIndex = getActualIndex(index, displayItems.length, truncated);

      elements.push(renderItem(item, isLast, actualIndex));

      if (!isLast) {
        addSeparatorsAndEllipsis(elements, index, truncated, isFirst, hiddenCount);
      }
    });

    return elements;
  }, [visibleItems, renderItem, getActualIndex, addSeparatorsAndEllipsis]);

  return (
    <nav className={styles.breadcrumb} aria-label={ariaLabel} data-testid="breadcrumb">
      <ol className={styles.list}>{breadcrumbElements}</ol>
    </nav>
  );
});

Breadcrumb.displayName = 'Breadcrumb';

export default Breadcrumb;
