import cn from 'classnames';
import { memo, useCallback, useId, useMemo, useRef, useState } from 'react';
import type { TabsProps } from '../../types';
import styles from '../assets/Tabs.module.scss';

/**
 * Tabs Component
 *
 * A component for organizing related content into switchable panels.
 * Supports controlled and uncontrolled modes, keyboard navigation,
 * horizontal and vertical orientations, and disabled tabs.
 *
 * @example
 * ```tsx
 * // Basic usage (uncontrolled)
 * <Tabs
 *   items={[
 *     { id: '1', label: 'Tab 1', content: <p>Content 1</p> },
 *     { id: '2', label: 'Tab 2', content: <p>Content 2</p> },
 *   ]}
 * />
 *
 * // With default selection
 * <Tabs items={items} defaultIndex={1} />
 *
 * // Controlled mode
 * <Tabs items={items} selectedIndex={activeTab} onChange={setActiveTab} />
 *
 * // Vertical orientation
 * <Tabs items={items} orientation="vertical" />
 * ```
 */
const Tabs = memo(function Tabs({
  items,
  defaultIndex = 0,
  selectedIndex: controlledIndex,
  onChange,
  orientation = 'horizontal',
  'aria-label': ariaLabel,
}: TabsProps) {
  const tabsId = useId();
  const tabRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  // Internal state for uncontrolled mode
  const [internalIndex, setInternalIndex] = useState(defaultIndex);

  // Determine if controlled or uncontrolled
  const isControlled = controlledIndex !== undefined;
  const selectedIndex = isControlled ? controlledIndex : internalIndex;

  // Get enabled tabs for keyboard navigation
  const enabledIndices = useMemo(
    () => items.map((item, index) => ({ item, index })).filter(({ item }) => !item.disabled),
    [items],
  );

  // Handle tab selection
  const selectTab = useCallback(
    (index: number) => {
      const item = items[index];
      if (item?.disabled) return;

      if (!isControlled) {
        setInternalIndex(index);
      }
      onChange?.(index);
    },
    [isControlled, onChange, items],
  );

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
      const currentEnabledIndex = enabledIndices.findIndex(({ index }) => index === currentIndex);
      if (currentEnabledIndex === -1) return;

      let nextEnabledIndex: number | null = null;
      const isVertical = orientation === 'vertical';

      switch (event.key) {
        case isVertical ? 'ArrowDown' : 'ArrowRight':
          event.preventDefault();
          nextEnabledIndex = (currentEnabledIndex + 1) % enabledIndices.length;
          break;
        case isVertical ? 'ArrowUp' : 'ArrowLeft':
          event.preventDefault();
          nextEnabledIndex =
            (currentEnabledIndex - 1 + enabledIndices.length) % enabledIndices.length;
          break;
        case 'Home':
          event.preventDefault();
          nextEnabledIndex = 0;
          break;
        case 'End':
          event.preventDefault();
          nextEnabledIndex = enabledIndices.length - 1;
          break;
        default:
          return;
      }

      if (nextEnabledIndex !== null) {
        const nextIndex = enabledIndices[nextEnabledIndex].index;
        const nextButton = tabRefs.current.get(nextIndex);
        nextButton?.focus();
        selectTab(nextIndex);
      }
    },
    [enabledIndices, orientation, selectTab],
  );

  // Set tab ref
  const setTabRef = useCallback((index: number, element: HTMLButtonElement | null) => {
    if (element) {
      tabRefs.current.set(index, element);
    } else {
      tabRefs.current.delete(index);
    }
  }, []);

  return (
    <div
      className={cn(styles.tabs, styles[`tabs--${orientation}`])}
      data-testid="tabs"
      data-orientation={orientation}
    >
      {/* Tab List */}
      <div
        role="tablist"
        aria-label={ariaLabel}
        aria-orientation={orientation}
        className={cn(styles.tabList, styles[`tabList--${orientation}`])}
        data-testid="tabs-list"
      >
        {items.map((item, index) => {
          const isSelected = selectedIndex === index;
          const tabId = `${tabsId}-tab-${item.id}`;
          const panelId = `${tabsId}-panel-${item.id}`;

          return (
            <button
              key={item.id}
              ref={(el) => setTabRef(index, el)}
              id={tabId}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-controls={panelId}
              aria-disabled={item.disabled}
              tabIndex={isSelected ? 0 : -1}
              disabled={item.disabled}
              className={cn(styles.tab, {
                [styles['tab--selected']]: isSelected,
                [styles['tab--disabled']]: item.disabled,
              })}
              onClick={() => selectTab(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              data-testid={`tab-${item.id}`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className={styles.panels} data-testid="tabs-panels">
        {items.map((item, index) => {
          const isSelected = selectedIndex === index;
          const tabId = `${tabsId}-tab-${item.id}`;
          const panelId = `${tabsId}-panel-${item.id}`;

          return (
            <div
              key={item.id}
              id={panelId}
              role="tabpanel"
              aria-labelledby={tabId}
              hidden={!isSelected}
              className={cn(styles.panel, {
                [styles['panel--selected']]: isSelected,
              })}
              data-testid={`panel-${item.id}`}
            >
              {isSelected && item.content}
            </div>
          );
        })}
      </div>
    </div>
  );
});

Tabs.displayName = 'Tabs';

export default Tabs;
