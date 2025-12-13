import cn from 'classnames';
import { memo, useCallback, useId, useMemo, useRef, useState } from 'react';
import type { SelectProps } from '../../types';
import styles from '../assets/Select.module.scss';

/**
 * Select Component
 *
 * An accessible select dropdown with keyboard navigation support.
 * Follows WCAG 2.1 AA standards with proper ARIA attributes.
 *
 * @example
 * ```tsx
 * <Select
 *   label="Country"
 *   value={country}
 *   onChange={setCountry}
 *   options={[
 *     { value: 'us', label: 'United States' },
 *     { value: 'uk', label: 'United Kingdom' },
 *   ]}
 *   placeholder="Select a country"
 * />
 * ```
 */
const Select = memo(function Select({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  helperText,
  error,
  disabled = false,
  required = false,
  id: providedId,
}: SelectProps) {
  const generatedId = useId();
  const selectId = providedId ?? generatedId;
  const helperId = `${selectId}-helper`;
  const errorId = `${selectId}-error`;
  const listboxId = `${selectId}-listbox`;

  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);

  // Find the selected option
  const selectedOption = useMemo(() => {
    return options.find((opt) => opt.value === value);
  }, [options, value]);

  // Get enabled options for keyboard navigation
  const enabledOptions = useMemo(() => {
    return options.filter((opt) => !opt.disabled);
  }, [options]);

  // Determine which IDs to use for aria-describedby
  const describedByIds = useMemo(() => {
    const ids: string[] = [];
    if (error) ids.push(errorId);
    else if (helperText) ids.push(helperId);
    return ids.length > 0 ? ids.join(' ') : undefined;
  }, [error, errorId, helperText, helperId]);

  // Build class names
  const containerClasses = useMemo(() => {
    return cn(styles.container, {
      [styles['container--error']]: !!error,
      [styles['container--disabled']]: disabled,
    });
  }, [error, disabled]);

  const triggerClasses = useMemo(() => {
    return cn(styles.trigger, {
      [styles['trigger--open']]: isOpen,
      [styles['trigger--error']]: !!error,
      [styles['trigger--disabled']]: disabled,
      [styles['trigger--placeholder']]: !selectedOption,
    });
  }, [isOpen, error, disabled, selectedOption]);

  // Handle opening/closing the dropdown
  const handleToggle = useCallback(() => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      // Set focus to selected option or first enabled option
      const selectedIndex = enabledOptions.findIndex((opt) => opt.value === value);
      setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0);
    }
  }, [disabled, isOpen, enabledOptions, value]);

  // Handle option selection
  const handleSelect = useCallback(
    (optionValue: string) => {
      onChange(optionValue);
      setIsOpen(false);
      setFocusedIndex(-1);
    },
    [onChange],
  );

  // Handle Enter/Space key
  const handleEnterSpace = useCallback(
    (event: React.KeyboardEvent) => {
      event.preventDefault();
      if (isOpen && focusedIndex >= 0) {
        handleSelect(enabledOptions[focusedIndex].value);
      } else {
        handleToggle();
      }
    },
    [isOpen, focusedIndex, enabledOptions, handleSelect, handleToggle],
  );

  // Handle ArrowDown key
  const handleArrowDown = useCallback(
    (event: React.KeyboardEvent) => {
      event.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        const selectedIndex = enabledOptions.findIndex((opt) => opt.value === value);
        setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0);
      } else {
        setFocusedIndex((prev) => Math.min(prev + 1, enabledOptions.length - 1));
      }
    },
    [isOpen, enabledOptions, value],
  );

  // Close dropdown helper
  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setFocusedIndex(-1);
  }, []);

  // Key handlers map for cleaner switch
  const keyHandlers = useMemo(
    () => ({
      Enter: handleEnterSpace,
      ' ': handleEnterSpace,
      ArrowDown: handleArrowDown,
      ArrowUp: (event: React.KeyboardEvent) => {
        event.preventDefault();
        if (isOpen) setFocusedIndex((prev) => Math.max(prev - 1, 0));
      },
      Escape: (event: React.KeyboardEvent) => {
        event.preventDefault();
        closeDropdown();
      },
      Home: (event: React.KeyboardEvent) => {
        event.preventDefault();
        if (isOpen) setFocusedIndex(0);
      },
      End: (event: React.KeyboardEvent) => {
        event.preventDefault();
        if (isOpen) setFocusedIndex(enabledOptions.length - 1);
      },
      Tab: () => {
        if (isOpen) closeDropdown();
      },
    }),
    [handleEnterSpace, handleArrowDown, isOpen, enabledOptions.length, closeDropdown],
  );

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (disabled) return;
      const handler = keyHandlers[event.key as keyof typeof keyHandlers];
      if (handler) handler(event);
    },
    [disabled, keyHandlers],
  );

  // Handle click outside to close
  const handleBlur = useCallback((event: React.FocusEvent) => {
    if (!containerRef.current?.contains(event.relatedTarget as Node)) {
      setIsOpen(false);
      setFocusedIndex(-1);
    }
  }, []);

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: Container needs onBlur to close dropdown when focus leaves
    <div
      ref={containerRef}
      className={containerClasses}
      onBlur={handleBlur}
      data-testid="select-container"
    >
      <label htmlFor={selectId} className={styles.label}>
        {label}
        {required && (
          <span className={styles.required} aria-hidden="true">
            *
          </span>
        )}
      </label>
      <button
        id={selectId}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-invalid={!!error}
        aria-describedby={describedByIds}
        aria-required={required}
        aria-activedescendant={
          isOpen && focusedIndex >= 0 ? `${selectId}-option-${focusedIndex}` : undefined
        }
        disabled={disabled}
        className={triggerClasses}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        data-testid="select-trigger"
      >
        <span className={styles.value}>{selectedOption ? selectedOption.label : placeholder}</span>
        <span className={styles.arrow} aria-hidden="true">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M2.5 4.5L6 8L9.5 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      {isOpen && (
        <div
          ref={listboxRef as React.RefObject<HTMLDivElement>}
          id={listboxId}
          role="listbox"
          aria-label={label}
          className={styles.listbox}
          data-testid="select-listbox"
        >
          {options.map((option, index) => {
            const enabledIndex = enabledOptions.findIndex((opt) => opt.value === option.value);
            const isFocused = enabledIndex === focusedIndex;
            const isSelected = option.value === value;

            return (
              <div
                key={option.value}
                id={`${selectId}-option-${enabledIndex}`}
                role="option"
                tabIndex={option.disabled ? -1 : 0}
                aria-selected={isSelected}
                aria-disabled={option.disabled}
                className={cn(styles.option, {
                  [styles['option--focused']]: isFocused,
                  [styles['option--selected']]: isSelected,
                  [styles['option--disabled']]: option.disabled,
                })}
                onClick={() => !option.disabled && handleSelect(option.value)}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && !option.disabled) {
                    e.preventDefault();
                    handleSelect(option.value);
                  }
                }}
                data-testid={`select-option-${index}`}
              >
                {option.label}
              </div>
            );
          })}
        </div>
      )}
      {error && (
        <span id={errorId} className={styles.error} role="alert">
          {error}
        </span>
      )}
      {!error && helperText && (
        <span id={helperId} className={styles.helperText}>
          {helperText}
        </span>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
