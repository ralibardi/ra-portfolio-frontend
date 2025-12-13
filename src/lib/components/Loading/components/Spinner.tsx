import cn from 'classnames';
import { memo, useMemo } from 'react';
import type { SpinnerProps } from '../../types';
import styles from '../assets/Spinner.module.scss';

/**
 * Spinner Component
 *
 * A rotating loading indicator with customizable size and color.
 * Includes proper ARIA attributes for screen reader accessibility.
 *
 * @example
 * ```tsx
 * // Basic spinner
 * <Spinner />
 *
 * // Large spinner with custom color
 * <Spinner size="large" color="#4a90e2" />
 *
 * // Custom pixel size
 * <Spinner size={48} />
 *
 * // With custom aria-label
 * <Spinner aria-label="Loading content..." />
 * ```
 */
const Spinner = memo(function Spinner({
  size = 'medium',
  color,
  'aria-label': ariaLabel = 'Loading',
}: SpinnerProps) {
  // Determine if size is a preset or custom number
  const isCustomSize = typeof size === 'number';

  // Build class names
  const spinnerClasses = useMemo(() => {
    return cn(styles.spinner, {
      [styles[`spinner--${size}`]]: !isCustomSize,
    });
  }, [size, isCustomSize]);

  // Calculate inline styles for custom size and color
  const inlineStyles = useMemo(() => {
    const styleObj: React.CSSProperties = {};

    if (isCustomSize) {
      styleObj.width = `${size}px`;
      styleObj.height = `${size}px`;
    }

    if (color) {
      styleObj.borderColor = color;
      styleObj.borderTopColor = 'transparent';
    }

    return Object.keys(styleObj).length > 0 ? styleObj : undefined;
  }, [size, isCustomSize, color]);

  return (
    <output
      className={spinnerClasses}
      style={inlineStyles}
      aria-label={ariaLabel}
      data-testid="spinner"
    >
      <span className={styles.visuallyHidden}>{ariaLabel}</span>
    </output>
  );
});

Spinner.displayName = 'Spinner';

export default Spinner;
