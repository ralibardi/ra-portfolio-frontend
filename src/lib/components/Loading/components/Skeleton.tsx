import cn from 'classnames';
import { memo, useMemo } from 'react';
import type { SkeletonProps } from '../../types';
import styles from '../assets/Skeleton.module.scss';

/**
 * Skeleton Component
 *
 * A placeholder component that displays a pulsing animation while content is loading.
 * Supports multiple variants (text, circle, rectangle) and customizable dimensions.
 *
 * @example
 * ```tsx
 * // Basic text skeleton
 * <Skeleton variant="text" />
 *
 * // Circle skeleton for avatars
 * <Skeleton variant="circle" width={48} height={48} />
 *
 * // Multi-line text skeleton
 * <Skeleton variant="text" lines={3} />
 *
 * // Custom dimensions
 * <Skeleton variant="rectangle" width="100%" height={200} />
 * ```
 */
const Skeleton = memo(function Skeleton({
  variant = 'text',
  width,
  height,
  animation = 'pulse',
  lines = 1,
}: SkeletonProps) {
  // Build class names
  const skeletonClasses = useMemo(() => {
    return cn(styles.skeleton, styles[`skeleton--${variant}`], styles[`skeleton--${animation}`]);
  }, [variant, animation]);

  // Calculate inline styles for custom dimensions
  const inlineStyles = useMemo(() => {
    const styleObj: React.CSSProperties = {};

    if (width !== undefined) {
      styleObj.width = typeof width === 'number' ? `${width}px` : width;
    }

    if (height !== undefined) {
      styleObj.height = typeof height === 'number' ? `${height}px` : height;
    }

    return Object.keys(styleObj).length > 0 ? styleObj : undefined;
  }, [width, height]);

  // Generate stable keys for skeleton lines
  const lineKeys = useMemo(() => {
    return Array.from({ length: lines }, (_, index) => `skeleton-line-${index}`);
  }, [lines]);

  // Render multi-line text skeleton
  if (variant === 'text' && lines > 1) {
    return (
      <div className={styles.skeletonLines} data-testid="skeleton">
        {lineKeys.map((key, index) => (
          <span
            key={key}
            className={cn(skeletonClasses, {
              [styles['skeleton--lastLine']]: index === lines - 1,
            })}
            style={inlineStyles}
            aria-hidden="true"
          />
        ))}
      </div>
    );
  }

  // Render single skeleton element
  return (
    <span
      className={skeletonClasses}
      style={inlineStyles}
      aria-hidden="true"
      data-testid="skeleton"
    />
  );
});

Skeleton.displayName = 'Skeleton';

export default Skeleton;
